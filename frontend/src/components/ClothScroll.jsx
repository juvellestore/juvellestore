import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 192;

const frameUrls = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(3, "0");
  return new URL(
    `../assets/hero_section_scroll_animation_frames/frame_${num}.webp`,
    import.meta.url,
  ).href;
});

// ─── Draw frame (cover-fit, centred) in CSS/logical pixels ──────────────────
// The source frames have the dress ~40 px left of the true frame centre.
// We compensate by sliding the image 40 px to the right on the canvas.
// To avoid exposing the left canvas edge, we compute the minimum scale that
// guarantees at least 40 px of horizontal excess, then take the max of that
// and the normal cover scale — so wide (width-driven) viewports zoom barely
// more than needed while tall (height-driven) viewports are barely affected.
const NUDGE_PX = 25;

function drawFrame(canvas, image) {
  if (!canvas || !image) return;
  const ctx = canvas.getContext("2d");
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  if (!iw || !ih) return;

  // Best-quality interpolation — critical for 1280×720 source images
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Cover: fill full screen, crop excess
  const coverScale = Math.max(cw / iw, ch / ih);
  // Minimum scale that guarantees NUDGE_PX horizontal excess on each side.
  // Derived from: (iw * minScale - cw) / 2 >= NUDGE_PX
  const minScale = (cw + 2 * NUDGE_PX) / iw;
  const scale = Math.max(coverScale, minScale) * 1.005; // tiny safety buffer

  // Shift image right by NUDGE_PX to centre the dress in the frame.
  const x = (cw - iw * scale) / 2 + NUDGE_PX;
  const y = (ch - ih * scale) / 2;

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(image, x, y, iw * scale, ih * scale);
}

// ─── Static style objects (no Tailwind, no conflicts) ────────────────────────
// MUST be declared before OVERLAYS (which references these at module init time)
const styles = {
  eyebrow: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "clamp(0.6rem, 1.5vw, 0.78rem)",
    fontWeight: 500,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "#e8c8d8",
    margin: 0,
    textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)",
  },
  heroTitle: {
    fontFamily: "'Anton', sans-serif",
    fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
    lineHeight: 1.0,
    letterSpacing: "0.02em",
    color: "#ffffff",
    margin: "0.35rem 0 0",
    textShadow:
      "0 2px 4px rgba(0,0,0,0.95)," +
      "0 4px 16px rgba(0,0,0,0.85)," +
      "0 8px 40px rgba(0,0,0,0.7)," +
      "0 0 60px rgba(207,157,184,0.35)",
  },
  sectionTitle: {
    fontFamily: "'Anton', sans-serif",
    fontSize: "clamp(1.9rem, 5vw, 4rem)",
    lineHeight: 1.05,
    letterSpacing: "0.02em",
    color: "#ffffff",
    margin: "0.35rem 0 0",
    textShadow:
      "0 2px 4px rgba(0,0,0,0.95)," +
      "0 4px 16px rgba(0,0,0,0.85)," +
      "0 8px 40px rgba(0,0,0,0.7)," +
      "0 0 40px rgba(207,157,184,0.3)",
  },
  ctaTitle: {
    fontFamily: "'Anton', sans-serif",
    fontSize: "clamp(3.5rem, 11vw, 8rem)",
    lineHeight: 0.95,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#ffffff",
    margin: "0.35rem 0",
    textShadow:
      "0 2px 4px rgba(0,0,0,0.95)," +
      "0 4px 20px rgba(0,0,0,0.85)," +
      "0 8px 60px rgba(0,0,0,0.7)," +
      "0 0 80px rgba(207,157,184,0.45)",
  },
  tagline: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "clamp(0.7rem, 1.6vw, 0.95rem)",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#e8c8d8",
    letterSpacing: "0.1em",
    margin: "0.2rem 0 0",
    textShadow: "0 1px 8px rgba(0,0,0,0.9)",
  },
};

// ─── Text-overlay data ────────────────────────────────────────────────────────
// All positioning is done 100% via inline styles — no Tailwind transforms.
const OVERLAYS = [
  {
    id: "woven",
    fadeIn: [0.0, 0.06],
    fadeOut: [0.18, 0.26],
    style: {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      alignItems: "center",
    },
    content: (
      <>
        <h1 style={styles.heroTitle}>Woven Meticulously</h1>
      </>
    ),
  },
  {
    id: "threads",
    fadeIn: [0.22, 0.3],
    fadeOut: [0.42, 0.5],
    style: {
      left: "7vw",
      top: "50%",
      transform: "translateY(-50%)",
      textAlign: "left",
      alignItems: "flex-start",
    },
    content: (
      <>
        <h2 style={styles.sectionTitle}>
          The Art of
          <br />
          Threads
        </h2>
      </>
    ),
  },
  {
    id: "intricate",
    fadeIn: [0.52, 0.6],
    fadeOut: [0.72, 0.8],
    style: {
      right: "7vw",
      top: "50%",
      transform: "translateY(-50%)",
      textAlign: "right",
      alignItems: "flex-end",
    },
    content: (
      <>
        <h2 style={styles.sectionTitle}>
          Intricate
          <br />
          by Design
        </h2>
      </>
    ),
  },
  {
    id: "cta",
    fadeIn: [0.85, 0.93],
    fadeOut: [2.0, 2.0], // scroll never reaches 2.0 → stays visible forever once shown
    style: {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      alignItems: "center",
    },
    isCTA: true,
  },
];

// ─── Overlay wrapper ──────────────────────────────────────────────────────────
function TextOverlay({ overlay, scrollYProgress }) {
  const opacity = useTransform(
    scrollYProgress,
    [
      overlay.fadeIn[0],
      overlay.fadeIn[1],
      overlay.fadeOut[0],
      overlay.fadeOut[1],
    ],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      style={{
        opacity,
        position: "absolute",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        maxWidth: "min(520px, 88vw)",
        pointerEvents: "none",
        ...overlay.style,
      }}
    >
      {/* Dark frosted scrim — ensures text reads on any frame */}
      <div>
        {overlay.isCTA ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <h2 style={styles.ctaTitle}>Juvelle</h2>
            <Link
              to="/store"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.9rem 2.4rem",
                marginTop: "0.5rem",
                border: "1.5px solid rgba(207,157,184,1)",
                background: "rgba(207,157,184,0.45)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: "2px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(0.7rem, 1.5vw, 0.82rem)",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#ffffff",
                textDecoration: "none",
                pointerEvents: "all",
                cursor: "pointer",
                boxShadow:
                  "0 0 28px rgba(207,157,184,0.25), 0 4px 14px rgba(207,157,184,0.15), inset 0 0 0 1px rgba(255,255,255,0.14)",
                transition:
                  "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(207,157,184,0.65)";
                e.currentTarget.style.borderColor = "rgba(207,157,184,1)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 0 44px rgba(207,157,184,0.4), 0 6px 22px rgba(207,157,184,0.25), inset 0 0 0 1px rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(207,157,184,0.45)";
                e.currentTarget.style.borderColor = "rgba(207,157,184,1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(207,157,184,0.25), 0 4px 14px rgba(207,157,184,0.15), inset 0 0 0 1px rgba(255,255,255,0.14)";
              }}
            >
              <span>Visit Store</span>
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        ) : (
          overlay.content
        )}
      </div>
    </motion.div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen({ progress }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2e1f24",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {/* Spinner */}
        <div style={{ position: "relative", width: "5rem", height: "5rem" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#cf9db8",
              borderRightColor: "#553858",
              animation: "cloth-spin 1s linear infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "6px",
              borderRadius: "50%",
              border: "1px solid #cf9db8",
              opacity: 0.3,
              animation: "cloth-pulse-ring 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Brand */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1.4rem",
              fontWeight: 300,
              letterSpacing: "0.4em",
              color: "#cf9db8",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Juvelle
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              color: "rgba(207,157,184,0.45)",
              textTransform: "uppercase",
              marginTop: "0.5rem",
            }}
          >
            Preparing your experience
          </p>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "12rem",
            height: "1px",
            background: "rgba(85,56,88,0.4)",
            borderRadius: "99px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: "linear-gradient(to right, #cf9db8, #553858)",
              borderRadius: "99px",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.12, ease: "linear" }}
          />
        </div>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            color: "rgba(207,157,184,0.35)",
            letterSpacing: "0.2em",
          }}
        >
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClothScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const currentFrameRef = useRef(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  // 250vh on mobile for a faster scroll experience, 400vh on desktop
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  // Apply body styles needed by ClothScroll; restore on unmount so other pages
  // are not affected.
  useEffect(() => {
    const prev = {
      background: document.body.style.background,
      overflowX: document.body.style.overflowX,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };
    document.body.style.background = "#2e1f24";
    document.body.style.overflowX = "hidden";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.background = prev.background;
      document.body.style.overflowX = prev.overflowX;
      document.body.style.overscrollBehavior = prev.overscrollBehavior;
    };
  }, []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, TOTAL_FRAMES - 1],
  );

  // ── Preload ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let loaded = 0;
    const images = new Array(TOTAL_FRAMES);
    let hadError = false;

    frameUrls.forEach((url, i) => {
      const img = new Image();
      img.onload = () => {
        images[i] = img;
        loaded++;
        setLoadProgress((loaded / TOTAL_FRAMES) * 100);
        if (loaded === TOTAL_FRAMES) {
          imagesRef.current = images;
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        if (!hadError) {
          hadError = true;
          setLoadError(true);
        }
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          imagesRef.current = images;
          setIsLoaded(true);
        }
      };
      img.src = url;
    });
  }, []);

  // ── Canvas resize — simple: canvas.width = CSS px (no DPR scaling) ──────
  // getBoundingClientRect gives the ACTUAL CSS pixel size of the canvas.
  // window.innerHeight ≠ 100vh on mobile (toolbar changes innerHeight but
  // 100vh stays fixed), so using innerHeight caused a buffer/display size
  // mismatch that made the browser stretch the canvas itself — adding blur
  // ON TOP of the image scaling. This fixes that second layer of blur.
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (!w || !h) return;
    // Only reset buffer if size actually changed (avoids unnecessary clear)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const img = imagesRef.current[currentFrameRef.current];
    if (img) drawFrame(canvas, img);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    // visualViewport fires when the mobile browser toolbar hides/shows
    // (window "resize" alone doesn't catch this on all Android browsers)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", resizeCanvas);
    }
    resizeCanvas();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", resizeCanvas);
      }
    };
  }, [resizeCanvas]);

  // ── Scroll → draw ─────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = frameIndex.on("change", (latest) => {
      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(latest)));
      currentFrameRef.current = idx;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        const img = imagesRef.current[idx];
        if (canvas && img) drawFrame(canvas, img);
      });
    });
    return () => {
      unsub();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frameIndex]);

  // ── Draw frame 0 once loaded ──────────────────────────────────────────────
  useEffect(() => {
    if (isLoaded && canvasRef.current && imagesRef.current[0]) {
      resizeCanvas();
      drawFrame(canvasRef.current, imagesRef.current[0]);
    }
  }, [isLoaded, resizeCanvas]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Scoped keyframes — keeps all ClothScroll CSS out of index.css */}
      <style>{`
        @keyframes cloth-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cloth-pulse-ring {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
      `}</style>

      {!isLoaded && <LoadingScreen progress={loadProgress} />}

      {/* Scroll container: 250vh on mobile, 400vh on desktop */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: isMobile ? "250vh" : "400vh",
          background: "#2e1f24",
          visibility: isLoaded ? "visible" : "hidden",
          marginTop: 0,
        }}
      >
        {/* Sticky full-viewport panel — plain 100vh, canvas sizes via window.innerHeight */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* ── Canvas fills 100% ── */}
          <canvas
            ref={canvasRef}
            aria-label="Dress construction animation"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />

          {/* ── Dark vignette gradients ── */}
          {/* Top */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "25%",
              background:
                "linear-gradient(to bottom, rgba(46,31,36,0.6) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
          {/* Bottom — extended to 40% to mask any mobile sub-pixel gap */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(to top, rgba(46,31,36,0.75) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* ── Text overlays ── */}
          {OVERLAYS.map((overlay) => (
            <TextOverlay
              key={overlay.id}
              overlay={overlay}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Graceful degradation error badge */}
        {loadError && (
          <div
            style={{
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
              zIndex: 9999,
              background: "rgba(120,0,0,0.6)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontSize: "0.7rem",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
            }}
          >
            Some frames failed to load
          </div>
        )}
      </div>
    </>
  );
}
