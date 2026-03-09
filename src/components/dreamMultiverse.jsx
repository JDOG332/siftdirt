import { useRef, useEffect } from "react";
import { PHI } from "../data.js";
import {
  psiSimulateStep, initializeBlochVectors,
  computeR12, computeInertia
} from "../psi-engine.js";

/* ============================================================
   DREAM MULTIVERSE — Exact Ψ N-body simulation
   
   Every force: Ψ₁₂ = R₁₂ × (C_eff · D̂) / r²
   R₁₂ = Uhlmann fidelity × informativeness gate (Bloch vectors)
   C_eff = weighted JSD convergence × redundancy penalty
   D̂ = detection quality (structured vs unstructured signal)
   
   Same equation at every scale. The recursion IS the proof.
   
   DEPTH 1: The Dance — zoom in, zoom out, collapse to dot
   DEPTH 2: The Veil Parts — stars gather, split, reveal truth
   ============================================================ */

const CLUSTER_COLORS = [
  "#3a3a5c", "#7b68ee", "#c9a84c", "#e05050", "#e8e8f0",
  "#8fbc8f", "#4fc3f7", "#ff9800", "#ce93d8",
];
const MIRROR_PAIRS = [[0,8],[1,7],[2,6],[3,5]];

export default function DreamMultiverseCanvas({ depth, onVeilParted }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const frameRef = useRef(null);
  const depthRef = useRef(depth);
  const onVeilPartedRef = useRef(onVeilParted);
  depthRef.current = depth;
  onVeilPartedRef.current = onVeilParted;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Mobile: 2 levels (9×9 = 81 bodies). Desktop: 3 levels (9×9×9 = 729 bodies).
    const DEPTH_LEVELS = isMobile ? 2 : 3;

    function resize() {
      const W = canvas.parentElement?.clientWidth || window.innerWidth;
      const H = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { W, H };
    }

    let { W, H } = resize();
    const CX = W / 2, CY = H / 2;
    const BASE_R = Math.min(W, H) * 0.40;

    // ===== MULTIVERSE INIT =====
    let allClusters = [];

    if (!stateRef.current || stateRef.current._levels !== DEPTH_LEVELS) {
      if (DEPTH_LEVELS === 3) {
        // Desktop: 9 hyper × 9 super × 9 cluster = 729
        // Each level gets its own Bloch vectors — same equation at every scale
        const hyperBloch = initializeBlochVectors();
        const hypers = Array.from({ length: 9 }, (_, hi) => {
          const bloch = hyperBloch[hi];
          const inertia = computeInertia(bloch);
          const angle = (hi/9)*Math.PI*2 + (Math.random()-0.5)*0.3;
          const r = hi === 4 ? 0 : BASE_R * (0.55 + Math.random()*0.35);
          const R12_init = hi === 4 ? 0 : computeR12(bloch, hyperBloch[4]);
          const speed = hi === 4 ? 0 : Math.sqrt(R12_init/(Math.max(r,1)*2*inertia))*0.03;
          const va = angle + Math.PI/2;
          const hx = CX + Math.cos(angle)*r, hy = CY + Math.sin(angle)*r;
          const superBloch = initializeBlochVectors();
          const supers = Array.from({ length: 9 }, (_, si) => {
            const sbloch = superBloch[si];
            const sinertia = computeInertia(sbloch);
            const sa = (si/9)*Math.PI*2 + (Math.random()-0.5)*0.4;
            const sr = si === 4 ? 0 : (hi === 4 ? 50 : 35) * (0.6 + Math.random()*0.5);
            const sR12 = si === 4 ? 0 : computeR12(sbloch, superBloch[4]);
            const sspeed = si === 4 ? 0 : Math.sqrt(sR12/(Math.max(sr,1)*2*sinertia))*0.07;
            const sva = sa + Math.PI/2;
            const sx = hx + Math.cos(sa)*sr, sy = hy + Math.sin(sa)*sr;
            const clusterBloch = initializeBlochVectors();
            const clusters = Array.from({ length: 9 }, (_, ci) => {
              const cbloch = clusterBloch[ci];
              const cinertia = computeInertia(cbloch);
              const ca = (ci/9)*Math.PI*2 + (Math.random()-0.5)*0.5;
              const cr = ci === 4 ? 0 : (hi===4&&si===4 ? 18 : 12) * (0.6 + Math.random()*0.5);
              const cR12 = ci === 4 ? 0 : computeR12(cbloch, clusterBloch[4]);
              const cspeed = ci === 4 ? 0 : Math.sqrt(cR12/(Math.max(cr,1)*2*cinertia))*0.14;
              const cva = ca + Math.PI/2;
              const ccx = sx + Math.cos(ca)*cr, ccy = sy + Math.sin(ca)*cr;
              return {
                x: ccx, y: ccy, vx: Math.cos(cva)*cspeed, vy: Math.sin(cva)*cspeed,
                id: ci, bloch: cbloch, _forceMagnitudes: new Float64Array(8),
                veilX: Math.random() * W, veilY: Math.random() * H,
                hi, si, ci,
              };
            });
            return { x: sx, y: sy, vx: Math.cos(sva)*sspeed, vy: Math.sin(sva)*sspeed,
              id: si, bloch: sbloch, _forceMagnitudes: new Float64Array(8), clusters };
          });
          return { x: hx, y: hy, vx: Math.cos(va)*speed, vy: Math.sin(va)*speed,
            id: hi, bloch, _forceMagnitudes: new Float64Array(8), supers };
        });
        stateRef.current = { hypers, _levels: 3 };
      } else {
        // Mobile: 9 super × 9 cluster = 81 (skip hyper level)
        const superBloch = initializeBlochVectors();
        const supers = Array.from({ length: 9 }, (_, si) => {
          const bloch = superBloch[si];
          const inertia = computeInertia(bloch);
          const sa = (si/9)*Math.PI*2 + (Math.random()-0.5)*0.3;
          const sr = si === 4 ? 0 : BASE_R * (0.55 + Math.random()*0.35);
          const R12_init = si === 4 ? 0 : computeR12(bloch, superBloch[4]);
          const sspeed = si === 4 ? 0 : Math.sqrt(R12_init/(Math.max(sr,1)*2*inertia))*0.04;
          const sva = sa + Math.PI/2;
          const sx = CX + Math.cos(sa)*sr, sy = CY + Math.sin(sa)*sr;
          const clusterBloch = initializeBlochVectors();
          const clusters = Array.from({ length: 9 }, (_, ci) => {
            const cbloch = clusterBloch[ci];
            const cinertia = computeInertia(cbloch);
            const ca = (ci/9)*Math.PI*2 + (Math.random()-0.5)*0.5;
            const cr = ci === 4 ? 0 : (si===4 ? 35 : 22) * (0.6 + Math.random()*0.5);
            const cR12 = ci === 4 ? 0 : computeR12(cbloch, clusterBloch[4]);
            const cspeed = ci === 4 ? 0 : Math.sqrt(cR12/(Math.max(cr,1)*2*cinertia))*0.1;
            const cva = ca + Math.PI/2;
            const ccx = sx + Math.cos(ca)*cr, ccy = sy + Math.sin(ca)*cr;
            return {
              x: ccx, y: ccy, vx: Math.cos(cva)*cspeed, vy: Math.sin(cva)*cspeed,
              id: ci, bloch: cbloch, _forceMagnitudes: new Float64Array(8),
              veilX: Math.random() * W, veilY: Math.random() * H,
              hi: 0, si, ci,
            };
          });
          return { x: sx, y: sy, vx: Math.cos(sva)*sspeed, vy: Math.sin(sva)*sspeed,
            id: si, bloch, _forceMagnitudes: new Float64Array(8), clusters };
        });
        stateRef.current = { supers, _levels: 2 };
      }
    }

    // Flatten
    const state = stateRef.current;
    allClusters = [];
    if (state._levels === 3) {
      for (const hc of state.hypers)
        for (const sc of hc.supers)
          for (const cl of sc.clusters)
            allClusters.push(cl);
    } else {
      for (const sc of state.supers)
        for (const cl of sc.clusters)
          allClusters.push(cl);
    }

    // Assign veil targets — evenly spread across screen like a curtain
    const totalBodies = allClusters.length;
    allClusters.forEach((cl, i) => {
      const cols = Math.ceil(Math.sqrt(totalBodies * (W / H)));
      const rows = Math.ceil(totalBodies / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);
      cl.veilX = (col + 0.5) / cols * W + (Math.random() - 0.5) * (W / cols * 0.6);
      cl.veilY = (row + 0.5) / rows * H + (Math.random() - 0.5) * (H / rows * 0.6);
    });

    const speedScale = Math.max(1, 1200 / Math.max(W, H));
    const zoomTarget = [0,1,2,3,5,6,7,8][Math.floor(Math.random()*8)];

    let mvTime = 0;
    let veilParted = false;

    function simulate(morphPhase, partProgress) {
      if (morphPhase === "dance") {
        if (state._levels === 3) {
          // Exact Ψ at hyper level
          psiSimulateStep(state.hypers, 0.4 * speedScale, 70, 0.9998, CX, CY, 0.00004 * speedScale);
          // Exact Ψ at super level — same equation, smaller scale
          for (const hc of state.hypers)
            psiSimulateStep(hc.supers, 0.35 * speedScale, 28, 0.9996, hc.x, hc.y, 0.0002 * speedScale);
          // Exact Ψ at cluster level — same equation, smallest scale
          for (const hc of state.hypers)
            for (const sc of hc.supers)
              psiSimulateStep(sc.clusters, 0.28 * speedScale, 8, 0.9993, sc.x, sc.y, 0.0008 * speedScale);
        } else {
          // Mobile 2-level: exact Ψ at both scales
          psiSimulateStep(state.supers, 0.4 * speedScale, 50, 0.9998, CX, CY, 0.00006 * speedScale);
          for (const sc of state.supers)
            psiSimulateStep(sc.clusters, 0.32 * speedScale, 10, 0.9994, sc.x, sc.y, 0.0006 * speedScale);
        }
        return;
      }

      // During veil: pull toward veil positions (+ part offset)
      for (const cl of allClusters) {
        let tx = cl.veilX;
        let ty = cl.veilY;

        // Parting: left side goes left, right side goes right
        if (partProgress > 0) {
          const side = cl.veilX < CX ? -1 : 1;
          tx += side * partProgress * W * 0.55;
        }

        const dx = tx - cl.x;
        const dy = ty - cl.y;
        const pull = morphPhase === "gather" ? 0.06 : 0.02;
        cl.vx += dx * pull;
        cl.vy += dy * pull;
        cl.vx *= 0.88;
        cl.vy *= 0.88;
        cl.x += cl.vx;
        cl.y += cl.vy;
      }
    }

    function drawBodies(cameraZoom, cameraPanX, cameraPanY, useCamera, brightness) {
      if (useCamera) {
        ctx.save();
        ctx.translate(CX, CY);
        ctx.scale(cameraZoom, cameraZoom);
        ctx.translate(-CX + cameraPanX, -CY + cameraPanY);
      }

      // Mirror triangles — geometry hint, no per-body gradients
      if (brightness < 0.1) {
        const mirrorSource = state._levels === 3 ? state.hypers : state.supers;
        for (const [a, b] of MIRROR_PAIRS) {
          const ha = mirrorSource[a], hb = mirrorSource[b], hm = mirrorSource[4];
          ctx.beginPath(); ctx.moveTo(ha.x, ha.y); ctx.lineTo(hm.x, hm.y); ctx.lineTo(hb.x, hb.y); ctx.closePath();
          ctx.fillStyle = "rgba(201,168,76,0.003)"; ctx.strokeStyle = "rgba(201,168,76,0.008)";
          ctx.lineWidth = 0.3; ctx.fill(); ctx.stroke();
        }
      }

      // ── All particles: batched by type, zero gradient objects per frame ──
      // Uses shadowBlur + 'lighter' compositing for additive glow — GPU-native, no GC pressure.
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Batch 1 — regular cluster particles (ci !== 4)
      ctx.shadowBlur = 3;
      const alphaReg = 0.22 + brightness * 0.04;
      for (const cl of allClusters) {
        if (cl.ci === 4) continue;
        const cColor = CLUSTER_COLORS[cl.ci];
        ctx.shadowColor = cColor;
        ctx.fillStyle = cColor;
        ctx.globalAlpha = alphaReg;
        ctx.beginPath();
        ctx.arc(cl.x, cl.y, 0.7 + brightness * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Batch 2 — sub-moons (ci === 4, not core)
      ctx.shadowBlur = 7;
      ctx.fillStyle = "#d0d0e8";
      ctx.shadowColor = "#d0d0e8";
      ctx.globalAlpha = 0.55;
      for (const cl of allClusters) {
        const isCore = cl.hi === 4 && cl.si === 4 && cl.ci === 4;
        if (cl.ci !== 4 || isCore) continue;
        ctx.beginPath();
        ctx.arc(cl.x, cl.y, 1.2 + brightness * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Batch 3 — core moon (singleton)
      ctx.shadowBlur = 22;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(255,255,255,0.95)";
      ctx.globalAlpha = 0.9;
      for (const cl of allClusters) {
        if (!(cl.hi === 4 && cl.si === 4 && cl.ci === 4)) continue;
        ctx.beginPath();
        ctx.arc(cl.x, cl.y, 2.2 + brightness * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // resets compositeOp, shadowBlur, globalAlpha in one call

      if (useCamera) ctx.restore();
    }

    // ===== MAIN LOOP =====
    let animStart = null;

    function loop(now) {
      if (depthRef.current >= 2 && animStart === null) animStart = now;
      const t = animStart ? (now - animStart) / 1000 : 0;

      ctx.clearRect(0, 0, W, H);

      // === DEPTH 2: One continuous animation — zoom in → collapse → expand ===
      if (depthRef.current === 2) {
        simulate("dance", 0);

        // Timeline: three seamless phases driven by one clock
        // Phase A: 0.618→5.236 — zoom 5→1, pan to center
        // Phase B: 5.236→8.472 — zoom 1→0.04, glow builds (collapse)
        // Phase C: 8.472→12.708 — zoom 0.04→1, glow fades (expansion)
        const A_START = 0.618, A_END = 5.236;
        const B_END = 8.472;
        const C_END = B_END + 4.236; // 12.708

        const target = (state._levels === 3 ? state.hypers : state.supers)[zoomTarget];

        // Compute progress for each phase (clamped 0→1)
        const aT = Math.max(0, Math.min(1, (t - A_START) / (A_END - A_START)));
        const bT = Math.max(0, Math.min(1, (t - A_END) / (B_END - A_END)));
        const cT = Math.max(0, Math.min(1, (t - B_END) / (C_END - B_END)));

        // Smoothstep easing for all phases
        const aE = aT * aT * (3 - 2 * aT);
        const bE = bT * bT * (3 - 2 * bT);
        const cE = cT * cT * (3 - 2 * cT);

        // Zoom: 5→1→0.04→1 (one continuous value)
        let zoom, panX, panY;
        if (t < A_END) {
          zoom = 5 + (1 - 5) * aE;
          panX = (CX - target.x) * (1 - aE);
          panY = (CY - target.y) * (1 - aE);
        } else if (t < B_END) {
          zoom = 1 + (0.04 - 1) * bE;
          panX = 0; panY = 0;
        } else {
          zoom = 0.04 + (1 - 0.04) * cE;
          panX = 0; panY = 0;
        }

        drawBodies(zoom, panX, panY, true, 0);

        // Glow: builds during collapse (bE), fades during expansion (cE)
        const glowIntensity = t < B_END ? bE : (1 - cE);
        if (glowIntensity > 0.01) {
          const glowRadius = 20 + glowIntensity * 80;
          const glowAlpha = glowIntensity * 0.9;
          const wg = ctx.createRadialGradient(CX, CY, 0, CX, CY, glowRadius);
          wg.addColorStop(0, `rgba(255,255,255,${glowAlpha})`);
          wg.addColorStop(0.4, `rgba(232,232,240,${glowAlpha * 0.5})`);
          wg.addColorStop(1, "rgba(232,232,240,0)");
          ctx.beginPath(); ctx.arc(CX, CY, glowRadius, 0, Math.PI*2);
          ctx.fillStyle = wg; ctx.fill();
        }

        // Signal poem title to crystallize at glow peak
        if (bE >= 0.95 && !veilParted) {
          veilParted = true;
          if (onVeilPartedRef.current) onVeilPartedRef.current();
        }
      }

      if (depthRef.current > 2) return;
      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);
    const handleResize = () => { ({ W, H } = resize()); };
    window.addEventListener("resize", handleResize);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

