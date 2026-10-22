"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Activity, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { getHealth, HealthResponse } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      const h = await getHealth();
      if (isMounted) setHealth(h);
    };

    check();
    const interval = setInterval(check, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/analyze", label: "Diagnostic Workspace" },
    { href: "/about", label: "Model Architecture" },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      backgroundColor: "rgba(7, 14, 10, 0.8)",
      borderBottom: "1px solid var(--border-subtle)",
    }}>
      <div className="content-wrapper" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "76px",
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
          color: "inherit",
        }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #10B981 0%, #064e3b 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
            border: "1px solid rgba(52, 211, 153, 0.4)",
          }}>
            <Leaf size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                fontSize: "19px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#ffffff"
              }}>
                AGROVISION
              </span>
              <span style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#34D399",
                background: "rgba(16, 185, 129, 0.15)",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(52, 211, 153, 0.3)"
              }}>
                AI
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>
              Crop Disease Intelligence
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.03)",
          padding: "6px",
          borderRadius: "999px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  color: isActive ? "#ffffff" : "var(--text-secondary)",
                  background: isActive ? "rgba(16, 185, 129, 0.22)" : "transparent",
                  border: isActive ? "1px solid rgba(52, 211, 153, 0.4)" : "1px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Status Badge & CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Health Pill */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600,
            background: "rgba(18, 35, 27, 0.8)",
            border: "1px solid var(--border-subtle)",
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: health?.model_loaded
                ? "#10B981"
                : health?.status && health.status !== "offline"
                ? "#F59E0B"
                : "#64748B",
              boxShadow: health?.model_loaded
                ? "0 0 10px #10B981"
                : "none",
            }} />
            <span style={{ color: "var(--text-secondary)" }}>
              {health?.model_loaded
                ? "MobileNetV2 Ready"
                : health?.status && health.status !== "offline"
                ? "Initializing Model..."
                : "Backend Offline"}
            </span>
          </div>

          <Link
            href="/analyze"
            className="btn-primary"
            style={{
              padding: "10px 20px",
              fontSize: "13px",
            }}
          >
            <Sparkles size={16} />
            Analyze Leaf
          </Link>
        </div>
      </div>
    </header>
  );
}
