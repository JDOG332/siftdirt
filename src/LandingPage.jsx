/**
 * LANDING PAGE — Layer 0
 * ⚠️ VITRUVIAN CANVAS CODE IS COMPLETE & PERFECT — DO NOT MODIFY
 * Wrapper UI: 100% Φ Design System compliant
 */

import React, { useEffect, useRef, useState } from "react";
import InfinityCursor from "./InfinityCursor.jsx";
import { F, S, A, GOLD, IVORY, EASE, DISPLAY_STYLE, ACCENT_STYLE } from "./phi.js";

const PHI  = 1.6180339887;
const TAU  = Math.PI * 2;
const GOLDC = (a) => `rgba(201,168,76,${a.toFixed(3)})`;
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

    function rotX([x,y,z], a) { return [x, y*Math.cos(a)-z*Math.sin(a), y*Math.sin(a)+z*Math.cos(a)]; }
    function rotY([x,y,z], a) { return [x*Math.cos(a)+z*Math.sin(a), y, -x*Math.sin(a)+z*Math.cos(a)]; }
    function rotZ([x,y,z], a) { return [x*Math.cos(a)-y*Math.sin(a), x*Math.sin(a)+y*Math.cos(a), z]; }
    function xf(p, rx, ry, rz) { return rotZ(rotY(rotX(p, rx), ry), rz); }
    function proj([x,y,z]) {
      const s = 2.4 / (2.4 + z * 0.4);
      return [cx + x * R * s, cy - y * R * s, z];
    }
    function depthAlpha(z) { return 0.15 + 0.75 * ((z + 1) / 2); }

    const R_CIRC = 0.70;
    const SQ_RATIO = 137/225;
    const SQ_H = R_CIRC / SQ_RATIO;
    const SQ_HW = SQ_H / 2;
    const SQ_BOT = -R_CIRC;
    const SQ_TOP = SQ_BOT + SQ_H;

    const SX = 0.10, SY = 0.23;
    const HX = 0.08, HY = -0.3711;
    const AR  = SQ_HW - SX;
    const LR  = 0.3289;
    const ELBOW = AR * 0.50;
    const KNEE  = LR * 0.52;
    const HEAD_Y = SQ_TOP - (SQ_H / 16);
    const HEAD_R_NORM = SQ_H / 16;

    const ARM_T = 0;
    const LEG_T = 0;
    const ARM_X = 34.35 * Math.PI / 180;
    const LEG_X = 30 * Math.PI / 180;

    function figure(breath) {
      const armA = ARM_T + breath * (ARM_X - ARM_T);
      const legA = LEG_T + breath * (LEG_X - LEG_T);
      const ac = Math.cos(armA), as_a = Math.sin(armA);
      const lc = Math.cos(legA), ls   = Math.sin(legA);
      return {
        head: [0, HEAD_Y, 0],
        neck: [[0, HEAD_Y - HEAD_R_NORM, 0], [0, SY + 0.008, 0]],
        shoulders: [[-SX, SY, 0], [SX, SY, 0]],
        lTorso: [[-SX, SY, 0], [-0.06, 0.01, 0], [-HX, HY, 0]],
        rTorso: [[ SX, SY, 0], [ 0.06, 0.01, 0], [ HX, HY, 0]],
        hips: [[-HX, HY, 0], [HX, HY, 0]],
        lArm: [[-SX, SY, 0], [-(SX + ELBOW*ac), SY + ELBOW*as_a, 0], [-(SX + AR*ac), SY + AR*as_a, 0]],
        rArm: [[ SX, SY, 0], [ SX + ELBOW*ac, SY + ELBOW*as_a, 0], [ SX + AR*ac, SY + AR*as_a, 0]],
        lLeg: [[-HX, HY, 0], [-(HX + KNEE*ls), HY - KNEE*lc, 0], [-(HX + LR*ls), HY - LR*lc, 0]],
        rLeg: [[ HX, HY, 0], [ HX + KNEE*ls, HY - KNEE*lc, 0], [ HX + LR*ls, HY - LR*lc, 0]],
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
      const breath = (Math.sin(t * 2.672) + 1) / 2;
      const rx = t * 1.0;
      const ry = t * PHI;
      const rz = t * (PHI * PHI);
      if (stateRef) stateRef.current = { rx, ry, rz };
      const fig = figure(breath);

      const circPts = Array.from({length: 65}, (_, i) => {
        const a = (i / 64) * TAU;
        return proj(xf([Math.cos(a)*R_CIRC, Math.sin(a)*R_CIRC, 0], rx, ry, rz));
      });
      const circZ = circPts.reduce((s,p)=>s+p[2],0)/circPts.length;
      ctx.beginPath();
      ctx.moveTo(circPts[0][0], circPts[0][1]);
      circPts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
      ctx.closePath();
      ctx.strokeStyle = GOLDC(depthAlpha(circZ) * (0.22 + breath * 0.55));
      ctx.lineWidth = 1.6 + breath * 1.4; ctx.stroke();

      const sqCorners = [
        [-SQ_HW, SQ_TOP, 0], [ SQ_HW, SQ_TOP, 0],
        [ SQ_HW, SQ_BOT, 0], [-SQ_HW, SQ_BOT, 0],
      ].map(p => proj(xf(p, rx, ry, rz)));
      const sqZ = sqCorners.reduce((s,p)=>s+p[2],0)/sqCorners.length;
      ctx.beginPath();
      ctx.moveTo(sqCorners[0][0], sqCorners[0][1]);
      sqCorners.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
      ctx.closePath();
      ctx.strokeStyle = GOLDC(depthAlpha(sqZ) * (0.18 + (1 - breath) * 0.50));
      ctx.lineWidth = 1.6 + (1 - breath) * 1.4; ctx.stroke();

      drawLimb(fig.lArm, rx, ry, rz, 0.88, breath);
      drawLimb(fig.rArm, rx, ry, rz, 0.88, breath);
      drawLimb(fig.lLeg, rx, ry, rz, 0.85, breath);
      drawLimb(fig.rLeg, rx, ry, rz, 0.85, breath);
      drawLimb(fig.lTorso, rx, ry, rz, 0.82, breath);
      drawLimb(fig.rTorso, rx, ry, rz, 0.82, breath);
      drawLimb(fig.shoulders, rx, ry, rz, 0.75, breath);
      drawLimb(fig.hips, rx, ry, rz, 0.72, breath);
      drawLimb(fig.neck, rx, ry, rz, 0.80, breath);

      const hc = proj(xf(fig.head, rx, ry, rz));
      const hr = R * HEAD_R_NORM;
      ctx.beginPath();
      ctx.arc(hc[0], hc[1], hr, 0, TAU);
      ctx.strokeStyle = WHITE(depthAlpha(hc[2]) * 0.90);
      ctx.lineWidth = 2.0 + breath * 0.8; ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 2.2, 0, TAU);
      ctx.fillStyle = GOLDC(0.35); ctx.fill();

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
// LANDING PAGE WRAPPER — 100% Φ Design System
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingPage({ onStart }) {
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const vitStateRef = useRef({ rx: 0, ry: 0, rz: 0 });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "radial-gradient(ellipse at 50% 38.2%, rgba(14,10,28,1) 0%, #030306 61.8%)",
      overflow: "hidden",
    }}>

      <InfinityCursor />

      <style>{`
        .title-glow { animation: goldPulse 11.2s ease-in-out infinite; }
        .btn-pulse { animation: btnBreath 4.236s ease-in-out infinite; }
        @keyframes btnBreath {
          0%,100% { box-shadow: 0 0 ${S.sm} rgba(201,168,76,${A.ghost}); }
          50%     { box-shadow: 0 0 ${S.lg} rgba(201,168,76,${A.ghost}); }
        }
      `}</style>

      {/* Ambient glow — φ-scaled */}
      <div style={{
        position: "absolute",
        width: "61.8vmin", height: "61.8vmin",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(201,168,76,${A.ghost}) 0%, transparent 61.8%)`,
        pointerEvents: "none",
      }} />

      {/* Sacred geometry */}
      <div style={{ position: "absolute", inset: 0 }}>
        <VitruvianCanvas stateRef={vitStateRef} />
      </div>

      {/* SIFTDIRT.COM — positioned at φ^-5 from top */}
      <div style={{
        position: "absolute",
        top: "9.02vh",
        left: "50%", transform: "translateX(-50%)",
        opacity: visible ? A.full : 0,
        transition: `opacity 1.618s ${S.xs} ${EASE}`,
        pointerEvents: "none",
        zIndex: 5,
      }}>
        <div className="title-glow" style={{
          ...DISPLAY_STYLE,
          fontSize: S.md,
          color: GOLD(A.phi),
        }}>
          SIFTDIRT.COM
        </div>
      </div>

      {/* Tagline + START — positioned at φ^-5 from bottom */}
      <div style={{
        position: "absolute",
        bottom: "9.02vh",
        left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        gap: S.lg,
        opacity: visible ? A.full : 0,
        transition: `opacity 1.618s ${S.xs} ${EASE}`,
        zIndex: 10,
      }}>
        {/* Tagline — accent font */}
        <div style={{
          ...ACCENT_STYLE,
          fontSize: S.md,
          color: IVORY(A.phi),
          textShadow: `0 0 ${S.sm} rgba(232,228,210,${A.ghost})`,
          textAlign: "center",
        }}>
          The universe observes itself through infinite lenses.
        </div>

        {/* START — display font */}
        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => onStart(vitStateRef.current)}
          className={hover ? "" : "btn-pulse"}
          style={{
            background: hover
              ? `radial-gradient(ellipse, rgba(201,168,76,${A.ghost}) 0%, transparent 61.8%)`
              : "transparent",
            border: `1px solid ${GOLD(hover ? A.phi : A.ghost)}`,
            borderRadius: S._3xs,
            padding: `${S.xs} ${S.lg}`,
            ...DISPLAY_STYLE,
            fontSize: S.sm,
            color: GOLD(hover ? A.full : A.phi),
            cursor: "pointer",
            transition: `all 618ms ${EASE}`,
            boxShadow: hover
              ? `0 0 ${S.xl} rgba(201,168,76,${A.ghost}), inset 0 0 ${S.md} rgba(201,168,76,${A.ghost})`
              : undefined,
          }}
        >
          START
        </button>
      </div>
    </div>
  );
}
