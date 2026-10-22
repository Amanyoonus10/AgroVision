"""
AgroVision AI - Model Service

Handles loading the Hugging Face model and running inference.
Uses lazy initialization with thread-safe singleton pattern.
"""
from __future__ import annotations

import logging
import threading
import time
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import torch
from PIL import Image

logger = logging.getLogger("agrovision.model")

# Global singleton
_model_service: Optional["ModelService"] = None
_init_lock = threading.Lock()


class ModelLoadError(Exception):
    """Raised when the model cannot be loaded."""
    pass


class ModelNotReadyError(Exception):
    """Raised when inference is called before the model is ready."""
    pass


class ModelService:
    """Singleton service that loads and runs the plant disease model."""

    def __init__(self, model_id: str, cache_dir: str):
        self.model_id = model_id
        self.cache_dir = cache_dir
        self.model = None
        self.processor = None
        self.id2label: Dict[int, str] = {}
        self.label2id: Dict[str, int] = {}
        self.num_classes: int = 0
        self.device: str = "cpu"
        self.is_loaded: bool = False
        self.is_loading: bool = False
        self.load_error: Optional[str] = None
        self._lock = threading.Lock()

    def load_model(self) -> None:
        """
        Load the model and processor from Hugging Face.
        Downloads weights on first run, then uses the local cache.
        Thread-safe: only one thread can load at a time.
        """
        if self.is_loaded:
            return

        with self._lock:
            if self.is_loaded:
                return

            self.is_loading = True
            self.load_error = None

            try:
                from transformers import (
                    AutoImageProcessor,
                    MobileNetV2ForImageClassification,
                )

                logger.info("Loading image processor from %s ...", self.model_id)
                self.processor = AutoImageProcessor.from_pretrained(
                    self.model_id,
                    cache_dir=self.cache_dir,
                )

                logger.info("Loading model weights from %s ...", self.model_id)
                self.model = MobileNetV2ForImageClassification.from_pretrained(
                    self.model_id,
                    cache_dir=self.cache_dir,
                )

                # Determine device
                if torch.cuda.is_available():
                    self.device = "cuda"
                    logger.info("CUDA available – using GPU.")
                else:
                    self.device = "cpu"
                    logger.info("Using CPU for inference.")

                self.model.to(self.device)
                self.model.eval()

                # Extract labels from model config
                config = self.model.config
                self.id2label = {int(k): v for k, v in config.id2label.items()}
                self.label2id = {v: int(k) for k, v in config.id2label.items()}
                self.num_classes = len(self.id2label)

                if self.num_classes == 0:
                    raise ModelLoadError("Model config has no class labels (id2label is empty).")

                logger.info(
                    "Model loaded: %d classes, device=%s", self.num_classes, self.device
                )
                self.is_loaded = True

            except Exception as exc:
                error_msg = f"Failed to load model: {exc}"
                logger.error(error_msg, exc_info=True)
                self.load_error = error_msg
                self.model = None
                self.processor = None
                raise ModelLoadError(error_msg) from exc
            finally:
                self.is_loading = False

    def predict(self, image: Image.Image, top_k: int = 3) -> Dict[str, Any]:
        """
        Run inference on a PIL Image.
        Returns the top-k predictions with scores.
        """
        if not self.is_loaded or self.model is None or self.processor is None:
            raise ModelNotReadyError(
                "Model is not loaded. " + (self.load_error or "Please wait for initialization.")
            )

        start_time = time.time()

        try:
            # Preprocess using the model's own image processor
            inputs = self.processor(images=image, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}

            # Run inference – no gradients needed
            with torch.no_grad():
                outputs = self.model(**inputs)

            logits = outputs.logits[0]  # shape: (num_classes,)

            # Verify output dimensions
            if logits.shape[0] != self.num_classes:
                raise ValueError(
                    f"Model output dimension ({logits.shape[0]}) does not match "
                    f"configured label count ({self.num_classes})."
                )

            # Check for non-finite values
            if not torch.isfinite(logits).all():
                raise ValueError("Model produced non-finite logit values.")

            # Apply softmax to get probabilities
            probs = torch.nn.functional.softmax(logits, dim=0)

            # Collect all class predictions sorted by score
            probs_np = probs.cpu().numpy()
            all_predictions: List[Dict[str, Any]] = []
            for idx_int, score in enumerate(probs_np):
                label = self.id2label.get(idx_int, f"unknown_{idx_int}")
                score_float = float(score) if np.isfinite(score) else 0.0
                all_predictions.append({
                    "index": idx_int,
                    "label": label,
                    "confidence": round(score_float, 6),
                })
            all_predictions.sort(key=lambda x: x["confidence"], reverse=True)

            top_k_clamped = min(top_k, len(all_predictions))
            predictions: List[Dict[str, Any]] = all_predictions[:top_k_clamped]

            elapsed_ms = round((time.time() - start_time) * 1000, 1)

            return {
                "predictions": predictions,
                "all_predictions": all_predictions,
                "processing_time_ms": elapsed_ms,
            }

        except (ModelNotReadyError, ModelLoadError):
            raise
        except Exception as exc:
            logger.error("Inference error: %s", exc, exc_info=True)
            raise ValueError(f"Inference failed: {exc}") from exc

    def get_status(self) -> Dict[str, Any]:
        """Return the current model status."""
        return {
            "model_id": self.model_id,
            "is_loaded": self.is_loaded,
            "is_loading": self.is_loading,
            "load_error": self.load_error,
            "num_classes": self.num_classes,
            "device": self.device,
            "predictions_available": self.is_loaded and self.model is not None,
        }


def get_model_service(model_id: str, cache_dir: str) -> ModelService:
    """Get or create the global ModelService singleton."""
    global _model_service
    if _model_service is not None:
        return _model_service

    with _init_lock:
        if _model_service is not None:
            return _model_service
        _model_service = ModelService(model_id=model_id, cache_dir=cache_dir)

    return _model_service
