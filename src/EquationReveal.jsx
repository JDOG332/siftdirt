/**
 * EQUATION REVEAL — fixed
 *
 * One horizontal line. Left blue, funnel center, right gold.
 * Ψ dominates. Mobile-first. Everything scales with vw.
 *
 * DESKTOP: S_eff := −log F_gated − log C_eff − log D̂  ⟩⟩  Ψ = R₁₂ × (C_eff · D̂)
 * MOBILE:  stacks vertically with transform arrow between
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { PHI, PHI_INV } from "./data.js";
import { computeR12, initializeBlochVectors } from "./psi-engine.js";

const TOTAL_MS = 22000;

// Quote: appears after equation fades
const QUOTE = "Truth is found by removing noise, watching without blinking, and holding reality from three angles until it can't slip away."
const QUOTE_PARTS = [
  "Truth is found",
  "by removing noise,",
  "watching without blinking,",
  "and holding reality from three angles",
  "until it can't slip away.",
];
const CINZEL = "'Cinzel', serif";
const CORRO  = "'Cormorant Garamond', Georgia, serif";

function smootherstep(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function easeOut(t) {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

// ── Particle field ───────────────────────────────────────────
class ParticleField {
  constructor(W, H) { this.reset(W, H); }
  reset(W, H) {
    this.W = W; this.H = H;
    this.p = Array.from({ length: 160 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: 0.7 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      spd: 0.01 + Math.random() * 0.014,
      side: i < 80 ? "L" : "R",
    }));
  }
  update() {
    this.p.forEach(p => {
      p.phase += p.spd;
      p.x += p.vx + Math.sin(p.phase * 0.7) * 0.07;
      p.y += p.vy + Math.cos(p.phase * 0.5) * 0.05;
      if (p.x < 0) p.x = this.W;
      if (p.x > this.W) p.x = 0;
      if (p.y < 0) p.y = this.H;
      if (p.y > this.H) p.y = 0;
    });
  }
  draw(ctx, alpha) {
    this.p.forEach(p => {
      const a = alpha * (0.25 + Math.sin(p.phase) * 0.12);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.side === "L"
        ? `rgba(100,160,220,${a})`
        : `rgba(201,168,76,${a})`;
      ctx.fill();
    });
  }
}

// ── Funnel canvas ─────────────────────────────────────────────
function drawCanvas(ctx, W, H, t, elapsed, pf) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#03030a";
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2;

  // Phase markers
  const voidEnd   = 1500  / TOTAL_MS;
  const leftEnd   = 5000  / TOTAL_MS;
  const funnelEnd = 7500  / TOTAL_MS;
  const rightEnd  = 11000 / TOTAL_MS;

  if (t < voidEnd) {
    const b = Math.sin((t / voidEnd) * Math.PI) * 0.025;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.4);
    g.addColorStop(0, `rgba(201,168,76,${b})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    return;
  }

  const leftT   = smootherstep(Math.max(0, Math.min(1, (t - voidEnd)   / (leftEnd   - voidEnd))));
  const funnelT = smootherstep(Math.max(0, Math.min(1, (t - leftEnd)   / (funnelEnd - leftEnd))));
  const rightT  = smootherstep(Math.max(0, Math.min(1, (t - funnelEnd) / (rightEnd  - funnelEnd))));

  // Particles fade as equations appear
  pf.update();
  const pA = Math.max(0, 1 - Math.max(leftT, rightT) * 1.6) * 0.45;
  if (pA > 0) pf.draw(ctx, pA);

  // Funnel streams
  if (funnelT > 0) {
    const te = easeOut(funnelT);
    const fW = Math.min(W * 0.28, 220) * te;
    const fH = Math.min(H * 0.12, 60);
    const streams = 20;

    for (let i = 0; i < streams; i++) {
      const frac = i / streams;
      const yOff = (frac - 0.5) * fH * 2;
      const flow = ((elapsed * 0.0011) + frac) % 1;
      const sA = te * (0.12 + Math.sin(flow * Math.PI) * 0.18);

      // Left stream → blue
      const x0 = cx - fW - 30, y0 = cy + yOff;
      const x1 = cx - 15,      y1 = cy + yOff * 0.07;
      const gL = ctx.createLinearGradient(x0, y0, x1, y1);
      gL.addColorStop(0, `rgba(80,140,210,0)`);
      gL.addColorStop(0.6, `rgba(130,185,255,${sA})`);
      gL.addColorStop(1, `rgba(200,225,255,${sA * 0.4})`);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(x0 + fW * 0.35, y0, x1 - 25, y1, x1, y1);
      ctx.strokeStyle = gL;
      ctx.lineWidth = 0.5 + Math.sin(flow * Math.PI * 2) * 0.25;
      ctx.stroke();

      // Right stream → gold
      const x2 = cx + 15,      y2 = cy + yOff * 0.07;
      const x3 = cx + fW + 30, y3 = cy + yOff * 1.35;
      const gR = ctx.createLinearGradient(x2, y2, x3, y3);
      gR.addColorStop(0, `rgba(201,168,76,${sA * 0.4})`);
      gR.addColorStop(0.4, `rgba(220,190,100,${sA})`);
      gR.addColorStop(1, `rgba(201,168,76,0)`);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.bezierCurveTo(x2 + 25, y2, x3 - fW * 0.35, y3, x3, y3);
      ctx.strokeStyle = gR;
      ctx.lineWidth = 0.5 + Math.sin((flow + 0.5) * Math.PI * 2) * 0.25;
      ctx.stroke();
    }

    // Throat glow
    const tA = te * (0.5 + Math.sin(elapsed * 0.004) * 0.15);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * te);
    g.addColorStop(0, `rgba(255,255,255,${tA})`);
    g.addColorStop(0.35, `rgba(180,215,255,${tA * 0.45})`);
    g.addColorStop(1, "rgba(100,160,220,0)");
    ctx.beginPath(); ctx.arc(cx, cy, 30 * te, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
  }

  // Vignette
  const vig = ctx.createRadialGradient(cx, cy, Math.min(W,H)*0.15, cx, cy, Math.max(W,H)*0.82);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = vig; ctx.fillRect(0,0,W,H);
}

// ── Equation HTML layer ───────────────────────────────────────
function EquationLayer({ phases, W, H, isMobile }) {
  const {
    leftT, funnelT, rightT, equalT,
    t1L, t2L, t3L, t4L,
    t1R, t2R, t3R,
  } = phases;

  const blue       = a => `rgba(120,185,245,${a})`;
  const blueDim    = a => `rgba(160,210,255,${a})`;
  const gold       = a => `rgba(201,168,76,${a})`;
  const goldBright = a => `rgba(235,205,110,${a})`;

  // Responsive font sizes
  const psiSize   = isMobile ? "clamp(38px,12vw,56px)"  : "clamp(42px,5.5vw,72px)";
  const eqSize    = isMobile ? "clamp(14px,4.2vw,22px)" : "clamp(16px,1.9vw,26px)";
  const leftSize  = isMobile ? "clamp(11px,3.2vw,16px)" : "clamp(13px,1.4vw,20px)";
  const subScale  = "0.58em";
  const labelSize = isMobile ? "clamp(7px,1.8vw,9px)"  : "clamp(8px,0.8vw,10px)";

  if (isMobile) {
    // ── MOBILE LAYOUT: vertical stack ─────────────────────────
    return (
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0, padding: "0 16px",
      }}>

        {/* Left: S_eff — inline on mobile too, just smaller */}
        <div style={{
          opacity: leftT,
          transform: `translateY(${(1-easeOut(leftT))*14}px)`,
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 2, marginBottom: 8,
        }}>
          {/* S_eff := row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 4,
            fontFamily: CORRO, fontStyle: "italic", fontSize: leftSize,
            color: blue(t1L), whiteSpace: "nowrap",
            opacity: t1L, transform: `translateX(${(1-t1L)*-10}px)`,
          }}>
            S<sub style={{fontSize:subScale}}>eff</sub>
            <span style={{fontStyle:"normal",margin:"0 4px",color:blueDim(t1L)}}> :=</span>
          </div>
          {/* log terms */}
          {[
            [t2L, <>− log F<sub style={{fontSize:subScale}}>gated</sub></>],
            [t3L, <>− log C<sub style={{fontSize:subScale}}>eff</sub></>],
            [t4L, <>− log D̂</>],
          ].map(([ti, content], i) => (
            <div key={i} style={{
              fontFamily: CORRO, fontStyle: "italic", fontSize: leftSize,
              color: blue(ti * 0.9), whiteSpace: "nowrap",
              opacity: ti, transform: `translateX(${(1-ti)*-8}px)`,
              lineHeight: 1.25,
            }}>
              {content}
            </div>
          ))}
        </div>

        {/* Transformation label */}
        {funnelT > 0.3 && (
          <div style={{
            fontFamily: CINZEL, fontSize: labelSize, letterSpacing: "0.35em",
            color: `rgba(160,205,245,${easeOut((funnelT-0.3)/0.7)*0.65})`,
            textAlign: "center", lineHeight: 1.5, marginBottom: 10,
            opacity: easeOut((funnelT-0.3)/0.7),
          }}>
            LOGARITHMIC<br/>TRANSFORMATION
          </div>
        )}

        {/* Right: Ψ = R₁₂ × (C_eff · D̂) */}
        <div style={{
          opacity: rightT,
          transform: `translateY(${(1-easeOut(rightT))*14}px)`,
          display: "flex", flexDirection: "row", alignItems: "center",
          gap: 4, flexWrap: "nowrap",
          marginTop: 4,
        }}>
          <div style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: psiSize,
            color: goldBright(t1R), lineHeight: 1,
            opacity: t1R, transform: `scale(${0.85+t1R*0.15})`,
            textShadow: `0 0 40px rgba(201,168,76,${t1R*0.55}),0 0 90px rgba(201,168,76,${t1R*0.2})`,
          }}>Ψ</div>
          <div style={{
            fontFamily: CORRO, fontStyle: "normal", fontSize: eqSize,
            color: gold(t1R * 0.7), opacity: t1R, margin: "0 4px",
          }}>=</div>
          <div style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: eqSize,
            color: gold(t2R * 0.9), opacity: t2R,
            transform: `translateX(${(1-t2R)*10}px)`, whiteSpace: "nowrap",
            textShadow: `0 0 25px rgba(201,168,76,${t2R*0.25})`,
          }}>
            R<sub style={{fontSize:subScale}}>12</sub>
            <span style={{fontStyle:"normal",margin:"0 5px",color:gold(t2R*0.6)}}>×</span>
          </div>
          <div style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: eqSize,
            color: gold(t3R * 0.9), opacity: t3R,
            transform: `translateX(${(1-t3R)*10}px)`, whiteSpace: "nowrap",
            textShadow: `0 0 25px rgba(201,168,76,${t3R*0.25})`,
          }}>
            <span style={{color:gold(t3R*0.5),fontStyle:"normal"}}>(</span>
            C<sub style={{fontSize:subScale}}>eff</sub>
            <span style={{margin:"0 3px",color:gold(t3R*0.6)}}>·</span>
            D̂
            <span style={{color:gold(t3R*0.5),fontStyle:"normal"}}>)</span>
          </div>
        </div>

        {/* EQUAL */}
        {equalT > 0 && (
          <div style={{
            fontFamily: CINZEL,
            fontSize: "clamp(20px,6vw,32px)",
            letterSpacing: "0.4em",
            color: `rgba(200,200,218,${easeOut(equalT)*0.88})`,
            textShadow: `0 0 50px rgba(180,200,230,${easeOut(equalT)*0.12})`,
            opacity: easeOut(equalT),
            transform: `translateY(${(1-easeOut(equalT))*20}px)`,
            marginTop: 28,
          }}>
            EQUAL
          </div>
        )}
      </div>
    );
  }

  // ── DESKTOP LAYOUT: single horizontal line ─────────────────
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>

      {/* One horizontal row: [left] [funnel label] [right] */}
      <div style={{
        display: "flex", flexDirection: "row",
        alignItems: "center", justifyContent: "center",
        width: "100%", gap: 0,
        padding: "0 clamp(16px,4vw,60px)",
      }}>

        {/* ── LEFT: S_eff := −log F_gated − log C_eff − log D̂ ── */}
        <div style={{
          display: "flex", flexDirection: "row",
          alignItems: "baseline", gap: "clamp(4px,0.6vw,10px)",
          opacity: leftT,
          transform: `translateX(${(1-easeOut(leftT))*-24}px)`,
          flexShrink: 0,
        }}>

          {/* S_eff := */}
          <span style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: leftSize,
            color: blue(t1L), whiteSpace: "nowrap",
            opacity: t1L, transition: "none",
          }}>
            S<sub style={{fontSize:subScale}}>eff</sub>
            <span style={{fontStyle:"normal",margin:"0 clamp(3px,0.4vw,7px)",color:blueDim(t1L)}}>:=</span>
          </span>

          {/* −log F_gated */}
          <span style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: leftSize,
            color: blue(t2L * 0.9), whiteSpace: "nowrap",
            opacity: t2L, transform: `translateY(${(1-t2L)*6}px)`,
          }}>
            − log F<sub style={{fontSize:subScale}}>gated</sub>
          </span>

          {/* −log C_eff */}
          <span style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: leftSize,
            color: blue(t3L * 0.9), whiteSpace: "nowrap",
            opacity: t3L, transform: `translateY(${(1-t3L)*6}px)`,
          }}>
            − log C<sub style={{fontSize:subScale}}>eff</sub>
          </span>

          {/* −log D̂ */}
          <span style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: leftSize,
            color: blue(t4L * 0.9), whiteSpace: "nowrap",
            opacity: t4L, transform: `translateY(${(1-t4L)*6}px)`,
          }}>
            − log D̂
          </span>
        </div>

        {/* ── FUNNEL LABEL (center gap) ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          minWidth: "clamp(100px,16vw,200px)",
          opacity: funnelT > 0.3 ? easeOut((funnelT-0.3)/0.7) : 0,
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: CINZEL, fontSize: labelSize,
            letterSpacing: "0.3em", color: `rgba(160,205,245,0.7)`,
            textAlign: "center", lineHeight: 1.6,
          }}>
            LOGARITHMIC<br/>TRANSFORMATION
          </div>
        </div>

        {/* ── RIGHT: Ψ = R₁₂ × (C_eff · D̂) ── */}
        <div style={{
          display: "flex", flexDirection: "row",
          alignItems: "center", gap: "clamp(4px,0.5vw,8px)",
          opacity: rightT,
          transform: `translateX(${(1-easeOut(rightT))*24}px)`,
          flexShrink: 0,
        }}>
          {/* Ψ */}
          <span style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: psiSize,
            color: goldBright(t1R), lineHeight: 1,
            opacity: t1R, transform: `scale(${0.85+t1R*0.15})`,
            display: "inline-block",
            textShadow: `0 0 50px rgba(201,168,76,${t1R*0.6}),0 0 100px rgba(201,168,76,${t1R*0.25})`,
            letterSpacing: 2,
          }}>Ψ</span>

          {/* = */}
          <span style={{
            fontFamily: CORRO, fontStyle: "normal", fontSize: eqSize,
            color: gold(t1R*0.7), opacity: t1R,
            margin: "0 clamp(4px,0.5vw,10px)",
          }}>=</span>

          {/* R₁₂ × */}
          <span style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: eqSize,
            color: gold(t2R*0.9), opacity: t2R,
            transform: `translateX(${(1-t2R)*12}px)`, whiteSpace: "nowrap",
            textShadow: `0 0 28px rgba(201,168,76,${t2R*0.28})`,
          }}>
            R<sub style={{fontSize:subScale}}>12</sub>
            <span style={{fontStyle:"normal",margin:"0 clamp(4px,0.6vw,9px)",color:gold(t2R*0.6)}}>×</span>
          </span>

          {/* (C_eff · D̂) */}
          <span style={{
            fontFamily: CORRO, fontStyle: "italic", fontSize: eqSize,
            color: gold(t3R*0.9), opacity: t3R,
            transform: `translateX(${(1-t3R)*12}px)`, whiteSpace: "nowrap",
            textShadow: `0 0 28px rgba(201,168,76,${t3R*0.28})`,
          }}>
            <span style={{color:gold(t3R*0.45),fontStyle:"normal"}}>(</span>
            C<sub style={{fontSize:subScale}}>eff</sub>
            <span style={{margin:"0 clamp(3px,0.4vw,6px)",color:gold(t3R*0.6)}}>·</span>
            D̂
            <span style={{color:gold(t3R*0.45),fontStyle:"normal"}}>)</span>
          </span>
        </div>
      </div>

      {/* EQUAL — below the equation */}
      {equalT > 0 && (
        <div style={{
          marginTop: "clamp(28px,4vw,52px)",
          fontFamily: CINZEL,
          fontSize: "clamp(22px,3.5vw,48px)",
          letterSpacing: "0.42em",
          color: `rgba(200,200,218,${easeOut(equalT)*0.88})`,
          textShadow: `0 0 60px rgba(180,200,230,${easeOut(equalT)*0.12})`,
          opacity: easeOut(equalT),
          transform: `translateY(${(1-easeOut(equalT))*24}px)`,
        }}>
          EQUAL
        </div>
      )}
    </div>
  );
}

// ── Quote layer ───────────────────────────────────────────────
function QuoteLayer({ t, buttonT, isMobile }) {
  if (t <= 0) return null;
  const te = easeOut(t);
  const [hover, setHover] = useState(false);
  const bt = easeOut(buttonT ?? 0);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 clamp(28px,8vw,120px)",
      gap: "clamp(32px,5vh,56px)",
      opacity: te,
    }}>
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "clamp(8px,1.8vh,18px)",
        maxWidth: 680, textAlign: "center",
      }}>
        {QUOTE_PARTS.map((part, i) => {
          const partT = easeOut(Math.max(0, Math.min(1, (t - i * 0.14) / 0.4)));
          return (
            <div key={i} style={{
              fontFamily: CORRO, fontStyle: "italic", fontWeight: 300,
              fontSize: i === 0 ? "clamp(18px,3.8vw,32px)" : "clamp(14px,2.8vw,24px)",
              letterSpacing: i === 0 ? "0.06em" : "0.03em",
              lineHeight: 1.5,
              color: i === 0
                ? `rgba(232,232,240,${partT * 0.88})`
                : `rgba(200,200,215,${partT * 0.62})`,
              opacity: partT,
              transform: `translateY(${(1 - partT) * 12}px)`,
              textShadow: i === 0 ? `0 0 60px rgba(201,168,76,${partT * 0.08})` : "none",
            }}>
              {part}
            </div>
          );
        })}
      </div>

      {bt > 0 && (
        <div style={{ opacity: bt, transform: `translateY(${(1 - bt) * 18}px)` }}>
          <a
            href="https://educationrevelation.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: "inline-block",
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(10px,2.2vw,13px)",
              letterSpacing: "0.45em",
              textDecoration: "none",
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
            }}
          >
            FIND YOUR TRUTH
          </a>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function EquationReveal({ onComplete }) {
  const canvasRef    = useRef(null);
  const rafRef       = useRef(null);
  const startRef     = useRef(null);
  const pfRef        = useRef(null);
  const doneRef      = useRef(false);

  const [phases, setPhases] = useState({
    t: 0,
    leftT:0, funnelT:0, rightT:0, equalT:0,
    eqFadeOut:1, quoteT:0, buttonT:0,
    t1L:0, t2L:0, t3L:0, t4L:0,
    t1R:0, t2R:0, t3R:0,
  });
  const [dims, setDims] = useState({ W: window.innerWidth, H: window.innerHeight });
  const isMobile = dims.W < 640;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      setDims({ W: canvas.width, H: canvas.height });
      if (!pfRef.current) pfRef.current = new ParticleField(canvas.width, canvas.height);
      else pfRef.current.reset(canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function loop(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = elapsed / TOTAL_MS;

      const vE    = 1500  / TOTAL_MS;
      const lE    = 5000  / TOTAL_MS;
      const fE    = 7500  / TOTAL_MS;
      const rE    = 11000 / TOTAL_MS;
      const eqE   = 13000 / TOTAL_MS;
      const holdE = 15000 / TOTAL_MS; // equation holds
      const fadeE = 16500 / TOTAL_MS; // equation fades to black
      const qE    = 17500 / TOTAL_MS; // quote begins

      const leftT   = smootherstep(Math.max(0, Math.min(1, (t - vE)     / (lE   - vE))));
      const funnelT = smootherstep(Math.max(0, Math.min(1, (t - lE)     / (fE   - lE))));
      const rightT  = smootherstep(Math.max(0, Math.min(1, (t - fE)     / (rE   - fE))));
      const equalT  = smootherstep(Math.max(0, Math.min(1, (t - rE)     / (eqE  - rE))));

      // Equation fades out after hold
      const eqFadeOut = t > holdE
        ? 1 - smootherstep(Math.max(0, Math.min(1, (t - holdE) / (fadeE - holdE))))
        : 1;

      // Quote phase
      const quoteT  = smootherstep(Math.max(0, Math.min(1, (t - qE) / (1 - qE))));
      const buttonT = smootherstep(Math.max(0, Math.min(1, (t - (qE + 0.055)) / 0.09)));

      // Left terms stagger
      const lDur = lE - vE;
      const t1L = easeOut(Math.max(0, Math.min(1, (t - vE)              / (lDur * 0.35))));
      const t2L = easeOut(Math.max(0, Math.min(1, (t - vE - lDur*0.18) / (lDur * 0.35))));
      const t3L = easeOut(Math.max(0, Math.min(1, (t - vE - lDur*0.36) / (lDur * 0.35))));
      const t4L = easeOut(Math.max(0, Math.min(1, (t - vE - lDur*0.54) / (lDur * 0.35))));

      // Right terms stagger
      const rDur = rE - fE;
      const t1R = easeOut(Math.max(0, Math.min(1, (t - fE)              / (rDur * 0.4))));
      const t2R = easeOut(Math.max(0, Math.min(1, (t - fE - rDur*0.25) / (rDur * 0.4))));
      const t3R = easeOut(Math.max(0, Math.min(1, (t - fE - rDur*0.50) / (rDur * 0.4))));

      drawCanvas(ctx, canvas.width, canvas.height, t, elapsed, pfRef.current);

      setPhases({ t, leftT, funnelT, rightT, equalT, eqFadeOut, quoteT, buttonT, t1L, t2L, t3L, t4L, t1R, t2R, t3R });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        if (!doneRef.current) { doneRef.current = true; onComplete?.(); }
      }
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#03030a" }}>
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%", display: "block",
      }} />

      {/* Equation — fades out */}
      <div style={{ position:"absolute", inset:0, opacity: phases.eqFadeOut ?? 1, transition:"none" }}>
        {/* Ψ background glow */}
        {phases.rightT > 0 && (
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(ellipse at 60% 50%,
              rgba(201,168,76,${phases.t1R*0.045}) 0%,
              transparent 60%)`,
          }} />
        )}
        <EquationLayer phases={phases} W={dims.W} H={dims.H} isMobile={isMobile} />
      </div>

      {/* Quote */}
      <QuoteLayer t={phases.quoteT ?? 0} buttonT={phases.buttonT ?? 0} isMobile={isMobile} />

      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.026,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 68%, rgba(0,0,0,0.82) 100%)",
      }} />
    </div>
  );
}
