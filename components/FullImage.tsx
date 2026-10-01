"use client";

import { useState } from "react";
import Image from "next/image";

export default function FullImage({ src, alt, style = {}, onClick }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        marginBottom: "24px",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "#f5f5f3",
        cursor: onClick ? "zoom-in" : "default",
        position: "relative",
        ...style
      }}
    >
      {!loaded && (
        <div style={{
          width: "100%",
          minHeight: "300px",
          background: "linear-gradient(90deg, #f0f0ee 25%, #e8e8e5 50%, #f0f0ee 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s ease-in-out infinite"
        }} />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        onLoad={() => setLoaded(true)}
        style={{
          objectFit: "contain",
          filter: loaded ? "blur(0)" : "blur(10px)",
          transform: loaded ? "scale(1)" : "scale(1.05)",
          opacity: loaded ? 1 : 0,
          transition: "filter 0.6s ease-out, transform 0.6s ease-out, opacity 0.6s ease-out"
        }}
      />
    </div>
  );
}
