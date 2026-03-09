import React, { useState } from "react";
import { F, S, A, GOLD, IVORY, EASE, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE } from "./phi.js";

function MathCard({ title, subtitle, icon, delay, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", maxWidth: "26rem",
        aspectRatio: "1.618 / 1",
        padding: S.lg,
        background: hover ? `rgba(201,168,76,${A.ghost})` : "transparent",
        border: `1px solid ${GOLD(hover ? A.phi : A.ghost)}`,
        borderRadius: S._3xs,
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        animation: `fadeUp 618ms ${delay}ms both ease`,
        boxShadow: hover ? `0 0 ${S.xl} rgba(201,168,76,${A.ghost})` : "none",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", gap: S.sm,
      }}
    >
      <span style={{ fontSize: S.xl, lineHeight: 1 }}>{icon}</span>
      <h2 style={{ ...DISPLAY_STYLE, fontSize: S.sm, color: GOLD(hover ? A.full : A.phi), transition: `color 618ms ${EASE}` }}>{title}</h2>
      <p style={{ ...ACCENT_STYLE, fontSize: S.sm, color: IVORY(hover ? A.phi : A.ghost), transition: `color 618ms ${EASE}` }}>{subtitle}</p>
    </div>
  );
}

export default function MathHubPage({ onBack, onVitruvian, onCRT }) {
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
        transition: `color 618ms ${EASE}`, padding: `${S.xs} ${S.sm}`,
      }}>← BACK</button>

      <div style={{ width: "100%", maxWidth: "30rem", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: S._2xl, gap: S.md }}>
        <h1 style={{ ...DISPLAY_STYLE, fontSize: S.xl, color: GOLD(A.phi), animation: "fadeUp 618ms 100ms both ease", textShadow: `0 0 ${S.sm} rgba(201,168,76,${A.ghost})` }}>MATHEMATICS</h1>
        <p style={{ ...ACCENT_STYLE, fontSize: S.sm, color: IVORY(A.phi), textAlign: "center", animation: "fadeUp 618ms 236ms both ease", marginBottom: S.sm }}>The hidden pattern beneath everything</p>
        <MathCard title="THE VITRUVIAN MAN" subtitle="Da Vinci's exact geometry — verified to the decimal" icon="📐" delay={382} onClick={onVitruvian} />
        <MathCard title="CONVERGENT RECOGNITION" subtitle="Ψ = R₁₂ × G — the master equation" icon="Ψ" delay={618} onClick={onCRT} />
      </div>
    </div>
  );
}
