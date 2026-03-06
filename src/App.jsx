import React, { useState, useEffect, useRef, useCallback } from "react";
import { PHI, PHI_INV, classifyDesire, DOORS } from "./data.js";
import "./global.css";

const GOLD   = "rgba(201,168,76,";
const BONE   = "rgba(232,232,240,";
const DARK   = "#03030a";
const CINZEL = "'Cinzel', serif";
const CORRO  = "'Cormorant Garamond', Georgia, serif";

// ── Grain overlay ──────────────────────────────────────────
function Grain() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999,
      opacity: 0.028,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      backgroundRepeat: "repeat", backgroundSize: "256px 256px",
      animation: "grainMove 0.5s steps(1) infinite",
    }} />
  );
}

// ── Vignette ──────────────────────────────────────────────
function Vignette() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
      background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.7) 100%)",
    }} />
  );
}

// ── Dirt particles canvas ─────────────────────────────────
function DirtCanvas({ active, onDone }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    // Generate particles
    const particles = Array.from({ length: 80 }, () => ({
      x: W * 0.2 + Math.random() * W * 0.6,
      y: H * 0.35 + Math.random() * H * 0.3,
      size: 1 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI * 2,
      type: "dirt", // brown/grey
    }));

    // Gold motes
    const goldMotes = Array.from({ length: 30 }, () => ({
      x: W * 0.3 + Math.random() * W * 0.4,
      y: H * 0.55 + Math.random() * H * 0.1,
      size: 1.5 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(1.5 + Math.random() * 2.5),
      delay: Math.random() * 0.4,
    }));

    const DURATION = 1600;

    function frame(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / DURATION);

      ctx.clearRect(0, 0, W, H);

      // Dirt particles fall
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy * (1 + t);
        p.rot += 0.04;
        const alpha = Math.max(0, 0.8 - t * 1.2);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(${80 + Math.random() * 40}, ${60 + Math.random() * 30}, ${40}, ${alpha})`;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      // Gold motes rise
      goldMotes.forEach(g => {
        if (t < g.delay) return;
        const localT = (t - g.delay) / (1 - g.delay);
        g.x += g.vx;
        g.y += g.vy;
        const alpha = localT < 0.3 ? localT / 0.3 : Math.max(0, 1 - (localT - 0.3) / 0.7);
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size * (0.5 + localT * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${alpha * 0.7})`;
        ctx.fill();
      });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, W, H);
        startRef.current = null;
        onDone?.();
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, onDone]);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 50,
    }} />
  );
}

// ── Door Revelation ───────────────────────────────────────
function DoorCard({ door, desire, onReset }) {
  const [show, setShow] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const r = door.color;
  const colorStr = `rgba(${r[0]},${r[1]},${r[2]},`;

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => setShowWords(true), 900);
    const t3 = setTimeout(() => setShowInvite(true), 1800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: "relative", zIndex: 10,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 24px",
      animation: "fadeIn 0.4s ease both",
    }}>

      {/* Echo the desire back */}
      <div style={{
        fontFamily: CORRO,
        fontSize: "clamp(14px, 3vw, 17px)",
        fontStyle: "italic",
        color: `${GOLD}0.4)`,
        letterSpacing: 2,
        marginBottom: 40,
        textAlign: "center",
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(6px)",
        transition: "all 1s ease 0.1s",
      }}>
        "{desire}"
      </div>

      {/* The Door */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 16,
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(12px) scale(0.97)",
        transition: "all 1.2s cubic-bezier(0.23,1,0.32,1) 0.2s",
      }}>
        {/* Roman numeral */}
        <div style={{
          fontFamily: CINZEL, fontSize: "clamp(11px, 2.5vw, 13px)",
          letterSpacing: "0.5em", color: `${colorStr}0.35)`,
          textTransform: "uppercase",
        }}>DOOR {door.num}</div>

        {/* Door name — the big reveal */}
        <div style={{
          fontFamily: CINZEL,
          fontSize: "clamp(32px, 8vw, 52px)",
          fontWeight: 300,
          letterSpacing: "0.2em",
          color: `${colorStr}0.9)`,
          textAlign: "center",
          textShadow: `0 0 60px ${colorStr}0.2), 0 0 120px ${colorStr}0.1)`,
          lineHeight: 1,
        }}>
          {door.name}
        </div>

        {/* The divider line */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${colorStr}0.4), transparent)`,
          animation: show ? "lineExpand 1.2s ease 0.6s both" : "none",
          width: 80,
        }} />

        {/* The central question */}
        <div style={{
          fontFamily: CORRO,
          fontSize: "clamp(15px, 3.5vw, 19px)",
          fontStyle: "italic", fontWeight: 300,
          color: `${BONE}0.55)`,
          textAlign: "center",
          maxWidth: 460,
          lineHeight: 1.7,
          letterSpacing: 0.5,
          opacity: show ? 1 : 0,
          transition: "opacity 1s ease 0.8s",
        }}>
          {door.question}
        </div>
      </div>

      {/* Reflection words */}
      {showWords && (
        <div style={{
          display: "flex", gap: 24, marginTop: 40,
          animation: "fadeUp 0.8s ease both",
        }}>
          {door.reflection.map((word, i) => (
            <div key={word} style={{
              fontFamily: CINZEL,
              fontSize: "clamp(9px, 2vw, 11px)",
              letterSpacing: "0.4em",
              color: `${colorStr}${0.4 + i * 0.1})`,
              textTransform: "uppercase",
              animation: `fadeUp 0.6s ease ${i * 0.15}s both`,
            }}>
              {word}
            </div>
          ))}
        </div>
      )}

      {/* Invitation to go deeper */}
      {showInvite && (
        <div style={{
          marginTop: 56,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
          animation: "fadeUp 1s ease both",
        }}>
          <div style={{
            fontFamily: CORRO, fontStyle: "italic",
            fontSize: "clamp(13px, 2.5vw, 15px)",
            color: `${BONE}0.25)`,
            letterSpacing: 1,
            textAlign: "center",
          }}>
            this is just the surface
          </div>

          <a
            href="https://educationrevelation.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: CINZEL,
              fontSize: "clamp(10px, 2vw, 12px)",
              letterSpacing: "0.45em",
              color: `${GOLD}0.55)`,
              textDecoration: "none",
              padding: "12px 28px",
              border: `1px solid ${GOLD}0.15)`,
              borderRadius: 2,
              transition: "all 0.618s ease",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.target.style.color = `${GOLD}0.9)`;
              e.target.style.borderColor = `${GOLD}0.4)`;
              e.target.style.boxShadow = `0 0 30px ${GOLD}0.08)`;
            }}
            onMouseLeave={e => {
              e.target.style.color = `${GOLD}0.55)`;
              e.target.style.borderColor = `${GOLD}0.15)`;
              e.target.style.boxShadow = "none";
            }}
          >
            GO DEEPER →
          </a>

          <button
            onClick={onReset}
            style={{
              fontFamily: CORRO, fontStyle: "italic",
              fontSize: "clamp(12px, 2.5vw, 14px)",
              color: `${BONE}0.2)`,
              background: "none", border: "none",
              cursor: "pointer", letterSpacing: 1,
              transition: "color 0.4s ease",
              marginTop: 4,
            }}
            onMouseEnter={e => { e.target.style.color = `${BONE}0.45)`; }}
            onMouseLeave={e => { e.target.style.color = `${BONE}0.2)`; }}
          >
            sift again
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────
export default function App() {
  // States: "idle" | "typing" | "sifting" | "revealed"
  const [phase, setPhase] = useState("idle");
  const [input, setInput] = useState("");
  const [door, setDoor] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);

  // Entrance — fade in after a breath
  useEffect(() => {
    const t = setTimeout(() => setShowInput(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = useCallback(() => {
    if (input.trim().length < 3 || phase !== "idle" && phase !== "typing") return;
    const result = classifyDesire(input);
    setDoor(result);
    setPhase("sifting");
  }, [input, phase]);

  const handleDone = useCallback(() => {
    setPhase("revealed");
  }, []);

  const handleReset = useCallback(() => {
    setPhase("idle");
    setInput("");
    setDoor(null);
    setTimeout(() => {
      setShowInput(true);
      inputRef.current?.focus();
    }, 400);
  }, []);

  const doorColor = door ? `rgba(${door.color[0]},${door.color[1]},${door.color[2]},` : `${GOLD}`;

  // Background shifts when door is revealed
  const bg = phase === "revealed" && door
    ? `radial-gradient(ellipse at 50% 40%, rgba(${door.color[0] * 0.05},${door.color[1] * 0.05},${door.color[2] * 0.05},1) 0%, ${DARK} 70%)`
    : `radial-gradient(ellipse at 50% 35%, rgba(8,6,20,1) 0%, ${DARK} 80%)`;

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      transition: `background ${(PHI * PHI).toFixed(3)}s cubic-bezier(0.23,1,0.32,1)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative",
      overflowX: "hidden",
    }}>
      <Grain />
      <Vignette />

      {/* Dirt animation */}
      <DirtCanvas active={phase === "sifting"} onDone={handleDone} />

      {/* ── IDLE / TYPING phase ── */}
      {(phase === "idle" || phase === "typing" || phase === "sifting") && (
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center",
          padding: "0 24px", width: "100%",
          opacity: phase === "sifting" ? 0 : 1,
          transform: phase === "sifting" ? "scale(0.97)" : "scale(1)",
          transition: "opacity 0.6s ease, transform 0.8s ease",
        }}>

          {/* SIFTDIRT wordmark */}
          <div style={{
            fontFamily: CINZEL,
            fontSize: "clamp(11px, 2.5vw, 13px)",
            letterSpacing: "0.55em",
            color: `${GOLD}0.3)`,
            marginBottom: 56,
            opacity: showInput ? 1 : 0,
            transition: "opacity 1.2s ease",
            animation: showInput ? "breatheSlow 4s ease-in-out infinite 2s" : "none",
          }}>
            SIFTDIRT
          </div>

          {/* The prompt */}
          <div style={{
            fontFamily: CORRO,
            fontSize: "clamp(26px, 6vw, 40px)",
            fontWeight: 300,
            fontStyle: "italic",
            color: `${BONE}0.7)`,
            letterSpacing: 2,
            marginBottom: 40,
            textAlign: "center",
            lineHeight: 1.4,
            opacity: showInput ? 1 : 0,
            transform: showInput ? "none" : "translateY(16px)",
            transition: "opacity 1.2s ease 0.2s, transform 1.4s cubic-bezier(0.23,1,0.32,1) 0.2s",
          }}>
            what do you want?
          </div>

          {/* The input */}
          <div style={{
            width: "100%", maxWidth: 520,
            opacity: showInput ? 1 : 0,
            transform: showInput ? "none" : "translateY(16px)",
            transition: "opacity 1.2s ease 0.5s, transform 1.4s cubic-bezier(0.23,1,0.32,1) 0.5s",
          }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              placeholder="type your desire…"
              onChange={e => {
                setInput(e.target.value);
                setPhase(e.target.value.length > 0 ? "typing" : "idle");
                // Auto-grow
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              style={{
                width: "100%",
                padding: `${Math.round(10 * PHI)}px ${Math.round(14 * PHI)}px`,
                fontFamily: CORRO,
                fontSize: "clamp(16px, 3.5vw, 22px)",
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: 1,
                color: `${BONE}0.85)`,
                background: "rgba(0,0,0,0.4)",
                border: `1px solid ${GOLD}${input.length > 0 ? "0.35" : "0.15"})`,
                borderRadius: 2,
                outline: "none",
                resize: "none",
                overflow: "hidden",
                textAlign: "center",
                lineHeight: 1.6,
                minHeight: 58,
                transition: "border-color 0.618s ease, box-shadow 0.618s ease",
                boxShadow: input.length > 0
                  ? `0 0 50px ${GOLD}0.08), inset 0 0 40px rgba(0,0,0,0.4)`
                  : `inset 0 0 40px rgba(0,0,0,0.4)`,
                animation: input.length === 0 && showInput ? "goldPulse 3s ease-in-out infinite 2s" : "none",
              }}
              onFocus={e => {
                e.target.style.borderColor = `${GOLD}0.4)`;
                e.target.style.boxShadow = `0 0 60px ${GOLD}0.12), inset 0 0 40px rgba(0,0,0,0.4)`;
              }}
              onBlur={e => {
                e.target.style.borderColor = `${GOLD}${input.length > 0 ? "0.3" : "0.15"})`;
                e.target.style.boxShadow = input.length > 0
                  ? `0 0 50px ${GOLD}0.08), inset 0 0 40px rgba(0,0,0,0.4)`
                  : `inset 0 0 40px rgba(0,0,0,0.4)`;
              }}
            />

            {/* Submit hint */}
            <div style={{
              textAlign: "center",
              marginTop: 16,
              fontFamily: CORRO, fontStyle: "italic",
              fontSize: "clamp(11px, 2vw, 13px)",
              color: `${BONE}${input.trim().length >= 3 ? "0.25" : "0.1"})`,
              letterSpacing: 2,
              transition: "color 0.618s ease",
            }}>
              {input.trim().length >= 3 ? "press enter to sift" : ""}
            </div>
          </div>

          {/* Sifting animation text */}
          {phase === "sifting" && (
            <div style={{
              position: "absolute",
              fontFamily: CINZEL,
              fontSize: "clamp(10px, 2vw, 12px)",
              letterSpacing: "0.5em",
              color: `${GOLD}0.5)`,
              animation: "siftPulse 1.2s ease-in-out infinite",
            }}>
              SIFTING
            </div>
          )}
        </div>
      )}

      {/* ── REVEALED phase ── */}
      {phase === "revealed" && door && (
        <DoorCard door={door} desire={input} onReset={handleReset} />
      )}
    </div>
  );
}
