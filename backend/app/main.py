"""
AgroVision AI - FastAPI Application Entry Point

Starts the backend with CORS, model lazy-loading, and all API routes.
"""
from __future__ import annotations

import logging
import threading

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS, MODEL_CACHE_DIR, MODEL_ID
from app.api.routes import router
from app.services.model_service import get_model_service, ModelLoadError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(name)-24s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("agrovision")

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("AgroVision AI backend starting up")
    logger.info("Model: %s", MODEL_ID)
    logger.info("Cache dir: %s", MODEL_CACHE_DIR)
    logger.info("CORS origins: %s", CORS_ORIGINS)

    # Ensure cache directory exists
    MODEL_CACHE_DIR.mkdir(parents=True, exist_ok=True)

    # Start model loading in a background thread so the server starts quickly
    def _load():
        try:
            svc = get_model_service(model_id=MODEL_ID, cache_dir=str(MODEL_CACHE_DIR))
            svc.load_model()
            logger.info("Model loaded successfully.")
        except ModelLoadError as exc:
            logger.error("Model failed to load: %s", exc)
        except Exception as exc:
            logger.error("Unexpected error loading model: %s", exc, exc_info=True)

    thread = threading.Thread(target=_load, daemon=True, name="model-loader")
    thread.start()
    logger.info("Model loading started in background thread.")

    yield

    logger.info("AgroVision AI backend shutting down")


# Create the FastAPI app
app = FastAPI(
    title="AgroVision AI",
    description="AI-Powered Crop Disease Intelligence Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(router)


# ─── Run with uvicorn ────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    from app.config import HOST, PORT

    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
