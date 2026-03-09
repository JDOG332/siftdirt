import React, { useState } from "react";
import { SUBCATEGORIES } from "./subcategories.js";
import { F, S, A, GOLD, IVORY, EASE, TEXT, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE, textGlow, boxGlow } from "./phi.js";

export const DOOR_META = {
  sameness: { name: "Religion",      emoji: "⛪", rgb: "201,168,76"  },
  layers:   { name: "Philosophy",    emoji: "🏛️", rgb: "150,180,220" },
  rock:     { name: "Science",       emoji: "🔬", rgb: "79,195,150"  },
  plain:    { name: "Mysticism",     emoji: "✨", rgb: "190,140,220" },
  depths:   { name: "Art",           emoji: "🎨", rgb: "224,120,100" },
  promise:  { name: "Mathematics",   emoji: "📐", rgb: "201,168,76"  },
  gravity:  { name: "Mythology",     emoji: "📖", rgb: "180,160,120" },
  pillars:  { name: "Nature",        emoji: "🌿", rgb: "120,180,100" },
  filter:   { name: "Love",          emoji: "💛", rgb: "220,160,160" },
  ancient:  { name: "Consciousness", emoji: "👁️", rgb: "200,200,230" },
};

const QUESTIONS = {
  sameness: "What has God revealed, and how must we live in response?",
  layers:   "What can we know through reason alone?",
  rock:     "How does the universe work, and what are its laws?",
  plain:    "Can I experience the divine directly, without mediation?",
  depths:   "What truth can only be expressed by creating something?",
  promise:  "What is the hidden structure beneath all things?",
  gravity:  "What stories keep telling themselves, and why?",
  pillars:  "What does the Earth itself teach us about existence?",
  filter:   "Is the deepest truth found in the space between us?",
  ancient:  "What is this awareness that makes all experience possible?",
};

function SubCard({ sub, rgb, index, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: `${S.md} ${S.lg}`,
        background: hover ? `rgba(${rgb},0.14)` : `rgba(${rgb},0.06)`,
        border: `1px solid rgba(${rgb},${hover ? 0.55 : A.ghost})`,
        borderRadius: S._2xs,
        cursor: "pointer",
        transition: `all 382ms ${EASE}`,
        animation: `fadeUp 618ms ${index * 62}ms both ease`,
        boxShadow: hover
          ? `0 4px 32px rgba(${rgb},0.14), inset 0 0 24px rgba(${rgb},0.04)`
          : "0 1px 8px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column",
        gap: S.xs, height: "100%",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(${rgb},${hover ? A.phi : A.ghost}), transparent)`,
        transition: `background 382ms ${EASE}`,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: S.xs }}>
        <span style={{ fontSize: "clamp(24px, 4vmin, 32px)", lineHeight: 1, flexShrink: 0 }}>{sub.icon}</span>
        <div style={{
          ...DISPLAY_STYLE,
          fontSize: TEXT.label,
          color: `rgba(${rgb},${hover ? A.full : A.phi})`,
          textShadow: hover ? textGlow(rgb, 0.618) : "none",
          transition: `all 382ms ${EASE}`,
        }}>{sub.name}</div>
      </div>
      <div style={{
        ...BODY_STYLE, fontWeight: 400,
        fontSize: TEXT.body,
        color: IVORY(hover ? A.full : A.phi),
        transition: `color 382ms ${EASE}`,
        paddingLeft: S.xl,
      }}>{sub.desc}</div>
      <div style={{
        height: 1, background: `rgba(${rgb},${hover ? A.phi : A.ghost})`,
        width: `${Math.round(sub.psi * 100)}%`,
        transition: `all 618ms ${EASE}`,
        marginTop: S._3xs,
      }} />
    </div>
  );
}

export default function DoorHall({ doorKey, onBack, onRoomSelect }) {
  const meta = DOOR_META[doorKey]; if (!meta) return null;
  const subs = SUBCATEGORIES[doorKey] || [];
  const { rgb, name, emoji } = meta;
  const [backH, setBackH] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 15%, rgba(${rgb},0.06) 0%, #03030a 55%)`,
      color: IVORY(A.phi),
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: `0 ${S.md}`, paddingBottom: S._2xl,
    }}>
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "61.8vw", height: "38.2vh",
        background: `radial-gradient(ellipse, rgba(${rgb},0.07) 0%, transparent 61.8%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      <button onClick={onBack}
        onMouseEnter={() => setBackH(true)} onMouseLeave={() => setBackH(false)}
        style={{
          position: "fixed", top: S.md, left: S.md, zIndex: 99,
          background: "none", border: "none", cursor: "pointer",
          ...DISPLAY_STYLE, fontSize: TEXT.label,
          color: `rgba(${rgb},${backH ? A.full : A.phi})`,
          transition: `color 618ms ${EASE}`, padding: `${S.xs} ${S.sm}`,
        }}
      >← BACK</button>

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "44rem",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: "clamp(80px, 13vh, 120px)",
      }}>
        <div style={{
          ...DISPLAY_STYLE, fontSize: TEXT.heading,
          letterSpacing: "0.236em",
          color: `rgba(${rgb},A.phi)`,
          marginBottom: S.xs,
          animation: "fadeUp 1s 100ms both ease",
        }}>{emoji} {name.toUpperCase()}</div>

        <h1 style={{
          ...ACCENT_STYLE,
          fontSize: TEXT.title,
          color: IVORY(A.phi),
          textAlign: "center", lineHeight: 1.618,
          maxWidth: "36rem",
          marginBottom: S.md,
          textShadow: `0 0 30px rgba(232,228,210,0.18), 0 0 60px rgba(232,228,210,0.08)`,
          animation: "fadeUp 1s 236ms both ease",
        }}>{QUESTIONS[doorKey]}</h1>

        <div style={{
          width: S._2xl, height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},0.50), transparent)`,
          marginBottom: S.lg,
          animation: "fadeUp 1s 382ms both ease",
        }} />

        <div style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(18rem, 1fr))",
          gap: S.md, alignItems: "stretch",
        }}>
          {subs.map((sub, i) => (
            <SubCard key={sub.id} sub={sub} rgb={rgb} index={i}
              onClick={() => onRoomSelect(doorKey, sub.id)} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(${S.md}); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
