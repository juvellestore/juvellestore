import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Store", to: "/store" },
  { label: "About", to: "/about" },
  { label: "Legal", to: "/legal" },
];

const HeroNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu if window resizes to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[9000] flex items-center justify-between px-5 py-4 md:px-10 md:py-5 bg-transparent w-full">
        {/* Brand */}
        <Link
          to="/"
          className="font-montserrat text-[1.6rem] md:text-[2rem] font-bold tracking-[0.12em] text-[#1e0a18] no-underline shrink-0"
        >
          Juvelle
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-1 items-center">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} to={link.to} label={link.label} />
          ))}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="md:hidden bg-transparent border-none cursor-pointer p-1 outline-none"
        >
          <HamburgerIcon open={mobileOpen} />
        </button>
      </nav>

      {/* ── Mobile full-screen drawer ─────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[8999] flex flex-col items-center justify-center gap-10 bg-midnight-truffle/95 backdrop-blur-xl transition-all duration-350 ease-in-out md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }`}
        style={{ WebkitBackdropFilter: "blur(20px)" }}
      >
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className="font-montserrat text-[clamp(1.6rem,7vw,2.8rem)] font-extralight tracking-[0.3em] uppercase text-ivory-blush no-underline opacity-90 hover:opacity-100"
            style={{ transition: `opacity 0.25s ease ${i * 0.05}s` }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
};

// ─── Hamburger Icon ───────────────────────────────────────────────────────────
function HamburgerIcon({ open }) {
  const barClass =
    "block w-[28px] h-[2px] bg-[#1e0a18] rounded-[2px] origin-center transition-all duration-300 ease-in-out";
  return (
    <div className="flex flex-col gap-[5px] cursor-pointer">
      <span
        className={`${barClass} ${
          open ? "rotate-45 translate-x-[6px] translate-y-[6px]" : ""
        }`}
      />
      <span className={`${barClass} ${open ? "opacity-0" : "opacity-100"}`} />
      <span
        className={`${barClass} ${
          open ? "-rotate-45 translate-x-[6px] -translate-y-[6px]" : ""
        }`}
      />
    </div>
  );
}

// ─── Desktop link with hover state ───────────────────────────────────────────
function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="font-inter text-[0.95rem] font-medium tracking-[0.2em] uppercase text-[#1e0a18]/60 hover:text-[#1e0a18] hover:bg-midnight-truffle/10 no-underline px-5 py-2.5 rounded-[2px] transition-colors duration-200 ease-in-out"
    >
      {label}
    </Link>
  );
}

export default HeroNavbar;
