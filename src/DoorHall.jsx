/**
 * DOOR HALL — 100% Φ Design System
 * phi-card aspect ratio, strict spacing, correct typography
 */

import React, { useState } from "react";
import { SUBCATEGORIES } from "./subcategories.js";
import { F, S, A, GOLD, IVORY, EASE, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE } from "./phi.js";

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
        aspectRatio: "1.618 / 1",
        padding: S.md,
        background: hover ? `rgba(${rgb},${A.ghost})` : "transparent",
        border: `1px solid rgba(${rgb},${hover ? A.phi : A.ghost})`,
        borderRadius: S._3xs,
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        animation: `fadeUp 618ms ${index * 100}ms both ease`,
        boxShadow: hover ? `0 0 ${S.lg} rgba(${rgb},${A.ghost})` : "none",
        display: "flex", flexDirection: "column",
        justifyContent: "center", gap: S.xs,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: S.xs }}>
        <span style={{ fontSize: S.lg, lineHeight: 1, flexShrink: 0 }}>{sub.icon}</span>
        <div style={{
          ...DISPLAY_STYLE,
          fontSize: S.xs,
          color: `rgba(${rgb},${hover ? A.full : A.phi})`,
          transition: `color 618ms ${EASE}`,
        }}>{sub.name}</div>
      </div>
      <div style={{
        ...BODY_STYLE,
        fontWeight: 400,
        fontSize: S.sm,
        color: IVORY(hover ? A.full : A.phi),
        transition: `color 618ms ${EASE}`,
        paddingLeft: S.xl,
      }}>{sub.desc}</div>
      <div style={{
        height: "1px",
        background: `rgba(${rgb},${hover ? A.phi : A.ghost})`,
        width: `${Math.round(sub.psi * 100)}%`,
        transition: `all 618ms ${EASE}`,
        marginLeft: S.xl,
      }} />
    </div>
  );
}

function BackBtn({ onClick, rgb }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: "fixed", top: S.md, left: S.md, zIndex: 99,
        background: "none", border: "none", cursor: "pointer",
        ...DISPLAY_STYLE,
        fontSize: S.xs,
        color: `rgba(${rgb},${h ? A.full : A.phi})`,
        transition: `color 618ms ${EASE}`,
        padding: `${S.xs} ${S.sm}`,
      }}
    >← BACK</button>
  );
}

export default function DoorHall({ doorKey, onBack, onRoomSelect }) {
  const meta = DOOR_META[doorKey];
  if (!meta) return null;
  const subs = SUBCATEGORIES[doorKey] || [];
  const { rgb, name, emoji } = meta;

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 23.6%, rgba(${rgb},${A.ghost}) 0%, #03030a 61.8%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: `0 ${S.sm}`, paddingBottom: S._2xl,
    }}>
      <BackBtn onClick={onBack} rgb={rgb} />

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "42rem",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: S._2xl,
      }}>
        <div style={{
          ...DISPLAY_STYLE,
          fontSize: S.xs,
          color: `rgba(${rgb},${A.phi})`,
          marginBottom: S.xs,
          animation: "fadeUp 618ms 100ms both ease",
        }}>{emoji} {name.toUpperCase()}</div>

        <h1 style={{
          ...ACCENT_STYLE,
          fontSize: S.lg,
          color: IVORY(A.phi),
          textAlign: "center",
          maxWidth: "34rem",
          marginBottom: S.sm,
          textShadow: `0 0 ${S.md} rgba(232,228,210,${A.ghost})`,
          animation: "fadeUp 618ms 236ms both ease",
        }}>{QUESTIONS[doorKey]}</h1>

        <div style={{
          width: S._2xl, height: "1px",
          background: `linear-gradient(90deg, transparent, rgba(${rgb},${A.phi}), transparent)`,
          marginBottom: S.lg,
          animation: "fadeUp 618ms 382ms both ease",
        }} />

        <div style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(18rem, 1fr))",
          gap: S.sm,
        }}>
          {subs.map((sub, i) => (
            <SubCard key={sub.id} sub={sub} rgb={rgb} index={i}
              onClick={() => onRoomSelect(doorKey, sub.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
