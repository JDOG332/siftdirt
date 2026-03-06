/**
 * EQUATION REVEAL
 *
 * The equation appears through its own mechanism.
 *
 * S_eff has high entropy → particles scattered → assembles first, blue
 * Ψ is low entropy → crystallized order → assembles last, gold
 * The transformation funnel connects them
 * EQUAL confirms they are the same truth
 *
 * TIMELINE (14 seconds):
 *  0.0–1.5   VOID          — black, breathing
 *  1.5–5.0   ENTROPY       — blue particles cohere into S_eff left side
 *  5.0–7.5   TRANSFORM     — energy funnel ignites center
 *  7.5–11.0  CRYSTALLIZE   — Ψ right side assembles gold
 *  11.0–13.0 EQUAL         — the word rises, chrome
 *  13.0+     HOLD          — everything alive, breathing
 */

import { useEffect, useRef, useState } from "react";
import { PHI, PHI_INV } from "./data.js";
import { computeR12, initializeBlochVectors } from "./psi-engine.js";

const TOTAL_MS = 14000;

function smootherstep(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function easeOut(t) { return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3); }

// ── Particle field — scattered info that coheres into symbols ────────────────
class ParticleField {
  constructor(W, H) {
    this.W = W; this.H = H;
    this.particles = [];
    this.reset(W, H);
  }

  reset(W, H) {
    this.W = W; this.H = H;
    // Scattered particles across full canvas
    this.particles = Array.from({ length: 180 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tx: W / 2 + (Math.random() - 0.5) * W * 0.8, // target x (equation region)
      ty: H / 2 + (Math.random() - 0.5) * H * 0.4, // target y
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 0.8 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.015,
      side: i < 90 ? "left" : "right", // which half of equation
      delay: Math.random() * 0.4,
    }));
  }

  update(t, dt) {
    this.particles.forEach(p => {
      p.phase += p.speed;
      // Slight drift
      p.x += p.vx + Math.sin(p.phase * 0.7) * 0.08;
      p.y += p.vy + Math.cos(p.phase * 0.5) * 0.06;
      // Wrap
      if (p.x < 0) p.x = this.W;
      if (p.x > this.W) p.x = 0;
      if (p.y < 0) p.y = this.H;
      if (p.y > this.H) p.y = 0;
    });
  }

  drawLeft(ctx, alpha) {
    this.particles.filter(p => p.side === "left").forEach(p => {
      const a = alpha * (0.3 + Math.sin(p.phase) * 0.15);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100,160,220,${a})`;
      ctx.fill();
    });
  }

  drawRight(ctx, alpha) {
    this.particles.filter(p => p.side === "right").forEach(p => {
      const a = alpha * (0.3 + Math.sin(p.phase) * 0.15);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${a})`;
      ctx.fill();
    });
  }
}

// ── Transformation funnel — energy streams from image ────────────────────────
function drawFunnel(ctx, cx, cy, t, elapsed) {
  if (t <= 0) return;
  const te = easeOut(t);

  // Funnel body — converging/diverging shape
  const fW = 180 * te;
  const fH = 55;
  const streamCount = 18;

  for (let i = 0; i < streamCount; i++) {
    const frac = i / streamCount;
    const yOff = (frac - 0.5) * fH * 2;

    // Left (input) side — wide spread
    const x0 = cx - fW - 40;
    const y0 = cy + yOff;

    // Converge to throat
    const x1 = cx - 20;
    const y1 = cy + yOff * 0.08;

    // Diverge on right (output) side
    const x2 = cx + 20;
    const y2 = cy + yOff * 0.08;

    const x3 = cx + fW + 40;
    const y3 = cy + yOff * 1.4;

    const flow = (elapsed * 0.0012 + frac) % 1;
    const streamAlpha = te * (0.15 + Math.sin(flow * Math.PI) * 0.2);

    // Left stream (blue)
    const gL = ctx.createLinearGradient(x0, y0, x1, y1);
    gL.addColorStop(0, `rgba(100,160,220,0)`);
    gL.addColorStop(0.7, `rgba(140,190,255,${streamAlpha})`);
    gL.addColorStop(1, `rgba(200,230,255,${streamAlpha * 0.5})`);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(x0 + fW * 0.4, y0, x1 - 30, y1, x1, y1);
    ctx.strokeStyle = gL;
    ctx.lineWidth = 0.6 + Math.sin(flow * Math.PI * 2) * 0.3;
    ctx.stroke();

    // Right stream (gold)
    const gR = ctx.createLinearGradient(x2, y2, x3, y3);
    gR.addColorStop(0, `rgba(201,168,76,${streamAlpha * 0.5})`);
    gR.addColorStop(0.3, `rgba(220,190,100,${streamAlpha})`);
    gR.addColorStop(1, `rgba(201,168,76,0)`);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.bezierCurveTo(x2 + 30, y2, x3 - fW * 0.4, y3, x3, y3);
    ctx.strokeStyle = gR;
    ctx.lineWidth = 0.6 + Math.sin((flow + 0.5) * Math.PI * 2) * 0.3;
    ctx.stroke();
  }

  // Throat glow
  const throatA = te * (0.4 + Math.sin(elapsed * 0.004) * 0.15);
  const gT = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 * te);
  gT.addColorStop(0, `rgba(255,255,255,${throatA})`);
  gT.addColorStop(0.4, `rgba(180,210,255,${throatA * 0.5})`);
  gT.addColorStop(1, `rgba(100,160,220,0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, 28 * te, 0, Math.PI * 2);
  ctx.fillStyle = gT;
  ctx.fill();

  // Label
  if (te > 0.4) {
    const labelA = easeOut((te - 0.4) / 0.6) * 0.55;
    ctx.font = `${Math.round(9 * te)}px 'Cinzel', serif`;
    ctx.letterSpacing = "0.35em";
    ctx.fillStyle = `rgba(160,200,240,${labelA})`;
    ctx.textAlign = "center";
    ctx.fillText("LOGARITHMIC", cx, cy - 18 * te);
    ctx.fillText("TRANSFORMATION", cx, cy - 6 * te);
  }
}

// ── Main canvas drawing ──────────────────────────────────────────────────────
function drawFrame(ctx, W, H, t, elapsed, particles, blochVecs, globalPsi) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#03030a";
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;
  const equationY = cy + 10;

  // Phase times (normalized 0-1)
  const voidEnd     = 1500 / TOTAL_MS;
  const leftEnd     = 5000 / TOTAL_MS;
  const funnelEnd   = 7500 / TOTAL_MS;
  const rightEnd    = 11000 / TOTAL_MS;
  const equalEnd    = 13000 / TOTAL_MS;

  const inVoid      = t < voidEnd;
  const leftT       = smootherstep(Math.max(0, Math.min(1, (t - voidEnd) / (leftEnd - voidEnd))));
  const funnelT     = smootherstep(Math.max(0, Math.min(1, (t - leftEnd) / (funnelEnd - leftEnd))));
  const rightT      = smootherstep(Math.max(0, Math.min(1, (t - funnelEnd) / (rightEnd - funnelEnd))));
  const equalT      = smootherstep(Math.max(0, Math.min(1, (t - rightEnd) / (equalEnd - rightEnd))));
  const holdT       = t >= equalEnd ? smootherstep(Math.min(1, (t - equalEnd) / (1000 / TOTAL_MS))) : 0;

  // ── VOID BREATH ──────────────────────────────────────────────────────────
  if (inVoid) {
    const breathe = Math.sin(t / voidEnd * Math.PI) * 0.03;
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.4);
    grd.addColorStop(0, `rgba(201,168,76,${breathe})`);
    grd.addColorStop(1, "rgba(201,168,76,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
    return;
  }

  // ── PARTICLE FIELD ────────────────────────────────────────────────────────
  // Left particles fade out as equation coheres
  const leftParticleA = Math.max(0, 1 - leftT * 1.5);
  if (leftParticleA > 0) particles.drawLeft(ctx, leftParticleA * 0.5);

  const rightParticleA = Math.max(0, 1 - rightT * 1.5);
  if (rightParticleA > 0) particles.drawRight(ctx, rightParticleA * 0.5);

  // ── FUNNEL ───────────────────────────────────────────────────────────────
  drawFunnel(ctx, cx, equationY, funnelT, elapsed);

  // ── VIGNETTE ─────────────────────────────────────────────────────────────
  const vig = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.15, cx, cy, Math.max(W, H) * 0.8);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // ── GRAIN ────────────────────────────────────────────────────────────────
  // handled by CSS overlay

  // return phase data for HTML layer
  return { leftT, funnelT, rightT, equalT, holdT, equationY };
}

// ── HTML equation layer — rendered with DOM for crisp fonts ─────────────────

const CINZEL = "'Cinzel', serif";
const CORRO  = "'Cormorant Garamond', Georgia, serif";

function LeftSide({ t, W, H }) {
  // S_eff := −log F_gated − log C_eff − log D̂
  // Each term appears in sequence, driven by t

  const t1 = easeOut(Math.max(0, Math.min(1, (t - 0)   / 0.35)));
  const t2 = easeOut(Math.max(0, Math.min(1, (t - 0.2) / 0.35)));
  const t3 = easeOut(Math.max(0, Math.min(1, (t - 0.4) / 0.35)));
  const t4 = easeOut(Math.max(0, Math.min(1, (t - 0.6) / 0.35)));

  const fs = Math.min(W * 0.025, 18);
  const lh = fs * 1.5;
  const blue = (a) => `rgba(120,180,240,${a})`;
  const dim  = (a) => `rgba(180,210,255,${a})`;

  return (
    <div style={{
      position: "absolute",
      right: "52%",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 0,
      paddingRight: 40,
    }}>

      {/* S_eff := */}
      <div style={{
        fontFamily: CORRO,
        fontSize: `clamp(14px, ${W * 0.022}px, 24px)`,
        fontStyle: "italic",
        color: blue(t1),
        letterSpacing: 1,
        lineHeight: 1,
        opacity: t1,
        transform: `translateX(${(1 - t1) * -20}px)`,
        transition: "none",
        whiteSpace: "nowrap",
        marginBottom: 2,
      }}>
        S<sub style={{ fontSize: "0.6em" }}>eff</sub>
        <span style={{ fontStyle: "normal", margin: "0 6px", color: dim(t1) }}>:=</span>
      </div>

      {/* −log F_gated */}
      <div style={{
        fontFamily: CORRO,
        fontSize: `clamp(13px, ${W * 0.02}px, 22px)`,
        fontStyle: "italic",
        color: blue(t2 * 0.9),
        opacity: t2,
        transform: `translateX(${(1 - t2) * -16}px)`,
        whiteSpace: "nowrap",
        letterSpacing: 0.5,
        lineHeight: 1.3,
      }}>
        − log F<sub style={{ fontSize: "0.55em" }}>gated</sub>
      </div>

      {/* −log C_eff */}
      <div style={{
        fontFamily: CORRO,
        fontSize: `clamp(13px, ${W * 0.02}px, 22px)`,
        fontStyle: "italic",
        color: blue(t3 * 0.9),
        opacity: t3,
        transform: `translateX(${(1 - t3) * -16}px)`,
        whiteSpace: "nowrap",
        letterSpacing: 0.5,
        lineHeight: 1.3,
      }}>
        − log C<sub style={{ fontSize: "0.55em" }}>eff</sub>
      </div>

      {/* −log D̂ */}
      <div style={{
        fontFamily: CORRO,
        fontSize: `clamp(13px, ${W * 0.02}px, 22px)`,
        fontStyle: "italic",
        color: blue(t4 * 0.9),
        opacity: t4,
        transform: `translateX(${(1 - t4) * -16}px)`,
        whiteSpace: "nowrap",
        letterSpacing: 0.5,
        lineHeight: 1.3,
      }}>
        − log D̂
      </div>
    </div>
  );
}

function RightSide({ t, W }) {
  const t1 = easeOut(Math.max(0, Math.min(1, (t - 0)    / 0.4)));
  const t2 = easeOut(Math.max(0, Math.min(1, (t - 0.25) / 0.4)));
  const t3 = easeOut(Math.max(0, Math.min(1, (t - 0.5)  / 0.4)));

  const gold = (a) => `rgba(201,168,76,${a})`;
  const brightGold = (a) => `rgba(235,205,110,${a})`;

  return (
    <div style={{
      position: "absolute",
      left: "52%",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingLeft: 40,
    }}>
      {/* Ψ = */}
      <div style={{
        fontFamily: CORRO,
        fontSize: `clamp(28px, ${W * 0.042}px, 52px)`,
        fontStyle: "italic",
        color: brightGold(t1),
        opacity: t1,
        transform: `translateX(${(1 - t1) * 20}px) scale(${0.85 + t1 * 0.15})`,
        lineHeight: 1,
        textShadow: `0 0 40px rgba(201,168,76,${t1 * 0.5}), 0 0 80px rgba(201,168,76,${t1 * 0.2})`,
        letterSpacing: 2,
        whiteSpace: "nowrap",
      }}>
        Ψ
        <span style={{
          fontStyle: "normal",
          margin: "0 10px",
          color: gold(t1 * 0.7),
          fontSize: "0.7em",
        }}>
          =
        </span>
      </div>

      {/* R12 × */}
      <div style={{
        fontFamily: CORRO,
        fontSize: `clamp(18px, ${W * 0.026}px, 32px)`,
        fontStyle: "italic",
        color: gold(t2 * 0.9),
        opacity: t2,
        transform: `translateX(${(1 - t2) * 16}px)`,
        lineHeight: 1,
        whiteSpace: "nowrap",
        textShadow: `0 0 30px rgba(201,168,76,${t2 * 0.3})`,
      }}>
        R<sub style={{ fontSize: "0.55em" }}>12</sub>
        <span style={{ margin: "0 8px", color: gold(t2 * 0.6), fontStyle: "normal" }}>×</span>
      </div>

      {/* (C_eff · D̂) */}
      <div style={{
        fontFamily: CORRO,
        fontSize: `clamp(18px, ${W * 0.026}px, 32px)`,
        fontStyle: "italic",
        color: gold(t3 * 0.9),
        opacity: t3,
        transform: `translateX(${(1 - t3) * 16}px)`,
        lineHeight: 1,
        whiteSpace: "nowrap",
        textShadow: `0 0 30px rgba(201,168,76,${t3 * 0.3})`,
      }}>
        <span style={{ color: gold(t3 * 0.5), fontStyle: "normal" }}>(</span>
        C<sub style={{ fontSize: "0.55em" }}>eff</sub>
        <span style={{ margin: "0 5px", color: gold(t3 * 0.6) }}>·</span>
        D̂
        <span style={{ color: gold(t3 * 0.5), fontStyle: "normal" }}>)</span>
      </div>
    </div>
  );
}

function EqualWord({ t }) {
  const te = easeOut(t);
  return (
    <div style={{
      position: "absolute",
      bottom: "22%",
      left: "50%",
      transform: `translateX(-50%) translateY(${(1 - te) * 30}px)`,
      opacity: te,
      fontFamily: CINZEL,
      fontSize: "clamp(28px, 6vw, 56px)",
      fontWeight: 400,
      letterSpacing: "0.35em",
      color: `rgba(200,200,215,${te * 0.85})`,
      textShadow: `0 0 60px rgba(180,200,230,${te * 0.15})`,
      whiteSpace: "nowrap",
    }}>
      EQUAL
    </div>
  );
}

function PsiGlow({ t, W, H }) {
  if (t <= 0) return null;
  const te = easeOut(t);
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse at 50% 50%, rgba(201,168,76,${te * 0.04}) 0%, transparent 65%)`,
    }} />
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function EquationReveal({ onComplete }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const startRef  = useRef(null);
  const particlesRef = useRef(null);
  const doneRef   = useRef(false);

  const [phases, setPhases] = useState({
    leftT: 0, funnelT: 0, rightT: 0, equalT: 0, holdT: 0,
  });
  const [dims, setDims] = useState({ W: window.innerWidth, H: window.innerHeight });

  // Initialize Bloch vectors for Ψ computation
  const blochVecs = useRef(initializeBlochVectors());
  const [psi, setPsi] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setDims({ W: canvas.width, H: canvas.height });
      if (particlesRef.current) particlesRef.current.reset(canvas.width, canvas.height);
      else particlesRef.current = new ParticleField(canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function loop(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = elapsed / TOTAL_MS;

      // Update particles
      particlesRef.current.update(t, 0.016);

      // Draw canvas layer
      const result = drawFrame(
        ctx,
        canvas.width, canvas.height,
        t, elapsed,
        particlesRef.current,
        blochVecs.current,
        psi
      );

      if (result) {
        setPhases(prev => {
          // Only update if changed meaningfully
          if (Math.abs(prev.leftT - result.leftT) > 0.001 ||
              Math.abs(prev.rightT - result.rightT) > 0.001) {
            return result;
          }
          return prev;
        });

        // Compute live Ψ from actual Bloch vectors — drives the glow
        if (result.rightT > 0) {
          const R12 = computeR12(blochVecs.current[0], blochVecs.current[8]); // mirror pair 0↔8
          const G = result.rightT;
          setPsi(R12 * G);
        }
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        if (!doneRef.current) {
          doneRef.current = true;
          onComplete?.();
        }
      }
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const { W, H } = dims;
  const { leftT, funnelT, rightT, equalT } = phases;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#03030a" }}>

      {/* Canvas — particles + funnel */}
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
      }} />

      {/* Ψ glow behind equation */}
      <PsiGlow t={rightT} W={W} H={H} />

      {/* Left side: S_eff entropy form */}
      {leftT > 0 && <LeftSide t={leftT} W={W} H={H} />}

      {/* Right side: Ψ crystallized form */}
      {rightT > 0 && <RightSide t={rightT} W={W} />}

      {/* EQUAL */}
      {equalT > 0 && <EqualWord t={equalT} />}

      {/* Grain overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.025,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "256px 256px",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.8) 100%)",
      }} />
    </div>
  );
}
