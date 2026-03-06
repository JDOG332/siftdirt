/**
 * TOUCH BLOOM — Option B
 *
 * Tap-only. No drag tracking. No preventDefault. Scroll is free.
 *
 * On touchstart:
 *   → Full lemniscate (∞) erupts from tap point
 *   → Scale: 0 → full in T×PHIi = 0.382s  (PHI easeOut)
 *   → Orbiting dot races the curve for T×PHI² = 1.618s total
 *   → Curve breathes: alpha pulses on PHI rhythm
 *
 * On touchend:
 *   → Curve fractures into gold + blue motes
 *   → Motes drift upward, fade over T×PHI = 1.000s
 *   → Each mote follows slight PHI spiral outward
 *
 * Multiple simultaneous touches → independent blooms
 *
 * OPACITY SYSTEM — PHI ladder only
 *   O.whisper = PHIi⁵ = 0.090
 *   O.ghost   = PHIi⁴ = 0.146
 *   O.dim     = PHIi³ = 0.236
 *   O.mid     = PHIi² = 0.382
 *   O.pres    = PHIi  = 0.618
 *   O.full    = 1.000
 *
 * TIMING — PHI clock
 *   T       = PHIi = 0.618s  (base)
 *   bloom   = T × PHIi = 0.382s
 *   life    = T × PHI² = 1.618s
 *   scatter = T × PHI  = 1.000s
 */

import { useEffect, useRef } from "react";

const PHI   = 1.6180339887;
const PHIi  = 0.6180339887;
const PHI2  = 2.6180339887;
const PHIi2 = 0.3819660113;
const PHIi3 = 0.2360679775;
const PHIi4 = 0.1458980338;
const PHIi5 = 0.0901699437;

const T_BLOOM   = PHIi * PHIi * 1000;   // 0.382s — bloom in
const T_LIFE    = PHIi * PHI2 * 1000;   // 1.618s — total life
const T_SCATTER = PHIi * PHI  * 1000;   // 1.000s — scatter fade

const O = {
  whisper: PHIi5,
  ghost:   PHIi4,
  dim:     PHIi3,
  mid:     PHIi2,
  pres:    PHIi,
  full:    1.0,
};

// Easing
function eo3(t) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3); }
function eio(t) { t=Math.max(0,Math.min(1,t)); return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }

// Gold color with alpha
const GOLD  = a => [201, 168,  76, a];
const GOLDB = a => [235, 205, 110, a];
const BLUE  = a => [120, 185, 245, a];

function rgba([r,g,b,a]) { return `rgba(${r},${g},${b},${a})`; }

// ── Lemniscate of Bernoulli ──────────────────────────────────────
// x(t) = a·cos(t) / (1 + sin²(t))
// y(t) = a·sin(t)·cos(t) / (1 + sin²(t))
function lemPoint(a_size, theta) {
  const d = 1 + Math.sin(theta) * Math.sin(theta);
  return [
    a_size * Math.cos(theta) / d,
    a_size * Math.sin(theta) * Math.cos(theta) / d,
  ];
}

// ── Bloom class ──────────────────────────────────────────────────
class Bloom {
  constructor(x, y, screenW) {
    this.x = x;
    this.y = y;
    this.born = performance.now();
    this.lifted = null;    // time of touchend
    this.dead = false;

    // Size: PHI-derived from screen width
    // Mobile: screenW × PHIi³ ≈ 22% of viewport width
    this.size = screenW * PHIi3;

    // Orbit phase: random start so multiple taps don't sync
    this.phase = Math.random() * Math.PI * 2;

    // Motes — created on lift
    this.motes = [];
  }

  lift() {
    if (this.lifted) return;
    this.lifted = performance.now();

    // Fracture into motes — count = PHI-ladder (13 = Fibonacci)
    const count = 13;
    for (let i = 0; i < count; i++) {
      const frac = i / count;
      // Place motes along the lemniscate curve
      const theta = frac * Math.PI * 2;
      const [lx, ly] = lemPoint(this.size, theta);

      // PHI spiral outward velocity
      const angle  = theta + Math.PI * PHIi; // offset by golden angle
      const speed  = this.size * PHIi4 * (1 + Math.random() * PHIi);
      const isGold = Math.random() > O.dim;

      this.motes.push({
        x: this.x + lx,
        y: this.y + ly,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - speed * PHIi,  // slight upward drift
        alpha: O.pres + Math.random() * O.dim,
        size: this.size * PHIi5 * (0.5 + Math.random()),
        color: isGold ? GOLD : BLUE,
        decay: O.dim / (T_SCATTER / 16),
      });
    }
  }

  isDead() { return this.dead; }

  draw(ctx, now) {
    const age = now - this.born;

    if (!this.lifted) {
      // ── ALIVE: draw lemniscate + orbiting dot ──────────────────
      if (age > T_LIFE) {
        // Auto-fade after full life if never lifted
        this.lift();
      }

      // Bloom-in scale: 0 → 1 over T_BLOOM
      const bloomT = eo3(Math.min(1, age / T_BLOOM));

      // Breathing: alpha pulses on PHI rhythm
      const breathCycle = (age / (T_LIFE * PHIi)) % 1;  // one breath per T_LIFE×PHIi
      const breathA = O.mid + O.ghost * Math.sin(breathCycle * Math.PI * 2);

      // Orbit phase advances over time
      this.phase += 0.042;  // slightly faster than desktop version

      const a = this.size * bloomT;

      // ── Draw full lemniscate curve ─────────────────────────────
      const STEPS = 180;
      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const theta = (i / STEPS) * Math.PI * 2;
        const [lx, ly] = lemPoint(a, theta);
        const px = this.x + lx, py = this.y + ly;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = rgba(GOLD(breathA * bloomT));
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // ── Outer ring at full lemniscate extent ───────────────────
      ctx.beginPath();
      ctx.arc(this.x, this.y, a * PHIi, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(GOLD(O.ghost * bloomT));
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // ── Orbiting dot ───────────────────────────────────────────
      const [dotX, dotY] = lemPoint(a, this.phase);
      const dx = this.x + dotX, dy = this.y + dotY;

      // Gold glow around dot
      const grd = ctx.createRadialGradient(dx, dy, 0, dx, dy, a * PHIi3);
      grd.addColorStop(0, rgba(GOLDB(O.pres * bloomT)));
      grd.addColorStop(PHIi, rgba(GOLD(O.mid * bloomT)));
      grd.addColorStop(1, rgba(GOLD(0)));
      ctx.beginPath();
      ctx.arc(dx, dy, a * PHIi3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Bright dot center
      ctx.beginPath();
      ctx.arc(dx, dy, a * PHIi5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(GOLDB(O.full * bloomT));
      ctx.fill();

      // ── Center tap indicator ───────────────────────────────────
      const cGrd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, a * PHIi4 * PHI);
      cGrd.addColorStop(0, rgba(GOLDB(O.mid * bloomT)));
      cGrd.addColorStop(1, rgba(GOLD(0)));
      ctx.beginPath();
      ctx.arc(this.x, this.y, a * PHIi4 * PHI, 0, Math.PI * 2);
      ctx.fillStyle = cGrd;
      ctx.fill();

    } else {
      // ── SCATTERED: draw motes ─────────────────────────────────
      const scatterAge = now - this.lifted;
      const scatterT = scatterAge / T_SCATTER;

      let anyAlive = false;
      this.motes.forEach(m => {
        if (m.alpha <= 0) return;
        anyAlive = true;

        // PHI gravity: slight pull downward, PHIi upward initial
        m.x += m.vx;
        m.y += m.vy;
        m.vy += PHIi5 * 0.8;     // gentle gravity
        m.vx *= 0.98;
        m.alpha -= m.decay;

        const a = Math.max(0, m.alpha);
        ctx.beginPath();
        ctx.arc(m.x, m.y, Math.max(0.5, m.size * (a / O.pres)), 0, Math.PI * 2);
        ctx.fillStyle = rgba(m.color(a));
        ctx.fill();

        // Tiny glow on each mote
        if (a > O.ghost) {
          const mg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size * 2);
          mg.addColorStop(0, rgba(m.color(a * PHIi2)));
          mg.addColorStop(1, rgba(m.color(0)));
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = mg;
          ctx.fill();
        }
      });

      if (!anyAlive && scatterT > 1) {
        this.dead = true;
      }
    }
  }
}

// ── Main component ───────────────────────────────────────────────
export default function TouchTrail() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const blooms    = useRef(new Map());  // touchId → Bloom

  useEffect(() => {
    // Only on touch devices
    if (navigator.maxTouchPoints === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // touchstart → create bloom
    function onStart(e) {
      const W = window.innerWidth;
      Array.from(e.changedTouches).forEach(touch => {
        blooms.current.set(
          touch.identifier,
          new Bloom(touch.clientX, touch.clientY, W)
        );
      });
    }

    // touchend / touchcancel → lift bloom → scatter
    function onEnd(e) {
      Array.from(e.changedTouches).forEach(touch => {
        const b = blooms.current.get(touch.identifier);
        if (b) b.lift();
      });
    }

    // NO touchmove handler → browser handles scroll freely
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend",   onEnd,   { passive: true });
    window.addEventListener("touchcancel",onEnd,   { passive: true });

    // Render loop
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();

      blooms.current.forEach((bloom, id) => {
        bloom.draw(ctx, now);
        if (bloom.isDead()) blooms.current.delete(id);
      });

      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend",   onEnd);
      window.removeEventListener("touchcancel",onEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 99999,
      }}
    />
  );
}
