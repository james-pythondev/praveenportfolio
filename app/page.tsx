"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { galleryData } from "./galleryData";
import { Instagram, MessageCircle, Phone } from "../components/Icons";
import InteractiveHeroCanvas from "../components/InteractiveHeroCanvas";
import FullImage from "../components/FullImage";
import Lightbox from "../components/Lightbox";
import AlbumCard from "../components/AlbumCard";
import AnimatedCounter from "../components/AnimatedCounter";

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
    <div className="bg-[#fafaf8] text-[#1a1a18] min-h-screen">

      {/* FIXED NAV */}
      <nav className={`nav-container fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 transition-all duration-500 text-[#1a1a18] ${scrolled || currentView !== "home" ? "py-6 bg-[#fafaf8]/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-[#1a1a18]/5" : "py-12 bg-transparent"}`}>
        <div className="cursor-pointer flex items-center" onClick={() => setCurrentView("home")}>
          <span className="font-['EB_Garamond'] text-3xl tracking-[0.15em] uppercase">
            PRAVEEN
          </span>
        </div>
        <div className="flex gap-10 items-center">
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
          }} className="bg-transparent border-none cursor-pointer text-sm uppercase tracking-[0.1em] text-inherit font-medium hover:opacity-70 transition-opacity">
            Collections
          </button>
          
          <div className="flex gap-6 items-center ml-6">
            <a href="https://www.instagram.com/hypothetical__soul?igsh=eWk2anNmM3o2ZXpx" target="_blank" rel="noopener noreferrer" className="text-inherit transition-opacity duration-200 hover:opacity-60">
              <Instagram size={24} strokeWidth={1.8} />
            </a>
            <a href="https://wa.me/916379192449" target="_blank" rel="noopener noreferrer" className="text-inherit transition-opacity duration-200 hover:opacity-60">
              <MessageCircle size={24} strokeWidth={1.8} />
            </a>
            <a href="tel:+916379192449" className="text-inherit transition-opacity duration-200 hover:opacity-60">
              <Phone size={24} strokeWidth={1.8} />
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
                <Image
                  src="/abc.jpeg"
                  alt="Praveen — Photographer"
                  fill
                  style={{
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
