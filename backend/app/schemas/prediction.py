"""
AgroVision AI - Pydantic Schemas for prediction request/response
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class PredictionItem(BaseModel):
    index: int
    label: str
    crop: str
    disease: str
    confidence: float
    is_healthy: bool
    relative_confidence: Optional[float] = None


class PredictionResult(BaseModel):
    success: bool
    model_id: str
    prediction: Optional[PredictionItem] = None
    crop_specific_prediction: Optional[PredictionItem] = None
    top_predictions: List[PredictionItem] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    crop_mismatch: bool = False
    is_target_crop: bool = True
    selected_crop: Optional[str] = None
    predicted_crop: Optional[str] = None
    processing_time_ms: float = 0.0
    disease_info: Optional[Dict[str, Any]] = None
    explanation: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_loading: bool
    model_id: str
    predictions_available: bool
    load_error: Optional[str] = None


class ModelInfoResponse(BaseModel):
    model_id: str
    architecture: str
    num_classes: int
    is_loaded: bool
    is_loading: bool
    device: str
    target_crops: List[str]
    all_labels: List[str]
    supported_diseases: Dict[str, List[str]]
    load_error: Optional[str] = None


class DiseaseCategory(BaseModel):
    crop: str
    disease_name: str
    raw_label: str
    is_healthy: bool


class DiseasesResponse(BaseModel):
    target_crops: List[str]
    categories: List[DiseaseCategory]
    total: int


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
