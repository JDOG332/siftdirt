import React, { useState } from "react";
import { F, S, A, GOLD, IVORY, EASE, TEXT, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE, textGlow, boxGlow } from "./phi.js";

const POEMS = [
  { key: "dol", title: "death or life", subtitle: "Dance all day and never stop", color: "190,140,220" },
  { key: "rol", title: "it's the rhythm of life", subtitle: "Heartbeats, hope, and hidden purposes", color: "220,160,160" },
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
        background: hover ? `rgba(${rgb},${A.ghost})` : `rgba(${rgb},0.04)`,
        border: `1px solid rgba(${rgb},${hover ? A.phi : A.ghost})`,
        borderRadius: S._2xs, cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        animation: `fadeUp 618ms ${236 + index * 236}ms both ease`,
        boxShadow: hover ? boxGlow(rgb, 1) : "none",
        display: "flex", flexDirection: "column",
        gap: S.xs, alignItems: "center",
        justifyContent: "center", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(${rgb},${hover ? A.phi : A.ghost}), transparent)`, transition: `background 618ms` }} />
      <h2 style={{ ...ACCENT_STYLE, fontSize: TEXT.title, color: IVORY(hover ? A.full : A.phi), transition: `color 618ms` }}>{poem.title}</h2>
      <p style={{ ...BODY_STYLE, fontSize: TEXT.label, color: `rgba(${rgb},${hover ? A.phi : A.ghost})`, transition: `color 618ms` }}>{poem.subtitle}</p>
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
        ...DISPLAY_STYLE, fontSize: TEXT.label,
        color: GOLD(backH ? A.full : A.phi),
        transition: `color 618ms ${EASE}`, padding: `${S.xs} ${S.sm}`,
      }}>← BACK</button>
      <div style={{ width: "100%", maxWidth: "34rem", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "clamp(80px, 14vh, 130px)", gap: S.md }}>
        <h1 style={{ ...DISPLAY_STYLE, fontSize: TEXT.hero, color: GOLD(A.phi), animation: "fadeUp 618ms 100ms both ease", textShadow: textGlow("201,168,76", A.phi) }}>POEMS</h1>
        {POEMS.map((p, i) => <PoemCard key={p.key} poem={p} index={i} onSelect={onSelectPoem} />)}
      </div>
    </div>
  );
}
