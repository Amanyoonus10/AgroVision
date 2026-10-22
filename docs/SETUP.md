# AgroVision AI — Windows Setup & Deployment Guide

This guide contains exact, step-by-step Windows PowerShell instructions to set up, configure, test, and run the AgroVision AI platform.

---

## 1. Prerequisites

Ensure the following tools are installed on your Windows machine:

1. **Python 3.10+ (tested on Python 3.13)**:
   ```powershell
   python --version
   ```
2. **Node.js 18+ & npm**:
   ```powershell
   node --version
   npm --version
   ```
3. **Git**:
   ```powershell
   git --version
   ```

---

## 2. Backend Setup & Configuration

### Step 2.1: Navigate to Backend Directory
```powershell
cd "c:\Users\edwin\OneDrive\Desktop\Our project\backend"
```

### Step 2.2: Install Python Dependencies
Install the required packages using pip:
```powershell
pip install -r requirements.txt
```
*Dependencies installed:*
- `fastapi==0.104.1`
- `uvicorn[standard]==0.24.0`
- `python-multipart==0.0.6`
- `torch>=2.0.0`
- `transformers>=4.35.0`
- `Pillow>=10.0.0`
- `numpy>=1.24.0`
- `httpx>=0.25.0,<0.28.0`
- `pytest>=7.4.0`
- `pytest-asyncio>=0.21.0`

### Step 2.3: Environment Configuration
Create or inspect your `.env` file in `backend/`:
```ini
HOST=127.0.0.1
PORT=8000
MODEL_ID=Kathir56/plant-disease-tamilnadu
MODEL_CACHE_DIR=./app/model_cache
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
MAX_UPLOAD_SIZE_MB=10
LOW_CONFIDENCE_THRESHOLD=0.4
TOP_K_PREDICTIONS=3
```

---

## 3. Automated Testing & Verification

### Step 3.1: Run Backend Automated Test Suite (28 Tests)
Run pytest to verify all label mappings, input validation, HTTP contracts, and error handling:
```powershell
python -m pytest tests/ -v
```
*Expected result:* `28 passed in ~5s`.

### Step 3.2: Run Live Model Inference Smoke Test
Run the forward-pass smoke test that loads the real pretrained MobileNetV2 model and performs live inference:
```powershell
python tests/smoke_test_real_model.py
```
*Expected result:*
```
[PASS] Model loaded successfully.
[PASS] Inference executed in ~500ms.
[PASS] All validation assertions passed!
REAL INFERENCE TEST PASSED: Genuine model classification confirmed.
```

---

## 4. Starting the Backend Server

Start the FastAPI application with Uvicorn:
```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Swagger API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc API Documentation: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- Health Check Endpoint: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 5. Frontend Setup & Execution

### Step 5.1: Navigate to Frontend Directory
Open a second PowerShell window:
```powershell
cd "c:\Users\edwin\OneDrive\Desktop\Our project\frontend"
```

### Step 5.2: Install NPM Dependencies (if needed)
```powershell
npm install
```

### Step 5.3: Build for Production (Verification)
```powershell
npm run build
```
*Expected result:* `✓ Generating static pages (6/6)` with zero errors.

### Step 5.4: Start the Development Server
```powershell
npm run dev
```
Open your browser to: [http://localhost:3000](http://localhost:3000)

---

## 6. End-to-End Verification Checklist

1. Navigate to [http://localhost:3000](http://localhost:3000) — verify the hero section, supported crops, and navigation.
2. Click **"Analyze a Leaf"** to navigate to `/analyze`.
3. Check the status badge at top-right: it should read **"AI Model Ready (38 classes)"**.
4. Select a crop (e.g. Apple) or leave "Auto-detect Crop" enabled.
5. Drag and drop or browse to select a sample image:
   - `frontend/public/samples/apple_leaf.png`
   - `frontend/public/samples/tomato_leaf.png`
6. Click **"Run Diagnostic Analysis"**.
7. Observe the genuine prediction results:
   - Predicted Crop & Disease condition
   - Model confidence percentage & progress bar
   - Top 3 predictions breakdown
   - Raw model class output (expandable)
   - Curated agricultural advisory guidance
8. Navigate to [http://localhost:3000/about](http://localhost:3000/about) to view the complete model card and technical methodology.
