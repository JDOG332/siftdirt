/**
 * POEMS PAGE — Select one of the three poems
 */

import React, { useState } from "react";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const GOLD = (a) => `rgba(201,168,76,${a})`;
const IVORY = (a) => `rgba(232,228,210,${a})`;

const POEMS = [
  {
    key: "dol",
    title: "it's the rhythm of life",
    subtitle: "A poem about heartbeats, hope, and hidden purposes",
    color: "220,160,160",
  },
  {
    key: "rol",
    title: "death or life",
    subtitle: "Dance all day and never stop",
    color: "190,140,220",
  },
  {
    key: "kal",
    title: "kaleidoscope sea",
    subtitle: "Shatter your glass and break down your walls",
    color: "100,180,220",
  },
];

function PoemCard({ poem, index, onSelect }) {
  const [hover, setHover] = useState(false);
  const rgb = poem.color;

  return (
    <div
      onClick={() => onSelect(poem.key)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        maxWidth: 480,
        padding: "2.618rem",
        background: hover ? `rgba(${rgb},0.08)` : `rgba(${rgb},0.03)`,
        border: `1px solid rgba(${rgb},${hover ? 0.50 : 0.146})`,
        borderRadius: 4,
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        animation: `fadeUp 0.8s ${0.2 + index * 0.15}s both ease`,
        boxShadow: hover
          ? `0 8px 40px rgba(${rgb},0.12), inset 0 0 20px rgba(${rgb},0.03)`
          : "none",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "0.618rem",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Top glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},${hover ? 0.618 : 0.18}), transparent)`,
          transition: `background 618ms ${EASE}`,
        }}
      />

      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(22px, 4vw, 30px)",
          fontWeight: 500,
          fontStyle: "italic",
          color: IVORY(hover ? 0.95 : 0.85),
          lineHeight: 1.382,
          transition: `color 382ms ${EASE}`,
        }}
      >
        {poem.title}
      </h2>

      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(14px, 2.2vw, 17px)",
          fontWeight: 300,
          color: `rgba(${rgb},${hover ? 0.82 : 0.50})`,
          lineHeight: 1.618,
          transition: `color 382ms ${EASE}`,
        }}
      >
        {poem.subtitle}
      </p>

      <div
        style={{
          width: 55,
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},${hover ? 0.50 : 0.18}), transparent)`,
          marginTop: "0.382rem",
          transition: `background 618ms ${EASE}`,
        }}
      />
    </div>
  );
}

export default function PoemsPage({ onBack, onSelectPoem }) {
  const [backH, setBackH] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 28%, rgba(14,10,28,0.88) 0%, #03030a 55%)",
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
          maxWidth: 540,
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
            marginBottom: "0.618rem",
          }}
        >
          POEMS
        </h1>

        {POEMS.map((poem, i) => (
          <PoemCard
            key={poem.key}
            poem={poem}
            index={i}
            onSelect={onSelectPoem}
          />
        ))}
      </div>
    </div>
  );
}
