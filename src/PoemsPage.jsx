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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        padding: `${S.lg} ${S.lg}`,
        background: hover
          ? `radial-gradient(ellipse at 50% 50%, rgba(${rgb},0.12) 0%, rgba(${rgb},0.03) 61.8%)`
          : `radial-gradient(ellipse at 50% 50%, rgba(${rgb},0.06) 0%, rgba(${rgb},0.01) 61.8%)`,
        border: `1px solid rgba(${rgb},${hover ? A.phi : A.ghost})`,
        borderRadius: S._2xs,
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        animation: `fadeUp 618ms ${236 + index * 236}ms both ease`,
        boxShadow: hover
          ? `0 0 38px rgba(${rgb},0.14), 0 0 80px rgba(${rgb},0.06), inset 0 0 38px rgba(${rgb},0.04)`
          : `0 0 18px rgba(${rgb},0.04)`,
        display: "flex", flexDirection: "column",
        gap: S._2xs,
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top shimmer line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(${rgb},${hover ? A.phi : A.ghost}), transparent)`,
        transition: `background 618ms ${EASE}`,
      }} />

      {/* Title — the invitation */}
      <h2 style={{
        ...ACCENT_STYLE,
        fontSize: TEXT.title,
        color: IVORY(hover ? A.full : A.phi),
        transition: `all 618ms ${EASE}`,
        textShadow: hover ? textGlow(rgb, A.phi) : `0 0 18px rgba(${rgb},${A.ghost})`,
      }}>
        {poem.title}
      </h2>

      {/* Subtitle */}
      <p style={{
        ...BODY_STYLE,
        fontWeight: 400,
        fontSize: TEXT.label,
        color: `rgba(${rgb},${hover ? A.full : A.phi})`,
        transition: `color 618ms ${EASE}`,
        maxWidth: "24rem",
      }}>
        {poem.subtitle}
      </p>

      {/* Bottom shimmer line */}
      <div style={{
        position: "absolute", bottom: 0, left: "23.6%", right: "23.6%", height: 1,
        background: `rgba(${rgb},${hover ? A.ghost : 0})`,
        transition: `background 618ms ${EASE}`,
      }} />
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
      justifyContent: "center",
      padding: `${S.lg} ${S.md}`,
    }}>
      {/* Back */}
      <button onClick={onBack}
        onMouseEnter={() => setBackH(true)}
        onMouseLeave={() => setBackH(false)}
        style={{
          position: "fixed", top: S.md, left: S.md, zIndex: 99,
          background: "none", border: "none", cursor: "pointer",
          ...DISPLAY_STYLE,
          fontSize: TEXT.label,
          color: GOLD(backH ? A.full : A.phi),
          transition: `color 618ms ${EASE}`,
          padding: `${S.xs} ${S.sm}`,
        }}
      >← BACK</button>

      {/* Content — vertically centered */}
      <div style={{
        width: "100%", maxWidth: "36rem",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        gap: S.md,
      }}>
        {/* Title */}
        <h1 style={{
          ...DISPLAY_STYLE,
          fontSize: TEXT.hero,
          letterSpacing: "0.236em",
          color: GOLD(A.phi),
          animation: "fadeUp 618ms 100ms both ease",
          textShadow: textGlow("201,168,76", A.phi),
          marginBottom: S.xs,
        }}>POEMS</h1>

        {/* Three invitations */}
        {POEMS.map((p, i) => (
          <PoemCard key={p.key} poem={p} index={i} onSelect={onSelectPoem} />
        ))}
      </div>
    </div>
  );
}
