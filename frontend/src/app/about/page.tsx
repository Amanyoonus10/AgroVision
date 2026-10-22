"use client";

import React from "react";
import Link from "next/link";
import {
  Cpu,
  ShieldCheck,
  ExternalLink,
  Layers,
  Database,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award
} from "lucide-react";

export default function AboutPage() {
  const modelClasses = [
    { index: 0, label: "Apple___Apple_scab", crop: "Apple", disease: "Apple Scab", healthy: false },
    { index: 1, label: "Apple___Black_rot", crop: "Apple", disease: "Black Rot", healthy: false },
    { index: 2, label: "Apple___Cedar_apple_rust", crop: "Apple", disease: "Cedar Apple Rust", healthy: false },
    { index: 3, label: "Apple___healthy", crop: "Apple", disease: "Healthy", healthy: true },
    { index: 4, label: "Blueberry___healthy", crop: "Blueberry", disease: "Healthy", healthy: true },
    { index: 5, label: "Cherry_(including_sour)___Powdery_mildew", crop: "Cherry", disease: "Powdery Mildew", healthy: false },
    { index: 6, label: "Cherry_(including_sour)___healthy", crop: "Cherry", disease: "Healthy", healthy: true },
    { index: 7, label: "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", crop: "Corn", disease: "Cercospora / Gray Leaf Spot", healthy: false },
    { index: 8, label: "Corn_(maize)___Common_rust_", crop: "Corn", disease: "Common Rust", healthy: false },
    { index: 9, label: "Corn_(maize)___Northern_Leaf_Blight", crop: "Corn", disease: "Northern Leaf Blight", healthy: false },
    { index: 10, label: "Corn_(maize)___healthy", crop: "Corn", disease: "Healthy", healthy: true },
    { index: 11, label: "Grape___Black_rot", crop: "Grape", disease: "Black Rot", healthy: false },
    { index: 12, label: "Grape___Esca_(Black_Measles)", crop: "Grape", disease: "Esca (Black Measles)", healthy: false },
    { index: 13, label: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", crop: "Grape", disease: "Leaf Blight (Isariopsis)", healthy: false },
    { index: 14, label: "Grape___healthy", crop: "Grape", disease: "Healthy", healthy: true },
    { index: 15, label: "Orange___Haunglongbing_(Citrus_greening)", crop: "Orange", disease: "Citrus Greening (HLB)", healthy: false },
    { index: 16, label: "Peach___Bacterial_spot", crop: "Peach", disease: "Bacterial Spot", healthy: false },
    { index: 17, label: "Peach___healthy", crop: "Peach", disease: "Healthy", healthy: true },
    { index: 18, label: "Pepper,_bell___Bacterial_spot", crop: "Bell Pepper", disease: "Bacterial Spot", healthy: false },
    { index: 19, label: "Pepper,_bell___healthy", crop: "Bell Pepper", disease: "Healthy", healthy: true },
    { index: 20, label: "Potato___Early_blight", crop: "Potato", disease: "Early Blight", healthy: false },
    { index: 21, label: "Potato___Late_blight", crop: "Potato", disease: "Late Blight", healthy: false },
    { index: 22, label: "Potato___healthy", crop: "Potato", disease: "Healthy", healthy: true },
    { index: 23, label: "Raspberry___healthy", crop: "Raspberry", disease: "Healthy", healthy: true },
    { index: 24, label: "Soybean___healthy", crop: "Soybean", disease: "Healthy", healthy: true },
    { index: 25, label: "Squash___Powdery_mildew", crop: "Squash", disease: "Powdery Mildew", healthy: false },
    { index: 26, label: "Strawberry___Leaf_scorch", crop: "Strawberry", disease: "Leaf Scorch", healthy: false },
    { index: 27, label: "Strawberry___healthy", crop: "Strawberry", disease: "Healthy", healthy: true },
    { index: 28, label: "Tomato___Bacterial_spot", crop: "Tomato", disease: "Bacterial Spot", healthy: false },
    { index: 29, label: "Tomato___Early_blight", crop: "Tomato", disease: "Early Blight", healthy: false },
    { index: 30, label: "Tomato___Late_blight", crop: "Tomato", disease: "Late Blight", healthy: false },
    { index: 31, label: "Tomato___Leaf_Mold", crop: "Tomato", disease: "Leaf Mold", healthy: false },
    { index: 32, label: "Tomato___Septoria_leaf_spot", crop: "Tomato", disease: "Septoria Leaf Spot", healthy: false },
    { index: 33, label: "Tomato___Spider_mites Two-spotted_spider_mite", crop: "Tomato", disease: "Spider Mites", healthy: false },
    { index: 34, label: "Tomato___Target_Spot", crop: "Tomato", disease: "Target Spot", healthy: false },
    { index: 35, label: "Tomato___Tomato_Yellow_Leaf_Curl_Virus", crop: "Tomato", disease: "Yellow Leaf Curl Virus", healthy: false },
    { index: 36, label: "Tomato___Tomato_mosaic_virus", crop: "Tomato", disease: "Mosaic Virus", healthy: false },
    { index: 37, label: "Tomato___healthy", crop: "Tomato", disease: "Healthy", healthy: true },
  ];

  return (
    <div className="content-wrapper" style={{ paddingTop: "40px" }}>
      {/* Header */}
      <div style={{ maxWidth: "800px", marginBottom: "48px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span className="badge badge-healthy">Technical Transparency & Model Card</span>
        </div>
        <h1 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Architecture & Model Card Specifications
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginTop: "8px", lineHeight: 1.6 }}>
          Comprehensive documentation of the integrated convolutional neural network, dataset heritage, authoritative class mappings, and diagnostic safety guardrails.
        </p>
      </div>

      {/* Grid: Overview Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        marginBottom: "48px",
      }}>
        <div className="glass-panel" style={{ padding: "26px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "rgba(16, 185, 129, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            color: "#34D399",
          }}>
            <Cpu size={22} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
            MobileNetV2 Backbone
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Inverted residual structure with linear bottlenecks designed for low-latency CPU and edge inference without compromising feature extraction capacity.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "26px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "rgba(56, 189, 248, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            color: "#38BDF8",
          }}>
            <Database size={22} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
            Hugging Face Model Hub
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Integrated directly with <code>Kathir56/plant-disease-tamilnadu</code>. Model weights are cached locally to ensure instant startup.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "26px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "rgba(245, 158, 11, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            color: "#F59E0B",
          }}>
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
            Multi-Tier Safety Guardrails
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Crop mismatch detection, 40% confidence threshold alerts, magic-byte header validation, and non-prescriptive cultural advisories.
          </p>
        </div>
      </div>

      {/* 38 Class Table */}
      <div className="glass-panel" style={{ padding: "32px", marginBottom: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff" }}>
              Authoritative 38-Class Mapping
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Directly extracted from the model id2label config.
            </p>
          </div>
          <span className="badge badge-healthy">
            38 Total Labels
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
            textAlign: "left",
          }}>
            <thead>
              <tr style={{
                borderBottom: "1px solid var(--border-highlight)",
                color: "var(--text-muted)",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                <th style={{ padding: "12px 16px" }}>Index</th>
                <th style={{ padding: "12px 16px" }}>Crop Category</th>
                <th style={{ padding: "12px 16px" }}>Condition / Pathology</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px" }}>Raw id2label Key</th>
              </tr>
            </thead>
            <tbody>
              {modelClasses.map((cls) => (
                <tr
                  key={cls.index}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.04)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    #{cls.index}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "#ffffff" }}>
                    {cls.crop}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#e2e8f0" }}>
                    {cls.disease}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {cls.healthy ? (
                      <span className="badge badge-healthy" style={{ fontSize: "11px" }}>Healthy</span>
                    ) : (
                      <span className="badge badge-disease" style={{ fontSize: "11px" }}>Diseased</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
                    <code>{cls.label}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* External Links CTA */}
      <div className="glass-panel" style={{
        padding: "32px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
            Explore Model Artifacts on Hugging Face
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Inspect weights, commit history, and model configuration directly on the Hugging Face Hub.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <a
            href="https://huggingface.co/Kathir56/plant-disease-tamilnadu"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ fontSize: "13px", padding: "10px 20px" }}
          >
            Hugging Face Model
            <ExternalLink size={14} />
          </a>
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ fontSize: "13px", padding: "10px 20px" }}
          >
            FastAPI Swagger UI
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
