/**
 * INFINITY CURSOR
 *
 * A golden lemniscate (∞ = Bernoulli's curve) that orbits
 * the cursor position in real time.
 *
 * Lemniscate of Bernoulli:
 *   r² = a² cos(2θ)
 *   x = a cos(θ) / (1 + sin²(θ))
 *   y = a sin(θ)cos(θ) / (1 + sin²(θ))
 *
 * - Hides native cursor (cursor:none on body)
 * - Draws a trailing ∞ path rotating around mouse position
 * - Trail fades: newest = bright gold, oldest = invisible
 * - Mobile: disabled (touch doesn't have a cursor)
 * - Scales size by device pixel ratio
 */

import { useEffect, useRef } from "react";

const PHI = 1.6180339887;

export default function InfinityCursor() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const mouseRef  = useRef({ x: -999, y: -999 });
  const targetRef = useRef({ x: -999, y: -999 });
  const tRef      = useRef(0); // lemniscate phase

  useEffect(() => {
    // Skip on touch devices
    const isTouch = navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Hide native cursor
    document.body.style.cursor = "none";

    function onMouseMove(e) {
      targetRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMouseMove);

    // Trail: array of {x,y} points along the lemniscate
    const TRAIL_LEN = 120;
    const trail = [];

    function loop() {
      // Smooth follow — cursor lags slightly behind mouse
      const lag = 0.12;
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * lag;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * lag;

      // Advance lemniscate phase
      tRef.current += 0.038; // speed of orbit
      const t = tRef.current;

      // Lemniscate of Bernoulli parametric
      // a = size of the ∞
      const a = 14 + Math.sin(t * 0.11) * 2; // slight breathing
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const lx = a * Math.cos(t) / denom;
      const ly = a * Math.sin(t) * Math.cos(t) / denom;

      // Add point to trail
      trail.push({
        x: mouseRef.current.x + lx,
        y: mouseRef.current.y + ly,
      });
      if (trail.length > TRAIL_LEN) trail.shift();

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trail.length > 2 && mouseRef.current.x > -900) {
        for (let i = 1; i < trail.length; i++) {
          const frac = i / trail.length;
          const alpha = frac * frac * 0.85; // quadratic fade

          ctx.beginPath();
          ctx.moveTo(trail[i-1].x, trail[i-1].y);
          ctx.lineTo(trail[i].x,   trail[i].y);

          // Gold gradient along trail: dim → bright
          const r = Math.round(180 + frac * 55);
          const g = Math.round(140 + frac * 65);
          const b = Math.round(50  + frac * 26);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 0.8 + frac * 1.2;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Bright dot at cursor center
        const tipAlpha = 0.6 + Math.sin(t * 3) * 0.15;
        const tipGrd = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 6
        );
        tipGrd.addColorStop(0, `rgba(235,205,110,${tipAlpha})`);
        tipGrd.addColorStop(1, "rgba(201,168,76,0)");
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = tipGrd;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      document.body.style.cursor = "";
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
