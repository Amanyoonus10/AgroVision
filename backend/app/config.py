"""
AgroVision AI - Backend Configuration
"""
import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_CACHE_DIR = Path(os.getenv("MODEL_CACHE_DIR", str(BASE_DIR / "model_cache")))

# Server
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# CORS
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]

# Model
MODEL_ID = os.getenv("MODEL_ID", "Kathir56/plant-disease-tamilnadu")

# Upload limits
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024
MAX_IMAGE_DIMENSION = int(os.getenv("MAX_IMAGE_DIMENSION", "4096"))
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Inference
LOW_CONFIDENCE_THRESHOLD = float(os.getenv("LOW_CONFIDENCE_THRESHOLD", "0.4"))
TOP_K_PREDICTIONS = int(os.getenv("TOP_K_PREDICTIONS", "3"))

# Target crops for this application
TARGET_CROPS = ["Apple", "Grape", "Orange", "Tomato"]
