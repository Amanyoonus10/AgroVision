/**
 * AgroVision AI - Type-Safe API Client
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface PredictionItem {
  index: number;
  label: string;
  crop: string;
  disease: string;
  confidence: number;
  is_healthy: boolean;
  relative_confidence?: number | null;
}

export interface DiseaseInfo {
  crop: string;
  condition: string;
  is_healthy: boolean;
  scientific_name?: string;
  symptoms: string[];
  cultural_management: string[];
  preventive_measures: string[];
  severity_level?: "none" | "low" | "moderate" | "severe";
  disclaimer: string;
}

export interface PredictionResult {
  success: boolean;
  model_id: string;
  prediction?: PredictionItem;
  crop_specific_prediction?: PredictionItem;
  top_predictions: PredictionItem[];
  warnings: string[];
  crop_mismatch: boolean;
  is_target_crop: boolean;
  selected_crop?: string | null;
  predicted_crop?: string | null;
  processing_time_ms: number;
  disease_info?: DiseaseInfo;
  explanation?: string;
}

export interface HealthResponse {
  status: "ok" | "loading" | "waiting" | string;
  model_loaded: boolean;
  model_loading: boolean;
  model_id: string;
  predictions_available: boolean;
  load_error?: string | null;
}

export interface ModelInfoResponse {
  model_id: string;
  architecture: string;
  num_classes: number;
  is_loaded: boolean;
  is_loading: boolean;
  device: string;
  target_crops: string[];
  all_labels: string[];
  supported_diseases: Record<string, string[]>;
  load_error?: string | null;
}

export interface DiseaseCategory {
  crop: string;
  disease_name: string;
  raw_label: string;
  is_healthy: boolean;
}

export interface DiseasesResponse {
  target_crops: string[];
  categories: DiseaseCategory[];
  total: number;
}

/**
 * Check backend health status
 */
export async function getHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    return {
      status: "offline",
      model_loaded: false,
      model_loading: false,
      model_id: "Kathir56/plant-disease-tamilnadu",
      predictions_available: false,
      load_error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

/**
 * Fetch model information
 */
export async function getModelInfo(): Promise<ModelInfoResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/model-info`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch supported diseases
 */
export async function getDiseases(): Promise<DiseasesResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/diseases`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Perform genuine disease prediction on an uploaded image
 */
export async function predictDisease(
  file: File | Blob,
  fileName = "leaf.jpg",
  selectedCrop?: string | null,
  autoDetect = true
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("file", file, fileName);

  if (selectedCrop && selectedCrop !== "Auto") {
    formData.append("selected_crop", selectedCrop);
  }
  formData.append("auto_detect", autoDetect ? "true" : "false");

  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.error || "Inference analysis failed");
  }
  return data as PredictionResult;
}
