# AgroVision AI — Technical Architecture Specification

## 1. System Overview

**AgroVision AI** is a production-grade, full-stack crop disease intelligence platform. It couples a modern responsive Next.js frontend with a high-performance Python FastAPI inference microservice running real neural network image classification using a pretrained MobileNetV2 model fine-tuned on foliar diseases.

```
+-------------------------------------------------------------------------+
|                              CLIENT BROWSER                             |
|  Next.js 16 (App Router) + React 19 + TypeScript + Vanilla CSS Tokens   |
|                                                                         |
|  [Landing Page /]  <--->  [Analysis Workspace /analyze]  <---> [/about] |
+-------------------------------------------------------------------------+
                                    |
                    REST API (JSON + multipart/form-data)
                                    |
+-------------------------------------------------------------------------+
|                          FASTAPI INFERENCE BACKEND                      |
|                                                                         |
|  [CORS Middleware] ---> [Image Validation & EXIF Correction Pipeline]   |
|                                     |                                   |
|                      [Lazy-Loaded Model Service]                        |
|                                     |                                   |
|       Hugging Face Transformers: Kathir56/plant-disease-tamilnadu       |
|                 MobileNetV2 (38 Classes, PyTorch CPU/CUDA)              |
|                                     |                                   |
|                      [Softmax & Top-K Extraction]                       |
|                                     |                                   |
|                      [Authoritative Label Parsing]                      |
|                 (Index -> Crop -> Condition -> Sanity)                  |
|                                     |                                   |
|      [Diagnostic Guardrails: Crop Mismatch & Low-Confidence Warning]    |
|                                     |                                   |
|         [Structured Advisory Knowledge Base & JSON Serialization]       |
+-------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
Our project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py              # GET /health, GET /model-info, GET /diseases, POST /predict
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── disease_service.py     # Curated agricultural knowledge base & safety advisory
│   │   │   ├── image_service.py       # Magic-byte check, size limits, EXIF rotation, RGB normalization
│   │   │   └── model_service.py       # Thread-safe MobileNetV2 singleton & forward pass
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── prediction.py          # Pydantic v2 validation contracts
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── label_mapping.py       # Authoritative id2label parser & crop grouping
│   │   ├── config.py                  # Environment settings, thresholds, CORS
│   │   └── main.py                    # Lifespan startup, background loading, CORS
│   ├── tests/
│   │   ├── test_api.py                # 28 automated pytest test cases
│   │   └── smoke_test_real_model.py   # Live forward-pass smoke test on real model weights
│   ├── requirements.txt               # Locked dependencies
│   ├── .env                           # Local environment config
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── analyze/
│   │   │   │   └── page.tsx           # Image upload, drag-and-drop, real inference & results
│   │   │   ├── about/
│   │   │   │   └── page.tsx           # Methodology, architecture & transparency details
│   │   │   ├── globals.css            # Forest green & sage design system tokens
│   │   │   ├── layout.tsx             # Root layout with SEO metadata & Inter typography
│   │   │   └── page.tsx               # Premium landing page with hero, crops & workflow
│   │   ├── components/
│   │   │   ├── Footer.tsx             # Footer with attribution & scientific disclaimers
│   │   │   └── Navbar.tsx             # Responsive sticky navigation bar
│   │   └── lib/
│   │       └── api.ts                 # Type-safe API client connecting to FastAPI backend
│   ├── public/
│   │   └── samples/                   # Real sample leaf images for test uploads
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── docs/
│   ├── ARCHITECTURE.md                # System design & component interaction
│   ├── MODEL_CARD.md                  # Machine learning model documentation & attribution
│   └── SETUP.md                       # Complete Windows PowerShell setup instructions
├── README.md                          # Main project documentation
└── .gitignore
```

---

## 3. Computer Vision & Inference Pipeline

1. **Client Upload**:
   - The user selects or drags a file into the upload zone.
   - Frontend pre-validates MIME type (`image/jpeg`, `image/png`, `image/webp`) and file size limit ($\le 10$ MB).
   - Generates client-side object URL for immediate high-fidelity preview.

2. **Backend Image Sanitization (`image_service.py`)**:
   - MIME header magic-byte verification (rejects renamed binaries or scripts).
   - EXIF orientation auto-correction using Pillow `ImageOps.exif_transpose`.
   - Conversion to canonical 3-channel RGB (`.convert("RGB")`), stripping alpha channels and color profiles.
   - Dimension gating ($\le 4096 \times 4096$ pixels) to protect against decompression denial-of-service.

3. **Preprocessing (`AutoImageProcessor`)**:
   - Uses the documented image processor (`MobileNetV2ImageProcessorPil`).
   - Resizes the leaf image to $224 \times 224$ pixels via bicubic interpolation.
   - Normalizes tensors using standard ImageNet mean (`[0.485, 0.456, 0.406]`) and standard deviation (`[0.229, 0.224, 0.225]`).

4. **Inference Execution (`model_service.py`)**:
   - Loaded MobileNetV2 model evaluated in `eval()` mode under `torch.no_grad()`.
   - Logits parsed through Softmax activation:
     $$\text{Softmax}(z_i) = \frac{e^{z_i}}{\sum_{j=1}^{38} e^{z_j}}$$
   - Top-K scores and class indices extracted via `torch.topk`.

5. **Diagnostic Safeguards & Advisory Mapping**:
   - **Label Parsing**: Extracts exact crop and condition using the model's authoritative `id2label` mapping.
   - **Crop Validation**: If the user selected a target crop (e.g. Apple), but the predicted winning class belongs to another crop (e.g. Tomato), a strict mismatch warning is issued and the prediction is not reported as a valid diagnosis for the selected crop.
   - **Confidence Gating**: Scores below the threshold (default: 40%) trigger an uncertainty alert, recommending re-imaging under better lighting.
   - **Knowledge Retrieval**: Matches predicted condition with visual symptom descriptions and actionable agricultural extension recommendations.
