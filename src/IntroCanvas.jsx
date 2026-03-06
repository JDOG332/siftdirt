/**
 * SIFTDIRT — THE OPENING
 * 10 seconds. No words. Pure 3D brilliance.
 *
 * What fires:
 *  — 81 multiverse bodies (9 clusters × 9) orbiting via Ψ = R₁₂ × C_eff, trailing in all 10 door colors
 *  — Sephirot tree (10 nodes, 22 paths) rotating on a different axis
 *  — Flower of Life (7 overlapping circles) in deep gold
 *  — PHI spiral unwinding in 3D
 *  — Aurora wash — 10 door colors bleeding like light through water
 *  — Gold motes rising through everything
 *  — Grain, vignette, atmosphere
 *
 * Timeline:
 *  0.0 – 0.1  GENESIS      — single point of gold light breathes open
 *  0.1 – 0.3  EXPLOSION    — everything bursts from center outward
 *  0.3 – 0.6  ORGANIZATION — chaos finds its orbits, geometry materializes
 *  0.6 – 0.85 REVELATION   — peak beauty, everything alive and synchronized
 *  0.85– 1.0  CONVERGENCE  — all pulls inward, fades to black, done
 */

import { useEffect, useRef } from "react";
import { PHI, PHI_INV, DOORS } from "./data.js";

const TOTAL_MS = 10000;

// ── Math helpers ────────────────────────────────────────────────────────────

function smootherstep(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function project(x, y, z, cx, cy, fov = 520) {
  const d = fov + z;
  if (d < 1) return null;
  const s = fov / d;
  return { sx: cx + x * s, sy: cy + y * s, scale: s };
}

function rotate3D(x, y, z, rx, ry, rz) {
  // X axis
  let y1 = y * Math.cos(rx) - z * Math.sin(rx);
  let z1 = y * Math.sin(rx) + z * Math.cos(rx);
  // Y axis
  let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
  let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
  // Z axis
  let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
  let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
  return [x3, y3, z2];
}

// ── Constants ───────────────────────────────────────────────────────────────

const DOOR_COLORS = DOORS.map(d => d.color);
const C_EFF = [1.0, 1.4, 1.8, 2.0, PHI * PHI, 2.0, 1.8, 1.4, 1.0];
const MIRROR_PAIRS = [[0, 8], [1, 7], [2, 6], [3, 5]];

function getR12(i, j) {
  let r = 0.5;
  if (MIRROR_PAIRS.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) r += PHI;
  if (Math.abs(i - j) === 1) r += 0.3;
  if (i === 4 || j === 4) r += 0.8;
  return r;
}

// Sephirot (10 nodes)
const SEPHIROT = [
  [0, -210, 20], [115, -148, 0], [-115, -148, 0],
  [115, -50, 0], [-115, -50, 0], [0, 0, 0],
  [115, 95, 0], [-115, 95, 0], [0, 158, 0], [0, 220, 0],
];
const SEPH_PATHS = [
  [0,1],[0,2],[0,5],[1,2],[1,3],[1,5],
  [2,4],[2,5],[3,4],[3,5],[3,6],
  [4,5],[4,7],[5,6],[5,7],[5,8],
  [6,7],[6,8],[6,9],[7,8],[7,9],[8,9],
];

// Flower of Life — center + 6 petals
const FOL = [
  [0, 0],
  ...Array.from({ length: 6 }, (_, i) => [
    Math.cos(i * Math.PI / 3) * 62,
    Math.sin(i * Math.PI / 3) * 62,
  ]),
];

// ── Build simulation state ──────────────────────────────────────────────────

function buildState() {
  // 9 clusters on a sphere using Fibonacci lattice
  const clusters = Array.from({ length: 9 }, (_, ci) => {
    const phi = Math.acos(1 - 2 * (ci + 0.5) / 9);
    const theta = Math.PI * (1 + Math.sqrt(5)) * ci;
    const R = 175;
    const cx = R * Math.sin(phi) * Math.cos(theta);
    const cy = R * Math.sin(phi) * Math.sin(theta);
    const cz = R * Math.cos(phi);
    const color = DOOR_COLORS[ci];

    const bodies = Array.from({ length: 9 }, (_, bi) => {
      if (bi === 4) return { x: cx, y: cy, z: cz, vx: 0, vy: 0, vz: 0, cEff: C_EFF[bi], id: bi, trail: [] };
      const angle = (bi / 9) * Math.PI * 2 + Math.random() * 0.6;
      const inc = (Math.random() - 0.5) * Math.PI * 0.6;
      const r = 18 + Math.random() * 14;
      const psi = getR12(bi, 4) * C_EFF[bi] * C_EFF[4];
      const speed = Math.sqrt(Math.abs(psi) / r) * 0.9 * (0.8 + Math.random() * 0.4);
      const vAngle = angle + Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * r * Math.cos(inc),
        y: cy + Math.sin(angle) * r,
        z: cz + Math.cos(angle) * r * Math.sin(inc),
        vx: Math.cos(vAngle) * speed * Math.cos(inc),
        vy: Math.sin(vAngle) * speed,
        vz: Math.cos(vAngle) * speed * Math.sin(inc),
        cEff: C_EFF[bi], id: bi, trail: [],
      };
    });

    return { cx, cy, cz, bodies, color };
  });

  // Gold motes
  const motes = Array.from({ length: 220 }, () => ({
    x: (Math.random() - 0.5) * 700,
    y: (Math.random() - 0.5) * 700,
    z: (Math.random() - 0.5) * 700,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(0.2 + Math.random() * 0.5),
    vz: (Math.random() - 0.5) * 0.25,
    size: 0.6 + Math.random() * 1.8,
    phase: Math.random() * Math.PI * 2,
    speed: 0.015 + Math.random() * 0.02,
  }));

  return { clusters, motes, rotX: 0, rotY: 0, rotZ: 0, rotSX: 0, rotSY: 0.3, rotSZ: 0 };
}

// ── Simulate one tick ───────────────────────────────────────────────────────

function simulate(state, dt) {
  state.rotX += 0.003 * PHI_INV;
  state.rotY += 0.005;
  state.rotZ += 0.001 * PHI_INV;
  state.rotSX += 0.0015;
  state.rotSY += 0.002 * PHI;
  state.rotSZ += 0.0008;

  state.clusters.forEach(cluster => {
    const { bodies, cx, cy, cz } = cluster;
    const N = bodies.length;
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const fz = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = bodies[j].x - bodies[i].x;
        const dy = bodies[j].y - bodies[i].y;
        const dz = bodies[j].z - bodies[i].z;
        const distSq = dx * dx + dy * dy + dz * dz + 6;
        const dist = Math.sqrt(distSq);
        const R12 = getR12(bodies[i].id, bodies[j].id);
        const psi = R12 * bodies[i].cEff * bodies[j].cEff / distSq;
        fx[i] += psi * dx / dist; fy[i] += psi * dy / dist; fz[i] += psi * dz / dist;
        fx[j] -= psi * dx / dist; fy[j] -= psi * dy / dist; fz[j] -= psi * dz / dist;
      }
      fx[i] += (cx - bodies[i].x) * 0.0018 * bodies[i].cEff;
      fy[i] += (cy - bodies[i].y) * 0.0018 * bodies[i].cEff;
      fz[i] += (cz - bodies[i].z) * 0.0018 * bodies[i].cEff;
    }

    for (let i = 0; i < N; i++) {
      if (i === 4) continue;
      bodies[i].vx = (bodies[i].vx + fx[i] / bodies[i].cEff * dt) * 0.994;
      bodies[i].vy = (bodies[i].vy + fy[i] / bodies[i].cEff * dt) * 0.994;
      bodies[i].vz = (bodies[i].vz + fz[i] / bodies[i].cEff * dt) * 0.994;
      bodies[i].x += bodies[i].vx * dt;
      bodies[i].y += bodies[i].vy * dt;
      bodies[i].z += bodies[i].vz * dt;
      bodies[i].trail.push([bodies[i].x, bodies[i].y, bodies[i].z]);
      if (bodies[i].trail.length > 35) bodies[i].trail.shift();
    }
  });

  state.motes.forEach(m => {
    m.x += m.vx; m.y += m.vy; m.z += m.vz;
    m.phase += m.speed;
    if (m.y < -450) { m.y = 450; m.x = (Math.random() - 0.5) * 600; m.z = (Math.random() - 0.5) * 600; }
  });
}

// ── Main component ──────────────────────────────────────────────────────────

export default function IntroCanvas({ onComplete }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const stateRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    stateRef.current = buildState();
    const state = stateRef.current;

    function draw(t, elapsed) {
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const fov = 500 + Math.sin(elapsed * 0.00025) * 60;

      // Phase calculations
      const isGenesis      = t < 0.1;
      const isExplosion    = t >= 0.1 && t < 0.3;
      const isOrganization = t >= 0.3 && t < 0.6;
      const isRevelation   = t >= 0.6 && t < 0.85;
      const isConvergence  = t >= 0.85;

      const localT = isGenesis      ? t / 0.1
                   : isExplosion    ? (t - 0.1) / 0.2
                   : isOrganization ? (t - 0.3) / 0.3
                   : isRevelation   ? (t - 0.6) / 0.25
                   :                  (t - 0.85) / 0.15;

      // ── CLEAR ──────────────────────────────────────────────────
      const trailDecay = isGenesis ? 0.12 : isConvergence ? 0.2 + smootherstep(localT) * 0.5 : 0.08;
      ctx.fillStyle = `rgba(3,3,10,${trailDecay})`;
      ctx.fillRect(0, 0, W, H);

      // ── AURORA WASH ────────────────────────────────────────────
      if (!isGenesis) {
        const auroraAlpha = isExplosion    ? smootherstep(localT) * 0.04
                          : isConvergence  ? (1 - smootherstep(localT)) * 0.05
                          :                  0.05;
        DOOR_COLORS.forEach(([r, g, b], i) => {
          const angle = (i / 10) * Math.PI * 2 + elapsed * 0.0003 + i * PHI_INV;
          const ex = cx + Math.cos(angle) * W * 0.7;
          const ey = cy + Math.sin(angle) * H * 0.7;
          const grd = ctx.createRadialGradient(ex, ey, 0, ex, ey, W * 0.8);
          grd.addColorStop(0, `rgba(${r},${g},${b},${auroraAlpha})`);
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, W, H);
        });
      }

      // ── GENESIS ────────────────────────────────────────────────
      if (isGenesis) {
        const ge = smootherstep(localT);
        // Black background
        ctx.fillStyle = "#03030a";
        ctx.fillRect(0, 0, W, H);

        // Expanding rings of gold
        for (let i = 0; i < 5; i++) {
          const rr = ge * Math.min(W, H) * (0.08 + i * 0.12);
          const a = Math.max(0, ge - i * 0.15) * (0.8 - i * 0.15);
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${a})`;
          ctx.lineWidth = 1.5 - i * 0.2;
          ctx.stroke();
        }

        // Central glow
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, ge * 120);
        grd.addColorStop(0, `rgba(201,168,76,${ge * 0.9})`);
        grd.addColorStop(0.4, `rgba(201,168,76,${ge * 0.3})`);
        grd.addColorStop(1, "rgba(201,168,76,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, ge * 120, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        return;
      }

      // ── SCATTER (explosion phase) ───────────────────────────────
      const scatter = isExplosion ? (1 - smootherstep(localT)) * 320 : 0;
      const multAlpha = isExplosion    ? smootherstep(localT)
                      : isConvergence  ? 1 - smootherstep(localT) * 0.9
                      :                  1;
      const orgAlpha  = isOrganization ? smootherstep(localT)
                      : isConvergence  ? 1 - smootherstep(localT)
                      : (isExplosion ? 0 : 1);

      // ── PHI SPIRAL ─────────────────────────────────────────────
      if (!isExplosion) {
        const spiralA = isOrganization ? smootherstep(localT) * 0.12
                      : isConvergence  ? (1 - smootherstep(localT)) * 0.12
                      :                  0.12;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 300; i++) {
          const angle = (i / 300) * 6 * Math.PI + elapsed * 0.0004;
          const r = Math.pow(PHI, angle / (Math.PI * 2)) * 14;
          const [rx, ry, rz] = rotate3D(Math.cos(angle) * r, Math.sin(angle) * r, 0, state.rotX * 0.5, state.rotY * 0.5, state.rotZ);
          const p = project(rx, ry, rz, cx, cy, fov);
          if (!p || p.sx < -50 || p.sx > W + 50) continue;
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = `rgba(201,168,76,${spiralA})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // ── FLOWER OF LIFE ─────────────────────────────────────────
      if (!isExplosion) {
        const folA = isOrganization ? smootherstep(localT) * 0.18
                   : isConvergence  ? (1 - smootherstep(localT)) * 0.18
                   :                  0.18;
        const folScale = 1.4 + Math.sin(elapsed * 0.0008) * 0.08;
        FOL.forEach(([fx2, fy2]) => {
          const [rx, ry, rz] = rotate3D(fx2 * folScale, fy2 * folScale, 0, state.rotX * 0.25, state.rotY * 0.25, state.rotZ * 0.5);
          const p = project(rx, ry, rz, cx, cy, fov);
          if (!p) return;
          const cr = 62 * p.scale * folScale;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, cr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${folA * Math.min(1, p.scale * 1.5)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
      }

      // ── SEPHIROT TREE ──────────────────────────────────────────
      if (!isExplosion) {
        const sephA = isOrganization ? smootherstep(localT) * 0.5
                    : isConvergence  ? (1 - smootherstep(localT)) * 0.5
                    :                  0.5;

        // Paths
        SEPH_PATHS.forEach(([a, b]) => {
          const [ax, ay, az] = SEPHIROT[a];
          const [bx, by, bz] = SEPHIROT[b];
          const [rax, ray] = rotate3D(ax, ay, az, state.rotSX, state.rotSY, state.rotSZ);
          const [rbx, rby] = rotate3D(bx, by, bz, state.rotSX, state.rotSY, state.rotSZ);
          const raza = rotate3D(ax, ay, az, state.rotSX, state.rotSY, state.rotSZ);
          const rbza = rotate3D(bx, by, bz, state.rotSX, state.rotSY, state.rotSZ);
          const pa = project(raza[0], raza[1], raza[2], cx, cy, fov);
          const pb = project(rbza[0], rbza[1], rbza[2], cx, cy, fov);
          if (!pa || !pb) return;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.strokeStyle = `rgba(201,168,76,${sephA * 0.35})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });

        // Nodes
        SEPHIROT.forEach(([nx, ny, nz], i) => {
          const [rx, ry, rz] = rotate3D(nx, ny, nz, state.rotSX, state.rotSY, state.rotSZ);
          const p = project(rx, ry, rz, cx, cy, fov);
          if (!p) return;
          const nr = 4.5 * p.scale;
          // Glow
          const grd = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, nr * 6);
          grd.addColorStop(0, `rgba(201,168,76,${sephA * 0.5})`);
          grd.addColorStop(1, "rgba(201,168,76,0)");
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, nr * 6, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
          // Node
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, nr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201,168,76,${sephA * Math.min(1, p.scale * 1.5)})`;
          ctx.fill();
        });
      }

      // ── MULTIVERSE ─────────────────────────────────────────────
      state.clusters.forEach((cluster, ci) => {
        const clusterAngle = (ci / 9) * Math.PI * 2;
        const sx = scatter * Math.cos(clusterAngle);
        const sy = scatter * Math.sin(clusterAngle);
        const sz = scatter * Math.sin(clusterAngle * PHI);

        cluster.bodies.forEach((body, bi) => {
          if (bi === 4) return;
          const [r, g, b] = cluster.color;

          // Trail
          if (body.trail.length > 2) {
            for (let ti = 1; ti < body.trail.length; ti++) {
              const t0 = body.trail[ti - 1];
              const t1 = body.trail[ti];
              const [rx0, ry0, rz0] = rotate3D(t0[0] + sx, t0[1] + sy, t0[2] + sz, state.rotX, state.rotY, state.rotZ);
              const [rx1, ry1, rz1] = rotate3D(t1[0] + sx, t1[1] + sy, t1[2] + sz, state.rotX, state.rotY, state.rotZ);
              const p0 = project(rx0, ry0, rz0, cx, cy, fov);
              const p1 = project(rx1, ry1, rz1, cx, cy, fov);
              if (!p0 || !p1) continue;
              const trailFrac = ti / body.trail.length;
              ctx.beginPath();
              ctx.moveTo(p0.sx, p0.sy);
              ctx.lineTo(p1.sx, p1.sy);
              ctx.strokeStyle = `rgba(${r},${g},${b},${trailFrac * 0.35 * multAlpha})`;
              ctx.lineWidth = p1.scale * 0.6;
              ctx.stroke();
            }
          }

          // Body
          const [rx, ry, rz] = rotate3D(body.x + sx, body.y + sy, body.z + sz, state.rotX, state.rotY, state.rotZ);
          const p = project(rx, ry, rz, cx, cy, fov);
          if (!p) return;

          const br = Math.max(0.5, p.scale * (1.8 + body.cEff * 0.4));
          const a = Math.min(1, p.scale * 2.5) * multAlpha;

          // Glow
          const grd = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, br * 5);
          grd.addColorStop(0, `rgba(${r},${g},${b},${a * 0.5})`);
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, br * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, br, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          ctx.fill();
        });
      });

      // ── GOLD MOTES ─────────────────────────────────────────────
      const moteA = isExplosion    ? smootherstep(localT) * 0.7
                  : isConvergence  ? (1 - smootherstep(localT)) * 0.7
                  :                  0.7;

      state.motes.forEach(m => {
        const [rx, ry, rz] = rotate3D(m.x, m.y, m.z, state.rotX * 0.08, state.rotY * 0.08, 0);
        const p = project(rx, ry, rz, cx, cy, fov);
        if (!p || p.scale < 0.2) return;
        const a = (0.25 + Math.sin(m.phase) * 0.2) * moteA * Math.min(1, p.scale * 2);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, m.size * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${a})`;
        ctx.fill();
      });

      // ── VIGNETTE ───────────────────────────────────────────────
      const vigGrd = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.2, cx, cy, Math.max(W, H) * 0.85);
      vigGrd.addColorStop(0, "rgba(0,0,0,0)");
      vigGrd.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = vigGrd;
      ctx.fillRect(0, 0, W, H);

      // ── CONVERGENCE FINAL FADE ─────────────────────────────────
      if (isConvergence) {
        // Gold pulse just before black
        if (localT > 0.55 && localT < 0.8) {
          const pulseT = (localT - 0.55) / 0.25;
          ctx.fillStyle = `rgba(201,168,76,${Math.sin(pulseT * Math.PI) * 0.12})`;
          ctx.fillRect(0, 0, W, H);
        }
        // Fade to black
        const fade = smootherstep(Math.max(0, (localT - 0.5) / 0.5));
        ctx.fillStyle = `rgba(3,3,10,${fade * 0.97})`;
        ctx.fillRect(0, 0, W, H);
      }
    }

    function loop(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = elapsed / TOTAL_MS;

      simulate(state, 0.28);
      draw(Math.min(t, 1), elapsed);

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
  }, [onComplete]);

  // Skip on click/tap
  function handleSkip() {
    if (!doneRef.current) {
      doneRef.current = true;
      cancelAnimationFrame(rafRef.current);
      onComplete?.();
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleSkip}
      style={{
        position: "fixed", inset: 0,
        width: "100%", height: "100%",
        display: "block",
        cursor: "none",
        touchAction: "none",
      }}
    />
  );
}
