import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  AlertTriangle,
  TrendingUp,
  Activity,
  HeartHandshake
} from "lucide-react";

export default function HomePage() {
  const targetCrops = [
    {
      name: "Apple",
      emoji: "🍎",
      conditions: ["Apple Scab", "Black Rot", "Cedar Apple Rust", "Healthy Foliage"],
      description: "Foliar monitoring for high-value orchards vulnerable to fungal gymnosporangium and venturia pathogens.",
      color: "#EF4444",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(18, 35, 27, 0.6) 100%)",
    },
    {
      name: "Grape",
      emoji: "🍇",
      conditions: ["Black Rot", "Esca (Black Measles)", "Leaf Blight", "Healthy Foliage"],
      description: "Viticulture diagnostics for trunk disease complex, Guignardia bidwellii, and leaf spot prevention.",
      color: "#A855F7",
      bgGradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(18, 35, 27, 0.6) 100%)",
    },
    {
      name: "Orange",
      emoji: "🍊",
      conditions: ["Citrus Greening (Huanglongbing)", "Healthy Foliage"],
      description: "Early warning surveillance against Candidatus Liberibacter asiaticus transmitted by citrus psyllids.",
      color: "#F97316",
      bgGradient: "linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(18, 35, 27, 0.6) 100%)",
    },
    {
      name: "Tomato",
      emoji: "🍅",
      conditions: [
        "Bacterial Spot",
        "Early Blight",
        "Late Blight",
        "Leaf Mold",
        "Septoria Leaf Spot",
        "Spider Mites",
        "Target Spot",
        "Yellow Leaf Curl Virus",
        "Mosaic Virus",
        "Healthy Foliage"
      ],
      description: "Comprehensive greenhouse and field solanaceous disease classification covering viral, fungal, and pest pressures.",
      color: "#10B981",
      bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(18, 35, 27, 0.6) 100%)",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Leaf Optical Ingestion",
      desc: "Upload RGB leaf photography via mobile camera or laboratory scan with automatic EXIF orientation normalization and magic-byte validation.",
      icon: Search,
    },
    {
      step: "02",
      title: "MobileNetV2 Deep Inference",
      desc: "Genuine forward pass executed on PyTorch inference runtime across 38 authoritative classes with soft probability distribution.",
      icon: Cpu,
    },
    {
      step: "03",
      title: "Safety Guardrails & Advisory",
      desc: "Automated crop mismatch flagging, low-confidence warning triggers (<40%), and actionable cultural management guidelines.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "80px", paddingTop: "40px" }}>
      {/* Hero Section */}
      <section className="content-wrapper">
        <div style={{
          textAlign: "center",
          maxWidth: "880px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          padding: "40px 0 20px 0",
        }}>
          {/* Pill Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "999px",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(52, 211, 153, 0.35)",
            fontSize: "13px",
            fontWeight: 600,
            color: "#6ee7b7",
          }}>
            <Sparkles size={15} color="#34D399" />
            <span>Production Neural Inference Microservice</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: "clamp(36px, 5.5vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}>
            Precision Agricultural AI for{" "}
            <span className="gradient-text">Crop Disease Intelligence</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: "720px",
          }}>
            Detect and classify plant leaf pathologies with verified neural accuracy. Powered by fine-tuned MobileNetV2 architecture with safety guardrails against crop mismatches and low-confidence predictions.
          </p>

          {/* CTA Group */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
            marginTop: "12px",
          }}>
            <Link href="/analyze" className="btn-primary" style={{ fontSize: "16px", padding: "16px 36px" }}>
              Launch Diagnostic Workspace
              <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="btn-secondary" style={{ fontSize: "16px", padding: "16px 32px" }}>
              Technical Architecture
            </Link>
          </div>

          {/* Live System Metrics Bar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px",
            width: "100%",
            marginTop: "40px",
          }}>
            {[
              { label: "Botanical Classes", value: "38", sub: "Authoritative id2label" },
              { label: "Target High-Value Crops", value: "4 Primary", sub: "Apple, Grape, Orange, Tomato" },
              { label: "Inference Latency", value: "< 250ms", sub: "PyTorch CPU / MPS" },
              { label: "Model Architecture", value: "MobileNetV2", sub: "Tamil Nadu foliar dataset" },
            ].map((metric, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: "20px", textAlign: "left" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#34D399", marginBottom: "4px" }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {metric.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Crops Section */}
      <section className="content-wrapper">
        <div style={{ marginBottom: "36px", textAlign: "center" }}>
          <div className="badge badge-healthy" style={{ marginBottom: "12px" }}>
            Horticultural Focus
          </div>
          <h2 className="section-title">Specialized Target Crops</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Calibrated specifically to diagnose key pathological pressures across orchard, vineyard, and field crops.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {targetCrops.map((crop) => (
            <div
              key={crop.name}
              className="glass-panel"
              style={{
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: crop.bgGradient,
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                transition: "transform 0.25s ease, border-color 0.25s ease",
              }}
            >
              <div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}>
                  <div style={{
                    fontSize: "36px",
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}>
                    {crop.emoji}
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: "11px" }}>
                    {crop.conditions.length} conditions
                  </span>
                </div>

                <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                  {crop.name}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "20px" }}>
                  {crop.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                    Detectable Conditions:
                  </div>
                  {crop.conditions.slice(0, 4).map((cond, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#e2e8f0" }}>
                      <CheckCircle2 size={14} color="#10B981" />
                      <span>{cond}</span>
                    </div>
                  ))}
                  {crop.conditions.length > 4 && (
                    <div style={{ fontSize: "12px", color: "#6ee7b7", paddingLeft: "22px" }}>
                      +{crop.conditions.length - 4} more conditions...
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={`/analyze?crop=${crop.name}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "background 0.2s ease",
                }}
              >
                <span>Analyze {crop.name} Leaf</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="content-wrapper">
        <div style={{
          background: "linear-gradient(180deg, rgba(18, 35, 27, 0.5) 0%, rgba(7, 14, 10, 0.8) 100%)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "24px",
          padding: "60px 40px",
        }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 className="section-title">End-to-End Diagnostic Pipeline</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Designed for field reliability, scientific validity, and agronomist trust.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
          }}>
            {workflowSteps.map((ws) => {
              const Icon = ws.icon;
              return (
                <div key={ws.step} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid rgba(52, 211, 153, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Icon size={24} color="#34D399" />
                    </div>
                    <span style={{ fontSize: "28px", fontWeight: 800, color: "rgba(255, 255, 255, 0.2)" }}>
                      {ws.step}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>
                    {ws.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {ws.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Guardrails Banner */}
      <section className="content-wrapper" style={{ paddingBottom: "20px" }}>
        <div className="glass-panel-glow" style={{
          padding: "40px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(18, 35, 27, 0.8) 100%)",
        }}>
          <div style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <ShieldCheck size={20} color="#34D399" />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#34D399", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Scientific Safety Standard
              </span>
            </div>
            <h3 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", marginBottom: "10px" }}>
              Zero Synthetic Delays. Zero Mocked Predictions.
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Every inference request executes real matrix math via Hugging Face Transformers and PyTorch. If an apple leaf is sent while tomato is selected, the platform actively flags the mismatch rather than producing deceptive results.
            </p>
          </div>
          <Link href="/analyze" className="btn-primary" style={{ padding: "16px 32px" }}>
            Start Diagnostic Session
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
