"use client";

import { useState, useEffect, useMemo } from "react";
import { galleryData } from "./galleryData";
import { heroPool } from "./heroPool";

// Dynamically generate categories from galleryData
const categoryLabels = {
  "Wedding": "Wedding Stories",
  "Bride": "Brides",
  "Engagement": "Engagements",
  "Groom": "Grooms",
  "Maternity": "Maternity Glow",
  "baby-shoot": "Tiny Footprints",
  "head-shots": "Modern Portraits",
  "jpeg": "Street Chronicles",
  "Outdoor": "Outdoor Series"
};

const categories = Object.keys(galleryData)
  .filter(key => Array.isArray(galleryData[key]) && galleryData[key].length > 0)
  .map(key => ({
    id: key,
    label: categoryLabels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
    cover: `/${key}/${galleryData[key][0]}`
  }));

function FullImage({ src, alt, style = {} }) {
  return (
    <div style={{
      width: "100%",
      marginBottom: "24px",
      borderRadius: "4px",
      overflow: "hidden",
      backgroundColor: "#f5f5f3",
      ...style
    }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain"
        }}
      />
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

export default function Portfolio() {
  const [currentView, setCurrentView] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  // Use only Landscape images for the hero carousel
  const heroImages = useMemo(() => {
    // Shuffle the landscape pool and pick 12 for variety
    return [...heroPool].sort(() => 0.5 - Math.random()).slice(0, 12);
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    if (currentView === "home") {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [currentView, heroImages.length]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (currentView !== "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentView]);

  return (
    <div style={{ backgroundColor: "#fafaf8", color: "#1a1a18", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        .gallery-grid { columns: 3; column-gap: 24px; padding: 0 2rem; max-width: 1400px; margin: 0 auto; }
        @media (max-width: 1000px) { .gallery-grid { columns: 2; } }
        @media (max-width: 600px) { .gallery-grid { columns: 1; } }
      `}</style>

      {/* FIXED NAV */}
      <nav style={{
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
        color: !scrolled && currentView === "home" ? "#fff" : "#1a1a18"
      }}>
        <div style={{ cursor: "pointer" }} onClick={() => setCurrentView("home")}>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "22px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            PRAVEEN
          </span>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <button onClick={() => setCurrentView("home")} style={{ 
            background: "none", border: "none", cursor: "pointer", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em",
            color: "inherit", fontWeight: 400
          }}>Collections</button>
        </div>
      </nav>

      {currentView === "home" ? (
        <>
          {/* HERO CAROUSEL */}
          <header style={{
            height: "100vh",
            width: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#1a1a18"
          }}>
            {heroImages.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={`Hero ${idx}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 1.5s ease-in-out, transform 10s linear",
                  opacity: heroIndex === idx ? 1 : 0,
                  transform: heroIndex === idx ? "scale(1.08)" : "scale(1)",
                  zIndex: 1
                }}
              />
            ))}
            {/* Safety Overlay - always behind text */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 2
            }} />
            
            <div style={{ textAlign: "center", color: "#fff", maxWidth: "800px", padding: "0 2rem", zIndex: 3 }}>
              <p style={{ letterSpacing: "0.25em", fontSize: "12px", textTransform: "uppercase", marginBottom: "1.5rem", opacity: 0.9 }}>
                Visual Storyteller · Fine Art Photography
              </p>
              <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 400, lineHeight: 1.1, marginBottom: "2rem" }}>
                Capturing the <br /><i>Timeless Grace</i>
              </h1>
              <button 
                onClick={() => document.getElementById('collections').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#fff",
                  padding: "1rem 2.5rem",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                Explore Albums
              </button>
            </div>
          </header>

          {/* COLLECTIONS GRID */}
          <section id="collections" style={{ padding: "6rem 3rem", backgroundColor: "#fafaf8" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: "42px", fontWeight: 400, marginBottom: "1rem" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
              <div>
                <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "48px", fontWeight: 400 }}>
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
              />
            ))}
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer style={{
        padding: "5rem 3rem",
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

        <div style={{ display: "flex", gap: "3rem", marginTop: "1rem" }}>
          <a 
            href="https://www.instagram.com/hypothetical__soul?igsh=eWk2anNmM3o2ZXpx" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#444", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500 }}
          >
            Instagram
          </a>
          <a 
            href="https://wa.me/916379192449" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#444", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500 }}
          >
            WhatsApp
          </a>
          <a 
            href="tel:+916379192449" 
            style={{ textDecoration: "none", color: "#444", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500 }}
          >
            Call
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
