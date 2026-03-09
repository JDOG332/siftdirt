import React, { useState } from "react";
import { F, S, A, GOLD, IVORY, EASE, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE } from "./phi.js";

const POEMS = [
  { key: "dol", title: "it's the rhythm of life", subtitle: "Heartbeats, hope, and hidden purposes", color: "220,160,160" },
  { key: "rol", title: "death or life", subtitle: "Dance all day and never stop", color: "190,140,220" },
  { key: "kal", title: "kaleidoscope sea", subtitle: "Shatter your glass and break down your walls", color: "100,180,220" },
];

function PoemCard({ poem, index, onSelect }) {
  const [hover, setHover] = useState(false);
  const rgb = poem.color;
  return (
    <div onClick={() => onSelect(poem.key)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", maxWidth: "30rem",
        aspectRatio: "1.618 / 1",
        padding: S.lg,
        background: hover ? `rgba(${rgb},${A.ghost})` : "transparent",
        border: `1px solid rgba(${rgb},${hover ? A.phi : A.ghost})`,
        borderRadius: S._3xs,
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        animation: `fadeUp 618ms ${236 + index * 236}ms both ease`,
        boxShadow: hover ? `0 0 ${S.xl} rgba(${rgb},${A.ghost})` : "none",
        display: "flex", flexDirection: "column",
        gap: S.xs, alignItems: "center",
        justifyContent: "center", textAlign: "center",
      }}
    >
      <h2 style={{ ...ACCENT_STYLE, fontSize: S.lg, color: IVORY(hover ? A.full : A.phi), transition: `color 618ms ${EASE}` }}>{poem.title}</h2>
      <p style={{ ...BODY_STYLE, fontSize: S.sm, color: `rgba(${rgb},${hover ? A.phi : A.ghost})`, transition: `color 618ms ${EASE}` }}>{poem.subtitle}</p>
    </div>
  );
}

export default function PoemsPage({ onBack, onSelectPoem }) {
  const [backH, setBackH] = useState(false);
  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 23.6%, rgba(14,10,28,${A.phi}) 0%, #03030a 61.8%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: `0 ${S.sm}`, paddingBottom: S._2xl,
    }}>
      <button onClick={onBack} onMouseEnter={() => setBackH(true)} onMouseLeave={() => setBackH(false)} style={{
        position: "fixed", top: S.md, left: S.md, zIndex: 99,
        background: "none", border: "none", cursor: "pointer",
        ...DISPLAY_STYLE, fontSize: S.xs,
        color: GOLD(backH ? A.full : A.phi),
        transition: `color 618ms ${EASE}`,
        padding: `${S.xs} ${S.sm}`,
      }}>← BACK</button>

      <div style={{ width: "100%", maxWidth: "34rem", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: S._2xl, gap: S.md }}>
        <h1 style={{ ...DISPLAY_STYLE, fontSize: S.xl, color: GOLD(A.phi), animation: "fadeUp 618ms 100ms both ease" }}>POEMS</h1>
        {POEMS.map((p, i) => <PoemCard key={p.key} poem={p} index={i} onSelect={onSelectPoem} />)}
      </div>
    </div>
  );
}
