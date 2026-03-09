import React, { useState } from "react";
import { F, S, A, GOLD, IVORY, EASE, TEXT, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE, textGlow, boxGlow } from "./phi.js";

function MathCard({ title, subtitle, icon, delay, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", maxWidth: "26rem",
        aspectRatio: "1.618 / 1",
        padding: S.lg,
        background: hover ? `rgba(201,168,76,${A.ghost})` : `rgba(201,168,76,0.03)`,
        border: `1px solid ${GOLD(hover ? A.phi : A.ghost)}`,
        borderRadius: S._2xs, cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        animation: `fadeUp 618ms ${delay}ms both ease`,
        boxShadow: hover ? boxGlow("201,168,76", 1) : "none",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", gap: S.sm,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD(hover ? A.phi : A.ghost)}, transparent)`, transition: `background 618ms` }} />
      <span style={{ fontSize: TEXT.hero, lineHeight: 1 }}>{icon}</span>
      <h2 style={{ ...DISPLAY_STYLE, fontSize: TEXT.heading, color: GOLD(hover ? A.full : A.phi), transition: `color 618ms` }}>{title}</h2>
      <p style={{ ...ACCENT_STYLE, fontSize: TEXT.label, color: IVORY(hover ? A.phi : A.ghost), transition: `color 618ms` }}>{subtitle}</p>
    </div>
  );
}

export default function MathHubPage({ onBack, onVitruvian, onCRT }) {
  const [backH, setBackH] = useState(false);
  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      background: `radial-gradient(ellipse at 50% 23.6%, rgba(14,10,28,${A.phi}) 0%, #03030a 61.8%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: `0 ${S.sm}`, paddingBottom: S._2xl,
    }}>
      <button onClick={onBack} onMouseEnter={() => setBackH(true)} onMouseLeave={() => setBackH(false)} style={{
        position: "absolute", top: S.md, left: S.md, zIndex: 99,
        background: "none", border: "none", cursor: "pointer",
        ...DISPLAY_STYLE, fontSize: TEXT.body,
        color: GOLD(backH ? A.full : A.phi),
        transition: `color 618ms ${EASE}`, padding: `${S.xs} ${S.sm}`,
      }}>← BACK</button>

      <div style={{ width: "100%", maxWidth: "30rem", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "clamp(80px, 14vh, 130px)", gap: S.md }}>
        <h1 style={{ ...DISPLAY_STYLE, fontSize: TEXT.hero, color: GOLD(A.phi), animation: "fadeUp 618ms 100ms both ease", textShadow: textGlow("201,168,76", A.phi) }}>MATHEMATICS</h1>
        <p style={{ ...ACCENT_STYLE, fontSize: TEXT.body, color: IVORY(A.phi), textAlign: "center", animation: "fadeUp 618ms 236ms both ease", marginBottom: S.sm }}>The hidden pattern beneath everything</p>
        <MathCard title="THE VITRUVIAN MAN" subtitle="Da Vinci's exact geometry — verified to the decimal" icon="📐" delay={382} onClick={onVitruvian} />
        <MathCard title="CONVERGENT RECOGNITION" subtitle="Ψ = R₁₂ × G — the master equation" icon="Ψ" delay={618} onClick={onCRT} />
      </div>
    </div>
  );
}
