"use client";

import { useState } from "react";
import Image from "next/image";

export default function AlbumCard({ cat, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      onClick={() => onClick(cat.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        aspectRatio: "3/4",
        cursor: "pointer",
        overflow: "hidden",
        borderRadius: "4px",
        transition: "all 0.5s ease"
      }}
    >
      <Image
        src={cat.cover}
        alt={cat.label}
        fill
        onLoad={() => setLoaded(true)}
        style={{
          objectFit: "cover",
          filter: loaded ? "blur(0)" : "blur(10px)",
          opacity: loaded ? 1 : 0,
          transition: "transform 1.2s cubic-bezier(0.2, 0, 0.2, 1), filter 0.8s ease-out, opacity 0.8s ease-out",
          transform: hovered ? "scale(1.08)" : (loaded ? "scale(1)" : "scale(1.05)")
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement.style.backgroundColor = '#222';
        }}
      />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        transition: "background 0.5s ease",
        backgroundColor: hovered ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.3)"
      }} />
      <div style={{
        position: "absolute",
        bottom: "1.5rem",
        left: "1.5rem",
        color: "#fff"
      }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8, marginBottom: "4px" }}>
          Collection
        </p>
        <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: "28px", fontWeight: 400 }}>
          {cat.label}
        </h3>
      </div>
    </div>
  );
}
