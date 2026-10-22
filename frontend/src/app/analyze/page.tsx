"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  UploadCloud,
  FileImage,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Clock,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  X
} from "lucide-react";
import { predictDisease, PredictionResult, getHealth, HealthResponse } from "@/lib/api";

// Sample test leaf images (data URIs or local assets)
const SAMPLE_PRESETS = [
  {
    name: "Apple Scab",
    crop: "Apple",
    label: "Apple___Apple_scab",
    desc: "Apple leaf with olive-brown velvety spots",
    file: "/samples/apple_scab.png",
  },
  {
    name: "Healthy Apple",
    crop: "Apple",
    label: "Apple___healthy",
    desc: "Vibrant green undamaged apple foliage",
    file: "/samples/apple_healthy.png",
  },
  {
    name: "Tomato Late Blight",
    crop: "Tomato",
    label: "Tomato___Late_blight",
    desc: "Solanaceous foliage with water-soaked necrotic lesions",
    file: "/samples/tomato_blight.png",
  },
  {
    name: "Grape Black Rot",
    crop: "Grape",
    label: "Grape___Black_rot",
    desc: "Grapevine leaf with reddish-brown necrotic spots",
    file: "/samples/grape_rot.png",
  },
  {
    name: "Citrus Greening",
    crop: "Orange",
    label: "Orange___Haunglongbing_(Citrus_greening)",
    desc: "Citrus leaf displaying asymmetric blotchy chlorosis",
    file: "/samples/orange_greening.png",
  },
];

function AnalyzeWorkspace() {
  const searchParams = useSearchParams();
  const initialCrop = searchParams.get("crop") || "Auto";

  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PredictionResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getHealth().then(setBackendHealth);
  }, []);

  // Handle file selection
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAnalysisError("Please select a valid image file (JPEG, PNG, or WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAnalysisError("Image file size exceeds the 10 MB maximum limit.");
      return;
    }

    setAnalysisError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAnalysisResult(null);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Preset selector
  const loadPreset = async (preset: typeof SAMPLE_PRESETS[0]) => {
    try {
      setSelectedCrop(preset.crop);
      setAnalysisError(null);
      setAnalysisResult(null);

      // Fetch sample asset
      const res = await fetch(preset.file);
      const blob = await res.blob();
      const file = new File([blob], `${preset.name.toLowerCase().replace(/\s+/g, "_")}.png`, {
        type: "image/png",
      });
      setSelectedFile(file);
      setPreviewUrl(preset.file);
    } catch {
      setAnalysisError("Could not load sample leaf asset.");
    }
  };

  // Reset
  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Trigger real inference
  const handleRunAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const autoDetect = selectedCrop === "Auto";
      const cropParam = autoDetect ? null : selectedCrop;
      const result = await predictDisease(selectedFile, selectedFile.name, cropParam, autoDetect);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Inference failed to complete.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const cropOptions = ["Auto", "Apple", "Grape", "Orange", "Tomato"];

  return (
    <div className="content-wrapper" style={{ paddingTop: "32px" }}>
      {/* Page Title */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span className="badge badge-healthy">Live Diagnostic Lab</span>
          {backendHealth?.model_loaded ? (
            <span className="badge badge-neutral" style={{ color: "#34D399" }}>
              MobileNetV2 Engine Active
            </span>
          ) : (
            <span className="badge badge-warn">
              {backendHealth?.model_loading ? "Loading Model Weights..." : "Connecting to Backend..."}
            </span>
          )}
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Leaf Pathology Diagnostic Workspace
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "4px" }}>
          Upload high-resolution foliar photography or select a calibrated sample below for instant neural disease classification.
        </p>
      </div>

      {/* Main Grid: Upload & Controls on Left, Results on Right */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "32px",
        alignItems: "start",
      }}>
        {/* Left Column: Image Ingestion & Parameters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Target Crop Selector */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "#ffffff" }}>
              Designated Crop Calibration:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {cropOptions.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setSelectedCrop(crop)}
                  className={`crop-pill ${selectedCrop === crop ? "active" : ""}`}
                >
                  {crop === "Auto" ? "⚡ Auto-Detect" : crop}
                </button>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "10px" }}>
              {selectedCrop === "Auto"
                ? "Auto-detect matches the leaf condition across all 38 classes simultaneously."
                : `Active safety guardrail: Flags if the uploaded leaf does not match ${selectedCrop}.`}
            </p>
          </div>

          {/* Quick Preset Samples */}
          <div className="glass-panel" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>
                Quick Test Samples
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Click to load calibrated leaf
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "var(--brand-leaf)";
                    e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            className="glass-panel"
            style={{
              padding: "32px",
              textAlign: "center",
              border: isDragging
                ? "2px dashed #10B981"
                : previewUrl
                ? "1px solid var(--border-highlight)"
                : "2px dashed rgba(52, 211, 153, 0.25)",
              background: isDragging
                ? "rgba(16, 185, 129, 0.1)"
                : "var(--bg-card)",
              cursor: "pointer",
              position: "relative",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {previewUrl ? (
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  maxHeight: "340px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#050b07",
                  border: "1px solid var(--border-subtle)",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Uploaded leaf preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "340px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>

                {/* Clear button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(0, 0, 0, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title="Remove image"
                >
                  <X size={16} />
                </button>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "12px",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                }}>
                  <span>{selectedFile?.name || "Sample Leaf"}</span>
                  <span>{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Asset"}</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: "20px 0" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "20px",
                  background: "rgba(16, 185, 129, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  color: "#34D399",
                }}>
                  <UploadCloud size={30} />
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                  Drop leaf image here or click to browse
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                  Supports JPEG, PNG, and WebP (up to 10 MB)
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)" }}>
                  <ShieldCheck size={14} color="#34D399" />
                  <span>Automatic EXIF orientation normalization & magic-byte validation</span>
                </div>
              </div>
            )}
          </div>

          {/* Diagnostic Action Button */}
          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={!selectedFile || isAnalyzing}
            className={`btn-primary ${!selectedFile || isAnalyzing ? "btn-disabled" : ""}`}
            style={{ width: "100%", padding: "16px", fontSize: "16px" }}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin" style={{ width: "18px", height: "18px", border: "2px solid #ffffff", borderTopColor: "transparent", borderRadius: "50%" }} />
                <span>Running PyTorch Forward Pass...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Run Diagnostic Analysis</span>
              </>
            )}
          </button>

          {/* Error Banner */}
          {analysisError && (
            <div style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#FCA5A5",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              fontSize: "14px",
            }}>
              <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ display: "block", color: "#ffffff", marginBottom: "2px" }}>Analysis Notice</strong>
                {analysisError}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Diagnostic Intelligence Results */}
        <div>
          {analysisResult ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Crop Mismatch Banner if triggered */}
              {analysisResult.crop_mismatch && (
                <div style={{
                  padding: "18px",
                  borderRadius: "14px",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.5)",
                  display: "flex",
                  gap: "14px",
                }}>
                  <AlertTriangle size={24} color="#F59E0B" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#FBBF24", marginBottom: "4px" }}>
                      Crop Mismatch Detected
                    </h4>
                    <p style={{ fontSize: "13px", color: "#FDE68A", lineHeight: 1.5 }}>
                      You designated <strong>{analysisResult.selected_crop}</strong>, but the neural model identified visual features corresponding to <strong>{analysisResult.predicted_crop}</strong> ({analysisResult.prediction?.disease}). Review the raw diagnosis below.
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Diagnosis Card */}
              <div className="glass-panel-glow" style={{ padding: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                      Primary Botanical Classification
                    </span>
                    <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>
                      {analysisResult.prediction?.crop} — {analysisResult.prediction?.disease}
                    </h2>
                  </div>

                  {analysisResult.prediction?.is_healthy ? (
                    <span className="badge badge-healthy" style={{ fontSize: "13px", padding: "6px 14px" }}>
                      <CheckCircle2 size={16} />
                      Healthy Foliage
                    </span>
                  ) : (
                    <span className="badge badge-disease" style={{ fontSize: "13px", padding: "6px 14px" }}>
                      <AlertCircle size={16} />
                      Pathology Detected
                    </span>
                  )}
                </div>

                {/* Confidence Bar Meter */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                    <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Model Confidence</span>
                    <span style={{ fontWeight: 800, color: "#34D399" }}>
                      {((analysisResult.prediction?.confidence || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{
                    height: "10px",
                    borderRadius: "999px",
                    background: "rgba(255, 255, 255, 0.08)",
                    overflow: "hidden",
                    position: "relative",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${Math.min(100, (analysisResult.prediction?.confidence || 0) * 100)}%`,
                      borderRadius: "999px",
                      background: (analysisResult.prediction?.confidence || 0) < 0.4
                        ? "linear-gradient(90deg, #F59E0B, #EF4444)"
                        : "linear-gradient(90deg, #10B981, #34D399)",
                      transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }} />
                  </div>
                </div>

                {/* Sub-metrics */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background: "rgba(0, 0, 0, 0.25)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "12px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={15} color="var(--brand-leaf)" />
                    <span style={{ color: "var(--text-secondary)" }}>Latency:</span>
                    <strong style={{ color: "#ffffff" }}>{analysisResult.processing_time_ms.toFixed(1)} ms</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Cpu size={15} color="var(--brand-leaf)" />
                    <span style={{ color: "var(--text-secondary)" }}>Engine:</span>
                    <strong style={{ color: "#ffffff" }}>MobileNetV2</strong>
                  </div>
                </div>
              </div>

              {/* Top-3 Candidates Breakdown */}
              {analysisResult.top_predictions && analysisResult.top_predictions.length > 0 && (
                <div className="glass-panel" style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "16px" }}>
                    Top-3 Probability Distribution
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {analysisResult.top_predictions.map((item, idx) => (
                      <div key={idx} style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        background: idx === 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
                        border: idx === 0 ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: idx === 0 ? "#ffffff" : "var(--text-secondary)" }}>
                            {idx + 1}. {item.crop} — {item.disease}
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: idx === 0 ? "#34D399" : "var(--text-muted)" }}>
                            {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255, 255, 255, 0.06)", overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${item.confidence * 100}%`,
                            background: idx === 0 ? "#10B981" : "#64748B",
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agricultural Advisory Guidance */}
              {analysisResult.disease_info && (
                <div className="glass-panel" style={{ padding: "26px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(56, 189, 248, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Info size={18} color="#38BDF8" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#ffffff" }}>
                        Agricultural Management Advisory
                      </h3>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Verified agronomic checklist for {analysisResult.disease_info.condition}
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {analysisResult.disease_info.symptoms && analysisResult.disease_info.symptoms.length > 0 && (
                    <div style={{ marginBottom: "18px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "8px", letterSpacing: "0.05em" }}>
                        Field Symptoms Checklist:
                      </div>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {analysisResult.disease_info.symptoms.map((sym, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#e2e8f0" }}>
                            <span style={{ color: "#38BDF8" }}>•</span>
                            <span>{sym}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cultural Management */}
                  {analysisResult.disease_info.cultural_management && analysisResult.disease_info.cultural_management.length > 0 && (
                    <div style={{ marginBottom: "18px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "8px", letterSpacing: "0.05em" }}>
                        Cultural & Agronomic Controls:
                      </div>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {analysisResult.disease_info.cultural_management.map((cult, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#cbd5e1" }}>
                            <CheckCircle2 size={14} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                            <span>{cult}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Scientific Disclaimer */}
                  <div style={{
                    padding: "12px 14px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                  }}>
                    <strong>Disclaimer:</strong> {analysisResult.disease_info.disclaimer}
                  </div>
                </div>
              )}

              {/* Expandable Raw Neural Output */}
              <div className="glass-panel" style={{ padding: "16px 20px" }}>
                <button
                  type="button"
                  onClick={() => setShowRawJson(!showRawJson)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  <span>Raw Model Output & Metadata</span>
                  {showRawJson ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showRawJson && (
                  <pre style={{
                    marginTop: "14px",
                    padding: "14px",
                    borderRadius: "8px",
                    background: "#030704",
                    color: "#a7f3d0",
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    overflowX: "auto",
                    maxHeight: "260px",
                  }}>
                    {JSON.stringify(analysisResult, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel" style={{
              padding: "60px 40px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "440px",
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: "var(--text-muted)",
              }}>
                <FileImage size={28} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                Awaiting Foliar Input
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "340px", lineHeight: 1.6 }}>
                Select a target crop, upload an image from your device, or click one of the quick test presets to execute genuine neural inference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="content-wrapper" style={{ padding: "40px" }}>Loading workspace...</div>}>
      <AnalyzeWorkspace />
    </Suspense>
  );
}
