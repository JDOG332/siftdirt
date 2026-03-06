/**
 * TOUCH TRAIL — mobile equivalent of the infinity cursor
 *
 * On touch:
 *  - A lemniscate (∞) blooms outward from the touch point
 *  - As the finger moves, a golden trail follows it
 *  - On lift, the trail fades and a small burst of motes scatters
 *
 * Multiple simultaneous touches each get their own trail.
 */

import { useEffect, useRef } from "react";

const PHI = 1.6180339887;

// One active touch stream
class TouchStream {
  constructor(id, x, y) {
    this.id = id;
    this.trail = [{ x, y }];
    this.motes = [];
    this.phase = 0;       // lemniscate phase
    this.alive = true;
    this.fadeOut = 0;     // 0→1 when lifted
  }

  addPoint(x, y) {
    this.trail.push({ x, y });
    if (this.trail.length > 80) this.trail.shift();
  }

  lift() {
    this.alive = false;
    // Scatter motes from last point
    const last = this.trail[this.trail.length - 1] || { x: 0, y: 0 };
    this.motes = Array.from({ length: 18 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3.5;
      return {
        x: last.x, y: last.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        alpha: 0.7 + Math.random() * 0.3,
        size: 1 + Math.random() * 2,
      };
    });
  }

  tick() {
    this.phase += 0.055;
    if (!this.alive) {
      this.fadeOut = Math.min(1, this.fadeOut + 0.04);
      this.motes.forEach(m => {
        m.x += m.vx; m.y += m.vy;
        m.vy += 0.06;
        m.alpha -= 0.035;
      });
      this.motes = this.motes.filter(m => m.alpha > 0);
    }
  }

  isDead() {
    return !this.alive && this.fadeOut >= 1 && this.motes.length === 0;
  }

  draw(ctx) {
    const trailAlpha = this.alive ? 1 : Math.max(0, 1 - this.fadeOut * 2);

    // Trail line
    if (this.trail.length > 1 && trailAlpha > 0) {
      for (let i = 1; i < this.trail.length; i++) {
        const frac = i / this.trail.length;
        const a = frac * frac * 0.7 * trailAlpha;
        const r = Math.round(180 + frac * 55);
        const g = Math.round(140 + frac * 65);
        const b = Math.round(50  + frac * 26);
        ctx.beginPath();
        ctx.moveTo(this.trail[i-1].x, this.trail[i-1].y);
        ctx.lineTo(this.trail[i].x,   this.trail[i].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
        ctx.lineWidth = 0.8 + frac * 1.8;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    }

    // Lemniscate bloom at current touch point
    const last = this.trail[this.trail.length - 1];
    if (last && trailAlpha > 0) {
      const t = this.phase;
      const a_size = 16 + Math.sin(t * 0.08) * 3;

      // Draw full lemniscate loop (parametric, 120 steps)
      const steps = 120;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const denom = 1 + Math.sin(theta) * Math.sin(theta);
        const lx = a_size * Math.cos(theta) / denom;
        const ly = a_size * Math.sin(theta) * Math.cos(theta) / denom;
        const px = last.x + lx;
        const py = last.y + ly;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(201,168,76,${0.22 * trailAlpha})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Moving dot on the lemniscate
      const denom2 = 1 + Math.sin(t) * Math.sin(t);
      const dotX = last.x + a_size * Math.cos(t) / denom2;
      const dotY = last.y + a_size * Math.sin(t) * Math.cos(t) / denom2;
      const grd = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 5);
      grd.addColorStop(0, `rgba(235,205,110,${0.85 * trailAlpha})`);
      grd.addColorStop(1, "rgba(201,168,76,0)");
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Center glow at finger position
      const cGrd = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 10);
      cGrd.addColorStop(0, `rgba(235,205,110,${0.35 * trailAlpha})`);
      cGrd.addColorStop(1, "rgba(201,168,76,0)");
      ctx.beginPath();
      ctx.arc(last.x, last.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = cGrd;
      ctx.fill();
    }

    // Scatter motes on lift
    this.motes.forEach(m => {
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size * m.alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${m.alpha})`;
      ctx.fill();
    });
  }
}

export default function TouchTrail() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const streams   = useRef(new Map()); // touchId → TouchStream

  useEffect(() => {
    // Only on touch devices
    const isTouch = navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onTouchStart(e) {
      Array.from(e.changedTouches).forEach(touch => {
        streams.current.set(
          touch.identifier,
          new TouchStream(touch.identifier, touch.clientX, touch.clientY)
        );
      });
    }

    function onTouchMove(e) {
      e.preventDefault();
      Array.from(e.changedTouches).forEach(touch => {
        const s = streams.current.get(touch.identifier);
        if (s) s.addPoint(touch.clientX, touch.clientY);
      });
    }

    function onTouchEnd(e) {
      Array.from(e.changedTouches).forEach(touch => {
        const s = streams.current.get(touch.identifier);
        if (s) s.lift();
      });
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });
    window.addEventListener("touchcancel",onTouchEnd,   { passive: true });

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      streams.current.forEach((stream, id) => {
        stream.tick();
        stream.draw(ctx);
        if (stream.isDead()) streams.current.delete(id);
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("touchcancel",onTouchEnd);
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
