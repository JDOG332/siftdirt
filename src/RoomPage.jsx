/**
 * ROOM PAGE — Experience a single topic card
 * Three depth levels: Simple → Deeper → Full Picture
 * Five senses lock it in. Songs connect it. Wiki expands it.
 */

import React, { useState, useEffect, useRef } from "react";
import { SUBCATEGORIES } from "./subcategories.js";
import { TOPIC_CARDS } from "./topicCards.js";
import { DOOR_META } from "./DoorHall.jsx";
import WikiSummary from "./WikiSummary.jsx";
import { F, S, A, GOLD, IVORY, EASE, TEXT, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE, textGlow, boxGlow } from "./phi.js";

/**
 * Splits a long text string into paragraphs of 3 sentences each.
 * Handles: "Mr.", "Dr.", "St.", "e.g.", "i.e.", decimal numbers,
 * and other common abbreviations that shouldn't be split on.
 * Returns an array of paragraph strings.
 */
function splitIntoParagraphs(text, sentencesPerParagraph = 3) {
  if (!text) return [];
  // Split on sentence boundaries: period/question/exclamation followed by space + capital letter
  // Negative lookbehind avoids splitting on common abbreviations
  const sentences = text.match(/[^.!?]*[.!?]+[\s]*/g);
  if (!sentences || sentences.length <= sentencesPerParagraph) return [text];
  
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join("").trim());
  }
  return paragraphs;
}

/** Renders text as 3-sentence paragraphs with φ spacing between them */
function ParagraphText({ text, style }) {
  const paragraphs = splitIntoParagraphs(text, 3);
  if (paragraphs.length <= 1) {
    return <div style={style}>{text}</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: S.sm }}>
      {paragraphs.map((p, i) => (
        <div key={i} style={style}>{p}</div>
      ))}
    </div>
  );
}

// ── Sense Card ────────────────────────────────────────────────
function SenseCard({ sense, rgb, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      padding: open ? `${S.md} ${S.md}` : `${S.sm} ${S.sm}`,
      background: open
        ? `radial-gradient(ellipse at 50% 50%, rgba(${rgb},0.10) 0%, rgba(${rgb},0.04) 100%)`
        : `rgba(${rgb},0.04)`,
      border: `1px solid rgba(${rgb},${open ? 0.50 : A.ghost})`,
      borderRadius: S._2xs,
      cursor: "pointer",
      transition: `all 382ms ${EASE}`,
      display: "flex", flexDirection: "column", gap: S.xs,
      boxShadow: open ? `0 4px 24px rgba(${rgb},0.08)` : "none",
      animation: `fadeUp 618ms ${618 + index * 80}ms both ease`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: S.xs }}>
        <span style={{
          fontSize: TEXT.heading, lineHeight: 1,
          filter: open ? `drop-shadow(0 0 8px rgba(${rgb},0.4))` : "none",
          transition: `filter 382ms ${EASE}`,
        }}>{sense.icon}</span>
        <span style={{
          ...DISPLAY_STYLE,
          fontSize: TEXT.heading,
          letterSpacing: "0.06em",
          color: `rgba(${rgb},${open ? A.full : A.phi})`,
          transition: `color 382ms`,
        }}>{sense.sense}</span>
        <span style={{
          marginLeft: "auto",
          fontSize: TEXT.label,
          color: `rgba(${rgb},${open ? A.phi : A.ghost})`,
          transition: `all 382ms ${EASE}`,
          display: "inline-block",
          transform: open ? "rotate(90deg)" : "none",
        }}>▶</span>
      </div>
      {open && (
        <div style={{
          ...BODY_STYLE, fontWeight: 400,
          fontSize: TEXT.body,
          color: IVORY(A.phi),
          paddingTop: S.xs,
          borderTop: `1px solid rgba(${rgb},${A.ghost})`,
          animation: "fadeIn 382ms ease",
        }}>{sense.text}</div>
      )}
    </div>
  );
}

// ── Song Row ──────────────────────────────────────────────────
function SongRow({ song, rgb }) {
  const [open, setOpen] = useState(false);
  const q = encodeURIComponent(`${song.title} ${song.artist}`);
  const links = [
    { label: "Spotify", url: `https://open.spotify.com/search/${q}` },
    { label: "YouTube", url: `https://music.youtube.com/search?q=${q}` },
    { label: "Apple", url: `https://music.apple.com/search?term=${q}` },
    { label: "Amazon", url: `https://music.amazon.com/search/${q}` },
  ];
  return (
    <div>
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: S._2xs, cursor: "pointer",
        padding: `${S.xs} 0`,
        borderBottom: `1px solid rgba(${rgb},${open ? A.ghost : 0.12})`,
      }}>
        <span style={{
          ...BODY_STYLE, fontWeight: 400,
          fontSize: TEXT.heading,
          color: IVORY(open ? A.phi : A.ghost),
          flex: 1,
          transition: `color 250ms`,
        }}>♪ {song.title}</span>
        <span style={{
          ...BODY_STYLE, fontWeight: 300,
          fontSize: TEXT.body,
          color: IVORY(A.ghost),
        }}>{song.artist}</span>
        <span style={{
          fontSize: TEXT.label,
          color: `rgba(${rgb},${open ? A.phi : A.ghost})`,
          transition: `all 250ms ${EASE}`,
          transform: open ? "rotate(180deg)" : "none",
          display: "inline-block", marginLeft: S._2xs,
        }}>▾</span>
      </div>
      {open && (
        <div style={{ display: "flex", gap: S.xs, padding: `${S.xs} 0`, animation: "fadeIn 382ms ease", flexWrap: "wrap" }}>
          {links.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              style={{
                ...DISPLAY_STYLE,
                fontSize: TEXT.label,
                letterSpacing: "0.06em",
                color: `rgba(${rgb},${A.phi})`,
                textDecoration: "none",
                padding: `${S._2xs} ${S.xs}`,
                border: `1px solid rgba(${rgb},${A.ghost})`,
                borderRadius: S._3xs,
                transition: `all 250ms ${EASE}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `rgba(${rgb},${A.phi})`;
                e.currentTarget.style.color = `rgba(${rgb},${A.full})`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `rgba(${rgb},${A.ghost})`;
                e.currentTarget.style.color = `rgba(${rgb},${A.phi})`;
              }}
            >{l.label}</a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section Toggle — clearly a dropdown, instinctually clickable ──
function Section({ title, rgb, children, defaultOpen = false, delay = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  const [hover, setHover] = useState(false);
  return (
    <div style={{ width: "100%", animation: `fadeUp 618ms ${delay}ms both ease` }}>
      <button onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: S.sm,
          background: hover
            ? `rgba(${rgb},${A.ghost})`
            : open
              ? `rgba(${rgb},0.08)`
              : `rgba(${rgb},0.04)`,
          border: `1px solid rgba(${rgb},${hover ? A.phi : open ? A.ghost : A.ghost})`,
          borderRadius: open ? `${S._2xs} ${S._2xs} 0 0` : S._2xs,
          cursor: "pointer",
          padding: `${S.sm} ${S.md}`,
          transition: `all 382ms ${EASE}`,
          boxShadow: hover ? `0 0 18px rgba(${rgb},0.08)` : "none",
        }}
      >
        <span style={{
          ...DISPLAY_STYLE,
          fontSize: TEXT.heading,
          letterSpacing: "0.146em",
          color: `rgba(${rgb},${hover ? A.full : open ? A.phi : A.phi})`,
          transition: `color 382ms`,
        }}>{title}</span>
        <span style={{
          fontSize: TEXT.heading,
          color: `rgba(${rgb},${hover ? A.full : A.phi})`,
          transition: `all 382ms ${EASE}`,
          transform: open ? "rotate(180deg)" : "none",
          display: "inline-block",
          flexShrink: 0,
        }}>▾</span>
      </button>
      {open && (
        <div style={{
          padding: `${S.md}`,
          background: `rgba(${rgb},0.03)`,
          border: `1px solid rgba(${rgb},${A.ghost})`,
          borderTop: "none",
          borderRadius: `0 0 ${S._2xs} ${S._2xs}`,
          animation: "fadeIn 382ms ease",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Nav Button ───────────────────────────────────────────────
function NavBtn({ label, rgb, disabled, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h && !disabled ? `rgba(${rgb},${A.ghost})` : "none",
        border: `1px solid rgba(${rgb},${disabled ? A.ghost : h ? A.phi : A.ghost})`,
        borderRadius: S._3xs,
        padding: `${S.xs} ${S.md}`,
        ...DISPLAY_STYLE,
        fontSize: TEXT.label,
        letterSpacing: "0.06em",
        color: `rgba(${rgb},${disabled ? A.ghost : h ? A.full : A.phi})`,
        cursor: disabled ? "default" : "pointer",
        transition: `all 382ms ${EASE}`,
        opacity: disabled ? A.ghost : A.full,
        boxShadow: h && !disabled ? boxGlow(rgb, A.ghost) : "none",
      }}
    >{label}</button>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOM PAGE
// ═══════════════════════════════════════════════════════════════

export default function RoomPage({ doorKey, subId, cardId, onBack }) {
  const meta = DOOR_META[doorKey];
  if (!meta) return null;
  const { rgb, name, emoji } = meta;
  const subs = SUBCATEGORIES[doorKey] || [];
  const sub = subs.find(s => s.id === subId);
  const cards = TOPIC_CARDS[doorKey]?.[subId] || [];
  const card = cardId ? cards.find(c => c.id === cardId) : cards[0];
  const [cardIdx, setCardIdx] = useState(cards.findIndex(c => c.id === (card?.id || "")) || 0);
  const [activeCard, setActiveCard] = useState(card);
  const [backH, setBackH] = useState(false);

  useEffect(() => { setActiveCard(cards[cardIdx] || null); }, [cardIdx, cards]);

  if (!activeCard) return (
    <div style={{ minHeight: "100vh", background: "#03030a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ ...BODY_STYLE, fontSize: TEXT.body, color: IVORY(A.phi) }}>No cards found.</span>
      <button onClick={onBack} style={{
        marginLeft: S.sm, background: "none",
        border: `1px solid ${GOLD(A.ghost)}`,
        color: GOLD(A.phi),
        padding: `${S._2xs} ${S.sm}`,
        cursor: "pointer",
        ...DISPLAY_STYLE, fontSize: TEXT.label,
        borderRadius: S._3xs,
      }}>BACK</button>
    </div>
  );

  const hasSenses = activeCard.senses?.length > 0;
  const hasSongs = activeCard.songs?.length > 0;
  const hasLinks = activeCard.links?.length > 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 8%, rgba(${rgb},0.05) 0%, #03030a 50%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: `0 ${S.md}`,
      paddingBottom: S._2xl,
      overflowX: "hidden",
    }}>

      {/* Ambient top glow */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "61.8vw", height: "23.6vh",
        background: `radial-gradient(ellipse, rgba(${rgb},0.06) 0%, transparent 61.8%)`,
        pointerEvents: "none",
      }} />

      {/* Back */}
      <button onClick={onBack}
        onMouseEnter={() => setBackH(true)}
        onMouseLeave={() => setBackH(false)}
        style={{
          position: "fixed", top: S.md, left: S.md, zIndex: 99,
          background: "none", border: "none", cursor: "pointer",
          ...DISPLAY_STYLE,
          fontSize: TEXT.body,
          color: `rgba(${rgb},${backH ? A.full : A.phi})`,
          transition: `color 618ms ${EASE}`,
          padding: `${S.xs} ${S.sm}`,
        }}
      >← BACK</button>

      {/* Content column */}
      <div style={{
        width: "100%", maxWidth: "42rem",
        paddingTop: "clamp(72px, 11vh, 100px)",
        display: "flex", flexDirection: "column",
        gap: S.xs,
        zIndex: 1,
      }}>

        {/* Breadcrumb — +2φ */}
        <div style={{
          ...DISPLAY_STYLE,
          fontSize: TEXT.heading,
          letterSpacing: "0.06em",
          color: `rgba(${rgb},${A.ghost})`,
          animation: "fadeUp 618ms 100ms both ease",
        }}>{emoji} {name} → {sub?.name || subId}</div>

        {/* Title */}
        <h1 style={{
          ...DISPLAY_STYLE,
          fontSize: TEXT.hero,
          color: IVORY(A.full),
          animation: "fadeUp 618ms 236ms both ease",
          textShadow: `0 0 28px rgba(232,228,210,0.12)`,
          marginTop: S.xs,
        }}>{activeCard.icon} {activeCard.title}</h1>

        {/* Subtitle — +2φ */}
        {activeCard.subtitle && (
          <p style={{
            ...ACCENT_STYLE,
            fontSize: TEXT.title,
            color: `rgba(${rgb},${A.phi})`,
            animation: "fadeUp 618ms 382ms both ease",
            marginTop: S.xs,
          }}>{activeCard.subtitle}</p>
        )}

        {/* Gold divider */}
        <div style={{
          width: S._2xl, height: 2, borderRadius: 1,
          background: `linear-gradient(90deg, rgba(${rgb},${A.phi}), transparent)`,
          margin: `${S.xs} 0`,
          animation: "fadeUp 618ms 382ms both ease",
        }} />

        {/* ── SIMPLE (always visible) ── */}
        {activeCard.simple && (
          <div style={{ animation: "fadeUp 618ms 618ms both ease", padding: `${S.xs} 0` }}>
            <ParagraphText text={activeCard.simple} style={{
              ...BODY_STYLE, fontWeight: 400,
              fontSize: TEXT.body,
              color: IVORY(A.phi),
            }} />
          </div>
        )}

        {/* ── GO DEEPER ── */}
        {activeCard.intuition && (
          <Section title="GO DEEPER" rgb={rgb} delay={618}>
            <ParagraphText text={activeCard.intuition} style={{
              ...BODY_STYLE, fontWeight: 400,
              fontSize: TEXT.body,
              color: IVORY(A.phi),
            }} />
          </Section>
        )}

        {/* ── THE FULL PICTURE ── */}
        {activeCard.advanced && (
          <Section title="THE FULL PICTURE" rgb={rgb} delay={618}>
            <ParagraphText text={activeCard.advanced} style={{
              ...BODY_STYLE, fontWeight: 300,
              fontSize: TEXT.body,
              color: IVORY(A.phi),
            }} />
          </Section>
        )}

        {/* ── FIVE SENSES ── */}
        {hasSenses && (
          <Section title="SIX SENSES" rgb={rgb} delay={618}>
            <div style={{ display: "flex", flexDirection: "column", gap: S.xs }}>
              {activeCard.senses.map((s, i) => (
                <SenseCard key={s.sense || i} sense={s} rgb={rgb} index={i} />
              ))}
            </div>
          </Section>
        )}

        {/* ── LISTEN ── */}
        {hasSongs && (
          <Section title="MUSIC" rgb={rgb} delay={618}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {activeCard.songs.map((s, i) => (
                <SongRow key={i} song={s} rgb={rgb} />
              ))}
            </div>
          </Section>
        )}

        {/* ── EXPLORE FURTHER — Wikipedia links ── */}
        {hasLinks && (
          <Section title="EXPLORE FURTHER" rgb={rgb} delay={618}>
            <div style={{ display: "flex", flexDirection: "column", gap: S.xs }}>
              {activeCard.links.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: S.xs,
                    padding: `${S.xs} ${S.sm}`,
                    background: `rgba(${rgb},0.04)`,
                    border: `1px solid rgba(${rgb},${A.ghost})`,
                    borderRadius: S._3xs,
                    textDecoration: "none",
                    transition: `all 382ms ${EASE}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `rgba(${rgb},${A.ghost})`;
                    e.currentTarget.style.borderColor = `rgba(${rgb},${A.phi})`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `rgba(${rgb},0.04)`;
                    e.currentTarget.style.borderColor = `rgba(${rgb},${A.ghost})`;
                  }}
                >
                  <span style={{ fontSize: TEXT.body }}>📖</span>
                  <span style={{
                    ...BODY_STYLE, fontWeight: 400,
                    fontSize: TEXT.body,
                    color: `rgba(${rgb},${A.phi})`,
                    flex: 1,
                  }}>{link.label}</span>
                  <span style={{
                    ...DISPLAY_STYLE, fontSize: TEXT.caption,
                    color: `rgba(${rgb},${A.ghost})`,
                  }}>→</span>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* ── Card navigation ── */}
        {cards.length > 1 && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: S.lg,
            padding: `${S.sm} 0`,
            borderTop: `1px solid rgba(${rgb},${A.ghost})`,
          }}>
            <NavBtn label="← PREV" rgb={rgb}
              disabled={cardIdx <= 0}
              onClick={() => setCardIdx(i => Math.max(0, i - 1))} />
            <span style={{
              ...DISPLAY_STYLE,
              fontSize: TEXT.label,
              color: `rgba(${rgb},${A.phi})`,
            }}>{cardIdx + 1} / {cards.length}</span>
            <NavBtn label="NEXT →" rgb={rgb}
              disabled={cardIdx >= cards.length - 1}
              onClick={() => setCardIdx(i => Math.min(cards.length - 1, i + 1))} />
          </div>
        )}
      </div>
    </div>
  );
}
