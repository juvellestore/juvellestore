import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Store", to: "/store" },
  { label: "About", to: "/about" },
  { label: "Legal", to: "/legal" },
];

// ─── Hook: track viewport width in JS (no Tailwind breakpoint dependency) ────
function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

// ─── Hamburger Icon ───────────────────────────────────────────────────────────
function HamburgerIcon({ open }) {
  const bar = (rotate, y) => ({
    display: "block",
    width: "22px",
    height: "1.5px",
    background: "#1e0a18",
    borderRadius: "2px",
    transformOrigin: "center",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    transform: rotate,
    opacity: y,
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        cursor: "pointer",
      }}
    >
      <span
        style={bar(open ? "rotate(45deg) translate(4.5px, 4.5px)" : "none", 1)}
      />
      <span style={bar("none", open ? 0 : 1)} />
      <span
        style={bar(
          open ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none",
          1,
        )}
      />
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const HeroNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const width = useWindowWidth();
  const isDesktop = width >= 768;

  // Close drawer when resizing to desktop
  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  return (
    <>
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isDesktop ? "1.25rem 2.5rem" : "1rem 1.25rem",
          background: "transparent",
          backdropFilter: "none",
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: isDesktop ? "1.7rem" : "1.35rem",
            fontWeight: 400,
            letterSpacing: "0.12em",
            color: "#1e0a18",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          Juvelle
        </Link>

        {/* Desktop links */}
        {isDesktop && (
          <div style={{ display: "flex", gap: "0.1rem", alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} to={link.to} label={link.label} />
            ))}
          </div>
        )}

        {/* Mobile burger */}
        {!isDesktop && (
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        )}
      </nav>

      {/* ── Mobile full-screen drawer ─────────────────────────────────────── */}
      {!isDesktop && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 8999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.5rem",
            background: "rgba(46,31,36,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            // Slide in/out
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? "all" : "none",
            transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 0.3s ease, transform 0.35s ease",
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "clamp(1.6rem, 7vw, 2.8rem)",
                fontWeight: 200,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#f3e6ec",
                textDecoration: "none",
                opacity: 0.9,
                // Staggered fade hint
                transition: `opacity 0.25s ease ${i * 0.05}s`,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

// ─── Desktop link with hover state ───────────────────────────────────────────
function NavLink({ to, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.8rem",
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: hovered ? "#1e0a18" : "rgba(30,10,24,0.6)",
        textDecoration: "none",
        padding: "0.5rem 1rem",
        borderRadius: "2px",
        background: hovered ? "rgba(46,31,36,0.1)" : "transparent",
        transition: "color 0.25s ease, background 0.25s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </Link>
  );
}

export default HeroNavbar;
