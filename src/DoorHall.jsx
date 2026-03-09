/**
 * DOOR HALL — The 10 rooms inside each door
 * Clean, readable, PHI-spaced cards
 */

import React, { useState } from "react";
import { PHI } from "./data.js";
import { SUBCATEGORIES } from "./subcategories.js";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

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
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "1.618rem",
        background: hover ? `rgba(${rgb},0.10)` : `rgba(${rgb},0.04)`,
        border: `1px solid rgba(${rgb},${hover ? 0.50 : 0.18})`,
        borderRadius: 4,
        cursor: "pointer",
        transition: `all 382ms ${EASE}`,
        animation: `fadeUp 0.618s ${index * 0.06}s both ease`,
        boxShadow: hover
          ? `0 4px 24px rgba(${rgb},0.12), inset 0 0 18px rgba(${rgb},0.03)`
          : "none",
        display: "flex", flexDirection: "column",
        gap: "0.618rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(${rgb},${hover ? 0.618 : 0.146}), transparent)`,
        transition: `background 382ms ${EASE}`,
      }} />

      {/* Icon + Name row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.618rem" }}>
        <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{sub.icon}</span>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(13px, 2vw, 16px)",
          letterSpacing: "0.06em",
          fontWeight: 600,
          color: `rgba(${rgb},${hover ? 1.0 : 0.88})`,
          textShadow: hover ? `0 0 12px rgba(${rgb},0.45)` : "none",
          transition: `all 382ms ${EASE}`,
          lineHeight: 1.2,
        }}>
          {sub.name}
        </div>
      </div>

      {/* Description */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(17px, 2.8vw, 22px)",
        fontWeight: 400,
        color: `rgba(232,228,210,${hover ? 0.95 : 0.82})`,
        lineHeight: 1.618,
        transition: `color 382ms ${EASE}`,
        paddingLeft: "2.618rem",
      }}>
        {sub.desc}
      </div>

      {/* Psi bar */}
      <div style={{
        height: 1,
        background: `rgba(${rgb},${hover ? 0.382 : 0.146})`,
        borderRadius: 1,
        width: `${Math.round(sub.psi * 100)}%`,
        transition: `all 618ms ${EASE}`,
        marginLeft: "2.618rem",
      }} />
    </div>
  );
}

export default function DoorHall({ doorKey, onBack, onRoomSelect }) {
  const meta = DOOR_META[doorKey];
  if (!meta) return null;
  const subs = SUBCATEGORIES[doorKey] || [];
  const { rgb, name, emoji } = meta;
  const [backH, setBackH] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 12%, rgba(${rgb},0.05) 0%, #03030a 55%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 1rem",
      paddingBottom: "4.236rem",
      overflowX: "hidden",
    }}>

      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "60vw", height: "30vh",
        background: `radial-gradient(ellipse, rgba(${rgb},0.05) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Back */}
      <button onClick={onBack}
        onMouseEnter={() => setBackH(true)} onMouseLeave={() => setBackH(false)}
        style={{
          position: "fixed", top: 21, left: 21, zIndex: 99,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Cinzel', serif",
          fontSize: 14, letterSpacing: "0.382em", fontWeight: 500,
          color: `rgba(${rgb},${backH ? 1.0 : 0.618})`,
          transition: `color 618ms ${EASE}`,
          padding: "0.618rem 1rem",
        }}
      >← BACK</button>

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 680,
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: "clamp(80px, 12vh, 120px)",
      }}>

        {/* Door label */}
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(12px, 1.8vmin, 16px)",
          letterSpacing: "0.618em",
          fontWeight: 600,
          color: `rgba(${rgb},0.72)`,
          marginBottom: "0.618rem",
          animation: "fadeUp 0.8s 0.1s both ease",
        }}>
          {emoji} {name.toUpperCase()}
        </div>

        {/* Core question */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(24px, 4.5vw, 36px)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "rgba(232,228,210,0.92)",
          textAlign: "center",
          lineHeight: 1.618,
          maxWidth: 540,
          marginBottom: "1rem",
          textShadow: "0 0 24px rgba(232,228,210,0.14)",
          animation: "fadeUp 1s 0.2s both ease",
        }}>
          {QUESTIONS[doorKey]}
        </h1>

        {/* Gold line */}
        <div style={{
          width: 144, height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},0.45), transparent)`,
          marginBottom: "2.618rem",
          animation: "fadeUp 0.8s 0.35s both ease",
        }} />

        {/* Subcategory cards */}
        <div style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          alignItems: "stretch",
        }}>
          {subs.map((sub, i) => (
            <SubCard
              key={sub.id}
              sub={sub}
              rgb={rgb}
              index={i}
              onClick={() => onRoomSelect(doorKey, sub.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
