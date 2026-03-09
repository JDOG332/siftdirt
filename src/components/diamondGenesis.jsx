/**
 * DIAMOND GENESIS — Pressurized crystallization at microscopic scale
 *
 * The inverse of the universe page:
 *   Universe = expansion outward (PHI⁺ⁿ)
 *   Diamond  = compression inward (PHI⁻ⁿ)
 *
 * Two modes:
 *   INTRO: standalone animation, fires onComplete when done
 *   BACKGROUND: depth-driven with camera phases (mirrors dreamMultiverse)
 */

import { useRef, useEffect } from "react";
import { PHI, PHI_INV } from "../data.js";

const PHI_2 = PHI * PHI;
const PHI_NEG2 = PHI_INV * PHI_INV;
const PHI_NEG3 = PHI_INV * PHI_INV * PHI_INV;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Intro mode phase boundaries (seconds)
const INTRO_A = PHI_2;                // 2.618 — chaos ends
const INTRO_B = INTRO_A + PHI_2;      // 5.236 — compression ends
const INTRO_C = INTRO_B + PHI;        // 6.854 — crystallization ends
const INTRO_D = INTRO_C + PHI;        // 8.472 — refraction ends
const INTRO_SIGNAL = INTRO_C + 0.618; // 7.472

// Background mode camera timing (matches dreamMultiverse exactly)
const CAM_A_START = 0.618, CAM_A_END = 5.236;
const CAM_B_END = 8.472;
const CAM_C_END = CAM_B_END + 4.236; // 12.708

export default function DiamondGenesisCanvas({ depth, onComplete, onVeilParted }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const depthRef = useRef(depth);
  const onCompleteRef = useRef(onComplete);
  const onVeilPartedRef = useRef(onVeilParted);
  depthRef.current = depth;
  onCompleteRef.current = onComplete;
  onVeilPartedRef.current = onVeilParted;

  const isBackground = depth !== undefined;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 3);
    const ATOM_COUNT = isMobile ? 60 : 120;

    let W, H, CX, CY, BASE_R;

    function resize() {
      W = canvas.parentElement?.clientWidth || window.innerWidth;
      H = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      CX = W / 2;
      CY = H / 2;
      BASE_R = Math.min(W, H) * 0.30;
    }
    resize();
    window.addEventListener("resize", resize);

    // ═══════════════════════════════════════════════════════
    // BUILD LATTICE TARGETS — concentric hexagonal rings
    // ═══════════════════════════════════════════════════════

    const targets = [];
    targets.push({ x: 0, y: 0, shell: 0 });

    const rings = [
      { count: 6, r: PHI_NEG3, shell: 1 },
      { count: 12, r: PHI_NEG2, shell: 2 },
      { count: 18, r: PHI_INV, shell: 3 },
      { count: 24, r: 1.0, shell: 4 },
      { count: 30, r: PHI, shell: 5 },
    ];

    for (let ri = 0; ri < rings.length; ri++) {
      const { count, r, shell } = rings[ri];
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + GOLDEN_ANGLE * (ri + 1);
        targets.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, shell });
      }
    }

    while (targets.length < ATOM_COUNT) {
      const i = targets.length - 91;
      const a = (i / 36) * Math.PI * 2 + GOLDEN_ANGLE * 6;
      targets.push({ x: Math.cos(a) * PHI_2, y: Math.sin(a) * PHI_2, shell: 6 });
    }

    // ═══════════════════════════════════════════════════════
    // CREATE ATOMS
    // ═══════════════════════════════════════════════════════

    const atoms = [];
    const scatterR = Math.min(W, H) * 0.45;

    for (let i = 0; i < ATOM_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = scatterR * (0.3 + Math.random() * 0.7);
      const tgt = targets[i] || targets[targets.length - 1];

      atoms.push({
        x: CX + Math.cos(angle) * dist,
        y: CY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        tx: CX + tgt.x * BASE_R,
        ty: CY + tgt.y * BASE_R,
        shell: tgt.shell,
        size: tgt.shell === 0 ? 2.5 : tgt.shell <= 2 ? 1.8 : tgt.shell <= 4 ? 1.2 : 0.9,
        bonded: false,
        bondTime: 0,
      });
    }

    // ═══════════════════════════════════════════════════════
    // BONDS — nearest neighbors in lattice
    // ═══════════════════════════════════════════════════════

    const bonds = [];
    const bondThresh = BASE_R * PHI_INV * 0.6;

    for (let i = 0; i < ATOM_COUNT; i++) {
      for (let j = i + 1; j < ATOM_COUNT; j++) {
        const dx = atoms[i].tx - atoms[j].tx;
        const dy = atoms[i].ty - atoms[j].ty;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < bondThresh && Math.abs(atoms[i].shell - atoms[j].shell) <= 1) {
          bonds.push({ a: i, b: j, dist: d });
        }
      }
    }

    // ═══════════════════════════════════════════════════════
    // REFRACTION RAYS
    // ═══════════════════════════════════════════════════════

    const RAY_COUNT = 12;
    const rays = [];
    for (let i = 0; i < RAY_COUNT; i++) {
      const a = i * GOLDEN_ANGLE;
      rays.push({ angle: a, hue: (i / RAY_COUNT) * 360, length: BASE_R * (0.8 + Math.random() * 0.6) });
    }

    // ═══════════════════════════════════════════════════════
    // SHARED RENDERING
    // ═══════════════════════════════════════════════════════

    function smoothstep(t) {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    }

    // Simulate atoms given a formation progress (0=chaos, 0.5=compressing, 1=crystallized)
    function simulateAtoms(formationProgress, t) {
      for (let i = 0; i < atoms.length; i++) {
        const a = atoms[i];

        if (formationProgress < 0.33) {
          // Chaos: brownian motion
          a.vx += (Math.random() - 0.5) * 0.15;
          a.vy += (Math.random() - 0.5) * 0.15;
          a.vx += (CX - a.x) * 0.00003;
          a.vy += (CY - a.y) * 0.00003;
          a.vx *= 0.98;
          a.vy *= 0.98;
        } else if (formationProgress < 0.66) {
          // Compression: spring toward center
          const p = (formationProgress - 0.33) / 0.33;
          const k = 0.0003 + p * 0.002;
          a.vx += (CX - a.x) * k;
          a.vy += (CY - a.y) * k;
          a.vx *= 0.96 - p * 0.02;
          a.vy *= 0.96 - p * 0.02;
        } else if (!a.bonded) {
          // Crystallization: snap to lattice
          const dx = a.tx - a.x;
          const dy = a.ty - a.y;
          const p = (formationProgress - 0.66) / 0.34;
          const snapK = 0.08 + p * 0.12;
          a.vx += dx * snapK;
          a.vy += dy * snapK;
          a.vx *= 0.82;
          a.vy *= 0.82;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 3) {
            a.bonded = true;
            a.bondTime = t;
            a.x = a.tx;
            a.y = a.ty;
            a.vx = 0;
            a.vy = 0;
          }
        } else {
          // Bonded: gentle breathing
          const breathe = Math.sin(t * PHI * 2 + a.shell) * 0.3;
          a.x = a.tx + breathe;
          a.y = a.ty + breathe * PHI_INV;
          a.vx = 0;
          a.vy = 0;
        }

        a.x += a.vx;
        a.y += a.vy;
      }
    }

    function drawScene(t, formationProgress, cameraZoom, cameraPanX, cameraPanY, useCamera, brightness) {
      ctx.clearRect(0, 0, W, H);

      if (useCamera) {
        ctx.save();
        ctx.translate(CX, CY);
        ctx.scale(cameraZoom, cameraZoom);
        ctx.translate(-CX + cameraPanX, -CY + cameraPanY);
      }

      // Pressure field
      if (formationProgress > 0.33 && formationProgress < 0.8) {
        const pI = Math.min(1, (formationProgress - 0.33) / 0.33);
        const pulseR = BASE_R * PHI_2 * (1 - pI * 0.6);
        const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, pulseR);
        g.addColorStop(0, `rgba(201,168,76,${0.02 * pI})`);
        g.addColorStop(0.5, `rgba(100,140,200,${0.015 * pI})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(useCamera ? CX - pulseR : 0, useCamera ? CY - pulseR : 0, useCamera ? pulseR * 2 : W, useCamera ? pulseR * 2 : H);
      }

      // Central glow
      if (formationProgress > 0.66) {
        const gP = (formationProgress - 0.66) / 0.34;
        const glowR = BASE_R * PHI_NEG2 + gP * BASE_R * 0.5;
        const glowA = gP * 0.35 + brightness * 0.4;
        const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, glowR);
        g.addColorStop(0, `rgba(255,255,255,${glowA})`);
        g.addColorStop(0.3, `rgba(201,168,76,${glowA * 0.6})`);
        g.addColorStop(0.7, `rgba(201,168,76,${glowA * 0.15})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(CX, CY, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bonds
      const bondProgress = Math.max(0, (formationProgress - 0.7) / 0.3);
      if (bondProgress > 0) {
        for (const bond of bonds) {
          const aa = atoms[bond.a];
          const bb = atoms[bond.b];
          if (!aa.bonded || !bb.bonded) continue;

          const shellAvg = (aa.shell + bb.shell) / 2;
          const alpha = bondProgress * (0.15 + 0.1 * Math.pow(PHI_INV, shellAvg));

          const pulsePhase = (t * 2 + bond.dist * 0.01) % 1;
          const px = aa.x + (bb.x - aa.x) * pulsePhase;
          const py = aa.y + (bb.y - aa.y) * pulsePhase;

          ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(aa.x, aa.y);
          ctx.lineTo(bb.x, bb.y);
          ctx.stroke();

          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
          ctx.beginPath();
          ctx.arc(px, py, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Atoms
      for (let i = 0; i < atoms.length; i++) {
        const a = atoms[i];

        let r, g2, b;
        if (formationProgress < 0.33) {
          r = 160; g2 = 180; b = 220;
        } else if (formationProgress < 0.66) {
          const mix = (formationProgress - 0.33) / 0.33;
          r = 160 + mix * 95;
          g2 = 180 + mix * 75;
          b = 220 + mix * 35;
        } else {
          const mix = (formationProgress - 0.66) / 0.34;
          r = 255 - mix * 54;
          g2 = 255 - mix * 87;
          b = 255 - mix * 179;
        }

        const baseAlpha = a.bonded ? 0.85 : (0.4 + brightness * 0.3);
        const glowR = a.size * (a.bonded ? 6 : 3) + brightness * 3;

        const gg = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, glowR);
        gg.addColorStop(0, `rgba(${r},${g2},${b},${baseAlpha * 0.5})`);
        gg.addColorStop(0.4, `rgba(${r},${g2},${b},${baseAlpha * 0.15})`);
        gg.addColorStop(1, "transparent");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(a.x, a.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        const coreR = a.size + (a.bonded ? 0.5 : 0);
        ctx.fillStyle = `rgba(${r},${g2},${b},${baseAlpha})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, coreR, 0, Math.PI * 2);
        ctx.fill();

        // Bond flash
        if (a.bonded && t - a.bondTime < 0.3) {
          const flashP = 1 - (t - a.bondTime) / 0.3;
          const flashR = a.size * 12 * flashP;
          const fg = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, flashR);
          fg.addColorStop(0, `rgba(255,255,255,${flashP * 0.6})`);
          fg.addColorStop(0.5, `rgba(201,168,76,${flashP * 0.2})`);
          fg.addColorStop(1, "transparent");
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.arc(a.x, a.y, flashR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Refraction rays (only when mostly formed)
      if (formationProgress > 0.9) {
        const rP = (formationProgress - 0.9) / 0.1;
        for (const ray of rays) {
          const len = ray.length * rP;
          const ex = CX + Math.cos(ray.angle) * len;
          const ey = CY + Math.sin(ray.angle) * len;
          const alpha = rP * 0.12;
          const g = ctx.createLinearGradient(CX, CY, ex, ey);
          g.addColorStop(0, `hsla(${ray.hue},80%,75%,${alpha})`);
          g.addColorStop(0.6, `hsla(${ray.hue},60%,60%,${alpha * 0.4})`);
          g.addColorStop(1, "transparent");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(CX, CY);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      }

      if (useCamera) ctx.restore();

      // Camera glow overlay (drawn outside camera transform)
      if (useCamera && brightness > 0.01) {
        const glowRadius = 20 + brightness * 80;
        const glowAlpha = brightness * 0.9;
        const wg = ctx.createRadialGradient(CX, CY, 0, CX, CY, glowRadius);
        wg.addColorStop(0, `rgba(255,255,255,${glowAlpha})`);
        wg.addColorStop(0.4, `rgba(232,232,240,${glowAlpha * 0.5})`);
        wg.addColorStop(1, "rgba(232,232,240,0)");
        ctx.beginPath();
        ctx.arc(CX, CY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = wg;
        ctx.fill();
      }
    }

    // ═══════════════════════════════════════════════════════
    // ANIMATION LOOP
    // ═══════════════════════════════════════════════════════

    let startTime = null;
    let animStart = null;
    let signalFired = false;
    let veilParted = false;

    function tick(now) {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;

      if (isBackground) {
        // ── BACKGROUND MODE: depth-driven, mirrors dreamMultiverse ──
        if (depthRef.current >= 2 && animStart === null) animStart = now;
        const t = animStart ? (now - animStart) / 1000 : 0;

        // Before depth 2: atoms drift gently (chaos phase)
        if (depthRef.current < 2) {
          simulateAtoms(0.1, elapsed);
          drawScene(elapsed, 0.1, 1, 0, 0, false, 0);
        } else if (depthRef.current === 2) {
          // Three-phase camera (matching dreamMultiverse exactly)
          const aT = Math.max(0, Math.min(1, (t - CAM_A_START) / (CAM_A_END - CAM_A_START)));
          const bT = Math.max(0, Math.min(1, (t - CAM_A_END) / (CAM_B_END - CAM_A_END)));
          const cT = Math.max(0, Math.min(1, (t - CAM_B_END) / (CAM_C_END - CAM_B_END)));

          const aE = aT * aT * (3 - 2 * aT);
          const bE = bT * bT * (3 - 2 * bT);
          const cE = cT * cT * (3 - 2 * cT);

          // Formation maps to camera phases:
          // Phase A: chaos → compression (formation 0→0.5)
          // Phase B: compression → crystallization (formation 0.5→1.0), glow peaks
          // Phase C: crystal formed, expansion, glow fades
          let formation, zoom, panX = 0, panY = 0, brightness = 0;

          if (t < CAM_A_END) {
            formation = aE * 0.5;
            zoom = 5 + (1 - 5) * aE;
            panX = 0; panY = 0;
          } else if (t < CAM_B_END) {
            formation = 0.5 + bE * 0.5;
            zoom = 1 + (0.04 - 1) * bE;
            brightness = bE;
          } else {
            formation = 1.0;
            zoom = 0.04 + (1 - 0.04) * cE;
            brightness = 1 - cE;
          }

          simulateAtoms(formation, t);
          drawScene(t, formation, zoom, panX, panY, true, brightness);

          // Signal at glow peak (matches universe timing exactly)
          if (bE >= 0.95 && !veilParted) {
            veilParted = true;
            if (onVeilPartedRef.current) onVeilPartedRef.current();
          }
        }

        if (depthRef.current > 2) return;

      } else {
        // ── INTRO MODE: standalone one-shot animation ──
        const t = elapsed;
        const formation = Math.min(1, t / INTRO_C);
        simulateAtoms(formation, t);
        drawScene(t, formation, 1, 0, 0, false, Math.max(0, (formation - 0.66) / 0.34));

        if (t >= INTRO_SIGNAL && !signalFired) {
          signalFired = true;
          if (onCompleteRef.current) onCompleteRef.current();
        }

        if (t > INTRO_D + 2) return;
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    />
  );
}

