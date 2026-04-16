"use client";

import { useState, useEffect } from "react";
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
        
        .hero-split { height: 100vh; width: 100%; display: flex; flex-direction: row; background-color: #fafaf8; }
        .hero-bio { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 4rem; z-index: 2; }
        .hero-image { flex: 1; position: relative; }
        
        .footer-links { display: flex; gap: 3rem; margin-top: 1rem; }
        .section-padding { padding: 6rem 3rem; }
        .footer-container { padding: 5rem 3rem; }
        
        @media (max-width: 1000px) { 
          .gallery-grid { columns: 2; padding: 0 1.5rem; } 
          .hero-split { flex-direction: column; height: auto; min-height: 100vh; padding-top: 80px; }
          .hero-bio { padding: 4rem 2rem 4rem; order: 2; align-items: center; text-align: center; }
          .hero-image { order: 1; height: auto; display: flex; }
          .nav-container { padding: 1.2rem 2rem !important; }
          .nav-logo { font-size: 24px !important; }
        }
        @media (max-width: 600px) { 
          .gallery-grid { columns: 1; padding: 0 1rem; } 
          .hero-bio { padding: 3rem 1.5rem 3rem; order: 2; }
          .hero-bio p { font-size: 14px !important; }
          .hero-image { height: auto; order: 1; margin-bottom: 1rem; }
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
          
          /* Hero image full-size override for mobile */
          .hero-img-element { position: relative !important; height: auto !important; object-fit: contain !important; }
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
        color: "#1a1a18" // changed to always dark since left side is white now
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
          {/* HERO SPLIT-SCREEN */}
          <header className="hero-split">
            
            {/* LEFT SIDE: BIO */}
            <div className="hero-bio">
              <p style={{ letterSpacing: "0.25em", fontSize: "12px", textTransform: "uppercase", marginBottom: "1.5rem", color: "#888" }}>
                Visual Storyteller · Fine Art Photography
              </p>
              <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 400, lineHeight: 1.1, marginBottom: "1.5rem", color: "#1a1a18" }}>
                Capturing the <br /><i>Timeless Grace</i>
              </h1>
              <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "500px" }}>
                Praveen is a fine art photographer specializing in creating elegant, cinematic imagery. By blending natural light with quiet, candid moments, he crafts visual heirlooms that authentically preserve your most profound milestones.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "inherit" }}>
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

            {/* RIGHT SIDE: STATIC IMAGE */}
            <div className="hero-image">
              <img
                className="hero-img-element"
                src="/abc.jpeg"
                alt="Praveen Photography"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            
          </header>

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
              />
            ))}
          </div>
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
