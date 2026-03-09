import React, { useState, useEffect, useRef } from "react";
import { POEMS, ASK_POEMS, KAL_POEMS } from "./data.js";
import { F, S, A, GOLD, IVORY, EASE, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE } from "./phi.js";

const POEM_MAP = {
  ask: { lines: ASK_POEMS, title: "death or life", rgb: "190,140,220" },
  explore: { lines: POEMS, title: "it's the rhythm of life", rgb: "220,160,160" },
  kal: { lines: KAL_POEMS, title: "kaleidoscope sea", rgb: "100,180,220" },
};

function PoemCanvas({ rgb }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const [r, g, b] = rgb.split(",").map(Number);
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize(); window.addEventListener("resize", resize);
    const motes = Array.from({ length: 62 }, () => ({ x: Math.random() * 2000, y: Math.random() * 2000, size: 0.618 + Math.random() * 1.618, speed: 0.1 + Math.random() * 0.236, phase: Math.random() * Math.PI * 2 }));
    function frame() {
      ctx.fillStyle = `rgba(3,3,10,${A.ghost})`; ctx.fillRect(0, 0, W, H);
      motes.forEach(m => {
        m.y -= m.speed; m.phase += 0.01;
        if (m.y < -10) { m.y = H + 10; m.x = Math.random() * W; }
        ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.236 + Math.sin(m.phase) * 0.236})`; ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    }
    ctx.fillStyle = "#03030a"; ctx.fillRect(0, 0, W, H);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [rgb]);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />;
}

export default function PoemUniverse({ poem, onBack }) {
  const cfg = POEM_MAP[poem]; if (!cfg) return null;
  const { lines, title, rgb } = cfg;
  const [backH, setBackH] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 236); return () => clearTimeout(t); }, []);

  const stanzas = []; let cur = [];
  lines.forEach(line => {
    if (line === "————") { if (cur.length) { stanzas.push(cur); cur = []; } }
    else cur.push(line);
  });
  if (cur.length) stanzas.push(cur);

  return (
    <div style={{ minHeight: "100vh", background: "#03030a" }}>
      <PoemCanvas rgb={rgb} />
      <button onClick={onBack} onMouseEnter={() => setBackH(true)} onMouseLeave={() => setBackH(false)} style={{
        position: "fixed", top: S.md, left: S.md, zIndex: 99,
        background: "none", border: "none", cursor: "pointer",
        ...DISPLAY_STYLE, fontSize: S.xs,
        color: `rgba(${rgb},${backH ? A.full : A.phi})`,
        transition: `color 618ms ${EASE}`, padding: `${S.xs} ${S.sm}`,
      }}>← BACK</button>

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: `0 ${S.md}`, paddingTop: S._2xl, paddingBottom: S._2xl,
        opacity: visible ? A.full : 0, transition: `opacity 1.618s ${EASE}`,
      }}>
        <h1 style={{ ...ACCENT_STYLE, fontSize: S.lg, color: IVORY(A.phi), textAlign: "center", marginBottom: S._2xl, textShadow: `0 0 ${S.md} rgba(${rgb},${A.ghost})` }}>{title}</h1>

        {stanzas.map((stanza, si) => (
          <div key={si} style={{ marginBottom: S.lg, textAlign: "center", animation: `fadeUp 618ms ${382 + si * 236}ms both ease` }}>
            {stanza.map((line, li) => (
              <div key={li} style={{
                ...BODY_STYLE,
                fontWeight: 400,
                fontSize: line === "" ? 0 : line === "&" ? S.sm : S.md,
                color: line === "&" ? `rgba(${rgb},${A.ghost})` : IVORY(A.phi),
                lineHeight: 1.618,
                minHeight: line === "" ? S.md : "auto",
                whiteSpace: "pre-wrap",
              }}>{line || "\u00A0"}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
