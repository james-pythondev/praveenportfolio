"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Lightbox({ images, currentIndex, onClose, onNavigate }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNavigate]);

  useEffect(() => {
    setImgLoaded(false);
  }, [currentIndex]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.3s ease",
        cursor: "zoom-out"
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: "absolute", top: "1.5rem", right: "1.5rem",
          background: "none", border: "none", color: "#fff", fontSize: "28px",
          cursor: "pointer", zIndex: 10001, opacity: 0.7,
          width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "opacity 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
      >
        ✕
      </button>

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
          aria-label="Previous photo"
          style={{
            position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
            width: "48px", height: "48px", borderRadius: "50%",
            cursor: "pointer", fontSize: "22px", zIndex: 10001,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)", transition: "background 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div onClick={(e) => e.stopPropagation()} style={{ cursor: "default", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "90vw", maxHeight: "85vh" }}>
        {!imgLoaded && (
          <div style={{
            width: "48px", height: "48px",
            border: "2px solid rgba(255,255,255,0.15)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            position: "absolute"
          }} />
        )}
        <Image
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          fill
          onLoad={() => setImgLoaded(true)}
          style={{
            objectFit: "contain",
            filter: imgLoaded ? "blur(0)" : "blur(10px)",
            opacity: imgLoaded ? 1 : 0,
            transition: "filter 0.4s ease-out, opacity 0.4s ease-out",
            borderRadius: "2px"
          }}
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
          aria-label="Next photo"
          style={{
            position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
            width: "48px", height: "48px", borderRadius: "50%",
            cursor: "pointer", fontSize: "22px", zIndex: 10001,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)", transition: "background 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        >
          ›
        </button>
      )}

      {/* Counter */}
      <div style={{
        position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.5)", fontSize: "13px", letterSpacing: "0.15em",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
