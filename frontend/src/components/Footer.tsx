import React from "react";
import Link from "next/link";
import { Leaf, ShieldAlert, Cpu, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)",
      backgroundColor: "rgba(5, 10, 7, 0.95)",
      padding: "50px 0 30px 0",
      marginTop: "auto",
      position: "relative",
      zIndex: 10,
    }}>
      <div className="content-wrapper">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "40px",
          marginBottom: "40px",
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #10B981, #064e3b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Leaf size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff" }}>
                AGROVISION AI
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "320px" }}>
              Production-grade AI crop disease diagnosis engine. Powered by MobileNetV2 pretrained on Tamil Nadu & international foliar plant disease datasets.
            </p>
          </div>

          {/* Col 2: Supported Target Crops */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Target Crops
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "var(--text-secondary)" }}>
              <li>🍎 <strong>Apple</strong> (Scab, Black Rot, Cedar Rust, Healthy)</li>
              <li>🍇 <strong>Grape</strong> (Black Rot, Esca, Leaf Blight, Healthy)</li>
              <li>🍊 <strong>Orange</strong> (Citrus Greening / Huanglongbing)</li>
              <li>🍅 <strong>Tomato</strong> (10 pathological and healthy states)</li>
            </ul>
          </div>

          {/* Col 3: Technical Transparency */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Transparency & Safety
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Cpu size={16} color="#34D399" />
                <span>Zero Mocked Outputs (Genuine Tensor Inference)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldAlert size={16} color="#FBBF24" />
                <span>Crop Mismatch & Low-Confidence Guardrails</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <HeartHandshake size={16} color="#38BDF8" />
                <span>Safe Cultural Agricultural Guidance</span>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Platform Navigation
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Platform Overview</Link>
              <Link href="/analyze" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Diagnostic Workspace</Link>
              <Link href="/about" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Model Card & 38 Classes</Link>
              <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>FastAPI Docs (Swagger)</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          paddingTop: "24px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}>
          <div>
            © {new Date().getFullYear()} AgroVision AI Platform. Sourced from <code>Kathir56/plant-disease-tamilnadu</code> on Hugging Face.
          </div>
          <div>
            Scientific decision-support tool. Not a replacement for accredited laboratory pathology assays.
          </div>
        </div>
      </div>
    </footer>
  );
}
