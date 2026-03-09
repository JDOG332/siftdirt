/**
 * KALEIDOSCOPE SEA CANVAS
 * Phase 1 — FREE:  9 Ψ-driven particles roaming entire screen, bouncing off walls
 *                  Motion governed by Ψ = R₁₂ × (C_eff · D̂) between all pairs
 *                  R₁₂  = simplified Uhlmann fidelity on 2D Bloch state vectors
 *                  C_eff = velocity coherence (low ΔV = high convergence)
 *                  D̂    = spatial detection quality (softened 1/r)
 * Phase 2 — CRACK: white flash → fracture lines → darkness
 * Phase 3 — SEA:   full-spectrum 12-fold kaleidoscope mandala, infinite
 *
 * onVeilParted fires at start of Phase 3 (poem scroll begins)
 */
import { useEffect, useRef } from "react";

const PHI  = 1.618033988749895;
const PHIi = 0.6180339887498949;

const FREE_DUR  = 7200;   // ms free roaming phase
const CRACK_DUR = 700;    // ms of shatter
const SECTORS   = 6;      // 6-fold = 12 mirrors

// 9 particle hues — one per CRT body index, mirrors cluster color spirit
const PARTICLE_HUES = [220, 260, 45, 0, 0, 120, 195, 30, 285];

export default function KaleidoscopeSeaCanvas({ onVeilParted }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // ── Resize ───────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Shared state ─────────────────────────────────────────────
    let startTime   = null;
    let phase       = "free";
    let freeParticles = [];
    let seaParticles  = [];
    let cracks        = [];
    let veilCalled    = false;
    let animId;

    // ─────────────────────────────────────────────────────────────
    // INIT — FREE PARTICLES (Ψ-driven, full screen)
    // ─────────────────────────────────────────────────────────────
    const initFree = () => {
      const W = canvas.width, H = canvas.height;
      freeParticles = [];
      for (let i = 0; i < 9; i++) {
        // Each particle gets a simplified 2D Bloch state vector (unit vector)
        const theta = (i / 9) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const spd   = 1.6 + Math.random() * 2.0;
        const ang   = Math.random() * Math.PI * 2;
        // Spread across whole screen with margin
        const mx = W * 0.12, my = H * 0.12;
        freeParticles.push({
          x:  mx + Math.random() * (W - mx * 2),
          y:  my + Math.random() * (H - my * 2),
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          // Bloch state — 2D unit vector drives R₁₂ fidelity
          sx: Math.cos(theta),
          sy: Math.sin(theta),
          // State precession (slow spin of each particle's quantum state)
          sOmega: (Math.random() - 0.5) * 0.018,
          trail: [],
          size: 1.8 + Math.random() * 1.6,
          hue: PARTICLE_HUES[i],
        });
      }
    };

    // ─────────────────────────────────────────────────────────────
    // PHYSICS — Ψ = R₁₂ × (C_eff · D̂) inter-particle force
    // ─────────────────────────────────────────────────────────────
    const psiForce = (pi, pj) => {
      const dx = pj.x - pi.x, dy = pj.y - pi.y;
      const r2 = dx * dx + dy * dy;
      const r  = Math.sqrt(r2) || 0.001;

      // R₁₂ — simplified Uhlmann fidelity on 2D Bloch state vectors
      // dot(si, sj) ∈ [-1,1] → fidelity ∈ [0,1]
      const dot = pi.sx * pj.sx + pi.sy * pj.sy;
      const R12 = (1 + dot) / 2;                          // [0, 1]

      // C_eff — velocity coherence: low delta-v = high convergence
      const dvx = pj.vx - pi.vx, dvy = pj.vy - pi.vy;
      const dv  = Math.sqrt(dvx * dvx + dvy * dvy);
      const Ceff = 1 / (1 + dv * 0.25);                   // (0, 1]

      // D̂ — detection quality: softened inverse distance
      const softR = Math.max(r, 28);
      const Dhat  = 900 / (softR * softR);                 // falls off as 1/r²

      // Master equation: Ψ = R₁₂ × (C_eff · D̂)
      const Psi = R12 * Ceff * Dhat;

      // Repulsion core prevents collapse (r < 40px)
      const repulse = r < 40 ? -0.6 * (40 - r) / 40 : 0;

      const mag = (Psi * 0.55 + repulse) / r;
      return { fx: dx * mag, fy: dy * mag };
    };

    // ─────────────────────────────────────────────────────────────
    // DRAW — FREE PHASE
    // ─────────────────────────────────────────────────────────────
    const drawFree = (elapsed) => {
      const W = canvas.width, H = canvas.height;
      const t = elapsed / FREE_DUR;  // 0 → 1

      // Persistent smear trail
      ctx.fillStyle = "rgba(3,3,10,0.18)";
      ctx.fillRect(0, 0, W, H);

      const N = freeParticles.length;

      // ── Ψ inter-particle forces ────────────────────────────────
      for (let i = 0; i < N; i++) {
        const pi = freeParticles[i];
        let fx = 0, fy = 0;

        for (let j = 0; j < N; j++) {
          if (i === j) continue;
          const f = psiForce(pi, freeParticles[j]);
          fx += f.fx;
          fy += f.fy;
        }

        // Soft screen-edge repulsion (not a wall, a field — keeps them roaming)
        const edgeMar = 60;
        const edgeStr = 0.12;
        if (pi.x < edgeMar)     fx += (edgeMar - pi.x) * edgeStr;
        if (pi.x > W - edgeMar) fx -= (pi.x - (W - edgeMar)) * edgeStr;
        if (pi.y < edgeMar)     fy += (edgeMar - pi.y) * edgeStr;
        if (pi.y > H - edgeMar) fy -= (pi.y - (H - edgeMar)) * edgeStr;

        pi.vx += fx;
        pi.vy += fy;

        // Damping
        pi.vx *= 0.972;
        pi.vy *= 0.972;

        // Speed clamp — min keeps particles alive, max prevents flying off
        const spd = Math.sqrt(pi.vx * pi.vx + pi.vy * pi.vy);
        if (spd > 5.5) { pi.vx *= 5.5 / spd; pi.vy *= 5.5 / spd; }
        if (spd < 0.6 && spd > 0) { pi.vx *= 0.6 / spd; pi.vy *= 0.6 / spd; }

        // Hard bounce off all 4 walls
        pi.x += pi.vx;
        pi.y += pi.vy;
        if (pi.x < 0)  { pi.x = 0;  pi.vx =  Math.abs(pi.vx); }
        if (pi.x > W)  { pi.x = W;  pi.vx = -Math.abs(pi.vx); }
        if (pi.y < 0)  { pi.y = 0;  pi.vy =  Math.abs(pi.vy); }
        if (pi.y > H)  { pi.y = H;  pi.vy = -Math.abs(pi.vy); }

        // State precession — Bloch vector slowly rotates
        const c = Math.cos(pi.sOmega), s = Math.sin(pi.sOmega);
        const nsx = pi.sx * c - pi.sy * s;
        const nsy = pi.sx * s + pi.sy * c;
        pi.sx = nsx; pi.sy = nsy;

        // Hue tracks state angle for visual CRT encoding
        pi.hue = ((Math.atan2(pi.sy, pi.sx) / Math.PI + 1) * 180 + PARTICLE_HUES[i]) % 360;

        pi.trail.push({ x: pi.x, y: pi.y, hue: pi.hue });
        if (pi.trail.length > 26) pi.trail.shift();
      }

      // ── Ψ connection lines between fidelity-similar pairs ──────
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const pi = freeParticles[i], pj = freeParticles[j];
          const dot = pi.sx * pj.sx + pi.sy * pj.sy;
          const R12 = (1 + dot) / 2;
          if (R12 < 0.62) continue;  // only draw high-fidelity connections
          const dx = pj.x - pi.x, dy = pj.y - pi.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 300) continue;
          const lineA = R12 * (1 - dist / 300) * 0.18;
          ctx.strokeStyle = `rgba(255,255,255,${lineA})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // ── Draw particles ─────────────────────────────────────────
      for (const p of freeParticles) {
        // Trail
        for (let i = 1; i < p.trail.length; i++) {
          const a = (i / p.trail.length) * 0.55;
          ctx.strokeStyle = `rgba(255,245,230,${a})`;
          ctx.lineWidth = p.size * (i / p.trail.length) * 1.3;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
          ctx.stroke();
        }

        // Core glow
        ctx.save();
        ctx.shadowColor = `rgba(255,255,255,0.9)`;
        ctx.shadowBlur = 14;
        ctx.fillStyle  = `rgba(255,250,240,0.96)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── Tension pulse last 12% — full-screen throb ────────────
      if (t > 0.88) {
        const p    = (t - 0.88) / 0.12;
        const pulse = Math.abs(Math.sin(p * Math.PI * 10)) * p;
        ctx.fillStyle = `rgba(255,255,255,${pulse * 0.18})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    // ─────────────────────────────────────────────────────────────
    // INIT — CRACK LINES
    // ─────────────────────────────────────────────────────────────
    const initCracks = () => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const numCracks = 14 + Math.floor(Math.random() * 6);
      cracks = [];
      for (let i = 0; i < numCracks; i++) {
        const baseAngle = (Math.PI * 2 / numCracks) * i + (Math.random() - 0.5) * 0.5;
        const totalLen  = Math.min(W, H) * (0.35 + Math.random() * 0.38);
        const segs = [];
        let x = cx, y = cy, a = baseAngle;
        const nSeg = 4 + Math.floor(Math.random() * 3);
        for (let s = 0; s < nSeg; s++) {
          a += (Math.random() - 0.5) * 0.45;
          const len = (totalLen / nSeg) * (0.7 + Math.random() * 0.6);
          const nx = x + Math.cos(a) * len;
          const ny = y + Math.sin(a) * len;
          if (s === 2 && Math.random() < 0.5) {
            const ba = a + (Math.random() < 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.4);
            const bl = len * 0.5;
            segs.push({ x1: x, y1: y, x2: x + Math.cos(ba) * bl, y2: y + Math.sin(ba) * bl, branch: true });
          }
          segs.push({ x1: x, y1: y, x2: nx, y2: ny, branch: false });
          x = nx; y = ny;
        }
        cracks.push(segs);
      }
    };

    // ─────────────────────────────────────────────────────────────
    // INIT — SEA PARTICLES
    // ─────────────────────────────────────────────────────────────
    const initSea = () => {
      const W = canvas.width, H = canvas.height;
      const maxR = Math.min(W, H) * 0.46;
      seaParticles = [];
      for (let i = 0; i < 28; i++) {
        const orbitR   = maxR * (0.08 + Math.random() * 0.88);
        const orbitA   = Math.random() * Math.PI * 2;
        const orbitSpd = (0.004 + Math.random() * 0.008) * (Math.random() < 0.5 ? 1 : -1);
        seaParticles.push({
          orbitR, orbitA, orbitSpd,
          wobblePhase: Math.random() * Math.PI * 2,
          wobbleAmp:   orbitR * (0.04 + Math.random() * 0.08),
          wobbleSpd:   0.6 + Math.random() * 1.2,
          hue:     Math.random() * 360,
          hueSpd:  0.4 + Math.random() * 1.2,
          size:    1.5 + Math.random() * 3,
          trail:   [],
          x: W / 2, y: H / 2,
        });
      }
    };

    // ─────────────────────────────────────────────────────────────
    // DRAW — CRACK PHASE  (unchanged)
    // ─────────────────────────────────────────────────────────────
    const drawCrack = (elapsed) => {
      const W = canvas.width, H = canvas.height;
      const t = Math.min(1, elapsed / CRACK_DUR);

      const flash = t < 0.12 ? 1 : Math.max(0, 1 - (t - 0.12) / 0.28);
      ctx.fillStyle = `rgba(255,255,255,${flash * 0.95})`;
      ctx.fillRect(0, 0, W, H);

      if (t > 0.15) {
        const darkT = Math.min(1, (t - 0.15) / 0.35);
        ctx.fillStyle = `rgba(3,3,10,${darkT * 0.92})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (t > 0.18) {
        const crackT = Math.min(1, (t - 0.18) / 0.55);
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 5;
        for (const segs of cracks) {
          const visibleSegs = Math.ceil(segs.length * crackT);
          for (let si = 0; si < visibleSegs; si++) {
            const seg = segs[si];
            const segAlpha = seg.branch ? 0.5 : 0.85;
            ctx.strokeStyle = `rgba(255,255,255,${segAlpha * (1 - t * 0.3)})`;
            ctx.lineWidth = seg.branch ? 0.5 : 1;
            ctx.beginPath();
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      if (t > 0.6) {
        const shardT = (t - 0.6) / 0.4;
        const nShards = 20;
        for (let i = 0; i < nShards; i++) {
          const a    = (Math.PI * 2 / nShards) * i;
          const dist = Math.min(W, H) * 0.06 * shardT;
          const hue  = (i / nShards) * 360;
          ctx.fillStyle  = `hsla(${hue},100%,68%,${shardT * 0.85})`;
          ctx.shadowColor = `hsla(${hue},100%,65%,0.7)`;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(W / 2 + Math.cos(a) * dist, H / 2 + Math.sin(a) * dist, 2 + shardT * 9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    };

    // ─────────────────────────────────────────────────────────────
    // DRAW — SEA PHASE  (unchanged)
    // ─────────────────────────────────────────────────────────────
    const drawSea = (elapsed) => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const t = elapsed / 1000;

      ctx.fillStyle = "rgba(3,3,10,0.11)";
      ctx.fillRect(0, 0, W, H);

      for (const p of seaParticles) {
        p.orbitA += p.orbitSpd;
        const wobble = Math.sin(t * p.wobbleSpd + p.wobblePhase) * p.wobbleAmp;
        p.x = cx + Math.cos(p.orbitA) * (p.orbitR + wobble);
        p.y = cy + Math.sin(p.orbitA) * (p.orbitR + wobble);
        p.hue = (p.hue + p.hueSpd) % 360;
        p.trail.push({ x: p.x, y: p.y, hue: p.hue });
        if (p.trail.length > 28) p.trail.shift();
      }

      const masterR    = Math.min(W, H) * 0.48;
      const sectorAngle = Math.PI / SECTORS;

      ctx.save();
      ctx.translate(cx, cy);

      for (let s = 0; s < SECTORS * 2; s++) {
        ctx.save();
        ctx.rotate(sectorAngle * s);
        if (s % 2 === 1) ctx.scale(1, -1);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, masterR, -sectorAngle / 2, sectorAngle / 2);
        ctx.closePath();
        ctx.clip();

        for (const p of seaParticles) {
          const lx = p.x - cx, ly = p.y - cy;

          for (let i = 1; i < p.trail.length; i++) {
            const alpha = (i / p.trail.length) * 0.65;
            ctx.strokeStyle = `hsla(${p.trail[i].hue},100%,62%,${alpha})`;
            ctx.lineWidth = p.size * (i / p.trail.length) * 1.6;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(p.trail[i - 1].x - cx, p.trail[i - 1].y - cy);
            ctx.lineTo(p.trail[i].x - cx, p.trail[i].y - cy);
            ctx.stroke();
          }

          ctx.save();
          ctx.shadowColor = `hsla(${p.hue},100%,70%,0.7)`;
          ctx.shadowBlur = 14;
          ctx.fillStyle  = `hsla(${p.hue},100%,72%,0.92)`;
          ctx.beginPath();
          ctx.arc(lx, ly, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.restore();
      }

      ctx.restore();

      const gemSize = Math.round(Math.min(W, H) * 0.018);
      const gemHue  = (t * 60) % 360;
      ctx.save();
      ctx.shadowColor = `hsla(${gemHue},100%,80%,0.9)`;
      ctx.shadowBlur  = 20;
      ctx.fillStyle   = `hsla(${gemHue},100%,80%,1)`;
      ctx.beginPath();
      ctx.arc(cx, cy, gemSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const vign = ctx.createRadialGradient(cx, cy, masterR * 0.38, cx, cy, masterR * 1.1);
      vign.addColorStop(0, "rgba(0,0,0,0)");
      vign.addColorStop(1, "rgba(3,3,10,0.72)");
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, W, H);
    };

    // ─────────────────────────────────────────────────────────────
    // ANIMATION LOOP
    // ─────────────────────────────────────────────────────────────
    initFree();

    const frame = (now) => {
      if (!startTime) startTime = now;
      const total = now - startTime;

      if (phase === "free") {
        drawFree(total);
        if (total >= FREE_DUR) {
          phase = "crack";
          initCracks();
        }
      } else if (phase === "crack") {
        const crackElapsed = total - FREE_DUR;
        drawCrack(crackElapsed);
        if (crackElapsed >= CRACK_DUR) {
          phase = "sea";
          initSea();
          if (!veilCalled && onVeilParted) {
            veilCalled = true;
            onVeilParted();
          }
        }
      } else {
        const seaElapsed = total - FREE_DUR - CRACK_DUR;
        drawSea(seaElapsed);
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}
