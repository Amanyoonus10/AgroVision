"""
AgroVision AI - Backend Tests

Tests for API endpoints, label mapping, image validation, and inference.
"""
from __future__ import annotations

import io
import os
import sys
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from PIL import Image

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.utils.label_mapping import (
    build_crop_map,
    build_label_map,
    label_matches_crop,
    parse_label,
)
from app.services.image_service import (
    ImageValidationError,
    load_and_validate_image,
    validate_content_type,
    validate_file_size,
)

client = TestClient(app)

# The model's actual id2label from config.json
ACTUAL_ID2LABEL = {
    0: "Apple___Apple_scab",
    1: "Apple___Black_rot",
    2: "Apple___Cedar_apple_rust",
    3: "Apple___healthy",
    4: "Blueberry___healthy",
    5: "Cherry_(including_sour)___Powdery_mildew",
    6: "Cherry_(including_sour)___healthy",
    7: "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    8: "Corn_(maize)___Common_rust_",
    9: "Corn_(maize)___Northern_Leaf_Blight",
    10: "Corn_(maize)___healthy",
    11: "Grape___Black_rot",
    12: "Grape___Esca_(Black_Measles)",
    13: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    14: "Grape___healthy",
    15: "Orange___Haunglongbing_(Citrus_greening)",
    16: "Peach___Bacterial_spot",
    17: "Peach___healthy",
    18: "Pepper,_bell___Bacterial_spot",
    19: "Pepper,_bell___healthy",
    20: "Potato___Early_blight",
    21: "Potato___Late_blight",
    22: "Potato___healthy",
    23: "Raspberry___healthy",
    24: "Soybean___healthy",
    25: "Squash___Powdery_mildew",
    26: "Strawberry___Leaf_scorch",
    27: "Strawberry___healthy",
    28: "Tomato___Bacterial_spot",
    29: "Tomato___Early_blight",
    30: "Tomato___Late_blight",
    31: "Tomato___Leaf_Mold",
    32: "Tomato___Septoria_leaf_spot",
    33: "Tomato___Spider_mites Two-spotted_spider_mite",
    34: "Tomato___Target_Spot",
    35: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    36: "Tomato___Tomato_mosaic_virus",
    37: "Tomato___healthy",
}


# ─── LABEL MAPPING TESTS ─────────────────────────────────

class TestLabelMapping:
    def test_parse_apple_scab(self):
        parsed = parse_label(0, "Apple___Apple_scab")
        assert parsed.crop == "Apple"
        assert parsed.display_crop == "Apple"
        assert parsed.display_condition == "Apple scab"
        assert not parsed.is_healthy

    def test_parse_healthy(self):
        parsed = parse_label(3, "Apple___healthy")
        assert parsed.is_healthy
        assert parsed.display_condition == "healthy"

    def test_parse_grape_esca(self):
        parsed = parse_label(12, "Grape___Esca_(Black_Measles)")
        assert parsed.crop == "Grape"
        assert parsed.display_crop == "Grape"
        assert "Esca" in parsed.display_condition

    def test_parse_orange_hlb(self):
        parsed = parse_label(15, "Orange___Haunglongbing_(Citrus_greening)")
        assert parsed.crop == "Orange"
        assert "Citrus greening" in parsed.display_condition

    def test_parse_tomato_spider_mites(self):
        parsed = parse_label(33, "Tomato___Spider_mites Two-spotted_spider_mite")
        assert parsed.crop == "Tomato"
        assert not parsed.is_healthy

    def test_build_label_map_38_classes(self):
        lm = build_label_map(ACTUAL_ID2LABEL)
        assert len(lm) == 38

    def test_build_crop_map_target_only(self):
        lm = build_label_map(ACTUAL_ID2LABEL)
        cm = build_crop_map(lm, target_crops=["Apple", "Grape", "Orange", "Tomato"])
        crop_names = {ci.display_name for ci in cm.values()}
        assert "Apple" in crop_names
        assert "Grape" in crop_names
        assert "Orange" in crop_names
        assert "Tomato" in crop_names
        # Should NOT include Blueberry, Cherry, etc.
        assert "Blueberry" not in crop_names

    def test_label_matches_crop_positive(self):
        lm = build_label_map(ACTUAL_ID2LABEL)
        assert label_matches_crop(lm, 0, "Apple")

    def test_label_matches_crop_negative(self):
        lm = build_label_map(ACTUAL_ID2LABEL)
        assert not label_matches_crop(lm, 0, "Tomato")

    def test_apple_has_4_labels(self):
        lm = build_label_map(ACTUAL_ID2LABEL)
        cm = build_crop_map(lm, target_crops=["Apple"])
        apple = list(cm.values())[0]
        assert len(apple.labels) == 4
        assert len(apple.diseases) == 3
        assert apple.healthy_label is not None

    def test_tomato_has_10_labels(self):
        lm = build_label_map(ACTUAL_ID2LABEL)
        cm = build_crop_map(lm, target_crops=["Tomato"])
        tomato = list(cm.values())[0]
        assert len(tomato.labels) == 10


# ─── IMAGE VALIDATION TESTS ──────────────────────────────

class TestImageValidation:
    def test_valid_content_type_jpeg(self):
        validate_content_type("image/jpeg")  # Should not raise

    def test_valid_content_type_png(self):
        validate_content_type("image/png")

    def test_invalid_content_type(self):
        with pytest.raises(ImageValidationError, match="Unsupported"):
            validate_content_type("application/pdf")

    def test_empty_content_type(self):
        with pytest.raises(ImageValidationError):
            validate_content_type(None)

    def test_empty_file(self):
        with pytest.raises(ImageValidationError, match="empty"):
            validate_file_size(b"")

    def test_oversized_file(self):
        data = b"x" * (11 * 1024 * 1024)  # 11 MB
        with pytest.raises(ImageValidationError, match="too large"):
            validate_file_size(data)

    def test_valid_image_loads(self):
        img = Image.new("RGB", (100, 100), color="green")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        loaded = load_and_validate_image(buf.getvalue())
        assert loaded.mode == "RGB"
        assert loaded.size == (100, 100)

    def test_corrupted_data_rejected(self):
        with pytest.raises(ImageValidationError):
            load_and_validate_image(b"not-an-image-at-all")

    def test_rgba_converted_to_rgb(self):
        img = Image.new("RGBA", (50, 50), color=(0, 128, 0, 128))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        loaded = load_and_validate_image(buf.getvalue())
        assert loaded.mode == "RGB"


# ─── API ENDPOINT TESTS ──────────────────────────────────

class TestHealthEndpoint:
    def test_health_returns_200(self):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "model_id" in data
        assert data["model_id"] == "Kathir56/plant-disease-tamilnadu"


class TestModelInfoEndpoint:
    def test_model_info_returns_200(self):
        response = client.get("/model-info")
        assert response.status_code == 200
        data = response.json()
        assert "model_id" in data
        assert "target_crops" in data
        assert "Apple" in data["target_crops"]


class TestDiseasesEndpoint:
    def test_diseases_returns_200(self):
        response = client.get("/diseases")
        assert response.status_code == 200
        data = response.json()
        assert "target_crops" in data
        assert "categories" in data


class TestPredictEndpoint:
    def _make_test_image(self, fmt="PNG", size=(224, 224), color="green"):
        img = Image.new("RGB", size, color=color)
        buf = io.BytesIO()
        img.save(buf, format=fmt)
        buf.seek(0)
        return buf

    def test_reject_empty_upload(self):
        response = client.post(
            "/predict",
            files={"file": ("empty.png", b"", "image/png")},
        )
        assert response.status_code == 400

    def test_reject_unsupported_type(self):
        response = client.post(
            "/predict",
            files={"file": ("test.pdf", b"fake-pdf-data", "application/pdf")},
        )
        assert response.status_code == 400

    def test_reject_corrupted_image(self):
        response = client.post(
            "/predict",
            files={"file": ("bad.png", b"not-an-image", "image/png")},
        )
        assert response.status_code == 400

    def test_reject_unsupported_crop(self):
        """If model is loaded, test that unsupported crop is rejected."""
        buf = self._make_test_image()
        response = client.post(
            "/predict",
            files={"file": ("test.png", buf, "image/png")},
            data={"selected_crop": "Banana", "auto_detect": "false"},
        )
        # Either 400 (unsupported crop) or 503 (model not loaded) is acceptable
        assert response.status_code in (400, 503)


# ─── SMOKE TEST ───────────────────────────────────────────

class TestInferenceSmokeTest:
    """
    Attempt a real inference if the model is loaded.
    If the model is not available, skip gracefully.
    """

    def test_real_inference_if_model_available(self):
        import time
        from app.services.model_service import get_model_service
        from app.config import MODEL_ID, MODEL_CACHE_DIR
        svc = get_model_service(model_id=MODEL_ID, cache_dir=str(MODEL_CACHE_DIR))
        
        # Wait up to 15s for the background model loader thread
        for _ in range(30):
            if svc.is_loaded or svc.load_error:
                break
            time.sleep(0.5)

        if not svc.is_loaded:
            pytest.skip(f"Model not loaded: {svc.load_error or 'still loading'}")

        # Check health
        health = client.get("/health").json()
        assert health["status"] == "ok"
        assert health["model_loaded"] is True

        # Create a test leaf-like image
        img = Image.new("RGB", (224, 224), color=(34, 139, 34))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        buf.seek(0)

        response = client.post(
            "/predict",
            files={"file": ("leaf.jpg", buf, "image/jpeg")},
            data={"auto_detect": "true"},
        )
        assert response.status_code == 200
        data = response.json()

        assert data["success"] is True
        assert data["model_id"] == "Kathir56/plant-disease-tamilnadu"
        assert data["prediction"] is not None
        assert data["prediction"]["confidence"] > 0
        assert data["prediction"]["confidence"] <= 1.0
        assert len(data["top_predictions"]) > 0
        assert data["processing_time_ms"] > 0

        # Verify no hardcoded values
        assert data["prediction"]["label"] in ACTUAL_ID2LABEL.values()
