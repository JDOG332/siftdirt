/**
 * INFINITY CURSOR
 *
 * A golden lemniscate (∞ = Bernoulli's curve) that orbits
 * the cursor/finger position in real time.
 *
 * Works on BOTH desktop (mouse) and mobile (touch).
 * Same pure trailing ∞ on every device.
 *
 * Lemniscate of Bernoulli:
 *   x = a cos(θ) / (1 + sin²(θ))
 *   y = a sin(θ)cos(θ) / (1 + sin²(θ))
 *
 * - Hides native cursor on desktop (cursor:none on body)
 * - Draws a trailing ∞ path rotating around position
 * - Trail fades: newest = bright gold, oldest = invisible
 * - Button proximity check on mobile — suppresses near tappable elements
 */

import { useEffect, useRef } from "react";

const PHI = 1.6180339887;
const BUTTON_PAD = 22;

function nearInteractive(x, y) {
  const els = document.querySelectorAll('button, a, input, textarea, select, [role="button"]');
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (
      x >= r.left  - BUTTON_PAD &&
      x <= r.right + BUTTON_PAD &&
      y >= r.top   - BUTTON_PAD &&
      y <= r.bottom + BUTTON_PAD
    ) return true;
  }
  return false;
}

export default function InfinityCursor() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const posRef    = useRef({ x: -999, y: -999 });   // current smoothed position
  const targetRef = useRef({ x: -999, y: -999 });   // raw input position
  const tRef      = useRef(0);
  const activeRef = useRef(true); // false when finger is near a button

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const isTouch = navigator.maxTouchPoints > 0;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Input: mouse ──
    if (!isTouch) {
      document.body.style.cursor = "none";
      window.addEventListener("mousemove", (e) => {
        targetRef.current = { x: e.clientX, y: e.clientY };
        activeRef.current = true;
      });
    }

    // ── Input: touch ──
    function onTouchStart(e) {
      const t = e.touches[0];
      if (!t) return;
      if (nearInteractive(t.clientX, t.clientY)) {
        activeRef.current = false;
        return;
      }
      activeRef.current = true;
      targetRef.current = { x: t.clientX, y: t.clientY };
      posRef.current    = { x: t.clientX, y: t.clientY };
    }
    function onTouchMove(e) {
      const t = e.touches[0];
      if (!t) return;
      if (nearInteractive(t.clientX, t.clientY)) {
        activeRef.current = false;
        return;
      }
      activeRef.current = true;
      targetRef.current = { x: t.clientX, y: t.clientY };
    }
    function onTouchEnd() {
      activeRef.current = false;
    }

    if (isTouch) {
      window.addEventListener("touchstart",  onTouchStart, { passive: true });
      window.addEventListener("touchmove",   onTouchMove,  { passive: true });
      window.addEventListener("touchend",    onTouchEnd,   { passive: true });
      window.addEventListener("touchcancel", onTouchEnd,   { passive: true });
    }

    // Trail
    const TRAIL_LEN = 120;
    const trail = [];

    function loop() {
      // Smooth follow
      const lag = isTouch ? 0.22 : 0.12;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lag;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lag;

      tRef.current += 0.038;
      const t = tRef.current;

      const a = 14 + Math.sin(t * 0.11) * 2;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const lx = a * Math.cos(t) / denom;
      const ly = a * Math.sin(t) * Math.cos(t) / denom;

      if (activeRef.current || !isTouch) {
        trail.push({
          x: posRef.current.x + lx,
          y: posRef.current.y + ly,
        });
      }
      if (trail.length > TRAIL_LEN) trail.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trail.length > 2 && posRef.current.x > -900 && (activeRef.current || !isTouch)) {
        for (let i = 1; i < trail.length; i++) {
          const frac = i / trail.length;
          const alpha = frac * frac * 0.85;

          ctx.beginPath();
          ctx.moveTo(trail[i-1].x, trail[i-1].y);
          ctx.lineTo(trail[i].x,   trail[i].y);

          const r = Math.round(180 + frac * 55);
          const g = Math.round(140 + frac * 65);
          const b = Math.round(50  + frac * 26);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 0.8 + frac * 1.2;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Bright dot at center
        const tipAlpha = 0.6 + Math.sin(t * 3) * 0.15;
        const tipGrd = ctx.createRadialGradient(
          posRef.current.x, posRef.current.y, 0,
          posRef.current.x, posRef.current.y, 6
        );
        tipGrd.addColorStop(0, `rgba(235,205,110,${tipAlpha})`);
        tipGrd.addColorStop(1, "rgba(201,168,76,0)");
        ctx.beginPath();
        ctx.arc(posRef.current.x, posRef.current.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = tipGrd;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      if (!isTouch) document.body.style.cursor = "";
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

