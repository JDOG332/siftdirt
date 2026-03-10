import React, { useState } from "react";
import { F, S, A, GOLD, IVORY, EASE, TEXT, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE, textGlow } from "./phi.js";

const SECTIONS = [
  { title: "The Master Equation", content: "Ψ₁₂ = R₁₂ × G\n\nWhere:\n  Ψ₁₂ = The Convergent Recognition Functional\n  R₁₂ = Disjoint Recognition Core (Uhlmann Fidelity × Informativeness Gate)\n  G   = Global Reliability Modulator (C_eff × D̂)\n\nThe universe is a self-recognizing information structure. Every interaction between two subsystems is an act of mutual recognition, quantified by Ψ." },
  { title: "Disjoint Recognition Core", content: "R₁₂ = F(ρ₁, ρ₂) × G_ε(ρ₁, ρ₂)\n\nF = Uhlmann Fidelity — How similar are two quantum states?\nG_ε = Informativeness Gate — Both observers must carry real information.\n\nThe gate prevents trivial recognition: two blank slates cannot recognize each other." },
  { title: "Global Reliability Modulator", content: "G = C_eff × D̂\n\nC_eff = Effective Convergence = C₀ × R\nD̂ = Detection Quality Weight\n\nMultiple independent observations that agree strengthen the signal. Redundant observations are penalized." },
  { title: "Physical Implications", content: "When Ψ₁₂ is applied as a force law:\n\n  F = Ψ₁₂ / r² × direction\n\nRecognition drives gravity. Bodies that recognize each other are drawn together. Inertia per body = 1 + I_k(φ² − 1)." },
  { title: "The Convergence", content: "Every field of human inquiry — religion, philosophy, science, art, mathematics, mythology, nature, love, mysticism, consciousness — has been describing the same underlying structure from different angles.\n\nΨ is the mathematical framework that unifies them.\n\nThe universe observes itself through infinite lenses. Each lens is a door. Behind every door is the same room." },
];

function PaperSection({ section, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{ width: "100%", animation: `fadeUp 618ms ${236 + index * 100}ms both ease` }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: S.xs,
        background: "none", border: "none", cursor: "pointer",
        padding: `${S.sm} 0`, borderBottom: `1px solid ${GOLD(open ? A.ghost : A.ghost)}`,
        textAlign: "left",
      }}>
        <span style={{ ...DISPLAY_STYLE, fontSize: TEXT.caption, color: GOLD(open ? A.phi : A.ghost), transition: `color 382ms ${EASE}`, flex: 1 }}>{section.title.toUpperCase()}</span>
        <span style={{ fontSize: TEXT.caption, color: GOLD(open ? A.phi : A.ghost), transition: `all 382ms ${EASE}`, transform: open ? "rotate(180deg)" : "none", display: "inline-block" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: `${S.md} 0`, animation: "fadeIn 382ms ease" }}>
          <pre style={{ ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.label, color: IVORY(A.phi), whiteSpace: "pre-wrap", wordWrap: "break-word", margin: 0 }}>{section.content}</pre>
        </div>
      )}
    </div>
  );
}

export default function PaperPage({ onBack }) {
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
        ...DISPLAY_STYLE, fontSize: TEXT.body,
        color: GOLD(backH ? A.full : A.phi),
        transition: `color 618ms ${EASE}`, padding: `${S.xs} ${S.sm}`,
      }}>← BACK</button>

      <div style={{ width: "100%", maxWidth: "40rem", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "clamp(80px, 12vh, 120px)" }}>
        <h1 style={{ ...DISPLAY_STYLE, fontSize: TEXT.heading, color: GOLD(A.phi), textAlign: "center", animation: "fadeUp 618ms 100ms both ease", marginBottom: S._2xs }}>CONVERGENT RECOGNITION THEORY</h1>
        <p style={{ ...ACCENT_STYLE, fontSize: TEXT.label, color: IVORY(A.ghost), textAlign: "center", animation: "fadeUp 618ms 236ms both ease", marginBottom: S.xs }}>A mathematical framework for self-recognizing systems</p>

        {/* The equation — atmospheric display */}
        <div style={{
          padding: `${S.lg} ${S.xl}`,
          background: `rgba(201,168,76,0.04)`,
          border: `1px solid ${GOLD(A.ghost)}`,
          borderRadius: S._2xs,
          animation: "fadeUp 618ms 382ms both ease",
          marginBottom: S.lg, textAlign: "center",
          aspectRatio: "1.618 / 1",
          display: "flex", alignItems: "center", justifyContent: "center",
          maxWidth: "26rem", width: "100%",
          boxShadow: `0 0 48px rgba(201,168,76,0.06), inset 0 0 24px rgba(201,168,76,0.02)`,
        }}>
          <div style={{
            ...DISPLAY_STYLE,
            fontSize: TEXT.hero,
            color: GOLD(A.phi),
            textShadow: textGlow("201,168,76", 1),
          }}>Ψ = R₁₂ × G</div>
        </div>

        {/* PDF Paper Link */}
        <a href="https://drive.google.com/file/d/16kvjpYSCDOerUKxxogDRdbi-37m7KAKL/view?usp=share_link"
          target="_blank" rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: S.xs,
            padding: `${S.sm} ${S.lg}`,
            background: `rgba(201,168,76,0.06)`,
            border: `1px solid ${GOLD(A.ghost)}`,
            borderRadius: S._2xs,
            animation: "fadeUp 618ms 450ms both ease",
            marginBottom: S.lg,
            maxWidth: "26rem", width: "100%",
            textDecoration: "none",
            transition: `all 618ms ${EASE}`,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = GOLD(A.phi);
            e.currentTarget.style.background = `rgba(201,168,76,0.10)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = GOLD(A.ghost);
            e.currentTarget.style.background = `rgba(201,168,76,0.06)`;
          }}
        >
          <span style={{ fontSize: "clamp(18px, 3vmin, 24px)" }}>📄</span>
          <span style={{
            ...DISPLAY_STYLE,
            fontSize: TEXT.label,
            letterSpacing: "0.12em",
            color: GOLD(A.phi),
          }}>VIEW THE FULL PAPER (PDF)</span>
        </a>

        <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
          {SECTIONS.map((s, i) => <PaperSection key={i} section={s} index={i} />)}
        </div>
      </div>
    </div>
  );
}
