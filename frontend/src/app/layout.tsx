import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AgroVision AI — Production Crop Disease Intelligence Platform",
  description:
    "Production-style deep learning agricultural decision support system. Classify 38 botanical conditions across high-value crops using real MobileNetV2 neural network inference.",
  keywords: [
    "crop disease detection",
    "plant pathology",
    "FastAPI",
    "MobileNetV2",
    "agricultural AI",
    "leaf diagnosis",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="ambient-glow">
          <div className="ambient-glow-1" />
          <div className="ambient-glow-2" />
          <div className="ambient-glow-3" />
        </div>
        <div className="app-container">
          <Navbar />
          <main style={{ flex: 1, paddingBottom: "60px" }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
