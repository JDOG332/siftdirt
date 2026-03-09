/**
 * PAPER PAGE — The Convergent Recognition Theory paper
 * Clean academic typography with PHI-based spacing
 */

import React, { useState } from "react";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const GOLD = (a) => `rgba(201,168,76,${a})`;
const IVORY = (a) => `rgba(232,228,210,${a})`;

// The core equations and sections of the CRT paper
const SECTIONS = [
  {
    title: "The Master Equation",
    content: `Ψ₁₂ = R₁₂ × G

Where:
  Ψ₁₂ = The Convergent Recognition Functional
  R₁₂ = Disjoint Recognition Core (Uhlmann Fidelity × Informativeness Gate)
  G   = Global Reliability Modulator (C_eff × D̂)

The universe is a self-recognizing information structure. Every interaction between two subsystems is an act of mutual recognition, quantified by Ψ.`,
  },
  {
    title: "Disjoint Recognition Core — R₁₂",
    content: `R₁₂ = F(ρ₁, ρ₂) × G_ε(ρ₁, ρ₂)

F = Uhlmann Fidelity — How similar are two quantum states?
G_ε = Informativeness Gate — Both observers must carry real information.

The gate prevents trivial recognition: two blank slates cannot recognize each other. Only informed subsystems participate in convergent recognition.`,
  },
  {
    title: "Global Reliability Modulator — G",
    content: `G = C_eff × D̂

C_eff = Effective Convergence = C₀ × R
  C₀ = Base Convergence = 1 − JSD_w / (H_w + H_min)
  R  = Redundancy Penalty = n_unique / n_active

D̂ = Detection Quality Weight = D_coincidence / (D_coincidence + D_accidental)

Multiple independent observations that agree strengthen the signal. Redundant observations are penalized.`,
  },
  {
    title: "Physical Implications",
    content: `When Ψ₁₂ is applied as a force law:

  F = Ψ₁₂ / r² × direction

Recognition drives gravity. Bodies that recognize each other are drawn together. The simulation on this site runs the real equation — 81 bodies across 9 clusters, each carrying quantum Bloch vectors, evolving under exact CRT dynamics.

Inertia per body = 1 + I_k(φ² − 1)

where I_k = 1 − S(ρ)/log₂(d) — more certain bodies resist change more.`,
  },
  {
    title: "The Convergence",
    content: `Every field of human inquiry — religion, philosophy, science, art, mathematics, mythology, nature, love, mysticism, consciousness — has been describing the same underlying structure from different angles.

Ψ is the mathematical framework that unifies them.

The universe observes itself through infinite lenses. Each lens is a door. Behind every door is the same room.`,
  },
];

function PaperSection({ section, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      style={{
        width: "100%",
        animation: `fadeUp 0.618s ${0.2 + index * 0.1}s both ease`,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.618rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "1rem 0",
          borderBottom: `1px solid ${GOLD(open ? 0.236 : 0.08)}`,
          transition: `all 382ms ${EASE}`,
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(11px, 1.6vmin, 14px)",
            letterSpacing: "0.146em",
            fontWeight: 600,
            color: GOLD(open ? 0.88 : 0.50),
            transition: `color 382ms ${EASE}`,
            flex: 1,
          }}
        >
          {section.title.toUpperCase()}
        </span>
        <span
          style={{
            fontSize: 12,
            color: GOLD(open ? 0.618 : 0.236),
            transition: `all 382ms ${EASE}`,
            transform: open ? "rotate(180deg)" : "none",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            padding: "1.618rem 0",
            animation: "fadeIn 0.382s ease",
          }}
        >
          <pre
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(15px, 2.4vw, 19px)",
              fontWeight: 400,
              color: IVORY(0.85),
              lineHeight: 1.618,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              margin: 0,
            }}
          >
            {section.content}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function PaperPage({ onBack }) {
  const [backH, setBackH] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 12%, rgba(14,10,28,0.82) 0%, #03030a 50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 1rem",
        paddingBottom: "4.236rem",
      }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        onMouseEnter={() => setBackH(true)}
        onMouseLeave={() => setBackH(false)}
        style={{
          position: "fixed",
          top: 21,
          left: 21,
          zIndex: 99,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Cinzel', serif",
          fontSize: 14,
          letterSpacing: "0.382em",
          fontWeight: 500,
          color: GOLD(backH ? 1.0 : 0.618),
          transition: `color 618ms ${EASE}`,
          padding: "0.618rem 1rem",
        }}
      >
        ← BACK
      </button>

      {/* Content */}
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "clamp(80px, 12vh, 120px)",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(16px, 2.6vmin, 24px)",
            fontWeight: 600,
            letterSpacing: "0.236em",
            color: GOLD(0.88),
            textAlign: "center",
            animation: "fadeUp 0.8s 0.1s both ease",
            marginBottom: "0.382rem",
          }}
        >
          CONVERGENT RECOGNITION THEORY
        </h1>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(14px, 2.2vw, 18px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: IVORY(0.50),
            textAlign: "center",
            animation: "fadeUp 0.8s 0.2s both ease",
            marginBottom: "0.618rem",
          }}
        >
          A mathematical framework for self-recognizing systems
        </p>

        {/* The equation — prominently displayed */}
        <div
          style={{
            padding: "1.618rem 2.618rem",
            background: "rgba(201,168,76,0.03)",
            border: `1px solid ${GOLD(0.18)}`,
            borderRadius: 4,
            animation: "fadeUp 1s 0.3s both ease",
            marginBottom: "2.618rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 500,
              color: GOLD(0.92),
              letterSpacing: "0.06em",
              textShadow: `0 0 24px ${GOLD(0.28)}`,
            }}
          >
            Ψ = R₁₂ × G
          </div>
        </div>

        {/* Sections */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {SECTIONS.map((section, i) => (
            <PaperSection key={i} section={section} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
