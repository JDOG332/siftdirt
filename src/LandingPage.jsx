/**
 * LANDING PAGE — Layer 0
 * Vitruvian Man gyroscope animation.
 * ENTER  → existing intro → truth flow
 *
 * ⚠️  THE VITRUVIAN CANVAS CODE IS COMPLETE & PERFECT
 *     BASED ON LEONARDO DA VINCI'S OWN MATH — DO NOT MODIFY
 */

import React, { useEffect, useRef, useState } from "react";
import InfinityCursor from "./InfinityCursor.jsx";

const PHI  = 1.6180339887;
const TAU  = Math.PI * 2;
const GOLD = (a) => `rgba(201,168,76,${a.toFixed(3)})`;
const WHITE = (a) => `rgba(220,215,200,${a.toFixed(3)})`;

// ─── VITRUVIAN CANVAS — DO NOT MODIFY ─────────────────────────────────────────
function VitruvianCanvas({ stateRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, cx, cy, R, raf;

    function resize() {
      const el = canvas.parentElement;
      W = canvas.width  = el.offsetWidth;
      H = canvas.height = el.offsetHeight;
      cx = W / 2; cy = H / 2;
      R = Math.min(W, H) * 0.38;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    // ── 3D helpers ──
    function rotX([x,y,z], a) { return [x, y*Math.cos(a)-z*Math.sin(a), y*Math.sin(a)+z*Math.cos(a)]; }
    function rotY([x,y,z], a) { return [x*Math.cos(a)+z*Math.sin(a), y, -x*Math.sin(a)+z*Math.cos(a)]; }
    function rotZ([x,y,z], a) { return [x*Math.cos(a)-y*Math.sin(a), x*Math.sin(a)+y*Math.cos(a), z]; }
    function xf(p, rx, ry, rz) { return rotZ(rotY(rotX(p, rx), ry), rz); }
    function proj([x,y,z]) {
      const s = 2.4 / (2.4 + z * 0.4);
      return [cx + x * R * s, cy - y * R * s, z];
    }
    function depthAlpha(z) { return 0.15 + 0.75 * ((z + 1) / 2); }

    // ══════════════════════════════════════════════════════════════
    // EXACT DA VINCI VITRUVIAN MAN GEOMETRY
    // ══════════════════════════════════════════════════════════════
    //
    // Two shapes, two truths, one man between them:
    //
    //   SQUARE = Earth. Center = genitals. Arms horizontal → fingertips
    //            touch the SIDES of the square exactly. Feet straight down
    //            → touch the BOTTOM of the square exactly.
    //
    //   CIRCLE = Cosmos. Center = navel (our canvas origin, y=0).
    //            Arms raised 33° → fingertips on the circle exactly (verified).
    //            Legs spread 30° → feet on the circle exactly (verified).
    //            Da Vinci: "space between legs = equilateral triangle."
    //
    // Circle radius R = 0.70 (canvas units, FIXED — cosmos does not change size).
    // Square side   H = R / (137/225) = 1.1496 (da Vinci measured ratio).
    // Square is offset DOWN: bottom = -R (tangent to circle bottom).
    // Square corners are OUTSIDE the circle (verified: dist = 0.906 > 0.70).
    //
    // The man breathes between them. Neither shape moves. Only he moves.
    //
    // ALL VALUES COMPUTED AND VERIFIED via quadratic geometry:
    //   SX=0.10, SY=0.23, AR=0.4748 → T-pose tip x = SQ_HW ✓, 33° tip dist = 0.700 ✓
    //   HX=0.08, HY=-0.3711, LR=0.3289 → T-pose foot y = -0.700 ✓, 30° foot dist = 0.700 ✓
    // ══════════════════════════════════════════════════════════════

    // ── Shape constants (FIXED — never change with breath) ──
    const R_CIRC = 0.70;
    const SQ_RATIO = 137/225;              // da Vinci's measured ratio R/H
    const SQ_H = R_CIRC / SQ_RATIO;       // square side = man's height = 1.1496
    const SQ_HW = SQ_H / 2;               // square half-width = 0.5748
    const SQ_BOT = -R_CIRC;               // square bottom = -R (tangent to circle!)
    const SQ_TOP = SQ_BOT + SQ_H;         // square top = head level = +0.4496

    // ── Body constants ──
    const SX = 0.10,     SY = 0.23;       // shoulder: narrow so arm can reach circle
    const HX = 0.08,     HY = -0.3711;    // hip joint (lower = equilateral triangle)
    const AR  = SQ_HW - SX;               // arm reach: T-pose fingertip = SQ_HW exactly
    const LR  = 0.3289;                   // leg reach: T-pose foot y = -0.70 exactly
    const ELBOW = AR * 0.50;              // elbow at midpoint
    const KNEE  = LR * 0.52;              // knee at 52%
    const HEAD_Y = SQ_TOP - (SQ_H / 16); // head center = square top minus one head-unit
    const HEAD_R_NORM = SQ_H / 16;        // head radius (1/16 of height = 0.072)

    // ── T-pose angles (touches SQUARE) ──
    const ARM_T = 0;                       // arms horizontal
    const LEG_T = 0;                       // legs straight down

    // ── X-pose angles (touches CIRCLE) — verified by quadratic solve ──
    const ARM_X = 34.35 * Math.PI / 180;  // 34.35° raise → fingertips on circle (dist=0.70000, verified)
    const LEG_X = 30 * Math.PI / 180;     // 30° spread → feet on circle (dist=0.700)
                                           // da Vinci: "space between legs = equilateral △"

    function figure(breath) {
      // Breath 0 = T-pose (SQUARE), Breath 1 = X-pose (CIRCLE)
      const armA = ARM_T + breath * (ARM_X - ARM_T);  // 0° → 33°
      const legA = LEG_T + breath * (LEG_X - LEG_T);  // 0° → 30°

      const ac = Math.cos(armA), as_a = Math.sin(armA);
      const lc = Math.cos(legA), ls   = Math.sin(legA);

      return {
        // Head center — top of square
        head: [0, HEAD_Y, 0],

        // Neck — connects head base to shoulder bar
        neck: [[0, HEAD_Y - HEAD_R_NORM, 0], [0, SY + 0.008, 0]],

        // Shoulder crossbar
        shoulders: [[-SX, SY, 0], [SX, SY, 0]],

        // Torso sides — shoulder → waist (navel) → hip
        lTorso: [[-SX, SY, 0], [-0.06, 0.01, 0], [-HX, HY, 0]],
        rTorso: [[ SX, SY, 0], [ 0.06, 0.01, 0], [ HX, HY, 0]],

        // Hip crossbar
        hips: [[-HX, HY, 0], [HX, HY, 0]],

        // Arms — shoulder → elbow → fingertip
        // T-pose: tip at (±SQ_HW, SY) — exactly touching square SIDES
        // X-pose: tip at 33° — exactly on circle (verified: dist=0.700)
        lArm: [
          [-SX,                SY,              0],
          [-(SX + ELBOW*ac),   SY + ELBOW*as_a, 0],
          [-(SX + AR*ac),      SY + AR*as_a,    0],
        ],
        rArm: [
          [ SX,                SY,              0],
          [ SX + ELBOW*ac,     SY + ELBOW*as_a, 0],
          [ SX + AR*ac,        SY + AR*as_a,    0],
        ],

        // Legs — hip → knee → foot (spread from straight down)
        // T-pose: foot at (±HX, -0.70) — exactly touching square BOTTOM
        // X-pose: foot at 30° — exactly on circle (verified: dist=0.700)
        lLeg: [
          [-HX,               HY,              0],
          [-(HX + KNEE*ls),   HY - KNEE*lc,    0],
          [-(HX + LR*ls),     HY - LR*lc,      0],
        ],
        rLeg: [
          [ HX,               HY,              0],
          [ HX + KNEE*ls,     HY - KNEE*lc,    0],
          [ HX + LR*ls,       HY - LR*lc,      0],
        ],
      };
    }

    function drawLimb(pts, rx, ry, rz, alpha, breath) {
      const mapped = pts.map(p => proj(xf(p, rx, ry, rz)));
      const z = mapped.reduce((s, p) => s + p[2], 0) / mapped.length;
      const a = depthAlpha(z) * alpha;
      ctx.save();
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(mapped[0][0], mapped[0][1]);
      for (let i = 1; i < mapped.length; i++) ctx.lineTo(mapped[i][0], mapped[i][1]);
      ctx.strokeStyle = WHITE(a);
      ctx.lineWidth = 2.4 + breath * 1.4;
      ctx.stroke();
      ctx.restore();
    }

    let t = 0;

    function frame() {
      ctx.clearRect(0, 0, W, H);
      t += 0.0035;

      // PHI breath — 5.6s inhale / 5.6s exhale (11.2s full cycle)
      // freq = 2π / (11.2s × 0.21 units/s) = 2.672 rad/unit
      const breath = (Math.sin(t * 2.672) + 1) / 2; // 0→1→0 per cycle

      // PHI-ratio gyroscopic rotation — never repeats
      const rx = t * 1.0;
      const ry = t * PHI;
      const rz = t * (PHI * PHI);
      // Export live rotation state for seamless IntroCanvas handoff
      if (stateRef) stateRef.current = { rx, ry, rz };

      // Figure driven purely by breath — snow angel at PHI breathing rate
      const fig = figure(breath);

      // ══════════════════════════════════════════════════
      // CIRCLE — COSMOS — center at navel (0,0), FIXED SIZE
      // Glows brighter when man opens and touches it (breath→1)
      // ══════════════════════════════════════════════════
      const circPts = Array.from({length: 65}, (_, i) => {
        const a = (i / 64) * TAU;
        return proj(xf([Math.cos(a)*R_CIRC, Math.sin(a)*R_CIRC, 0], rx, ry, rz));
      });
      const circZ = circPts.reduce((s,p)=>s+p[2],0)/circPts.length;
      ctx.beginPath();
      ctx.moveTo(circPts[0][0], circPts[0][1]);
      circPts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
      ctx.closePath();
      // Cosmos awakens when man touches it
      ctx.strokeStyle = GOLD(depthAlpha(circZ) * (0.22 + breath * 0.55));
      ctx.lineWidth = 1.6 + breath * 1.4; ctx.stroke();

      // ══════════════════════════════════════════════════
      // SQUARE — EARTH — exact da Vinci proportions, FIXED
      // Center = genitals (not navel). Bottom tangent to circle.
      // Side = man's height. Corners OUTSIDE the circle.
      // Glows brighter when man is in T-pose touching it (breath→0)
      // ══════════════════════════════════════════════════
      const sqCorners = [
        [-SQ_HW, SQ_TOP, 0], [ SQ_HW, SQ_TOP, 0],
        [ SQ_HW, SQ_BOT, 0], [-SQ_HW, SQ_BOT, 0],
      ].map(p => proj(xf(p, rx, ry, rz)));
      const sqZ = sqCorners.reduce((s,p)=>s+p[2],0)/sqCorners.length;
      ctx.beginPath();
      ctx.moveTo(sqCorners[0][0], sqCorners[0][1]);
      sqCorners.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
      ctx.closePath();
      // Earth awakens when man stands in it
      ctx.strokeStyle = GOLD(depthAlpha(sqZ) * (0.18 + (1 - breath) * 0.50));
      ctx.lineWidth = 1.6 + (1 - breath) * 1.4; ctx.stroke();

      // ── Figure ──
      // Body parts — use consistent alpha levels matching da Vinci ink weight
      drawLimb(fig.lArm,     rx, ry, rz, 0.88, breath);
      drawLimb(fig.rArm,     rx, ry, rz, 0.88, breath);
      drawLimb(fig.lLeg,     rx, ry, rz, 0.85, breath);
      drawLimb(fig.rLeg,     rx, ry, rz, 0.85, breath);
      drawLimb(fig.lTorso,   rx, ry, rz, 0.82, breath);
      drawLimb(fig.rTorso,   rx, ry, rz, 0.82, breath);
      drawLimb(fig.shoulders,rx, ry, rz, 0.75, breath);
      drawLimb(fig.hips,     rx, ry, rz, 0.72, breath);
      drawLimb(fig.neck,     rx, ry, rz, 0.80, breath);

      // Head — fixed circle, top of the square (head top = square top)
      const hc = proj(xf(fig.head, rx, ry, rz));
      const hr = R * HEAD_R_NORM;   // head radius in pixels (1/16 of height)
      ctx.beginPath();
      ctx.arc(hc[0], hc[1], hr, 0, TAU);
      ctx.strokeStyle = WHITE(depthAlpha(hc[2]) * 0.90);
      ctx.lineWidth = 2.0 + breath * 0.8; ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2.2, 0, TAU);
      ctx.fillStyle = GOLD(0.35); ctx.fill();

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}
// ─── END VITRUVIAN CANVAS — DO NOT MODIFY ABOVE ──────────────────────────────


// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE — Redesigned wrapper around the sacred geometry
// ═══════════════════════════════════════════════════════════════════════════════

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

export default function LandingPage({ onStart }) {
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const vitStateRef = useRef({ rx: 0, ry: 0, rz: 0 });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "radial-gradient(ellipse at 50% 38%, rgba(14,10,28,1) 0%, #030306 72%)",
      overflow: "hidden",
      fontFamily: "'Cinzel', serif",
    }}>

      <InfinityCursor />

      <style>{`
        .title-glow { animation: goldPulse 11.2s ease-in-out infinite; }
        .btn-pulse { animation: btnPulse 3.2s ease-in-out infinite; }
        @keyframes btnPulse {
          0%,100% { box-shadow: 0 0 18px rgba(201,168,76,0.18), 0 0 40px rgba(201,168,76,0.06); }
          50%     { box-shadow: 0 0 28px rgba(201,168,76,0.38), 0 0 70px rgba(201,168,76,0.15); }
        }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: "60vmin", height: "60vmin",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 68%)",
        pointerEvents: "none",
      }} />

      {/* Sacred geometry */}
      <div style={{ position: "absolute", inset: 0 }}>
        <VitruvianCanvas stateRef={vitStateRef} />
      </div>

      {/* ── SIFTDIRT.COM — top ── */}
      <div style={{
        position: "absolute",
        top: "9.02vh",
        left: "50%", transform: "translateX(-50%)",
        opacity: visible ? 1 : 0,
        transition: `opacity 1.618s 0.236s ${EASE}`,
        pointerEvents: "none",
        zIndex: 5,
      }}>
        <div className="title-glow" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(16px, 2.4vmin, 24px)",
          letterSpacing: "0.618em",
          fontWeight: 600,
          color: "rgba(201,168,76,0.88)",
        }}>
          SIFTDIRT.COM
        </div>
      </div>

      {/* ── Tagline + START — bottom ── */}
      <div style={{
        position: "absolute",
        bottom: "9.02vh",
        left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        gap: "3.82vh",
        opacity: visible ? 1 : 0,
        transition: `opacity 1.618s 0.618s ${EASE}`,
        zIndex: 10,
      }}>
        {/* Tagline */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(18px, 3.2vmin, 28px)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "rgba(232,228,210,0.88)",
          textShadow: "0 0 18px rgba(232,228,210,0.38), 0 0 50px rgba(232,228,210,0.14)",
          letterSpacing: "0.04em",
          textAlign: "center",
          lineHeight: 1.618,
        }}>
          The universe observes itself through infinite lenses.
        </div>

        {/* START */}
        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => onStart(vitStateRef.current)}
          className={hover ? "" : "btn-pulse"}
          style={{
            background: hover
              ? "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 80%)"
              : "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 80%)",
            border: `1px solid rgba(201,168,76,${hover ? 0.88 : 0.50})`,
            borderRadius: 2,
            padding: "0.618rem 2.618rem",
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(14px, 2vmin, 18px)",
            letterSpacing: "0.618em",
            fontWeight: 600,
            color: `rgba(201,168,76,${hover ? 1.0 : 0.78})`,
            cursor: "pointer",
            transition: `all 618ms ${EASE}`,
            boxShadow: hover
              ? "0 0 40px rgba(201,168,76,0.32), 0 0 80px rgba(201,168,76,0.12), inset 0 0 20px rgba(201,168,76,0.06)"
              : undefined,
            textShadow: hover
              ? "0 0 20px rgba(201,168,76,0.72)"
              : "0 0 10px rgba(201,168,76,0.28)",
          }}
        >
          START
        </button>
      </div>
    </div>
  );
}
