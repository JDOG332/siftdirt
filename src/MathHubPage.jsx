/**
 * MATH HUB — Gateway to Vitruvian Man + CRT Paper
 */

import React, { useState } from "react";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const GOLD = (a) => `rgba(201,168,76,${a})`;
const IVORY = (a) => `rgba(232,228,210,${a})`;

function MathCard({ title, subtitle, icon, delay, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        maxWidth: 420,
        padding: "2.618rem",
        background: hover ? "rgba(201,168,76,0.06)" : "rgba(201,168,76,0.02)",
        border: `1px solid ${GOLD(hover ? 0.45 : 0.12)}`,
        borderRadius: 4,
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        animation: `fadeUp 0.8s ${delay}s both ease`,
        boxShadow: hover
          ? "0 8px 40px rgba(201,168,76,0.10), inset 0 0 20px rgba(201,168,76,0.02)"
          : "none",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      {/* Top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${GOLD(hover ? 0.618 : 0.146)}, transparent)`,
          transition: `background 618ms ${EASE}`,
        }}
      />

      <span style={{ fontSize: 42, lineHeight: 1 }}>{icon}</span>

      <h2
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(16px, 2.6vmin, 22px)",
          fontWeight: 600,
          letterSpacing: "0.146em",
          color: GOLD(hover ? 0.92 : 0.78),
          transition: `color 382ms ${EASE}`,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(15px, 2.4vw, 19px)",
          fontWeight: 400,
          fontStyle: "italic",
          color: IVORY(hover ? 0.72 : 0.50),
          lineHeight: 1.618,
          transition: `color 382ms ${EASE}`,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export default function MathHubPage({ onBack, onVitruvian, onCRT }) {
  const [backH, setBackH] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 22%, rgba(14,10,28,0.85) 0%, #03030a 55%)",
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
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "clamp(80px, 14vh, 130px)",
          gap: "1.618rem",
        }}
      >
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(18px, 3vmin, 28px)",
            fontWeight: 600,
            letterSpacing: "0.382em",
            color: GOLD(0.82),
            animation: "fadeUp 0.8s 0.1s both ease",
            textShadow: `0 0 14px ${GOLD(0.28)}`,
          }}
        >
          MATHEMATICS
        </h1>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(16px, 2.8vmin, 22px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: IVORY(0.618),
            textAlign: "center",
            lineHeight: 1.618,
            maxWidth: 420,
            animation: "fadeUp 0.8s 0.2s both ease",
            marginBottom: "1rem",
          }}
        >
          The hidden pattern beneath everything
        </p>

        <MathCard
          title="THE VITRUVIAN MAN"
          subtitle="Da Vinci's exact geometry — verified to 17 decimal places"
          icon="📐"
          delay={0.3}
          onClick={onVitruvian}
        />

        <MathCard
          title="CONVERGENT RECOGNITION"
          subtitle="Ψ = R₁₂ × G — the master equation of self-recognizing systems"
          icon="Ψ"
          delay={0.45}
          onClick={onCRT}
        />
      </div>
    </div>
  );
}
