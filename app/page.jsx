"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { galleryData } from "./galleryData";

// Native SVG Icons to avoid bundle bloat
const Instagram = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
const MessageCircle = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
  </svg>
);
const Phone = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);


// Dynamically generate categories from galleryData
const categoryLabels = {
  "Wedding": "Weddings",
  "Bride": "Bride",
  "Engagement": "Engagement",
  "Groom": "Groom",
  "Maternity": "Maternity",
  "baby-shoot": "Tiny Footprints",
  "head-shots": "Headshots",
  "jpeg": "Outdoor shoots",
};

// Define specific order for the collections
const collectionOrder = [
  "head-shots",
  "Groom",
  "Bride",
  "Engagement",
  "Wedding",
  "Maternity",
  "baby-shoot",
  "jpeg"
];

// Specific cover images as requested
const customCovers = {
  "head-shots": "/head-shots/vimal.webp",
  "Maternity": "/Maternity/R3K00089.webp", 
  "jpeg": "/jpeg/02.webp"
};

const categories = collectionOrder
  .filter(key => Array.isArray(galleryData[key]) && galleryData[key].length > 0)
  .map(key => ({
    id: key,
    label: categoryLabels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
    cover: customCovers[key] || `/${key}/${galleryData[key][0]}`
  }));

/* ─── Interactive Hero Canvas ─── */
function InteractiveHeroCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const timeRef = useRef(0);

  const createParticles = useCallback((w, h) => {
    const particles = [];
    const count = Math.min(Math.floor((w * h) / 18000), 60);
    for (let i = 0; i < count; i++) {
      const type = Math.random();
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: type < 0.3 ? Math.random() * 3 + 1 : (type < 0.6 ? Math.random() * 18 + 8 : Math.random() * 40 + 20),
        opacity: Math.random() * 0.15 + 0.03,
        baseOpacity: Math.random() * 0.15 + 0.03,
        type: type < 0.3 ? "dot" : (type < 0.5 ? "ring" : (type < 0.7 ? "line" : (type < 0.85 ? "aperture" : "cross"))),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2,
        driftRadius: Math.random() * 30 + 10,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const drawAperture = (ctx, x, y, size, rotation) => {
      const blades = 6;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      for (let i = 0; i < blades; i++) {
        const angle = (i / blades) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * size * 0.4, Math.sin(angle) * size * 0.4, size * 0.5, angle - 0.5, angle + 0.5);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawCross = (ctx, x, y, size, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(size, 0);
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 0.008;
      const t = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      // Subtle animated gradient background
      const g = ctx.createRadialGradient(
        w * 0.5 + Math.sin(t * 0.3) * w * 0.15,
        h * 0.5 + Math.cos(t * 0.4) * h * 0.15,
        0,
        w * 0.5, h * 0.5, w * 0.8
      );
      g.addColorStop(0, "rgba(240, 235, 225, 0.5)");
      g.addColorStop(0.5, "rgba(245, 240, 232, 0.2)");
      g.addColorStop(1, "rgba(250, 250, 248, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        // Organic drift
        p.x = p.baseX + Math.sin(t + p.phase) * p.driftRadius;
        p.y = p.baseY + Math.cos(t * 0.7 + p.phase) * p.driftRadius;

        // Base movement
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Wrap around
        if (p.baseX < -50) p.baseX = w + 50;
        if (p.baseX > w + 50) p.baseX = -50;
        if (p.baseY < -50) p.baseY = h + 50;
        if (p.baseY > h + 50) p.baseY = -50;

        p.rotation += p.rotationSpeed;

        // Mouse interaction — magnetic glow and push
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 200;
        let pushX = 0, pushY = 0;
        let glowBoost = 0;

        if (dist < interactionRadius && mx > 0) {
          const force = (1 - dist / interactionRadius);
          pushX = (dx / dist) * force * 40;
          pushY = (dy / dist) * force * 40;
          glowBoost = force * 0.35;
        }

        const drawX = p.x + pushX;
        const drawY = p.y + pushY;
        const finalOpacity = Math.min(p.baseOpacity + glowBoost, 0.6);

        ctx.strokeStyle = `rgba(26, 26, 24, ${finalOpacity})`;
        ctx.fillStyle = `rgba(26, 26, 24, ${finalOpacity})`;
        ctx.lineWidth = 0.5;

        if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.size + glowBoost * 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "ring") {
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.stroke();
          if (glowBoost > 0.1) {
            ctx.strokeStyle = `rgba(26, 26, 24, ${glowBoost * 0.3})`;
            ctx.beginPath();
            ctx.arc(drawX, drawY, p.size + 4, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (p.type === "line") {
          ctx.save();
          ctx.translate(drawX, drawY);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, 0);
          ctx.lineTo(p.size / 2, 0);
          ctx.stroke();
          ctx.restore();
        } else if (p.type === "aperture") {
          drawAperture(ctx, drawX, drawY, p.size * 0.4, p.rotation);
        } else if (p.type === "cross") {
          drawCross(ctx, drawX, drawY, p.size * 0.3, p.rotation);
        }
      });

      // Connection lines between nearby particles
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.04;
            ctx.strokeStyle = `rgba(26, 26, 24, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    />
  );
}

function FullImage({ src, alt, style = {}, onClick }) {
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
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease"
        }}
      />
    </div>
  );
}

function Lightbox({ images, currentIndex, onClose, onNavigate }) {
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
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
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
        <img
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          onLoad={() => setImgLoaded(true)}
          style={{
            maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain",
            opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease",
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

function AlbumCard({ cat, onClick }) {
  const [hovered, setHovered] = useState(false);
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
      <img
        src={cat.cover}
        alt={cat.label}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 1.2s cubic-bezier(0.2, 0, 0.2, 1)",
          transform: hovered ? "scale(1.08)" : "scale(1)"
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

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix = "", duration = 2000, isVisible }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };
    countRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(countRef.current);
  }, [isVisible, end, duration]);

  return <span>{count}{suffix}</span>;
}

/* ─── Scroll-triggered visibility hook ─── */
function useScrollVisible(threshold = 0.2) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}


export default function Portfolio() {
  const [currentView, setCurrentView] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);

  // Scroll-triggered visibility for sections (must be at top level)
  const [statsRef, statsVisible] = useScrollVisible(0.3);
  const [aboutRef, aboutVisible] = useScrollVisible(0.2);

  useEffect(() => {
    // Staggered hero entrance animation
    const timer = setTimeout(() => setHeroVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setLightboxIndex(null);
    if (currentView !== "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentView]);

  const currentImages = currentView !== "home"
    ? (galleryData[currentView] || []).map(img => `/${currentView}/${img}`)
    : [];

  const handleLightboxNavigate = (direction) => {
    setLightboxIndex(prev => {
      const len = currentImages.length;
      return (prev + direction + len) % len;
    });
  };

  return (
    <div style={{ backgroundColor: "#fafaf8", color: "#1a1a18", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        .gallery-grid { columns: 3; column-gap: 24px; padding: 0 2rem; max-width: 1400px; margin: 0 auto; }
        
        .footer-links { display: flex; gap: 3rem; margin-top: 1rem; }
        .section-padding { padding: 6rem 3rem; }
        .footer-container { padding: 5rem 3rem; }

        .stats-bar { display: flex; justify-content: center; gap: 0; padding: 4rem 2rem; background: #1a1a18; }
        .stat-item { flex: 1; max-width: 220px; text-align: center; padding: 0 2rem; position: relative; }
        .stat-item:not(:last-child)::after { content: ''; position: absolute; right: 0; top: 15%; height: 70%; width: 1px; background: rgba(255,255,255,0.1); }
        .stat-number { font-family: 'EB Garamond', serif; font-size: 48px; font-weight: 400; color: #fff; line-height: 1; }
        .stat-label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-top: 0.6rem; }

        .featured-grid { display: none; }

        .about-section { display: flex; align-items: center; gap: 5rem; max-width: 1200px; margin: 0 auto; }
        .about-image-wrap { flex: 0 0 380px; height: 500px; position: relative; border-radius: 6px; overflow: hidden; }
        .about-text-wrap { flex: 1; }

        .scroll-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .scroll-reveal.visible { opacity: 1; transform: translateY(0); }
        
        @media (max-width: 1000px) { 
          .gallery-grid { columns: 2; padding: 0 1.5rem; } 
          .nav-container { padding: 1.2rem 2rem !important; }
          .nav-logo { font-size: 24px !important; }
          .hero-content { padding: 0 2rem !important; }
          .hero-content h1 { font-size: clamp(36px, 8vw, 56px) !important; }
          .featured-grid { grid-template-columns: repeat(2, 1fr) !important; grid-template-rows: 280px 280px 280px !important; }
          .featured-grid > *:nth-child(1) { grid-column: 1 / 3 !important; }
          .featured-grid > *:nth-child(2) { grid-column: auto !important; grid-row: auto !important; }
          .featured-grid > *:nth-child(5) { grid-column: 1 / 3 !important; }
          .about-section { flex-direction: column !important; gap: 3rem !important; text-align: center; }
          .about-image-wrap { flex: none !important; width: 100% !important; max-width: 400px; height: 400px !important; }
          .stat-number { font-size: 36px !important; }
        }
        @media (max-width: 600px) { 
          .gallery-grid { columns: 1; padding: 0 1rem; } 
          .nav-container { padding: 1rem 1.2rem !important; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
          .nav-logo { font-size: 20px !important; }
          .nav-links { gap: 1rem !important; }
          .nav-icons { gap: 0.8rem !important; margin-left: 0.5rem !important; }
          .nav-icons svg { width: 16px; height: 16px; }
          .footer-links { gap: 2rem !important; flex-wrap: wrap; justify-content: center; }
          .section-padding { padding: 4rem 1.5rem !important; }
          .footer-container { padding: 4rem 1.5rem !important; }
          .section-title { font-size: 32px !important; }
          .album-title { font-size: 32px !important; }
          .album-header { flex-direction: column !important; align-items: flex-start !important; gap: 1.5rem !important; }
          .hero-content { padding: 0 1.5rem !important; }
          .hero-content p { font-size: 14px !important; }
          .hero-buttons { flex-direction: column !important; align-items: stretch !important; }
          .hero-buttons a, .hero-buttons button { text-align: center; justify-content: center; }
          .stats-bar { flex-wrap: wrap !important; gap: 2rem !important; padding: 3rem 1.5rem !important; }
          .stat-item { flex: 0 0 40% !important; padding: 0 !important; }
          .stat-item::after { display: none !important; }
          .stat-number { font-size: 32px !important; }
          .featured-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .featured-grid > * { grid-column: auto !important; grid-row: auto !important; min-height: 250px !important; }
          .about-image-wrap { height: 350px !important; }
          .about-section { gap: 2rem !important; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) translateY(0); }
          50% { opacity: 0.8; transform: translateX(-50%) translateY(6px); }
        }
        @keyframes subtlePan {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      {/* FIXED NAV */}
      <nav className="nav-container" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 3rem",
        backgroundColor: scrolled || currentView !== "home" ? "rgba(250,250,248,0.95)" : "transparent",
        backdropFilter: scrolled || currentView !== "home" ? "blur(10px)" : "none",
        borderBottom: scrolled || currentView !== "home" ? "0.5px solid #eaeae5" : "none",
        transition: "all 0.5s ease",
        color: "#1a1a18"
      }}>
        <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => setCurrentView("home")}>
          <span className="nav-logo" style={{ fontFamily: "'EB Garamond', serif", fontSize: "28px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            PRAVEEN
          </span>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <button onClick={() => {
            if (currentView === "home") {
              const el = document.getElementById('collections');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
              setCurrentView("home");
              setTimeout(() => {
                const el = document.getElementById('collections');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }} style={{ 
            background: "none", border: "none", cursor: "pointer", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em",
            color: "inherit", fontWeight: 500
          }}>Collections</button>
          
          <div className="nav-icons" style={{ display: "flex", gap: "1.2rem", alignItems: "center", marginLeft: "1rem" }}>
            <a href="https://www.instagram.com/hypothetical__soul?igsh=eWk2anNmM3o2ZXpx" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", opacity: 1, transition: "opacity 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.6} onMouseLeave={(e) => e.currentTarget.style.opacity = 1}>
              <Instagram size={20} strokeWidth={1.8} />
            </a>
            <a href="https://wa.me/916379192449" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", opacity: 1, transition: "opacity 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.6} onMouseLeave={(e) => e.currentTarget.style.opacity = 1}>
              <MessageCircle size={20} strokeWidth={1.8} />
            </a>
            <a href="tel:+916379192449" style={{ color: "inherit", opacity: 1, transition: "opacity 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.6} onMouseLeave={(e) => e.currentTarget.style.opacity = 1}>
              <Phone size={20} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </nav>

      {currentView === "home" ? (
        <>
          {/* INTERACTIVE HERO */}
          <header style={{
            height: "100vh",
            width: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#fafaf8",
          }}>
            {/* Canvas background */}
            <InteractiveHeroCanvas />

            {/* Center content overlay */}
            <div
              className="hero-content"
              style={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                padding: "0 3rem",
                maxWidth: "800px",
              }}
            >
              <p style={{
                letterSpacing: "0.3em",
                fontSize: "11px",
                textTransform: "uppercase",
                marginBottom: "2rem",
                color: "#999",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}>
                Visual Storyteller · Fine Art Photography
              </p>
              <h1 style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "clamp(42px, 7vw, 80px)",
                fontWeight: 400,
                lineHeight: 1.08,
                marginBottom: "1.5rem",
                color: "#1a1a18",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
              }}>
                Capturing the<br /><i style={{ fontWeight: 400 }}>Timeless Grace</i>
              </h1>
              <p style={{
                color: "#666",
                fontSize: "15px",
                lineHeight: 1.8,
                marginBottom: "3rem",
                maxWidth: "540px",
                margin: "0 auto 3rem",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
              }}>
                Fine art photography specializing in elegant, cinematic imagery. Blending natural light with quiet, candid moments to craft visual heirlooms.
              </p>
              <div className="hero-buttons" style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s",
              }}>
                <button 
                  onClick={() => document.getElementById('collections').scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    background: "#1a1a18",
                    border: "1px solid #1a1a18",
                    color: "#fff",
                    padding: "1rem 2.5rem",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1a18"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a18"; e.currentTarget.style.color = "#fff"; }}
                >
                  Explore Albums
                </button>
                <a 
                  href="https://wa.me/916379192449?text=Hi Praveen, I'm interested in booking a photoshoot."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "transparent",
                    border: "1px solid #1a1a18",
                    color: "#1a1a18",
                    padding: "0.9rem 2.5rem",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a18"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1a18"; }}
                >
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Scroll indicator */}
            <div style={{
              position: "absolute",
              bottom: "2.5rem",
              left: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              animation: "scrollPulse 2.5s ease-in-out infinite",
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1s ease 1.4s",
            }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa" }}>
                Scroll
              </span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#aaa" strokeWidth="1.5">
                <rect x="1" y="1" width="14" height="22" rx="7" />
                <line x1="8" y1="6" x2="8" y2="10" />
              </svg>
            </div>
          </header>

          {/* STATS BAR */}
          <section ref={statsRef} className="stats-bar">
            {[
              { value: 5, suffix: "+", label: "Years Experience" },
              { value: 200, suffix: "+", label: "Shoots Delivered" },
              { value: 50, suffix: "+", label: "Weddings Covered" },
              { value: 100, suffix: "%", label: "Happy Clients" },
            ].map((stat, i) => (
              <div key={i} className="stat-item" style={{
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? "translateY(0)" : "translateY(15px)",
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s`,
              }}>
                <div className="stat-number">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} isVisible={statsVisible} />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* ABOUT ME */}
          <section ref={aboutRef} className="section-padding" style={{ backgroundColor: "#f4f3f0" }}>
            <div className="about-section">
              {/* Photo */}
              <div className="about-image-wrap" style={{
                opacity: aboutVisible ? 1 : 0,
                transform: aboutVisible ? "translateX(0)" : "translateX(-30px)",
                transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}>
                <img
                  src="/abc.jpeg"
                  alt="Praveen — Photographer"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* Text */}
              <div className="about-text-wrap">
                <p style={{
                  fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#999", marginBottom: "1.2rem",
                  opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? "translateY(0)" : "translateY(15px)",
                  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                }}>
                  The Photographer
                </p>
                <h2 style={{
                  fontFamily: "'EB Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.15, marginBottom: "1.5rem", color: "#1a1a18",
                  opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                }}>
                  Hello, I'm <i>Praveen</i>
                </h2>
                <div style={{
                  opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? "translateY(0)" : "translateY(15px)",
                  transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s",
                }}>
                  <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, marginBottom: "1.2rem" }}>
                    Photography found me before I found it. What started as a curiosity with borrowed cameras became a lifelong pursuit of capturing the beauty in fleeting moments — the stolen glances, the quiet tears of joy, the golden light that lasts only seconds.
                  </p>
                  <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, marginBottom: "1.2rem" }}>
                    I believe every frame should tell a story that words cannot. My approach blends fine art aesthetics with documentary honesty — I don't pose moments, I preserve them. Natural light is my favorite collaborator, and emotion is the only direction I give.
                  </p>
                  <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, marginBottom: "2rem" }}>
                    From intimate maternity portraits to grand wedding celebrations, I pour my heart into every shoot, ensuring your memories are not just documented, but truly felt.
                  </p>
                </div>
                <a
                  href="https://www.instagram.com/hypothetical__soul?igsh=eWk2anNmM3o2ZXpx"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px",
                    color: "#1a1a18", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase",
                    textDecoration: "none", borderBottom: "1px solid #1a1a18", paddingBottom: "4px",
                    transition: "all 0.3s ease",
                    opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? "translateY(0)" : "translateY(10px)",
                    transitionDelay: "0.7s",
                  }}
                >
                  Follow My Journey <span style={{ fontSize: "16px" }}>→</span>
                </a>
              </div>
            </div>
          </section>

          {/* COLLECTIONS GRID */}
          <section id="collections" className="section-padding" style={{ backgroundColor: "#fafaf8" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 className="section-title" style={{ fontFamily: "'EB Garamond', serif", fontSize: "42px", fontWeight: 400, marginBottom: "1rem" }}>
                The Collections
              </h2>
              <div style={{ width: "40px", height: "1px", background: "#ccc", margin: "0 auto" }}></div>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "24px",
              maxWidth: "1400px",
              margin: "0 auto"
            }}>
              {categories.map((cat) => (
                <AlbumCard key={cat.id} cat={cat} onClick={setCurrentView} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <main style={{ paddingTop: "8rem", paddingBottom: "6rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", marginBottom: "4rem" }}>
            <button 
              onClick={() => setCurrentView("home")}
              style={{
                background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: "11px", 
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              ← Back to All albums
            </button>
            <div className="album-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
              <div>
                <h1 className="album-title" style={{ fontFamily: "'EB Garamond', serif", fontSize: "48px", fontWeight: 400 }}>
                  {categoryLabels[currentView] || currentView}
                </h1>
                <p style={{ color: "#888", fontSize: "14px", marginTop: "0.5rem" }}>
                  Showing {galleryData[currentView]?.length || 0} photographs
                </p>
              </div>
              <a 
                href={`https://wa.me/916379192449?text=Hi Praveen, I'm interested in your ${categoryLabels[currentView] || currentView} photography.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  backgroundColor: "#1a1a18",
                  color: "#fff",
                  padding: "0.8rem 2rem",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  borderRadius: "2px",
                  transition: "opacity 0.3s ease"
                }}
              >
                Book / Enquire
              </a>
            </div>
          </div>

          <div className="gallery-grid">
            {galleryData[currentView]?.map((img, idx) => (
              <FullImage
                key={idx}
                src={`/${currentView}/${img}`}
                alt={`${currentView} ${idx + 1}`}
                onClick={() => setLightboxIndex(idx)}
              />
            ))}
          </div>

          {lightboxIndex !== null && currentImages.length > 0 && (
            <Lightbox
              images={currentImages}
              currentIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
              onNavigate={handleLightboxNavigate}
            />
          )}
        </main>
      )}

      {/* FOOTER */}
      <footer className="footer-container" style={{
        borderTop: "1px solid #eaeae5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2.5rem",
        textAlign: "center"
      }}>
        <div>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "36px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            PRAVEEN
          </span>
          <p style={{ 
            maxWidth: "600px", 
            margin: "1.5rem auto 0", 
            color: "#666", 
            fontSize: "15px", 
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif" 
          }}>
            Praveen is a fine art photographer specializing in timeless weddings, emotive maternity portraits, and cinematic portraiture. With an eye for raw emotion and natural light, he crafts visual stories that preserve your most precious moments with elegance and authenticity.
          </p>
        </div>

        <div className="footer-links" style={{ display: "flex", gap: "3rem", marginTop: "1rem" }}>
          <a 
            href="https://www.instagram.com/hypothetical__soul?igsh=eWk2anNmM3o2ZXpx" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: "#444", transition: "color 0.2s ease" }}
            aria-label="Instagram"
          >
            <Instagram size={28} strokeWidth={1.5} />
          </a>
          <a 
            href="https://wa.me/916379192449" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#444", transition: "color 0.2s ease" }}
            aria-label="WhatsApp"
          >
            <MessageCircle size={28} strokeWidth={1.5} />
          </a>
          <a 
            href="tel:+916379192449" 
            style={{ color: "#444", transition: "color 0.2s ease" }}
            aria-label="Call"
          >
            <Phone size={28} strokeWidth={1.5} />
          </a>
        </div>
        
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontSize: "12px", color: "#999", letterSpacing: "0.05em" }}>
            &copy; {new Date().getFullYear()} PRAVEEN PORTFOLIO · ALL RIGHTS RESERVED
          </p>
          <p style={{ fontSize: "12px", color: "#999", letterSpacing: "0.05em", marginTop: "0.5rem" }}>
            Made by <a href="https://portfolio-blue-nu-31.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#666", textDecoration: "none", fontWeight: 500 }}>James Andrew</a> · Framextech
          </p>
        </div>
      </footer>
    </div>
  );
}
