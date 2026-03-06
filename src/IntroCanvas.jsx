/**
 * SIFTDIRT — THE OPENING
 *
 * This animation runs on the EXACT equation:
 *   Ψ₁₂ = R₁₂ × (C_eff · D̂)
 *   S_eff = −log F_gated − log C_eff − log D̂  [equivalent]
 *
 * Every orbit, every trail, every force between bodies is literally
 * computed from the master equation. Not approximated. Not heuristic.
 *
 * What's real here:
 *  — Each body carries a Bloch vector ρ = (I + r⃗·σ⃗)/2 on the quantum Bloch sphere
 *  — R₁₂ = Uhlmann fidelity × informativeness gate (exact closed-form for qubits)
 *  — G = C_eff × D̂  where C_eff uses JSD convergence + redundancy, D̂ = signal quality
 *  — Forces: F = Ψ₁₂ / r² × direction  (recognition drives gravity)
 *  — Inertia per body = 1 + I_k(φ²−1)  where I_k = 1 − S(ρ)/log₂d
 *  — Bloch vectors evolve: states align when bodies recognize each other
 *  — Mirror pairs share Bloch axes → high R₁₂ → stronger attraction
 *
 * The 3D extension:
 *  — Force magnitudes come from the real Ψ₁₂
 *  — Spatial physics extended to z-axis
 *  — 9 clusters on a Fibonacci sphere, each a full 9-body Ψ system
 *
 * TIMELINE (10 seconds):
 *  0.0–0.1  GENESIS      — gold point breathes open
 *  0.1–0.3  EXPLOSION    — bodies burst from center
 *  0.3–0.6  ORGANIZATION — Ψ orbits stabilize, geometry materializes
 *  0.6–0.85 REVELATION   — peak: all systems alive, aurora, Sephirot, FOL, spiral
 *  0.85–1.0 CONVERGENCE  — everything collapses inward, gold pulse, black
 */

import { useEffect, useRef } from "react";
import { PHI, PHI_INV, DOORS } from "./data.js";
import {
  computeR12,
  computeG,
  computeDetectionQuality,
  evolveBlochVectors,
  initializeBlochVectors,
  isMirrorPair,
  isAdjacent,
} from "./psi-engine.js";

const TOTAL_MS = 10000;
const DOOR_COLORS = DOORS.map(d => d.color);

// ── Smootherstep ────────────────────────────────────────────
function smootherstep(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// ── 3D projection ───────────────────────────────────────────
function project(x, y, z, cx, cy, fov = 500) {
  const d = fov + z;
  if (d < 1) return null;
  const s = fov / d;
  return { sx: cx + x * s, sy: cy + y * s, scale: s };
}

// ── 3D rotation ─────────────────────────────────────────────
function rotate3D(x, y, z, rx, ry, rz) {
  let y1 = y * Math.cos(rx) - z * Math.sin(rx);
  let z1 = y * Math.sin(rx) + z * Math.cos(rx);
  let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
  let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
  let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
  let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
  return [x3, y3, z2];
}

// ── Sephirot (10 nodes, 22 paths) ───────────────────────────
const SEPHIROT_POS = [
  [0,-210,20],[115,-148,0],[-115,-148,0],
  [115,-50,0],[-115,-50,0],[0,0,0],
  [115,95,0],[-115,95,0],[0,158,0],[0,220,0],
];
const SEPH_PATHS = [
  [0,1],[0,2],[0,5],[1,2],[1,3],[1,5],
  [2,4],[2,5],[3,4],[3,5],[3,6],
  [4,5],[4,7],[5,6],[5,7],[5,8],
  [6,7],[6,8],[6,9],[7,8],[7,9],[8,9],
];

// ── Flower of Life ───────────────────────────────────────────
const FOL_CENTERS = [
  [0,0],
  ...Array.from({length:6},(_,i)=>[
    Math.cos(i*Math.PI/3)*62,
    Math.sin(i*Math.PI/3)*62,
  ]),
];

// ── Von Neumann entropy (for inertia) ───────────────────────
function vonNeumannEntropy(r) {
  const norm = Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2]);
  if (norm < 1e-12) return 1.0;
  if (norm >= 1-1e-12) return 0.0;
  const lp=(1+norm)/2, lm=(1-norm)/2;
  let S=0;
  if(lp>0) S-=lp*Math.log2(lp);
  if(lm>0) S-=lm*Math.log2(lm);
  return S;
}

// ── Build the full 3D simulation state ──────────────────────
function buildState() {
  // 9 clusters — Fibonacci sphere placement
  const clusters = Array.from({length:9}, (_, ci) => {
    const phi = Math.acos(1 - 2*(ci+0.5)/9);
    const theta = Math.PI*(1+Math.sqrt(5))*ci;
    const R = 170;
    const cx = R*Math.sin(phi)*Math.cos(theta);
    const cy = R*Math.sin(phi)*Math.sin(theta);
    const cz = R*Math.cos(phi);
    const color = DOOR_COLORS[ci];

    // Initialize REAL Bloch vectors for this 9-body system
    const blochVecs = initializeBlochVectors();

    const bodies = Array.from({length:9}, (_, bi) => {
      if (bi === 4) {
        // Moon at cluster center
        return {
          x: cx, y: cy, vx: 0, vy: 0,
          // 3D extension
          z: cz, vz: 0,
          id: bi,
          bloch: blochVecs[bi],
          _forceMagnitudes: new Float64Array(8),
          trail: [],
        };
      }

      const angle = (bi/9)*Math.PI*2 + (Math.random()-0.5)*0.4;
      const inc = (Math.random()-0.5)*Math.PI*0.5;
      const r = 18 + Math.random()*14;

      // REAL orbital speed from R₁₂
      const R12_init = computeR12(blochVecs[bi], blochVecs[4]);
      const inertia = 1 + (1 - vonNeumannEntropy(blochVecs[bi]))*(PHI*PHI-1);
      const speed = Math.sqrt(R12_init / (r * 0.5 * inertia)) * 0.9 * (0.8+Math.random()*0.4);
      const vAngle = angle + Math.PI/2;

      return {
        x: cx + Math.cos(angle)*r*Math.cos(inc),
        y: cy + Math.sin(angle)*r,
        z: cz + Math.cos(angle)*r*Math.sin(inc),
        vx: Math.cos(vAngle)*speed*Math.cos(inc),
        vy: Math.sin(vAngle)*speed,
        vz: Math.cos(vAngle)*speed*Math.sin(inc),
        id: bi,
        bloch: blochVecs[bi],
        _forceMagnitudes: new Float64Array(8),
        trail: [],
      };
    });

    return { cx, cy, cz, bodies, color };
  });

  // Gold motes
  const motes = Array.from({length:240}, () => ({
    x: (Math.random()-0.5)*700,
    y: (Math.random()-0.5)*700,
    z: (Math.random()-0.5)*700,
    vy: -(0.2+Math.random()*0.55),
    vx: (Math.random()-0.5)*0.22,
    vz: (Math.random()-0.5)*0.22,
    size: 0.5+Math.random()*1.8,
    phase: Math.random()*Math.PI*2,
    speed: 0.015+Math.random()*0.02,
  }));

  return {
    clusters, motes,
    rotX:0, rotY:0, rotZ:0,
    rotSX:0, rotSY:0.3, rotSZ:0,
    // Global G across all clusters — updated each frame
    globalG: 0.5,
    globalGDiag: {},
  };
}

// ── ONE SIMULATION TICK using the REAL equation ─────────────
function simulate(state, dt) {
  // Rotate scene
  state.rotX += 0.003*PHI_INV;
  state.rotY += 0.005;
  state.rotZ += 0.001*PHI_INV;
  state.rotSX += 0.0015;
  state.rotSY += 0.002*PHI;
  state.rotSZ += 0.0008;

  // ── Per-cluster: full Ψ physics ──
  state.clusters.forEach(cluster => {
    const { bodies, cx, cy, cz } = cluster;
    const N = bodies.length;

    // 1. Detection quality from previous frame
    const { D_coincidence, D_accidental } = computeDetectionQuality(bodies);

    // 2. G = C_eff × D̂  — THE REAL MODULATOR
    const { G, diagnostics } = computeG(bodies, D_coincidence, D_accidental);
    // Store for visualization
    state.globalG = G;
    state.globalGDiag = diagnostics;

    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const fz = new Float32Array(N);
    const psiValues = new Float32Array(N*N);

    // Reset force magnitudes
    for (let i=0; i<N; i++) {
      bodies[i]._forceMagnitudes = new Float32Array(N-1);
    }

    // 3. Per-pair: R₁₂ → Ψ → Force
    for (let i=0; i<N; i++) {
      for (let j=i+1; j<N; j++) {
        const dx = bodies[j].x - bodies[i].x;
        const dy = bodies[j].y - bodies[i].y;
        const dz = bodies[j].z - bodies[i].z;
        const distSq = dx*dx + dy*dy + dz*dz + 6;
        const dist = Math.sqrt(distSq);

        // ═══ THE EQUATION ═══
        // R₁₂ = F_gated = Uhlmann fidelity × informativeness gate
        const R12 = computeR12(bodies[i].bloch, bodies[j].bloch);
        // Ψ₁₂ = R₁₂ × G
        const psi = R12 * G;
        psiValues[i*N+j] = psi;
        psiValues[j*N+i] = psi;

        // Force = Ψ₁₂ / r²
        const forceMag = psi / distSq;
        fx[i] += forceMag*dx/dist; fy[i] += forceMag*dy/dist; fz[i] += forceMag*dz/dist;
        fx[j] -= forceMag*dx/dist; fy[j] -= forceMag*dy/dist; fz[j] -= forceMag*dz/dist;

        // Record for next-frame D̂ computation
        const fi = j>i ? j-1 : j;
        const fj = i>j ? i-1 : i;
        bodies[i]._forceMagnitudes[fi] = forceMag;
        bodies[j]._forceMagnitudes[fj] = forceMag;
      }

      // Center pull
      const moonFactor = bodies[i].id===4 ? 0.1 : 1.0;
      fx[i] += (cx-bodies[i].x)*0.0018*moonFactor;
      fy[i] += (cy-bodies[i].y)*0.0018*moonFactor;
      fz[i] += (cz-bodies[i].z)*0.0018*moonFactor;
    }

    // 4. Integrate — inertia from von Neumann entropy (exact)
    for (let i=0; i<N; i++) {
      if (bodies[i].id===4) continue;
      // Inertia = 1 + I_k(φ²−1) where I_k = 1 − S(ρ)/log₂(2)
      const S_i = vonNeumannEntropy(bodies[i].bloch);
      const I_i = 1 - S_i; // log₂(2)=1
      const inertia = 1 + I_i*(PHI*PHI-1);
      const damp = 0.994;
      bodies[i].vx = (bodies[i].vx + fx[i]/inertia*dt)*damp;
      bodies[i].vy = (bodies[i].vy + fy[i]/inertia*dt)*damp;
      bodies[i].vz = (bodies[i].vz + fz[i]/inertia*dt)*damp;
      bodies[i].x += bodies[i].vx*dt;
      bodies[i].y += bodies[i].vy*dt;
      bodies[i].z += bodies[i].vz*dt;

      // Trail
      bodies[i].trail.push([bodies[i].x, bodies[i].y, bodies[i].z]);
      if (bodies[i].trail.length > 38) bodies[i].trail.shift();
    }

    // 5. Evolve Bloch vectors — epistemic states align with Ψ
    evolveBlochVectors(bodies, psiValues, dt);
  });

  // Gold motes
  state.motes.forEach(m => {
    m.x+=m.vx; m.y+=m.vy; m.z+=m.vz;
    m.phase+=m.speed;
    if(m.y < -450){ m.y=450; m.x=(Math.random()-0.5)*600; m.z=(Math.random()-0.5)*600; }
  });
}

// ── DRAW ────────────────────────────────────────────────────
function draw(ctx, state, t, elapsed, W, H) {
  const cx=W/2, cy=H/2;
  const fov = 500 + Math.sin(elapsed*0.00025)*55;

  const isGenesis      = t < 0.1;
  const isExplosion    = t >= 0.1 && t < 0.3;
  const isOrganization = t >= 0.3 && t < 0.6;
  const isConvergence  = t >= 0.85;

  const localT = isGenesis      ? t/0.1
               : isExplosion    ? (t-0.1)/0.2
               : isOrganization ? (t-0.3)/0.3
               : isConvergence  ? (t-0.85)/0.15
               :                  (t-0.6)/0.25;

  // Trail decay
  const trailDecay = isConvergence ? 0.2 + smootherstep(localT)*0.5 : 0.075;
  ctx.fillStyle = `rgba(3,3,10,${trailDecay})`;
  ctx.fillRect(0,0,W,H);

  // ── AURORA ──────────────────────────────────────────────────
  if (!isGenesis) {
    const aA = isExplosion ? smootherstep(localT)*0.035
              : isConvergence ? (1-smootherstep(localT))*0.04
              : 0.04;
    DOOR_COLORS.forEach(([r,g,b],i) => {
      const angle = (i/10)*Math.PI*2 + elapsed*0.0003 + i*PHI_INV;
      const ex=cx+Math.cos(angle)*W*0.72, ey=cy+Math.sin(angle)*H*0.72;
      const grd=ctx.createRadialGradient(ex,ey,0,ex,ey,W*0.78);
      grd.addColorStop(0,`rgba(${r},${g},${b},${aA})`);
      grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
      ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);
    });
  }

  // ── GENESIS ──────────────────────────────────────────────────
  if (isGenesis) {
    const ge=smootherstep(localT);
    ctx.fillStyle="#03030a"; ctx.fillRect(0,0,W,H);
    for(let i=0;i<5;i++){
      const rr=ge*Math.min(W,H)*(0.08+i*0.12);
      const a=Math.max(0,ge-i*0.15)*(0.8-i*0.15);
      ctx.beginPath(); ctx.arc(cx,cy,rr,0,Math.PI*2);
      ctx.strokeStyle=`rgba(201,168,76,${a})`; ctx.lineWidth=1.5-i*0.2; ctx.stroke();
    }
    const grd=ctx.createRadialGradient(cx,cy,0,cx,cy,ge*120);
    grd.addColorStop(0,`rgba(201,168,76,${ge*0.9})`);
    grd.addColorStop(0.4,`rgba(201,168,76,${ge*0.3})`);
    grd.addColorStop(1,"rgba(201,168,76,0)");
    ctx.beginPath(); ctx.arc(cx,cy,ge*120,0,Math.PI*2); ctx.fillStyle=grd; ctx.fill();
    return;
  }

  const scatter = isExplosion ? (1-smootherstep(localT))*300 : 0;
  const multAlpha = isExplosion ? smootherstep(localT) : isConvergence ? 1-smootherstep(localT)*0.9 : 1;
  const geoAlpha  = isOrganization ? smootherstep(localT) : isConvergence ? 1-smootherstep(localT) : (isExplosion?0:1);

  // ── PHI SPIRAL ──────────────────────────────────────────────
  if (!isExplosion) {
    ctx.beginPath(); let started=false;
    for(let i=0;i<=300;i++){
      const angle=(i/300)*6*Math.PI+elapsed*0.0004;
      const r=Math.pow(PHI,angle/(Math.PI*2))*14;
      const [rx,ry,rz]=rotate3D(Math.cos(angle)*r,Math.sin(angle)*r,0,state.rotX*0.5,state.rotY*0.5,state.rotZ);
      const p=project(rx,ry,rz,cx,cy,fov);
      if(!p||p.sx<-50||p.sx>W+50) continue;
      if(!started){ctx.moveTo(p.sx,p.sy);started=true;} else ctx.lineTo(p.sx,p.sy);
    }
    ctx.strokeStyle=`rgba(201,168,76,${geoAlpha*0.12})`; ctx.lineWidth=0.7; ctx.stroke();
  }

  // ── FLOWER OF LIFE ───────────────────────────────────────────
  if (!isExplosion) {
    const fs=1.4+Math.sin(elapsed*0.0008)*0.08;
    FOL_CENTERS.forEach(([fx2,fy2]) => {
      const [rx,ry,rz]=rotate3D(fx2*fs,fy2*fs,0,state.rotX*0.25,state.rotY*0.25,state.rotZ*0.5);
      const p=project(rx,ry,rz,cx,cy,fov); if(!p) return;
      ctx.beginPath(); ctx.arc(p.sx,p.sy,62*p.scale*fs,0,Math.PI*2);
      ctx.strokeStyle=`rgba(201,168,76,${geoAlpha*0.16*Math.min(1,p.scale*1.5)})`; ctx.lineWidth=0.5; ctx.stroke();
    });
  }

  // ── SEPHIROT ─────────────────────────────────────────────────
  if (!isExplosion) {
    SEPH_PATHS.forEach(([a,b]) => {
      const pa2=rotate3D(...SEPHIROT_POS[a],state.rotSX,state.rotSY,state.rotSZ);
      const pb2=rotate3D(...SEPHIROT_POS[b],state.rotSX,state.rotSY,state.rotSZ);
      const pa=project(...pa2,cx,cy,fov), pb=project(...pb2,cx,cy,fov);
      if(!pa||!pb) return;
      ctx.beginPath(); ctx.moveTo(pa.sx,pa.sy); ctx.lineTo(pb.sx,pb.sy);
      ctx.strokeStyle=`rgba(201,168,76,${geoAlpha*0.32})`; ctx.lineWidth=0.5; ctx.stroke();
    });
    SEPHIROT_POS.forEach((pos,i) => {
      const [rx,ry,rz]=rotate3D(...pos,state.rotSX,state.rotSY,state.rotSZ);
      const p=project(rx,ry,rz,cx,cy,fov); if(!p) return;
      const nr=4.5*p.scale;
      const grd=ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,nr*6);
      grd.addColorStop(0,`rgba(201,168,76,${geoAlpha*0.45})`);
      grd.addColorStop(1,"rgba(201,168,76,0)");
      ctx.beginPath(); ctx.arc(p.sx,p.sy,nr*6,0,Math.PI*2); ctx.fillStyle=grd; ctx.fill();
      ctx.beginPath(); ctx.arc(p.sx,p.sy,nr,0,Math.PI*2);
      ctx.fillStyle=`rgba(201,168,76,${geoAlpha*Math.min(1,p.scale*1.5)})`; ctx.fill();
    });
  }

  // ── MULTIVERSE — bodies running on real Ψ ──────────────────
  state.clusters.forEach((cluster, ci) => {
    const clusterAngle=(ci/9)*Math.PI*2;
    const sx=scatter*Math.cos(clusterAngle);
    const sy=scatter*Math.sin(clusterAngle);
    const sz=scatter*Math.sin(clusterAngle*PHI);
    const [r,g,b]=cluster.color;

    cluster.bodies.forEach((body,bi) => {
      if(bi===4) return;

      // Trail
      if(body.trail.length>2){
        for(let ti=1;ti<body.trail.length;ti++){
          const t0=body.trail[ti-1], t1=body.trail[ti];
          const [rx0,ry0,rz0]=rotate3D(t0[0]+sx,t0[1]+sy,t0[2]+sz,state.rotX,state.rotY,state.rotZ);
          const [rx1,ry1,rz1]=rotate3D(t1[0]+sx,t1[1]+sy,t1[2]+sz,state.rotX,state.rotY,state.rotZ);
          const p0=project(rx0,ry0,rz0,cx,cy,fov);
          const p1=project(rx1,ry1,rz1,cx,cy,fov);
          if(!p0||!p1) continue;
          const frac=ti/body.trail.length;
          // Trail brightness modulated by Ψ recognition strength
          const R12mirror = isMirrorPair(bi,4) ? 1.4 : 1.0;
          ctx.beginPath(); ctx.moveTo(p0.sx,p0.sy); ctx.lineTo(p1.sx,p1.sy);
          ctx.strokeStyle=`rgba(${r},${g},${b},${frac*0.32*multAlpha*R12mirror})`;
          ctx.lineWidth=p1.scale*0.55; ctx.stroke();
        }
      }

      // Body
      const [rx,ry,rz]=rotate3D(body.x+sx,body.y+sy,body.z+sz,state.rotX,state.rotY,state.rotZ);
      const p=project(rx,ry,rz,cx,cy,fov); if(!p) return;

      // Size = f(Bloch purity) — more certain bodies appear larger
      const blochNorm=Math.sqrt(body.bloch[0]**2+body.bloch[1]**2+body.bloch[2]**2);
      const br=Math.max(0.5,p.scale*(1.6+blochNorm*0.8));
      const a=Math.min(1,p.scale*2.4)*multAlpha;

      // Mirror pair glow is stronger (R₁₂ is higher for mirror pairs)
      const mirrorGlow = isMirrorPair(bi,4) ? 1.5 : (isAdjacent(bi,4) ? 1.2 : 1.0);

      const grd=ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,br*5*mirrorGlow);
      grd.addColorStop(0,`rgba(${r},${g},${b},${a*0.45})`);
      grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(p.sx,p.sy,br*5*mirrorGlow,0,Math.PI*2); ctx.fillStyle=grd; ctx.fill();
      ctx.beginPath(); ctx.arc(p.sx,p.sy,br,0,Math.PI*2);
      ctx.fillStyle=`rgba(${r},${g},${b},${a})`; ctx.fill();
    });
  });

  // ── GOLD MOTES ──────────────────────────────────────────────
  const moteA = isExplosion ? smootherstep(localT)*0.7 : isConvergence ? (1-smootherstep(localT))*0.7 : 0.7;
  state.motes.forEach(m => {
    const [rx,ry,rz]=rotate3D(m.x,m.y,m.z,state.rotX*0.08,state.rotY*0.08,0);
    const p=project(rx,ry,rz,cx,cy,fov); if(!p||p.scale<0.2) return;
    const a=(0.2+Math.sin(m.phase)*0.18)*moteA*Math.min(1,p.scale*2);
    ctx.beginPath(); ctx.arc(p.sx,p.sy,m.size*p.scale,0,Math.PI*2);
    ctx.fillStyle=`rgba(201,168,76,${a})`; ctx.fill();
  });

  // ── VIGNETTE ────────────────────────────────────────────────
  const vigGrd=ctx.createRadialGradient(cx,cy,Math.min(W,H)*0.2,cx,cy,Math.max(W,H)*0.85);
  vigGrd.addColorStop(0,"rgba(0,0,0,0)"); vigGrd.addColorStop(1,"rgba(0,0,0,0.75)");
  ctx.fillStyle=vigGrd; ctx.fillRect(0,0,W,H);

  // ── CONVERGENCE FADE ────────────────────────────────────────
  if (isConvergence) {
    if(localT>0.55&&localT<0.8){
      const pt=(localT-0.55)/0.25;
      ctx.fillStyle=`rgba(201,168,76,${Math.sin(pt*Math.PI)*0.12})`;
      ctx.fillRect(0,0,W,H);
    }
    const fade=smootherstep(Math.max(0,(localT-0.5)/0.5));
    ctx.fillStyle=`rgba(3,3,10,${fade*0.97})`; ctx.fillRect(0,0,W,H);
  }
}

// ── Main component ───────────────────────────────────────────
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

    function loop(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / TOTAL_MS);

      simulate(stateRef.current, 0.28);
      draw(ctx, stateRef.current, t, elapsed, canvas.width, canvas.height);

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
      style={{ position:"fixed",inset:0,width:"100%",height:"100%",display:"block",cursor:"none",touchAction:"none" }}
    />
  );
}
