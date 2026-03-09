/**
 * PROOF PAGE — The Heart of siftdirt.com
 * RESTORED: DoorOrnament, dynamic pyramid, atmospheric glows
 * KEPT: Clean structure, better search input, simpler layout
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PHI, PHI_INV } from "./data.js";
import { classifyContent, TEN_DOORS } from "./tenDoors.js";
import { siftSearch } from "./siftEngine.js";
import { F, S, A, GOLD, IVORY, EASE, TEXT, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE, textGlow, boxGlow } from "./phi.js";

const PHIi  = 0.6180339887498949;
const PHIi2 = 0.3819660112501051;
const PHIi3 = 0.2360679774997896;
const PHIi4 = 0.1458980337503153;

// ─── TETRACTYS LAYOUT ─────────────────────────────────────────
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
  "Love":"220,160,160","Mysticism":"190,140,220","Consciousness":"200,200,230",
  "Religion":"201,168,76","Art":"224,120,100","Nature":"120,180,100",
  "Mythology":"200,160,100","Philosophy":"150,180,220","Science":"79,195,247",
  "Mathematics":"201,168,76",
};

const DOOR_DATA_KEY = {
  "Religion":"sameness","Philosophy":"layers","Science":"rock","Mysticism":"plain",
  "Art":"depths","Mathematics":"promise","Mythology":"gravity","Nature":"pillars",
  "Love":"filter","Consciousness":"ancient",
};

// ─── FLOWER OF LIFE ORNAMENT ──────────────────────────────────
function DoorOrnament({ size, alpha }) {
  const r = size / 2;
  const r1 = r * PHIi, r2 = r * PHIi2, r3 = r * PHIi3;
  const O = { ghost: PHIi4, dim: PHIi3, mid: PHIi2, pres: PHIi };
  const petals = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    const cx = r + Math.cos(a) * r2, cy = r + Math.sin(a) * r2;
    return `M${cx} ${cy} m-${r2} 0 a${r2} ${r2} 0 1 0 ${r2*2} 0 a${r2} ${r2} 0 1 0-${r2*2} 0`;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ opacity: alpha, overflow: "visible", display: "block", flexShrink: 0 }}>
      <circle cx={r} cy={r} r={r*.94} fill="none" stroke={GOLD(O.dim)} strokeWidth=".5"/>
      {petals.map((d, i) => <path key={i} d={d} fill="none" stroke={GOLD(O.dim)} strokeWidth=".5"/>)}
      {[0,1,2,3,4,5].map(i => {
        const a = (i/6)*Math.PI*2;
        return <line key={i} x1={r+Math.cos(a)*r1} y1={r+Math.sin(a)*r1}
          x2={r+Math.cos(a+Math.PI)*r1} y2={r+Math.sin(a+Math.PI)*r1}
          stroke={GOLD(O.ghost)} strokeWidth=".4"/>;
      })}
      <circle cx={r} cy={r} r={r1} fill="none" stroke={GOLD(O.dim)} strokeWidth=".5"/>
      <circle cx={r} cy={r} r={r3} fill="none" stroke={GOLD(O.mid)} strokeWidth=".5"/>
      <circle cx={r} cy={r} r={3.5} fill={GOLD(O.pres)}/>
      <circle cx={r} cy={r} r={1.5} fill={GOLD(1)}/>
    </svg>
  );
}

// ─── BACK BUTTON (with breathing glow) ───────────────────────
function BackButton({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="foot-glow"
      style={{
        position: "fixed", top: S.md, left: S.md, zIndex: 999,
        background: "none", border: "none", cursor: "pointer",
        ...DISPLAY_STYLE,
        fontSize: TEXT.label,
        color: GOLD(h ? A.full : A.phi),
        transition: `color 618ms ${EASE}`,
        padding: `${S.xs} ${S.sm}`,
        userSelect: "none",
      }}
    >← BACK</button>
  );
}

// ─── DYNAMIC TETRACTYS PYRAMID ────────────────────────────────
function TetractysDisplay({ scores, topDoor, onDoorSelect }) {
  const W = typeof window !== "undefined" ? window.innerWidth : 800;
  const H = typeof window !== "undefined" ? window.innerHeight : 900;
  // Dynamic card sizing — rectangular Egyptian blocks (φ ratio)
  const cardByH = Math.round(H * 0.56 / 4.236);
  const cardByW = Math.round(W / 4.236);
  const cardH = Math.round(Math.max(72, Math.min(cardByH, cardByW, 110)));
  const cardW = Math.round(cardH * 1.618);  // φ ratio — wider than tall
  const gap  = Math.round(Math.max(7, Math.min(11, W / 62)));
  const rowGap = Math.round(gap * 1.1);
  const emojiSz = Math.round(cardH * 0.38);

  // Label size per ROW — uniform within each row, sized by the longest name
  // This ensures visual symmetry: every block in a row has identical typography
  const rowLabelSizes = TETRACTYS.map((row) => {
    const longest = Math.max(...row.map(d => d.name.length));
    const base = Math.round(cardW * 0.10);
    return Math.max(8, Math.round(base * Math.sqrt(8 / Math.max(8, longest))));
  });

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: rowGap, width: "100%",
      animation: "fadeUp 1s 382ms both ease",
    }}>
      {TETRACTYS.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap, justifyContent: "center" }}>
          {row.map((door) => {
            const pct = scores?.[door.key] ?? 0;
            const isTop = topDoor === door.key;
            const rgb = DOOR_COLORS[door.key] || "201,168,76";
            const hasScore = scores !== null && Object.keys(scores).length > 0;
            const bgOp  = hasScore ? Math.max(0.08, pct / 100 * 0.9) : 0.12;
            const borOp = hasScore ? Math.max(0.22, pct / 100 * 0.6) : 0.30;
            const txtOp = hasScore ? Math.max(0.70, Math.min(1.0, pct / 100 * 1.4)) : 0.90;
            const emjOp = hasScore ? Math.max(0.75, Math.min(1.0, pct / 60)) : 0.95;
            const rowFontSize = rowLabelSizes[ri];

            return (
              <div key={door.key}
                onClick={() => onDoorSelect(DOOR_DATA_KEY[door.key])}
                style={{
                  width: cardW, height: cardH,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: Math.round(cardH * 0.06),
                  borderRadius: 6,
                  background: `rgba(${rgb},${bgOp})`,
                  border: `1px solid rgba(${rgb},${borOp})`,
                  boxShadow: isTop
                    ? `0 0 ${cardW * 0.24}px rgba(${rgb},0.22), 0 0 ${cardW * 0.45}px rgba(${rgb},0.07)`
                    : pct > 20 ? `0 0 ${cardW * 0.12}px rgba(${rgb},0.09)` : "none",
                  transition: `all 618ms ${EASE}`,
                  animation: isTop ? "proofPulse 2.618s ease-in-out infinite" : "none",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "visible",
                  padding: `${Math.round(cardH * 0.08)}px ${Math.round(cardW * 0.06)}px`,
                  userSelect: "none",
                }}
              >
                {/* Inner radial glow on activation */}
                {pct > 10 && (
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 7,
                    background: `radial-gradient(ellipse at center, rgba(${rgb},${Math.min(0.12, pct/300)}) 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                )}

                {/* Top rule glow */}
                <div style={{
                  position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
                  background: `rgba(${rgb},${borOp * 1.5})`,
                  transition: `background 618ms ease`,
                }} />

                {/* Emoji with drop-shadow glow */}
                <div style={{
                  fontSize: emojiSz, lineHeight: 1,
                  opacity: emjOp,
                  filter: pct > 5 ? `drop-shadow(0 0 ${Math.round(emojiSz * 0.4)}px rgba(${rgb},${Math.min(0.6, pct/60)}))` : "none",
                  transition: `all 618ms ease`,
                  flexShrink: 0,
                }}>{door.emoji}</div>

                {/* Label — uniform size per row for visual symmetry */}
                <div style={{
                  fontFamily: F.display,
                  fontWeight: 900,
                  fontSize: rowFontSize,
                  letterSpacing: "0.04em",
                  color: `rgba(${rgb},${txtOp})`,
                  textAlign: "center",
                  transition: `color 618ms ease`,
                  lineHeight: 1.1,
                  width: "100%",
                  whiteSpace: "nowrap",
                }}>{door.name}</div>

                {/* Score percentage */}
                {hasScore && pct > 0 && (
                  <div style={{
                    fontFamily: F.body, fontWeight: 300,
                    fontSize: Math.max(7, Math.round(cardH * 0.09)),
                    color: `rgba(${rgb},${Math.max(0.3, pct/100)})`,
                    transition: `color 618ms ease`,
                  }}>{Math.round(pct)}%</div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── SEARCH RESULT CARD ──────────────────────────────────────
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
        background: hover ? `rgba(${rgb},${A.ghost})` : `rgba(${rgb},0.03)`,
        border: `1px solid rgba(${rgb},${hover ? A.phi : A.ghost})`,
        borderRadius: S._2xs,
        cursor: "pointer",
        transition: `all 382ms ${EASE}`,
        animation: `fadeUp 618ms ${100 + index * 100}ms both ease`,
        display: "flex", flexDirection: "column", gap: S._2xs,
        boxShadow: hover ? boxGlow(rgb, 0.618) : "none",
      }}
    >
      <span style={{
        ...DISPLAY_STYLE, fontSize: TEXT.caption,
        color: `rgba(${rgb},${A.phi})`,
      }}>
        {isCard ? `${result.doorEmoji} ${result.doorName}` : "✦ MIRROR"}
        {isCard && result.subName && (
          <span style={{ ...BODY_STYLE, fontSize: TEXT.caption, color: IVORY(A.ghost), marginLeft: S.xs }}>{result.subName}</span>
        )}
      </span>
      <span style={{
        ...BODY_STYLE, fontWeight: 400,
        fontSize: TEXT.body,
        color: IVORY(hover ? A.full : A.phi),
        transition: `color 382ms ${EASE}`,
      }}>{title}</span>
      {subtitle && (
        <span style={{ ...BODY_STYLE, fontSize: TEXT.label, color: IVORY(A.ghost) }}>{subtitle}</span>
      )}
    </div>
  );
}

// ─── NAV LINK — True exploration options, not afterthoughts ──
function NavLink({ label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? `rgba(201,168,76,${A.ghost})` : `rgba(201,168,76,0.04)`,
        border: `1px solid ${GOLD(h ? A.phi : A.ghost)}`,
        borderRadius: S._2xs,
        padding: `${S.xs} ${S.lg}`,
        ...DISPLAY_STYLE,
        fontSize: TEXT.label,
        letterSpacing: "0.146em",
        color: GOLD(h ? A.full : A.phi),
        cursor: "pointer",
        transition: `all 618ms ${EASE}`,
        boxShadow: h ? boxGlow("201,168,76", A.phi) : `0 0 12px rgba(201,168,76,0.04)`,
        flex: 1,
        maxWidth: "14rem",
        textAlign: "center",
      }}
    >{label}</button>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROOF PAGE
// ═══════════════════════════════════════════════════════════════

export default function ProofPage({ onBack, onDoorSelect, onRoomSelect, onPoems, onMath, autoSearch }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [doorScores, setDoorScores] = useState({});
  const [maxDoorScore, setMaxDoorScore] = useState(0);
  const [topDoor, setTopDoor] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 618);
    return () => clearTimeout(t);
  }, []);

  const runSearch = useCallback((q) => {
    if (!q || q.trim().length < 2) {
      setResults([]); setDoorScores({}); setMaxDoorScore(0); setTopDoor(null); return;
    }
    const classified = classifyContent(q);
    const scores = {}; let max = 0; let top = null;
    classified.forEach((d) => {
      scores[d.door.name] = d.pct;
      if (d.pct > max) { max = d.pct; top = d.door.name; }
    });
    setDoorScores(scores); setMaxDoorScore(max); setTopDoor(top);
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
      overflowX: "hidden",
    }}>

      {/* Animations */}
      <style>{`
        .foot-glow { animation: footGlow 11.2s ease-in-out infinite; }
        @keyframes footGlow {
          0%,100% { text-shadow: 0 0 8px rgba(201,168,76,0.5), 0 0 20px rgba(201,168,76,0.25), 0 0 40px rgba(201,168,76,0.1); }
          50%     { text-shadow: 0 0 12px rgba(201,168,76,0.8), 0 0 30px rgba(201,168,76,0.4), 0 0 60px rgba(201,168,76,0.2); }
        }
        @keyframes proofPulse {
          0%,100% { filter: brightness(1); }
          50%     { filter: brightness(1.25); }
        }
      `}</style>

      {/* Ambient atmospheric glow */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "61.8vw", height: "38.2vh",
        background: `radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 61.8%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      <BackButton onClick={onBack} />

      <div style={{
        width: "100%", maxWidth: "40rem",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: S.md, position: "relative", zIndex: 1,
      }}>

        {/* Flower of Life ornament — aligned with BACK button */}
        <div style={{ animation: "fadeUp 1s 100ms both ease", marginBottom: S.xs }}>
          <DoorOrnament size={48} alpha={A.phi} />
        </div>

        {/* Title */}
        <h1 style={{
          ...DISPLAY_STYLE,
          fontSize: TEXT.title,
          letterSpacing: "0.236em",
          color: GOLD(A.phi),
          textAlign: "center",
          animation: "fadeUp 1s 100ms both ease",
          marginBottom: S.xs,
          textShadow: textGlow("201,168,76", 0.618),
        }}>SIFT THE DIRT</h1>

        {/* Subtitle */}
        <p style={{
          ...ACCENT_STYLE,
          fontSize: TEXT.body,
          color: IVORY(A.phi),
          textAlign: "center",
          animation: "fadeUp 1s 236ms both ease",
          marginBottom: S.md,
          maxWidth: "30rem",
        }}>
          Type anything that matters to you. Watch all ten doors respond.
        </p>

        {/* ── EXPLORE NAVIGATION — true paths to walk ── */}
        <div style={{
          display: "flex", gap: S.md, width: "100%", justifyContent: "center",
          animation: "fadeUp 618ms 300ms both ease",
          marginBottom: S.md,
        }}>
          <NavLink label="✦ POEMS" onClick={onPoems} />
          <NavLink label="✦ MATHEMATICS" onClick={onMath} />
        </div>

        {/* ── THE TETRACTYS — the sacred architecture, seen first ── */}
        <div style={{ marginBottom: S.md, width: "100%" }}>
          <TetractysDisplay
            scores={doorScores}
            topDoor={topDoor}
            onDoorSelect={onDoorSelect}
          />
        </div>

        {/* ── SEARCH — the tool that activates the temple ── */}
        <div style={{ width: "100%", animation: "fadeUp 618ms 618ms both ease", marginBottom: S.md }}>
          <input ref={inputRef} value={query} onChange={handleInput}
            placeholder="What are you searching for?"
            spellCheck={false}
            style={{
              width: "100%",
              background: `rgba(232,228,210,0.03)`,
              border: `1px solid ${GOLD(query ? A.ghost : A.ghost)}`,
              borderRadius: S._2xs,
              padding: `${S.sm} ${S.md}`,
              ...BODY_STYLE, fontWeight: 400,
              fontSize: TEXT.body,
              color: IVORY(A.full),
              outline: "none",
              transition: `all 618ms ${EASE}`,
              boxShadow: query ? `0 0 24px rgba(201,168,76,0.08), inset 0 0 12px rgba(201,168,76,0.02)` : "none",
            }}
            onFocus={(e) => e.target.style.borderColor = GOLD(A.phi)}
            onBlur={(e) => e.target.style.borderColor = GOLD(A.ghost)}
          />
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: S.xs, marginBottom: S.lg }}>
            <div style={{ width: "100%", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD(A.ghost)}, transparent)`, marginBottom: S._2xs }} />
            {results.map((r, i) => (
              <ResultCard key={`${r.type}-${i}`} result={r} index={i} onClick={() => handleResultClick(r)} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
