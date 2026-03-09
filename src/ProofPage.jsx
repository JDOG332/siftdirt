/**
 * PROOF PAGE — The Heart of siftdirt.com
 *
 * "For thousands of years, in every language and every discipline,
 *  humans have been describing the same thing."
 *
 * Type anything → Watch 10 doors light up → Navigate deeper.
 * The search tool IS the proof.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PHI, PHI_INV } from "./data.js";
import { classifyContent, TEN_DOORS } from "./tenDoors.js";
import { siftSearch } from "./siftEngine.js";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const GOLD = (a) => `rgba(201,168,76,${a})`;
const IVORY = (a) => `rgba(232,228,210,${a})`;

// ─── TETRACTYS — 10 doors in sacred pyramid: 1+2+3+4 = 10 ───────
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
  "Love":          "220,160,160",
  "Mysticism":     "190,140,220",
  "Consciousness": "200,200,230",
  "Religion":      "201,168,76",
  "Art":           "224,120,100",
  "Nature":        "120,180,100",
  "Mythology":     "200,160,100",
  "Philosophy":    "150,180,220",
  "Science":       "79,195,247",
  "Mathematics":   "201,168,76",
};

const DOOR_DATA_KEY = {
  "Religion": "sameness", "Philosophy": "layers", "Science": "rock",
  "Mysticism": "plain", "Art": "depths", "Mathematics": "promise",
  "Mythology": "gravity", "Nature": "pillars", "Love": "filter",
  "Consciousness": "ancient",
};

// ─── BACK BUTTON (reusable) ──────────────────────────────────────
function BackButton({ onClick, label = "← BACK", rgb = "201,168,76" }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: "fixed", top: 21, left: 21, zIndex: 99,
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        fontSize: 14, letterSpacing: "0.382em", fontWeight: 500,
        color: `rgba(${rgb},${h ? 1.0 : 0.618})`,
        transition: `color 618ms ${EASE}`,
        padding: "0.618rem 1rem",
      }}
    >{label}</button>
  );
}

// ─── SINGLE DOOR NODE ────────────────────────────────────────────
function DoorNode({ door, score, maxScore, onClick }) {
  const [hover, setHover] = useState(false);
  const rgb = DOOR_COLORS[door.key] || "201,168,76";
  const intensity = maxScore > 0 ? score / maxScore : 0;
  const isLit = intensity > 0.08;
  const glow = isLit ? Math.max(0.18, intensity) : 0;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? `rgba(${rgb},0.14)`
          : isLit
            ? `rgba(${rgb},${0.04 + glow * 0.08})`
            : "rgba(232,228,210,0.018)",
        border: `1px solid rgba(${rgb},${hover ? 0.72 : isLit ? 0.18 + glow * 0.32 : 0.08})`,
        borderRadius: 4,
        padding: "0.618rem 1rem",
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "0.236rem",
        minWidth: 90,
        flex: "1 1 0",
        maxWidth: 140,
        position: "relative",
        overflow: "hidden",
        boxShadow: hover
          ? `0 0 28px rgba(${rgb},0.18), inset 0 0 14px rgba(${rgb},0.04)`
          : isLit
            ? `0 0 ${12 + glow * 20}px rgba(${rgb},${glow * 0.18})`
            : "none",
      }}
    >
      {/* Top glow line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(${rgb},${hover ? 0.618 : glow * 0.382}), transparent)`,
        transition: `all 618ms ${EASE}`,
      }} />

      <span style={{ fontSize: "clamp(22px, 3.6vmin, 30px)", lineHeight: 1 }}>
        {door.emoji}
      </span>
      <span style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "clamp(8px, 1.2vmin, 10px)",
        letterSpacing: "0.18em",
        fontWeight: 600,
        color: `rgba(${rgb},${hover ? 1.0 : isLit ? 0.72 + glow * 0.28 : 0.382})`,
        transition: `color 618ms ${EASE}`,
        textAlign: "center",
        lineHeight: 1.2,
      }}>
        {door.name}
      </span>

      {/* Score bar */}
      {isLit && (
        <div style={{
          width: "100%", height: 2, borderRadius: 1,
          background: `rgba(${rgb},0.12)`, marginTop: "0.236rem",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${Math.round(intensity * 100)}%`,
            height: "100%",
            background: `rgba(${rgb},${0.382 + intensity * 0.618})`,
            transition: `width 618ms ${EASE}`,
          }} />
        </div>
      )}
    </button>
  );
}

// ─── SEARCH RESULT CARD ──────────────────────────────────────────
function ResultCard({ result, index, onClick }) {
  const [hover, setHover] = useState(false);
  const isCard = result.type === "card";
  const rgb = isCard
    ? (DOOR_COLORS[result.doorName] || "201,168,76")
    : "201,168,76";

  const title = isCard
    ? result.card?.title || "Untitled"
    : result.node?.text || "Untitled";

  const subtitle = isCard
    ? result.card?.simple || result.card?.subtitle || ""
    : result.node?.depth || "";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "1rem 1.618rem",
        background: hover ? `rgba(${rgb},0.08)` : `rgba(${rgb},0.03)`,
        border: `1px solid rgba(${rgb},${hover ? 0.382 : 0.12})`,
        borderRadius: 4,
        cursor: "pointer",
        transition: `all 382ms ${EASE}`,
        animation: `fadeUp 0.618s ${0.1 + index * 0.09}s both ease`,
        display: "flex", flexDirection: "column", gap: "0.382rem",
      }}
    >
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.618rem" }}>
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 10, letterSpacing: "0.236em",
          color: `rgba(${rgb},0.618)`,
          fontWeight: 600,
        }}>
          {isCard ? `${result.doorEmoji} ${result.doorName}` : "✦ MIRROR"}
        </span>
        {isCard && (
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 12, color: IVORY(0.382),
          }}>
            {result.subName}
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(18px, 3vw, 24px)",
        fontWeight: 500,
        color: IVORY(hover ? 1.0 : 0.90),
        lineHeight: 1.382,
        transition: `color 382ms ${EASE}`,
      }}>
        {title}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(14px, 2.2vw, 17px)",
          color: IVORY(0.618),
          lineHeight: 1.618,
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// PROOF PAGE
// ═══════════════════════════════════════════════════════════════════

export default function ProofPage({
  onBack, onDoorSelect, onRoomSelect, onPoems, onMath, autoSearch
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [doorScores, setDoorScores] = useState({});
  const [maxDoorScore, setMaxDoorScore] = useState(0);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 800);
    return () => clearTimeout(t);
  }, []);

  // Live search with debounce
  const runSearch = useCallback((q) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setDoorScores({});
      setMaxDoorScore(0);
      return;
    }

    // Door classification for pyramid lighting
    const classified = classifyContent(q);
    const scores = {};
    let max = 0;
    classified.forEach((d) => {
      scores[d.door.name] = d.pct;
      if (d.pct > max) max = d.pct;
    });
    setDoorScores(scores);
    setMaxDoorScore(max);

    // Search engine results
    const hits = siftSearch(q);
    setResults(hits);
  }, []);

  const handleInput = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 200);
  }, [runSearch]);

  const handleResultClick = (r) => {
    if (r.type === "card") {
      onRoomSelect(r.doorKey, r.subId, r.cardId);
    } else if (r.type === "mirror" && r.navDoorKey) {
      onDoorSelect(r.navDoorKey);
    }
  };

  const handleDoorClick = (doorKey) => {
    const dataKey = DOOR_DATA_KEY[doorKey];
    if (dataKey) onDoorSelect(dataKey);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 18%, rgba(14,10,28,0.90) 0%, #03030a 55%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 1rem",
      paddingBottom: "4.236rem",
      overflowX: "hidden",
    }}>

      <BackButton onClick={onBack} />

      {/* ── Content column ── */}
      <div style={{
        width: "100%", maxWidth: 680,
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: "clamp(80px, 12vh, 120px)",
        position: "relative", zIndex: 1,
      }}>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(20px, 3.8vmin, 32px)",
          fontWeight: 600,
          letterSpacing: "0.236em",
          color: GOLD(0.88),
          textAlign: "center",
          animation: "fadeUp 1s 0.1s both ease",
          marginBottom: "0.618rem",
          textShadow: `0 0 18px rgba(201,168,76,0.28)`,
        }}>
          SIFT THE DIRT
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(16px, 2.8vmin, 22px)",
          fontWeight: 400,
          fontStyle: "italic",
          color: IVORY(0.618),
          textAlign: "center",
          animation: "fadeUp 1s 0.2s both ease",
          marginBottom: "1.618rem",
          lineHeight: 1.618,
          maxWidth: 480,
        }}>
          Type anything that matters to you.
          Watch all ten doors respond.
        </p>

        {/* ── SEARCH INPUT ── */}
        <div style={{
          width: "100%",
          animation: "fadeUp 0.8s 0.35s both ease",
          marginBottom: "1.618rem",
        }}>
          <input
            ref={inputRef}
            value={query}
            onChange={handleInput}
            placeholder="What are you searching for?"
            spellCheck={false}
            style={{
              width: "100%",
              background: "rgba(232,228,210,0.03)",
              border: `1px solid rgba(201,168,76,${query ? 0.382 : 0.146})`,
              borderRadius: 4,
              padding: "1rem 1.618rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(18px, 3vw, 24px)",
              fontWeight: 400,
              color: IVORY(0.95),
              outline: "none",
              transition: `border-color 618ms ${EASE}, box-shadow 618ms ${EASE}`,
              boxShadow: query
                ? `0 0 24px rgba(201,168,76,0.08), inset 0 0 12px rgba(201,168,76,0.02)`
                : "none",
              letterSpacing: "0.02em",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(201,168,76,0.50)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = query
                ? "rgba(201,168,76,0.382)"
                : "rgba(201,168,76,0.146)";
            }}
          />
        </div>

        {/* ── TETRACTYS PYRAMID ── */}
        <div style={{
          width: "100%",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "0.618rem",
          animation: "fadeUp 1s 0.5s both ease",
          marginBottom: "2.618rem",
        }}>
          {TETRACTYS.map((row, ri) => (
            <div key={ri} style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.618rem",
              width: "100%",
              maxWidth: `${(row.length / 4) * 100}%`,
            }}>
              {row.map((door) => (
                <DoorNode
                  key={door.key}
                  door={door}
                  score={doorScores[door.key] || 0}
                  maxScore={maxDoorScore}
                  onClick={() => handleDoorClick(door.key)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* ── SEARCH RESULTS ── */}
        {results.length > 0 && (
          <div style={{
            width: "100%",
            display: "flex", flexDirection: "column",
            gap: "0.618rem",
            marginBottom: "2.618rem",
          }}>
            {/* Divider */}
            <div style={{
              width: "100%", height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD(0.236)}, transparent)`,
              marginBottom: "0.382rem",
            }} />

            {results.map((r, i) => (
              <ResultCard
                key={`${r.type}-${i}`}
                result={r}
                index={i}
                onClick={() => handleResultClick(r)}
              />
            ))}
          </div>
        )}

        {/* ── NAVIGATION FOOTER ── */}
        <div style={{
          display: "flex", gap: "1.618rem",
          justifyContent: "center",
          animation: "fadeUp 1s 0.7s both ease",
        }}>
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
        border: `1px solid ${GOLD(h ? 0.382 : 0.146)}`,
        borderRadius: 2,
        padding: "0.618rem 1.618rem",
        fontFamily: "'Cinzel', serif",
        fontSize: "clamp(10px, 1.4vmin, 13px)",
        letterSpacing: "0.382em",
        fontWeight: 500,
        color: GOLD(h ? 0.88 : 0.50),
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
      }}
    >{label}</button>
  );
}
