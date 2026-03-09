/**
 * PROOF PAGE — 100% Φ Design System
 * Every spacing, font, opacity, and ratio from φ = 1.618
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PHI, PHI_INV } from "./data.js";
import { classifyContent, TEN_DOORS } from "./tenDoors.js";
import { siftSearch } from "./siftEngine.js";
import { F, S, A, GOLD, IVORY, EASE, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE } from "./phi.js";

const TETRACTYS = [
  [{ num: "IX",  name: "LOVE",          emoji: "💛", key: "Love" }],
  [{ num: "IV",  name: "MYSTICISM",     emoji: "✨", key: "Mysticism" },
   { num: "X",   name: "CONSCIOUSNESS", emoji: "👁️", key: "Consciousness" }],
  [{ num: "I",   name: "RELIGION",      emoji: "⛪", key: "Religion" },
   { num: "V",   name: "ART",           emoji: "🎨", key: "Art" },
   { num: "VIII",name: "NATURE",        emoji: "🌿", key: "Nature" }],
  [{ num: "VII", name: "MYTHOLOGY",     emoji: "📖", key: "Mythology" },
   { num: "II",  name: "PHILOSOPHY",    emoji: "🏛️", key: "Philosophy" },
   { num: "III", name: "SCIENCE",       emoji: "🔬", key: "Science" },
   { num: "VI",  name: "MATHEMATICS",   emoji: "📐", key: "Mathematics" }],
];

const DOOR_COLORS = {
  "Love":"220,160,160", "Mysticism":"190,140,220", "Consciousness":"200,200,230",
  "Religion":"201,168,76", "Art":"224,120,100", "Nature":"120,180,100",
  "Mythology":"200,160,100", "Philosophy":"150,180,220", "Science":"79,195,247",
  "Mathematics":"201,168,76",
};

const DOOR_DATA_KEY = {
  "Religion":"sameness","Philosophy":"layers","Science":"rock","Mysticism":"plain",
  "Art":"depths","Mathematics":"promise","Mythology":"gravity","Nature":"pillars",
  "Love":"filter","Consciousness":"ancient",
};

function BackButton({ onClick, rgb = "201,168,76" }) {
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

function DoorNode({ door, score, maxScore, onClick }) {
  const [hover, setHover] = useState(false);
  const rgb = DOOR_COLORS[door.key] || "201,168,76";
  const intensity = maxScore > 0 ? score / maxScore : 0;
  const isLit = intensity > 0.1;
  const alpha = isLit ? A.phi : A.ghost;

  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? `rgba(${rgb},${A.ghost})` : `rgba(${rgb},${isLit ? A.ghost : 0})`,
        border: `1px solid rgba(${rgb},${hover ? A.phi : isLit ? A.ghost : A.ghost})`,
        borderRadius: S._3xs,
        padding: `${S.xs} ${S.sm}`,
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: S._3xs,
        flex: "1 1 0",
        aspectRatio: "1.618 / 1",
        justifyContent: "center",
        boxShadow: hover ? `0 0 ${S.md} rgba(${rgb},${A.ghost})` : "none",
      }}
    >
      <span style={{ fontSize: S.lg, lineHeight: 1 }}>{door.emoji}</span>
      <span style={{
        ...DISPLAY_STYLE,
        fontSize: S._2xs,
        color: `rgba(${rgb},${hover ? A.full : alpha})`,
        transition: `color 618ms ${EASE}`,
        textAlign: "center",
      }}>{door.name}</span>
      {isLit && (
        <div style={{
          width: "100%", height: S._3xs, borderRadius: S._3xs,
          background: `rgba(${rgb},${A.ghost})`, overflow: "hidden",
        }}>
          <div style={{
            width: `${Math.round(intensity * 100)}%`, height: "100%",
            background: `rgba(${rgb},${A.phi})`,
            transition: `width 618ms ${EASE}`,
          }} />
        </div>
      )}
    </button>
  );
}

function ResultCard({ result, index, onClick }) {
  const [hover, setHover] = useState(false);
  const isCard = result.type === "card";
  const rgb = isCard ? (DOOR_COLORS[result.doorName] || "201,168,76") : "201,168,76";
  const title = isCard ? (result.card?.title || "Untitled") : (result.node?.text || "Untitled");
  const subtitle = isCard ? (result.card?.simple || "") : "";

  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: `${S.sm} ${S.md}`,
        background: hover ? `rgba(${rgb},${A.ghost})` : "transparent",
        border: `1px solid rgba(${rgb},${hover ? A.ghost : A.ghost})`,
        borderRadius: S._3xs,
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        animation: `fadeUp 618ms ${100 + index * 100}ms both ease`,
        display: "flex", flexDirection: "column", gap: S._2xs,
      }}
    >
      <span style={{
        ...DISPLAY_STYLE,
        fontSize: S._2xs,
        color: `rgba(${rgb},${A.phi})`,
      }}>
        {isCard ? `${result.doorEmoji} ${result.doorName}` : "✦ MIRROR"}
      </span>
      <span style={{
        ...BODY_STYLE,
        fontWeight: 400,
        fontSize: S.md,
        color: IVORY(hover ? A.full : A.phi),
        transition: `color 618ms ${EASE}`,
      }}>{title}</span>
      {subtitle && (
        <span style={{
          ...BODY_STYLE,
          fontSize: S.sm,
          color: IVORY(A.ghost),
        }}>{subtitle}</span>
      )}
    </div>
  );
}

export default function ProofPage({ onBack, onDoorSelect, onRoomSelect, onPoems, onMath, autoSearch }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [doorScores, setDoorScores] = useState({});
  const [maxDoorScore, setMaxDoorScore] = useState(0);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 618);
    return () => clearTimeout(t);
  }, []);

  const runSearch = useCallback((q) => {
    if (!q || q.trim().length < 2) {
      setResults([]); setDoorScores({}); setMaxDoorScore(0); return;
    }
    const classified = classifyContent(q);
    const scores = {}; let max = 0;
    classified.forEach((d) => { scores[d.door.name] = d.pct; if (d.pct > max) max = d.pct; });
    setDoorScores(scores); setMaxDoorScore(max);
    setResults(siftSearch(q));
  }, []);

  const handleInput = useCallback((e) => {
    const val = e.target.value; setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 236);
  }, [runSearch]);

  const handleResultClick = (r) => {
    if (r.type === "card") onRoomSelect(r.doorKey, r.subId, r.cardId);
    else if (r.type === "mirror" && r.navDoorKey) onDoorSelect(r.navDoorKey);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 23.6%, rgba(14,10,28,${A.phi}) 0%, #03030a 61.8%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: `0 ${S.sm}`,
      paddingBottom: S._2xl,
    }}>
      <BackButton onClick={onBack} />

      <div style={{
        width: "100%", maxWidth: "42rem",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: S._2xl, position: "relative", zIndex: 1,
      }}>
        <h1 style={{
          ...DISPLAY_STYLE,
          fontSize: S.xl,
          color: GOLD(A.phi),
          textAlign: "center",
          animation: "fadeUp 618ms 100ms both ease",
          marginBottom: S.xs,
          textShadow: `0 0 ${S.md} rgba(201,168,76,${A.ghost})`,
        }}>SIFT THE DIRT</h1>

        <p style={{
          ...ACCENT_STYLE,
          fontSize: S.sm,
          color: IVORY(A.phi),
          textAlign: "center",
          animation: "fadeUp 618ms 236ms both ease",
          marginBottom: S.md,
          maxWidth: "30rem",
        }}>
          Type anything that matters to you. Watch all ten doors respond.
        </p>

        {/* Search input */}
        <div style={{ width: "100%", animation: "fadeUp 618ms 382ms both ease", marginBottom: S.md }}>
          <input ref={inputRef} value={query} onChange={handleInput}
            placeholder="What are you searching for?"
            spellCheck={false}
            style={{
              width: "100%",
              background: `rgba(232,228,210,${A.ghost})`,
              border: `1px solid ${GOLD(query ? A.ghost : A.ghost)}`,
              borderRadius: S._3xs,
              padding: `${S.sm} ${S.md}`,
              ...BODY_STYLE,
              fontWeight: 400,
              fontSize: S.md,
              color: IVORY(A.full),
              outline: "none",
              transition: `all 618ms ${EASE}`,
            }}
            onFocus={(e) => e.target.style.borderColor = GOLD(A.phi)}
            onBlur={(e) => e.target.style.borderColor = GOLD(A.ghost)}
          />
        </div>

        {/* Tetractys */}
        <div style={{
          width: "100%",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: S.xs,
          animation: "fadeUp 618ms 618ms both ease",
          marginBottom: S.lg,
        }}>
          {TETRACTYS.map((row, ri) => (
            <div key={ri} style={{
              display: "flex", justifyContent: "center",
              gap: S.xs, width: `${(row.length / 4) * 100}%`,
            }}>
              {row.map((door) => (
                <DoorNode key={door.key} door={door}
                  score={doorScores[door.key] || 0} maxScore={maxDoorScore}
                  onClick={() => { const dk = DOOR_DATA_KEY[door.key]; if (dk) onDoorSelect(dk); }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: S.xs, marginBottom: S.lg }}>
            <div style={{ width: "100%", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD(A.ghost)}, transparent)` }} />
            {results.map((r, i) => (
              <ResultCard key={`${r.type}-${i}`} result={r} index={i} onClick={() => handleResultClick(r)} />
            ))}
          </div>
        )}

        {/* Nav footer */}
        <div style={{ display: "flex", gap: S.md, animation: "fadeUp 618ms 618ms both ease" }}>
          <NavLink label="POEMS" onClick={onPoems} />
          <NavLink label="MATHEMATICS" onClick={onMath} />
        </div>
      </div>
    </div>
  );
}

function NavLink({ label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: "none",
        border: `1px solid ${GOLD(h ? A.phi : A.ghost)}`,
        borderRadius: S._3xs,
        padding: `${S.xs} ${S.md}`,
        ...DISPLAY_STYLE,
        fontSize: S._2xs,
        color: GOLD(h ? A.phi : A.ghost),
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
      }}
    >{label}</button>
  );
}
