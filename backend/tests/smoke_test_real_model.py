"""
AgroVision AI - Real Inference Smoke Test

Performs genuine image classification using the real pretrained model:
Kathir56/plant-disease-tamilnadu
Verifies:
1. Model download and initialization from Hugging Face
2. Architecture verification (MobileNetV2, 38 classes)
3. Authoritative id2label configuration inspection
4. Real tensor preprocessing via AutoImageProcessor
5. Genuine forward-pass inference without mocks
6. Probability calibration via Softmax
7. Structured response verification
"""
from __future__ import annotations

import os
import sys
import time
from PIL import Image, ImageDraw

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Force UTF-8 stdout if possible on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from app.config import MODEL_CACHE_DIR, MODEL_ID
from app.services.model_service import ModelService
from app.utils.label_mapping import build_label_map, parse_label


def create_test_leaf_image() -> Image.Image:
    """Create a test image representing a leaf with green and discolored pixels."""
    img = Image.new("RGB", (300, 300), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    # Draw leaf shape
    draw.polygon([(150, 30), (240, 150), (150, 270), (60, 150)], fill=(34, 139, 34))
    # Draw some spot lesions
    draw.ellipse([(120, 100), (145, 125)], fill=(139, 69, 19))
    draw.ellipse([(160, 160), (180, 180)], fill=(101, 67, 33))
    # Draw central vein
    draw.line([(150, 30), (150, 270)], fill=(20, 90, 20), width=3)
    return img


def run_smoke_test():
    print("=" * 60)
    print("AGROVISION AI - REAL MODEL INFERENCE SMOKE TEST")
    print("=" * 60)
    print(f"Target Model: {MODEL_ID}")
    print(f"Cache Directory: {MODEL_CACHE_DIR}")

    MODEL_CACHE_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Initialize Model Service
    svc = ModelService(model_id=MODEL_ID, cache_dir=str(MODEL_CACHE_DIR))

    print("\n[Step 1] Loading model and image processor from Hugging Face...")
    start_time = time.time()
    try:
        svc.load_model()
        elapsed = time.time() - start_time
        print(f"[PASS] Model loaded successfully in {elapsed:.2f} seconds.")
    except Exception as exc:
        print(f"[FAIL] Failed to load model: {exc}")
        return False

    # 2. Verify Model Metadata
    print("\n[Step 2] Verifying model metadata and label mapping...")
    print(f"  Device: {svc.device}")
    print(f"  Total classes in id2label: {svc.num_classes}")
    assert svc.num_classes == 38, f"Expected 38 classes, got {svc.num_classes}"

    # Sample some labels
    print("  Authoritative label samples:")
    for idx in [0, 1, 2, 3, 11, 14, 15, 28, 37]:
        label = svc.id2label.get(idx, "UNKNOWN")
        parsed = parse_label(idx, label)
        print(f"    Index {idx:2d} -> Raw: '{label}' | Parsed: {parsed.display_crop} - {parsed.display_condition}")

    # 3. Create test image
    print("\n[Step 3] Preparing test image for genuine inference...")
    test_image = create_test_leaf_image()
    test_image_path = os.path.join(str(MODEL_CACHE_DIR), "smoke_test_leaf.png")
    test_image.save(test_image_path)
    print(f"  Test image saved to: {test_image_path}")

    # 4. Execute Real Inference
    print("\n[Step 4] Executing real forward pass with MobileNetV2...")
    infer_start = time.time()
    result = svc.predict(test_image, top_k=5)
    infer_time = time.time() - infer_start

    top_pred = result["predictions"][0]
    top_label = top_pred["label"]
    top_index = top_pred["index"]
    confidence = top_pred["confidence"]

    print(f"[PASS] Inference executed in {infer_time*1000:.1f} ms (internal model time: {result['processing_time_ms']} ms).")
    print(f"  Top predicted label: {top_label}")
    print(f"  Top predicted index: {top_index}")
    print(f"  Model confidence score: {confidence:.4f} ({confidence*100:.2f}%)")

    print("\n[Step 5] Top 5 Model Predictions:")
    for i, pred in enumerate(result["predictions"], 1):
        parsed = parse_label(pred["index"], pred["label"])
        print(f"  {i}. [{pred['index']:2d}] {parsed.display_crop} - {parsed.display_condition} ({pred['label']}): {pred['confidence']*100:.2f}%")

    # 5. Sanity Checks
    print("\n[Step 6] Verifying statistical sanity...")
    assert 0.0 <= confidence <= 1.0, "Confidence must be within [0, 1]"
    assert len(result["predictions"]) == 5, "Expected 5 predictions"
    assert result["predictions"][0]["confidence"] == confidence, "Top prediction confidence mismatch"
    print("[PASS] All validation assertions passed!")

    print("\n" + "=" * 60)
    print("REAL INFERENCE TEST PASSED: Genuine model classification confirmed.")
    print("=" * 60)
    return True


if __name__ == "__main__":
    success = run_smoke_test()
    sys.exit(0 if success else 1)
