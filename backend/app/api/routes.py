"""
AgroVision AI - API Routes

All FastAPI endpoints: health, model-info, diseases, predict.
"""
from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.config import (
    LOW_CONFIDENCE_THRESHOLD,
    MODEL_ID,
    TARGET_CROPS,
    TOP_K_PREDICTIONS,
    MAX_UPLOAD_SIZE_BYTES,
    MODEL_CACHE_DIR,
)
from app.schemas.prediction import (
    DiseaseCategory,
    DiseasesResponse,
    ErrorResponse,
    HealthResponse,
    ModelInfoResponse,
    PredictionItem,
    PredictionResult,
)
from app.services.disease_service import get_disease_info
from app.services.image_service import (
    ImageValidationError,
    load_and_validate_image,
    validate_content_type,
    validate_file_size,
)
from app.services.model_service import (
    ModelLoadError,
    ModelNotReadyError,
    get_model_service,
)
from app.utils.label_mapping import (
    build_crop_map,
    build_label_map,
    label_matches_crop,
)

logger = logging.getLogger("agrovision.api")
router = APIRouter()


def _get_service():
    """Get or create the model service (lazy init)."""
    return get_model_service(model_id=MODEL_ID, cache_dir=str(MODEL_CACHE_DIR))


# ─────────────────────────────────────────────────────────
# GET /health
# ─────────────────────────────────────────────────────────
@router.get("/health", response_model=HealthResponse)
async def health():
    svc = _get_service()
    status = svc.get_status()
    return HealthResponse(
        status="ok" if svc.is_loaded else ("loading" if svc.is_loading else "waiting"),
        model_loaded=status["is_loaded"],
        model_loading=status["is_loading"],
        model_id=status["model_id"],
        predictions_available=status["predictions_available"],
        load_error=status["load_error"],
    )


# ─────────────────────────────────────────────────────────
# GET /model-info
# ─────────────────────────────────────────────────────────
@router.get("/model-info", response_model=ModelInfoResponse)
async def model_info():
    svc = _get_service()

    all_labels = list(svc.id2label.values()) if svc.id2label else []

    # Build supported diseases from the labels
    supported_diseases = {}
    if svc.id2label:
        label_map = build_label_map(svc.id2label)
        crop_map = build_crop_map(label_map, target_crops=TARGET_CROPS)
        for crop_key, crop_info in crop_map.items():
            diseases = [lb.display_condition for lb in crop_info.labels if not lb.is_healthy]
            supported_diseases[crop_info.display_name] = diseases

    return ModelInfoResponse(
        model_id=svc.model_id,
        architecture="MobileNetV2ForImageClassification",
        num_classes=svc.num_classes,
        is_loaded=svc.is_loaded,
        is_loading=svc.is_loading,
        device=svc.device,
        target_crops=TARGET_CROPS,
        all_labels=all_labels,
        supported_diseases=supported_diseases,
        load_error=svc.load_error,
    )


# ─────────────────────────────────────────────────────────
# GET /diseases
# ─────────────────────────────────────────────────────────
@router.get("/diseases", response_model=DiseasesResponse)
async def diseases():
    svc = _get_service()

    categories = []
    if svc.id2label:
        label_map = build_label_map(svc.id2label)
        crop_map = build_crop_map(label_map, target_crops=TARGET_CROPS)
        for crop_info in crop_map.values():
            for lb in crop_info.labels:
                categories.append(
                    DiseaseCategory(
                        crop=lb.display_crop,
                        disease_name=lb.display_condition,
                        raw_label=lb.raw_label,
                        is_healthy=lb.is_healthy,
                    )
                )

    return DiseasesResponse(
        target_crops=TARGET_CROPS,
        categories=categories,
        total=len(categories),
    )


# ─────────────────────────────────────────────────────────
# POST /predict
# ─────────────────────────────────────────────────────────
@router.post("/predict", response_model=PredictionResult, responses={400: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
async def predict(
    file: UploadFile = File(...),
    selected_crop: Optional[str] = Form(None),
    auto_detect: Optional[str] = Form("false"),
):
    """Run plant disease inference on an uploaded image."""
    svc = _get_service()
    warnings_list = []

    # 1. Validate content type
    try:
        validate_content_type(file.content_type)
    except ImageValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    # 2. Read and validate file size
    try:
        data = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to read uploaded file.")

    try:
        validate_file_size(data)
    except ImageValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    # 3. Load and validate image content
    try:
        image = load_and_validate_image(data)
    except ImageValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    # 4. Check model availability
    if not svc.is_loaded:
        if svc.is_loading:
            raise HTTPException(
                status_code=503,
                detail="Model is still loading. Please try again in a moment.",
            )
        raise HTTPException(
            status_code=503,
            detail=f"Model is not available. {svc.load_error or 'Please check the server logs.'}",
        )

    # 5. Run inference
    try:
        result = svc.predict(image, top_k=TOP_K_PREDICTIONS)
    except ModelNotReadyError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")
    except Exception as exc:
        logger.error("Unexpected inference error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="An unexpected error occurred during inference.")

    # 6. Map predictions to parsed labels
    label_map = build_label_map(svc.id2label)
    raw_predictions = result["predictions"]
    all_raw = result.get("all_predictions", raw_predictions)
    processing_time = result["processing_time_ms"]

    top_predictions = []
    for pred in raw_predictions:
        parsed = label_map.get(pred["index"])
        if parsed:
            top_predictions.append(
                PredictionItem(
                    index=pred["index"],
                    label=pred["label"],
                    crop=parsed.display_crop,
                    disease=parsed.display_condition,
                    confidence=pred["confidence"],
                    is_healthy=parsed.is_healthy,
                )
            )

    if not top_predictions:
        raise HTTPException(
            status_code=500,
            detail="Model returned predictions that could not be mapped to known classes.",
        )

    top_prediction = top_predictions[0]

    # Map all predictions so we can find the best match for any selected crop
    all_mapped: List[PredictionItem] = []
    for pred in all_raw:
        parsed = label_map.get(pred["index"])
        if parsed:
            all_mapped.append(
                PredictionItem(
                    index=pred["index"],
                    label=pred["label"],
                    crop=parsed.display_crop,
                    disease=parsed.display_condition,
                    confidence=pred["confidence"],
                    is_healthy=parsed.is_healthy,
                )
            )

    # 7. Target crop check
    crop_map = build_crop_map(label_map, target_crops=TARGET_CROPS)
    is_target_crop = any(
        ci.display_name.lower() == top_prediction.crop.lower()
        for ci in crop_map.values()
    )

    # 8. Crop mismatch & crop-specific filtering
    is_auto = not selected_crop or (auto_detect and auto_detect.lower() in ("true", "1", "yes"))
    crop_mismatch = False
    crop_specific_prediction: Optional[PredictionItem] = None
    explanation: Optional[str] = None

    if selected_crop and not is_auto:
        # Validate selected crop
        if selected_crop not in TARGET_CROPS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported crop: {selected_crop}. Supported: {', '.join(TARGET_CROPS)}",
            )

        # Find best match specifically for the selected crop
        selected_crop_items = [
            p for p in all_mapped
            if label_matches_crop(label_map, p.index, selected_crop)
        ]
        if selected_crop_items:
            crop_specific_prediction = selected_crop_items[0]
            total_crop_prob = sum(p.confidence for p in selected_crop_items)
            if total_crop_prob > 0:
                crop_specific_prediction.relative_confidence = round(
                    crop_specific_prediction.confidence / total_crop_prob, 4
                )

        if not label_matches_crop(label_map, top_prediction.index, selected_crop):
            crop_mismatch = True
            explanation = (
                f"Crop Mismatch: You selected '{selected_crop}', but the AI vision model's unconstrained "
                f"top prediction was '{top_prediction.crop}' ({top_prediction.disease}) with {top_prediction.confidence:.1%} confidence. "
                f"In plant pathology, foliar spots, blights, and chlorosis can share similar visual patterns across different plant families. "
                f"We do not report '{top_prediction.crop} – {top_prediction.disease}' as a valid diagnosis for '{selected_crop}'. "
                + (f"Within {selected_crop} conditions, the closest match is '{crop_specific_prediction.disease}'." if crop_specific_prediction else "")
            )
            warnings_list.append(explanation)
        else:
            explanation = (
                f"Verified: Uploaded image features match your selected crop ({selected_crop}) "
                f"and indicate '{top_prediction.disease}' ({top_prediction.confidence:.1%} confidence)."
            )
    elif not is_target_crop:
        explanation = (
            f"The model classified this leaf as '{top_prediction.crop}' ({top_prediction.disease}). "
            f"Note that '{top_prediction.crop}' is outside AgroVision AI's 4 target crops ({', '.join(TARGET_CROPS)}). "
            f"If this is actually an Apple, Grape, Orange, or Tomato leaf, please uncheck auto-detect "
            f"and select the specific crop for a targeted evaluation."
        )
        warnings_list.append(
            f"The model predicts '{top_prediction.crop}' which is not one of the four "
            f"target crops ({', '.join(TARGET_CROPS)}). This application focuses on "
            f"{', '.join(TARGET_CROPS)} only."
        )

    # 9. Low-confidence warning
    if top_prediction.confidence < LOW_CONFIDENCE_THRESHOLD:
        warnings_list.append(
            f"The model's confidence ({top_prediction.confidence:.1%}) is below the "
            f"application's uncertainty threshold ({LOW_CONFIDENCE_THRESHOLD:.0%}). "
            f"This prediction should be treated with extra caution. "
            f"The threshold is an application safeguard, not a scientifically validated boundary."
        )

    # 10. Disease info lookup
    active_disease_label = (
        crop_specific_prediction.label
        if (crop_mismatch and crop_specific_prediction)
        else top_prediction.label
    )
    disease_info_data = get_disease_info(active_disease_label)

    return PredictionResult(
        success=True,
        model_id=MODEL_ID,
        prediction=top_prediction,
        crop_specific_prediction=crop_specific_prediction,
        top_predictions=top_predictions,
        warnings=warnings_list,
        crop_mismatch=crop_mismatch,
        is_target_crop=is_target_crop,
        selected_crop=selected_crop if not is_auto else None,
        predicted_crop=top_prediction.crop,
        processing_time_ms=processing_time,
        disease_info=disease_info_data,
        explanation=explanation,
    )
