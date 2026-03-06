/**
 * DOOR SCENE
 *
 * States:
 *  "button"    — "FIND YOUR TRUTH" button sitting at bottom
 *  "expanding" — button morphs into full-screen arch door
 *  "open"      — door holds, breathing, waiting
 *  "dissolving"— door shatters into particles on click
 *  "three"     — 3 smaller doors rise: POETRY · PAPER · PROOF
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { PHI, PHI_INV } from "./data.js";

const CINZEL = "'Cinzel', serif";
const CORRO  = "'Cormorant Garamond', Georgia, serif";

function easeOut(t) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3); }
function easeInOut(t) {
  t = Math.max(0, Math.min(1, t));
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
}

// ── Sacred geometry SVG ornament for door center ──────────────
function DoorOrnament({ size = 120, alpha = 1 }) {
  const r = size / 2;
  const r2 = r * 0.618;
  const r3 = r * 0.382;

  // 6 petal flower of life + center circle + outer ring
  const petals = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return `M ${r + Math.cos(a) * r3} ${r + Math.sin(a) * r3} m -${r3} 0 a ${r3} ${r3} 0 1 0 ${r3*2} 0 a ${r3} ${r3} 0 1 0 -${r3*2} 0`;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ opacity: alpha, overflow: "visible" }}>
      {/* Outer ring */}
      <circle cx={r} cy={r} r={r*0.92} fill="none"
        stroke="rgba(201,168,76,0.25)" strokeWidth="0.5" />
      {/* Petals */}
      {petals.map((d, i) => (
        <path key={i} d={d} fill="none"
          stroke="rgba(201,168,76,0.3)" strokeWidth="0.4" />
      ))}
      {/* PHI hexagram */}
      {[0, Math.PI/3, 2*Math.PI/3, Math.PI, 4*Math.PI/3, 5*Math.PI/3].map((a, i) => (
        <line key={`h${i}`}
          x1={r + Math.cos(a) * r2} y1={r + Math.sin(a) * r2}
          x2={r + Math.cos(a + Math.PI) * r2} y2={r + Math.sin(a + Math.PI) * r2}
          stroke="rgba(201,168,76,0.18)" strokeWidth="0.4" />
      ))}
      {/* Inner + center circles */}
      <circle cx={r} cy={r} r={r2} fill="none"
        stroke="rgba(201,168,76,0.22)" strokeWidth="0.5" />
      <circle cx={r} cy={r} r={r3} fill="none"
        stroke="rgba(201,168,76,0.32)" strokeWidth="0.4" />
      <circle cx={r} cy={r} r={4} fill="rgba(201,168,76,0.5)" />
      {/* 4 compass points */}
      {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((a, i) => (
        <line key={`c${i}`}
          x1={r + Math.cos(a) * r3} y1={r + Math.sin(a) * r3}
          x2={r + Math.cos(a) * r*0.88} y2={r + Math.sin(a) * r*0.88}
          stroke="rgba(201,168,76,0.35)" strokeWidth="0.6" />
      ))}
    </svg>
  );
}

// ── Single arch door ──────────────────────────────────────────
function ArchDoor({
  width, height,
  label, sublabel,
  alpha = 1, scale = 1,
  glowAlpha = 0,
  onClick,
  href,
  style = {},
  ornamentSize,
  showHandle = true,
  labelBelow = false,
}) {
  const [hover, setHover] = useState(false);
  const hA = hover ? 1 : 0;
  const gold    = a => `rgba(201,168,76,${a})`;
  const goldBrt = a => `rgba(235,205,110,${a})`;
  const navy    = a => `rgba(8,10,28,${a})`;

  const archH = height * 0.22; // how tall the arch is
  const ornSize = ornamentSize || width * 0.55;

  const doorContent = (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        position: "relative",
        width, height,
        cursor: "pointer",
        transform: `scale(${scale * (hover ? 1.012 : 1)})`,
        transition: "transform 0.618s cubic-bezier(0.23,1,0.32,1)",
        opacity: alpha,
        ...style,
      }}
    >
      {/* Outer glow */}
      <div style={{
        position: "absolute",
        inset: -20,
        borderRadius: `${width/2}px ${width/2}px 0 0 / ${archH+20}px ${archH+20}px 0 0`,
        background: `radial-gradient(ellipse at 50% 40%, ${gold(glowAlpha + hA*0.08)} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* SVG door frame — arch shape */}
      <svg
        width={width} height={height}
        style={{ position: "absolute", inset: 0 }}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Door path — rect bottom + arch top */}
        <defs>
          <clipPath id={`arch-${label}`}>
            <path d={`
              M 0 ${archH}
              Q 0 0 ${width/2} 0
              Q ${width} 0 ${width} ${archH}
              L ${width} ${height}
              L 0 ${height}
              Z
            `} />
          </clipPath>
          <linearGradient id={`doorGrad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(12,14,36,0.97)" />
            <stop offset="100%" stopColor="rgba(4,5,16,0.99)" />
          </linearGradient>
        </defs>

        {/* Door fill */}
        <path
          d={`M 0 ${archH} Q 0 0 ${width/2} 0 Q ${width} 0 ${width} ${archH} L ${width} ${height} L 0 ${height} L 0 ${archH} Z`}
          fill={`url(#doorGrad-${label})`}
        />

        {/* Outer border */}
        <path
          d={`M 2 ${archH} Q 2 2 ${width/2} 2 Q ${width-2} 2 ${width-2} ${archH} L ${width-2} ${height} L 2 ${height} L 2 ${archH}`}
          fill="none"
          stroke={gold(0.35 + hA * 0.25)}
          strokeWidth="1"
        />

        {/* Inner border panel */}
        {(() => {
          const m = width * 0.1;
          const mt = archH * 0.7;
          const iaH = archH * 0.55;
          return (
            <path
              d={`M ${m} ${mt + iaH} Q ${m} ${mt} ${width/2} ${mt} Q ${width-m} ${mt} ${width-m} ${mt+iaH} L ${width-m} ${height*0.88} L ${m} ${height*0.88} L ${m} ${mt+iaH} Z`}
              fill="none"
              stroke={gold(0.18 + hA*0.15)}
              strokeWidth="0.5"
            />
          );
        })()}

        {/* Corner flourishes */}
        {[
          [width*0.08, height*0.78], [width*0.92, height*0.78],
          [width*0.08, height*0.9],  [width*0.92, height*0.9],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2}
            fill={gold(0.3 + hA*0.2)} />
        ))}

        {/* Door handle */}
        {showHandle && (
          <>
            <circle cx={width*0.7} cy={height*0.52} r={4}
              fill="none" stroke={gold(0.4 + hA*0.3)} strokeWidth="0.8" />
            <circle cx={width*0.7} cy={height*0.52} r={1.5}
              fill={gold(0.5 + hA*0.3)} />
          </>
        )}

        {/* Keyhole */}
        <circle cx={width*0.5} cy={height*0.7} r={3}
          fill="none" stroke={gold(0.2 + hA*0.2)} strokeWidth="0.5" />
        <line
          x1={width*0.5} y1={height*0.7+3}
          x2={width*0.5} y2={height*0.7+9}
          stroke={gold(0.2 + hA*0.2)} strokeWidth="0.5"
        />

        {/* Horizontal divider bar */}
        <line
          x1={width*0.1} y1={height*0.5}
          x2={width*0.9} y2={height*0.5}
          stroke={gold(0.12 + hA*0.1)} strokeWidth="0.4"
        />
      </svg>

      {/* Ornament */}
      <div style={{
        position: "absolute",
        top: archH * 0.45,
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}>
        <DoorOrnament size={ornSize} alpha={0.6 + hA * 0.3} />
      </div>

      {/* Label inside or below door */}
      {label && !labelBelow && (
        <div style={{
          position: "absolute",
          bottom: height * 0.14,
          left: 0, right: 0,
          textAlign: "center",
          fontFamily: CINZEL,
          fontSize: `clamp(8px, ${width * 0.09}px, 18px)`,
          letterSpacing: "0.35em",
          color: gold(0.55 + hA * 0.3),
          textShadow: hover ? `0 0 20px ${gold(0.25)}` : "none",
          transition: "all 0.4s ease",
          pointerEvents: "none",
        }}>
          {label}
        </div>
      )}
    </div>
  );

  // Outer label below (for 3-door layout)
  if (labelBelow) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {doorContent}
        <div style={{
          fontFamily: CINZEL,
          fontSize: "clamp(10px,2.5vw,14px)",
          letterSpacing: "0.45em",
          color: gold(0.5 + hA*0.35),
          textShadow: hover ? `0 0 24px ${gold(0.2)}` : "none",
          transition: "all 0.618s ease",
          opacity: alpha,
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            fontFamily: CORRO,
            fontStyle: "italic",
            fontSize: "clamp(9px,1.8vw,11px)",
            letterSpacing: "0.2em",
            color: gold(0.28 + hA*0.2),
            opacity: alpha,
          }}>
            {sublabel}
          </div>
        )}
      </div>
    );
  }

  return doorContent;
}

// ── Dissolve particle canvas ───────────────────────────────────
function DissolveCanvas({ W, H, active }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const startRef  = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = W; canvas.height = H;

    // Spawn particles from center of screen
    particles.current = Array.from({ length: 280 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5;
      return {
        x: W/2 + (Math.random()-0.5)*W*0.55,
        y: H/2 + (Math.random()-0.5)*H*0.55,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 1 + Math.random() * 3,
        alpha: 0.6 + Math.random() * 0.4,
        decay: 0.015 + Math.random() * 0.025,
        gold: Math.random() > 0.4,
      };
    });

    function loop(now) {
      if (!startRef.current) startRef.current = now;
      const t = (now - startRef.current) / 1200;
      ctx.clearRect(0, 0, W, H);

      let alive = false;
      particles.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.99;
        p.alpha -= p.decay;
        if (p.alpha > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
          ctx.fillStyle = p.gold
            ? `rgba(201,168,76,${p.alpha})`
            : `rgba(140,170,220,${p.alpha * 0.7})`;
          ctx.fill();
        }
      });

      if (alive) rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, W, H]);

  if (!active) return null;
  return (
    <canvas ref={canvasRef}
      style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:50 }} />
  );
}

// ── Three doors ────────────────────────────────────────────────
const THREE_DOORS = [
  {
    label: "POETRY",
    sublabel: "the felt truth",
    href: "https://educationrevelation.com",
    delay: 0,
  },
  {
    label: "PAPER",
    sublabel: "the proven truth",
    href: "https://educationrevelation.com",
    delay: 0.12,
  },
  {
    label: "PROOF",
    sublabel: "the lived truth",
    href: "https://educationrevelation.com",
    delay: 0.24,
  },
];

// ── Main DoorScene component ───────────────────────────────────
export default function DoorScene({ visible }) {
  const [doorState, setDoorState] = useState("idle");
  // idle → expanding → open → dissolving → three
  const [expandT, setExpandT] = useState(0);
  const [dissolveActive, setDissolveActive] = useState(false);
  const [threeT, setThreeT] = useState(0);
  const rafRef = useRef(null);
  const dims = useRef({ W: window.innerWidth, H: window.innerHeight });

  useEffect(() => {
    const update = () => {
      dims.current = { W: window.innerWidth, H: window.innerHeight };
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Expand animation
  useEffect(() => {
    if (doorState !== "expanding") return;
    let start = null;
    const DURATION = 1200;
    function loop(now) {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      setExpandT(easeInOut(t));
      if (t < 1) rafRef.current = requestAnimationFrame(loop);
      else setDoorState("open");
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [doorState]);

  // Three doors animation
  useEffect(() => {
    if (doorState !== "three") return;
    let start = null;
    const DURATION = 1400;
    function loop(now) {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      setThreeT(t);
      if (t < 1) rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [doorState]);

  const handleButtonClick = useCallback(() => {
    setDoorState("expanding");
  }, []);

  const handleMainDoorClick = useCallback(() => {
    if (doorState !== "open") return;
    setDoorState("dissolving");
    setDissolveActive(true);
    setTimeout(() => {
      setDoorState("three");
      setDissolveActive(false);
    }, 1000);
  }, [doorState]);

  if (!visible) return null;

  const { W, H } = dims.current;
  const isMobile = W < 640;

  // Door dimensions at full expansion
  const fullDoorW = Math.min(W * 0.72, 480);
  const fullDoorH = Math.min(H * 0.82, 680);
  // Small door dimensions for 3-door layout
  const smallDoorW = isMobile ? Math.min(W*0.28, 100) : Math.min(W*0.2, 150);
  const smallDoorH = smallDoorW * 1.95;

  // Button state
  if (doorState === "idle") {
    return (
      <FindYourTruthButton onClick={handleButtonClick} />
    );
  }

  // Expanding: morphs from button-sized to full door
  if (doorState === "expanding") {
    const t = expandT;
    // interpolate size
    const dW = 200 + (fullDoorW - 200) * t;
    const dH = 52  + (fullDoorH - 52)  * t;
    const alpha = 0.6 + t * 0.4;

    return (
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `rgba(3,3,10,${t * 0.85})`,
        zIndex: 100,
      }}>
        <ArchDoor
          width={dW} height={dH}
          alpha={alpha}
          glowAlpha={t * 0.15}
          ornamentSize={dW * 0.45 * t}
          showHandle={t > 0.6}
        />
      </div>
    );
  }

  // Open: full door, waiting for click
  if (doorState === "open") {
    return (
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "rgba(3,3,10,0.92)",
        zIndex: 100,
      }}>
        {/* Ambient glow behind door */}
        <div style={{
          position: "absolute",
          width: fullDoorW * 1.8, height: fullDoorH * 1.4,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 45%, rgba(201,168,76,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <ArchDoor
          width={fullDoorW}
          height={fullDoorH}
          alpha={1}
          glowAlpha={0.12}
          ornamentSize={fullDoorW * 0.52}
          showHandle={true}
          onClick={handleMainDoorClick}
        />

        {/* Hint text */}
        <div style={{
          marginTop: 28,
          fontFamily: CORRO,
          fontStyle: "italic",
          fontSize: "clamp(10px,1.6vw,13px)",
          letterSpacing: "0.28em",
          color: "rgba(201,168,76,0.3)",
          animation: "breathe 3s ease-in-out infinite",
        }}>
          open the door
        </div>

        <style>{`
          @keyframes breathe {
            0%,100% { opacity:0.4; }
            50% { opacity:0.9; }
          }
        `}</style>
      </div>
    );
  }

  // Dissolving
  if (doorState === "dissolving") {
    return (
      <div style={{
        position: "fixed", inset: 0,
        background: "rgba(3,3,10,0.92)",
        zIndex: 100,
      }}>
        <DissolveCanvas W={W} H={H} active={dissolveActive} />
      </div>
    );
  }

  // Three doors
  if (doorState === "three") {
    return (
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "rgba(3,3,10,0.96)",
        zIndex: 100,
        gap: "clamp(20px,4vh,48px)",
      }}>
        {/* Ambient */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)",
        }} />

        {/* Heading */}
        <div style={{
          fontFamily: CINZEL,
          fontSize: "clamp(10px,2vw,13px)",
          letterSpacing: "0.55em",
          color: "rgba(201,168,76,0.35)",
          opacity: easeOut(Math.max(0, threeT - 0.2) / 0.4),
          transform: `translateY(${(1-easeOut(Math.max(0,threeT-0.2)/0.4))*12}px)`,
        }}>
          CHOOSE YOUR PATH
        </div>

        {/* The 3 doors */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? 24 : "clamp(24px,4vw,64px)",
        }}>
          {THREE_DOORS.map((door, i) => {
            const dt = easeOut(Math.max(0, (threeT - door.delay * 0.6) / 0.55));
            return (
              <div
                key={door.label}
                style={{
                  opacity: dt,
                  transform: `translateY(${(1-dt)*40}px)`,
                }}
              >
                <ArchDoor
                  width={smallDoorW}
                  height={smallDoorH}
                  label={door.label}
                  sublabel={door.sublabel}
                  labelBelow={true}
                  alpha={1}
                  glowAlpha={0.06}
                  ornamentSize={smallDoorW * 0.5}
                  showHandle={true}
                  onClick={() => window.open(door.href, "_blank")}
                />
              </div>
            );
          })}
        </div>

        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.85) 100%)",
        }} />
      </div>
    );
  }

  return null;
}

// ── The initial button ─────────────────────────────────────────
function FindYourTruthButton({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{
      position: "fixed", bottom: "clamp(32px,6vh,60px)",
      left: "50%", transform: "translateX(-50%)",
      zIndex: 100,
    }}>
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
        style={{
          display: "inline-block",
          fontFamily: CINZEL,
          fontSize: "clamp(10px,2.2vw,13px)",
          letterSpacing: "0.45em",
          color: hover ? "rgba(235,205,110,0.95)" : "rgba(201,168,76,0.65)",
          padding: "clamp(12px,2vh,18px) clamp(28px,4vw,52px)",
          border: `1px solid ${hover ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.18)"}`,
          borderRadius: 2,
          background: hover ? "rgba(201,168,76,0.04)" : "transparent",
          boxShadow: hover
            ? "0 0 40px rgba(201,168,76,0.1), inset 0 0 30px rgba(0,0,0,0.3)"
            : "inset 0 0 30px rgba(0,0,0,0.3)",
          transition: "all 0.618s cubic-bezier(0.23,1,0.32,1)",
          cursor: "pointer",
          whiteSpace: "nowrap",
          outline: "none",
        }}
      >
        FIND YOUR TRUTH
      </button>
    </div>
  );
}
