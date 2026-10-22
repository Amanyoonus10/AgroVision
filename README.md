# AGROVISION AI
### Production-Style AI-Powered Crop Disease Intelligence Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16-black?logo=next.js)](https://nextjs.org)
[![PyTorch](https://img.shields.io/badge/Inference-PyTorch_2.13-EE4C2C?logo=pytorch)](https://pytorch.org)
[![HuggingFace](https://img.shields.io/badge/Model-Kathir56%2Fplant--disease--tamilnadu-yellow?logo=huggingface)](https://huggingface.co/Kathir56/plant-disease-tamilnadu)
[![Tests](https://img.shields.io/badge/Tests-28%20Passed-brightgreen)](backend/tests/)

**AGROVISION AI** is a production-grade agricultural decision support platform. It combines a state-of-the-art computer vision inference engine with an accessible web interface to assist farmers, agronomists, and researchers in rapidly detecting and classifying plant diseases across high-value horticultural crops.

The platform executes **genuine neural network inference** on uploaded leaf images using an existing fine-tuned MobileNetV2 architecture (`Kathir56/plant-disease-tamilnadu`) sourced directly from the Hugging Face Model Hub.

---

## Key Features

1. **Genuine Pretrained Deep Learning Inference**:
   - Zero mocked predictions, simulated delays, or synthetic scores.
   - Genuine MobileNetV2 forward pass via Hugging Face Transformers & PyTorch CPU/CUDA.
   - Authoritative 38-class mapping directly parsed from the model's `id2label` configuration.
2. **Target Crop Diagnostics**:
   - Dedicated support for **Apple**, **Grape**, **Orange**, and **Tomato** across 16 verified pathological and healthy conditions.
   - Automatic crop inference and user-selected crop validation.
3. **Diagnostic Safety Guardrails**:
   - **Crop Mismatch Rejection**: Detects and flags when an uploaded image does not match the designated crop type.
   - **Low-Confidence Warning**: Highlights predictions below 40% confidence as preliminary safeguards against ambiguous inputs.
   - **Non-Prescriptive Agricultural Guidance**: Visual symptom checklists and safe cultural practices without unverified chemical prescriptions.
4. **Resilient Production Architecture**:
   - Binary header magic-byte validation rejecting corrupted, non-image, and oversized uploads.
   - EXIF orientation auto-correction to normalize smartphone photos.
   - Asynchronous lazy-loading model singleton to ensure instant server startup.
5. **Modern SaaS UI/UX**:
   - Curated forest-green, warm off-white, and muted olive palette designed for clarity and trust.
   - Drag-and-drop file upload with live client-side image preview.
   - Top-3 prediction breakdowns, confidence meters, and expandable technical metrics.

---

## Technology Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Vanilla CSS Design System, Responsive Layouts |
| **Backend** | Python 3.13, FastAPI, Uvicorn (ASGI), Pydantic v2, Python-Multipart |
| **Machine Learning** | PyTorch 2.13 (CPU/CUDA), Hugging Face Transformers, Pillow (PIL), NumPy |
| **Model** | `Kathir56/plant-disease-tamilnadu` (MobileNetV2, 38 classes) |
| **Testing** | Pytest, Pytest-Asyncio, HTTPX, Unittest Mocking |

---

## Supported Crops & Model Classes

The integrated model classifies 38 botanical conditions. AgroVision AI filters and maps the four primary target crops:

- **🍎 Apple (4 classes):**
  - Apple Scab (`Apple___Apple_scab`)
  - Black Rot (`Apple___Black_rot`)
  - Cedar Apple Rust (`Apple___Cedar_apple_rust`)
  - Healthy (`Apple___healthy`)
- **🍇 Grape (4 classes):**
  - Black Rot (`Grape___Black_rot`)
  - Esca / Black Measles (`Grape___Esca_(Black_Measles)`)
  - Leaf Blight / Isariopsis (`Grape___Leaf_blight_(Isariopsis_Leaf_Spot)`)
  - Healthy (`Grape___healthy`)
- **🍊 Orange (1 class):**
  - Huanglongbing / Citrus Greening (`Orange___Haunglongbing_(Citrus_greening)`)
- **🍅 Tomato (10 classes):**
  - Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Two-Spotted Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy

*Other classes (Corn, Cherry, Potato, Bell Pepper, Peach, Blueberry, Raspberry, Soybean, Squash, Strawberry) are retained in the model's authoritative mapping and correctly identified if uploaded.*

---

## Quick Start (Windows PowerShell)

### Prerequisites
- Windows 10/11
- Python 3.10+ (tested on Python 3.13)
- Node.js 18+ and npm

### 1. Backend Setup
Open PowerShell in the project root:
```powershell
cd backend

# Install dependencies
pip install -r requirements.txt

# Run automated test suite (28 tests)
python -m pytest tests/ -v

# Run real model forward pass smoke test
python tests/smoke_test_real_model.py

# Start the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend will start at [http://127.0.0.1:8000](http://127.0.0.1:8000).
- API Documentation (Swagger): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 2. Frontend Setup
In a second PowerShell terminal:
```powershell
cd frontend

# Verify production build
npm run build

# Start development server
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

---

## API Documentation

### `GET /health`
Returns server status, model loading status, and active compute device.
```json
{
  "status": "ok",
  "model_id": "Kathir56/plant-disease-tamilnadu",
  "model_loaded": true,
  "model_loading": false,
  "predictions_available": true,
  "device": "cpu"
}
```

### `GET /model-info`
Returns complete model metadata, architecture description, and all 38 class labels.

### `GET /diseases`
Returns supported disease categories grouped by target crop.

### `POST /predict`
Performs genuine image classification on an uploaded leaf image.
- **Form Data:**
  - `file`: Image file (JPEG, PNG, WebP $\le 10$ MB)
  - `selected_crop` *(optional)*: Target crop name (e.g. `"Apple"`)
  - `auto_detect` *(optional)*: `"true"` or `"false"`
- **Response Structure:**
```json
{
  "success": true,
  "model_id": "Kathir56/plant-disease-tamilnadu",
  "prediction": {
    "crop": "Tomato",
    "disease": "Late blight",
    "raw_label": "Tomato___Late_blight",
    "class_index": 30,
    "confidence": 0.8841,
    "is_healthy": false,
    "selected_crop": "Tomato",
    "crop_matches": true,
    "disease_info": {
      "name": "Late blight",
      "description": "A destructive fungal-like pathogen causing large dark brown water-soaked lesions.",
      "symptoms": ["Large irregular water-soaked spots", "White fuzzy growth on underside of leaves"],
      "guidance": "Prune infected leaves, avoid overhead watering, ensure adequate plant spacing.",
      "when_to_consult_expert": "Consult extension services if lesions expand across stems or fruit."
    }
  },
  "top_predictions": [
    {
      "rank": 1,
      "crop": "Tomato",
      "disease": "Late blight",
      "raw_label": "Tomato___Late_blight",
      "confidence": 0.8841,
      "is_healthy": false
    }
  ],
  "warnings": [],
  "processing_time_ms": 525.5
}
```

---

## Model Attribution & Limitations

1. **Pretrained Model Provenance:**
   - Model Author: Kathir56
   - Model Hub: `Kathir56/plant-disease-tamilnadu`
   - MobileNetV2 architecture fine-tuned on plant pathology datasets.
   - AgroVision AI integrates this external model and does not claim to have trained it.
2. **Laboratory vs. Field Discrepancy:**
   - Documented benchmark accuracy was achieved under controlled laboratory conditions (PlantVillage dataset) with uniform monochrome backdrops and studio lighting.
   - Field conditions (shadows, multiple overlapping leaves, dirt, motion blur) may lower confidence.
3. **Closed-World Constraint:**
   - Standard Softmax models distribute 100% of probability across the 38 classes. Uploading non-leaf objects will force a winning class; the platform provides low-confidence warnings and crop mismatch guards to alert users.
4. **Advisory Scope:**
   - All predictions are preliminary advisory indicators and should be verified with an agricultural extension officer before taking chemical interventions.

---

## Documentation Links

- [System Architecture Specification](docs/ARCHITECTURE.md)
- [Authoritative Model Card](docs/MODEL_CARD.md)
- [Windows Setup & Deployment Guide](docs/SETUP.md)

---

## License

This project is created for educational and college demonstration purposes. Model weights and architecture are subject to the terms of the original model publisher on Hugging Face.
