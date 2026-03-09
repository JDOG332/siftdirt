/**
 * DOOR HALL — Nesting Dolls
 *
 * Level 1: 10 subcategory cards (expandable)
 * Level 2: Topic cards inside each subcategory (expandable)
 * Level 3: Content inside each topic card (simple, deeper, senses, music, wiki)
 *
 * Browse everything from one page. No back buttons needed.
 */

import React, { useState } from "react";
import { SUBCATEGORIES } from "./subcategories.js";
import { TOPIC_CARDS } from "./topicCards.js";
import WikiCard from "./WikiCard.jsx";
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

// ── Utility: split text into 3-sentence paragraphs ───────────
function splitIntoParagraphs(text, n = 3) {
  if (!text) return [];
  const sentences = text.match(/[^.!?]*[.!?]+[\s]*/g);
  if (!sentences || sentences.length <= n) return [text];
  const out = [];
  for (let i = 0; i < sentences.length; i += n)
    out.push(sentences.slice(i, i + n).join("").trim());
  return out;
}

function ParagraphText({ text, style }) {
  const paragraphs = splitIntoParagraphs(text, 3);
  if (paragraphs.length <= 1) return <div style={style}>{text}</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: S.sm }}>
      {paragraphs.map((p, i) => <div key={i} style={style}>{p}</div>)}
    </div>
  );
}

// ── Level 3: Content Section toggle ──────────────────────────
function ContentSection({ title, rgb, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [hover, setHover] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <button onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: S.sm,
          background: hover ? `rgba(${rgb},${A.ghost})` : open ? `rgba(${rgb},0.08)` : `rgba(${rgb},0.04)`,
          border: `1px solid rgba(${rgb},${hover ? A.phi : A.ghost})`,
          borderRadius: open ? `${S._2xs} ${S._2xs} 0 0` : S._2xs,
          cursor: "pointer",
          padding: `${S.xs} ${S.sm}`,
          transition: `all 382ms ${EASE}`,
        }}
      >
        <span style={{
          ...DISPLAY_STYLE, fontSize: TEXT.label,
          letterSpacing: "0.146em",
          color: `rgba(${rgb},${hover ? A.full : A.phi})`,
        }}>{title}</span>
        <span style={{
          fontSize: TEXT.label,
          color: `rgba(${rgb},${hover ? A.full : A.phi})`,
          transition: `all 382ms ${EASE}`,
          transform: open ? "rotate(180deg)" : "none",
          display: "inline-block",
        }}>▾</span>
      </button>
      {open && (
        <div style={{
          padding: S.sm,
          background: `rgba(${rgb},0.03)`,
          border: `1px solid rgba(${rgb},${A.ghost})`,
          borderTop: "none",
          borderRadius: `0 0 ${S._2xs} ${S._2xs}`,
          animation: "fadeIn 382ms ease",
        }}>{children}</div>
      )}
    </div>
  );
}

// ── Level 3: Sense Card ──────────────────────────────────────
function SenseCard({ sense, rgb }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      padding: open ? `${S.sm} ${S.sm}` : `${S.xs} ${S.xs}`,
      background: open ? `rgba(${rgb},0.08)` : `rgba(${rgb},0.03)`,
      border: `1px solid rgba(${rgb},${open ? A.phi : A.ghost})`,
      borderRadius: S._3xs, cursor: "pointer",
      transition: `all 382ms ${EASE}`,
      display: "flex", flexDirection: "column", gap: S._2xs,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: S._2xs }}>
        <span style={{ fontSize: TEXT.body, lineHeight: 1 }}>{sense.icon}</span>
        <span style={{ ...DISPLAY_STYLE, fontSize: TEXT.label, letterSpacing: "0.06em", color: `rgba(${rgb},${open ? A.full : A.phi})` }}>{sense.sense}</span>
        <span style={{ marginLeft: "auto", fontSize: TEXT.label, color: `rgba(${rgb},${open ? A.phi : A.ghost})`, transform: open ? "rotate(90deg)" : "none", display: "inline-block", transition: `all 382ms ${EASE}` }}>▶</span>
      </div>
      {open && <div style={{ ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.body, color: IVORY(A.phi), paddingTop: S._2xs, borderTop: `1px solid rgba(${rgb},${A.ghost})`, animation: "fadeIn 382ms ease" }}>{sense.text}</div>}
    </div>
  );
}

// ── Level 3: Song Row ────────────────────────────────────────
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
        padding: `${S.xs} 0`, borderBottom: `1px solid rgba(${rgb},${A.phi})`,
      }}>
        <span style={{ ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.body, color: IVORY(open ? A.full : A.phi), flex: 1 }}>♪ {song.title}</span>
        <span style={{ ...BODY_STYLE, fontSize: TEXT.label, color: IVORY(A.phi) }}>{song.artist}</span>
      </div>
      {open && (
        <div style={{ display: "flex", gap: S._2xs, padding: `${S._2xs} 0`, flexWrap: "wrap", animation: "fadeIn 382ms ease" }}>
          {links.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" style={{
              ...DISPLAY_STYLE, fontSize: TEXT.caption, letterSpacing: "0.06em",
              color: `rgba(${rgb},${A.phi})`, textDecoration: "none",
              padding: `${S._3xs} ${S._2xs}`, border: `1px solid rgba(${rgb},${A.ghost})`, borderRadius: S._3xs,
            }}>{l.label}</a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Level 2: Topic Card (expandable) ─────────────────────────
function TopicCard({ card, rgb, index }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const hasSenses = card.senses?.length > 0;
  const hasSongs = card.songs?.length > 0;
  const hasLinks = card.links?.length > 0;

  return (
    <div style={{ width: "100%" }}>
      {/* Header — always visible */}
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
              ? `rgba(${rgb},0.10)`
              : `rgba(${rgb},0.05)`,
          border: `1px solid rgba(${rgb},${hover ? A.phi : open ? A.ghost : A.ghost})`,
          borderRadius: open ? `${S._2xs} ${S._2xs} 0 0` : S._2xs,
          cursor: "pointer",
          padding: `${S.sm} ${S.md}`,
          transition: `all 382ms ${EASE}`,
          boxShadow: hover ? `0 0 18px rgba(${rgb},0.08)` : "none",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: S._3xs, flex: 1 }}>
          <span style={{
            ...DISPLAY_STYLE, fontSize: TEXT.body,
            color: IVORY(hover ? A.full : A.phi),
            transition: `color 382ms ${EASE}`,
          }}>{card.icon} {card.title}</span>
          {card.subtitle && (
            <span style={{
              ...ACCENT_STYLE, fontSize: TEXT.body,
              color: `rgba(${rgb},${hover ? A.full : A.phi})`,
              transition: `color 382ms ${EASE}`,
            }}>{card.subtitle}</span>
          )}
        </div>
        <span style={{
          fontSize: TEXT.body,
          color: `rgba(${rgb},${hover ? A.full : A.phi})`,
          transition: `all 382ms ${EASE}`,
          transform: open ? "rotate(180deg)" : "none",
          display: "inline-block",
          flexShrink: 0,
        }}>▾</span>
      </button>

      {/* Expanded content — the full card experience */}
      {open && (
        <div style={{
          padding: `${S.md}`,
          background: `rgba(${rgb},0.03)`,
          border: `1px solid rgba(${rgb},${A.ghost})`,
          borderTop: "none",
          borderRadius: `0 0 ${S._2xs} ${S._2xs}`,
          animation: "fadeIn 382ms ease",
          display: "flex", flexDirection: "column", gap: S.sm,
        }}>
          {/* Simple — always shown */}
          {card.simple && (
            <ParagraphText text={card.simple} style={{
              ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.body, color: IVORY(A.phi),
            }} />
          )}

          {/* GO DEEPER */}
          {card.intuition && (
            <ContentSection title="GO DEEPER" rgb={rgb}>
              <ParagraphText text={card.intuition} style={{
                ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.body, color: IVORY(A.phi),
              }} />
            </ContentSection>
          )}

          {/* THE FULL PICTURE */}
          {card.advanced && (
            <ContentSection title="THE FULL PICTURE" rgb={rgb}>
              <ParagraphText text={card.advanced} style={{
                ...BODY_STYLE, fontWeight: 300, fontSize: TEXT.body, color: IVORY(A.phi),
              }} />
            </ContentSection>
          )}

          {/* SIX SENSES */}
          {hasSenses && (
            <ContentSection title="SIX SENSES" rgb={rgb}>
              <div style={{ display: "flex", flexDirection: "column", gap: S._2xs }}>
                {card.senses.map((s, i) => <SenseCard key={s.sense || i} sense={s} rgb={rgb} />)}
              </div>
            </ContentSection>
          )}

          {/* MUSIC */}
          {hasSongs && (
            <ContentSection title="MUSIC" rgb={rgb}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {card.songs.map((s, i) => <SongRow key={i} song={s} rgb={rgb} />)}
              </div>
            </ContentSection>
          )}

          {/* EXPLORE FURTHER — Wikipedia powered summaries */}
          {hasLinks && (
            <ContentSection title="EXPLORE FURTHER" rgb={rgb}>
              <div style={{ display: "flex", flexDirection: "column", gap: S._2xs }}>
                {card.links.map((link, i) => (
                  <WikiCard key={i} label={link.label} url={link.url} rgb={rgb} index={i} />
                ))}
              </div>
            </ContentSection>
          )}
        </div>
      )}
    </div>
  );
}

// ── Level 1: Subcategory Card (expandable) ───────────────────
function SubCard({ sub, rgb, index, doorKey }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const cards = TOPIC_CARDS[doorKey]?.[sub.id] || [];

  return (
    <div style={{ width: "100%" }}>
      {/* Header — the invitation */}
      <button onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "100%",
          padding: `${S.md} ${S.md}`,
          background: hover
            ? `radial-gradient(ellipse at 50% 50%, rgba(${rgb},0.14) 0%, rgba(${rgb},0.06) 100%)`
            : open
              ? `rgba(${rgb},0.10)`
              : `rgba(${rgb},0.06)`,
          border: `1px solid rgba(${rgb},${hover ? 0.55 : open ? A.ghost : A.ghost})`,
          borderRadius: open ? `${S._2xs} ${S._2xs} 0 0` : S._2xs,
          cursor: "pointer",
          transition: `all 382ms ${EASE}`,
          animation: `fadeUp 618ms ${index * 62}ms both ease`,
          boxShadow: hover
            ? `0 4px 32px rgba(${rgb},0.14), inset 0 0 24px rgba(${rgb},0.04)`
            : `0 1px 8px rgba(0,0,0,0.4)`,
          display: "flex", flexDirection: "column",
          alignItems: "center",
          gap: S.xs,
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Top shimmer */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},${hover ? A.phi : A.ghost}), transparent)`,
          transition: `background 382ms ${EASE}`,
        }} />

        {/* Icon + Name + Chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: S.xs, justifyContent: "center", width: "100%" }}>
          <span style={{
            fontSize: TEXT.heading, lineHeight: 1, flexShrink: 0,
            filter: hover ? `drop-shadow(0 0 8px rgba(${rgb},0.4))` : "none",
            transition: `filter 382ms ${EASE}`,
          }}>{sub.icon}</span>
          <span style={{
            fontFamily: F.display, fontWeight: 900,
            fontSize: TEXT.heading,
            letterSpacing: "0.06em", lineHeight: 1.1,
            color: `rgba(${rgb},${hover ? A.full : A.phi})`,
            textShadow: hover ? textGlow(rgb, A.phi) : "none",
            transition: `all 382ms ${EASE}`,
          }}>{sub.name}</span>
          <span style={{
            fontSize: TEXT.body,
            color: `rgba(${rgb},${hover ? A.full : A.phi})`,
            transition: `all 382ms ${EASE}`,
            transform: open ? "rotate(180deg)" : "none",
            display: "inline-block",
            flexShrink: 0,
          }}>▾</span>
        </div>

        {/* Description */}
        <div style={{
          ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.body,
          color: IVORY(hover ? A.full : A.phi),
          transition: `color 382ms ${EASE}`,
          lineHeight: 1.618,
        }}>{sub.desc}</div>

        {/* Psi bar */}
        <div style={{
          height: 2, borderRadius: 1,
          background: `rgba(${rgb},${hover ? A.phi : A.ghost})`,
          width: `${Math.round(sub.psi * 100)}%`,
          transition: `all 618ms ${EASE}`,
          alignSelf: "center",
        }} />
      </button>

      {/* Expanded: topic cards inside */}
      {open && (
        <div style={{
          padding: `${S.sm}`,
          background: `rgba(${rgb},0.02)`,
          border: `1px solid rgba(${rgb},${A.ghost})`,
          borderTop: "none",
          borderRadius: `0 0 ${S._2xs} ${S._2xs}`,
          animation: "fadeIn 382ms ease",
          display: "flex", flexDirection: "column",
          gap: S.xs,
        }}>
          {/* Card count */}
          <div style={{
            ...DISPLAY_STYLE, fontSize: TEXT.caption,
            letterSpacing: "0.146em",
            color: `rgba(${rgb},${A.ghost})`,
            textAlign: "center",
          }}>{cards.length} TOPICS</div>

          {/* Topic cards */}
          {cards.map((card, i) => (
            <TopicCard key={card.id} card={card} rgb={rgb} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DOOR HALL
// ═══════════════════════════════════════════════════════════════

export default function DoorHall({ doorKey, onBack, onRoomSelect }) {
  const meta = DOOR_META[doorKey];
  if (!meta) return null;
  const subs = SUBCATEGORIES[doorKey] || [];
  const { rgb, name, emoji } = meta;
  const [backH, setBackH] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 15%, rgba(${rgb},0.06) 0%, #03030a 55%)`,
      color: IVORY(A.phi),
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: `0 ${S.md}`,
      paddingBottom: S._2xl,
      overflowX: "hidden",
    }}>

      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "61.8vw", height: "38.2vh",
        background: `radial-gradient(ellipse, rgba(${rgb},0.07) 0%, transparent 61.8%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Back */}
      <button onClick={onBack}
        onMouseEnter={() => setBackH(true)}
        onMouseLeave={() => setBackH(false)}
        style={{
          position: "fixed", top: S.md, left: S.md, zIndex: 99,
          background: "none", border: "none", cursor: "pointer",
          ...DISPLAY_STYLE, fontSize: TEXT.body,
          color: `rgba(${rgb},${backH ? A.full : A.phi})`,
          transition: `color 618ms ${EASE}`,
          padding: `${S.xs} ${S.sm}`,
        }}
      >← BACK</button>

      {/* Content column */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "48rem",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: "clamp(72px, 11vh, 110px)",
      }}>

        {/* Door label */}
        <div style={{
          ...DISPLAY_STYLE, fontSize: TEXT.heading,
          letterSpacing: "0.236em",
          color: `rgba(${rgb},${A.phi})`,
          marginBottom: S.xs,
          animation: "fadeUp 1s 100ms both ease",
        }}>{emoji} {name.toUpperCase()}</div>

        {/* Core question */}
        <h1 style={{
          ...ACCENT_STYLE, fontSize: TEXT.title,
          color: IVORY(A.phi),
          textAlign: "center", lineHeight: 1.618,
          maxWidth: "36rem",
          marginBottom: S.sm,
          textShadow: `0 0 30px rgba(232,228,210,0.18), 0 0 60px rgba(232,228,210,0.08)`,
          animation: "fadeUp 1s 236ms both ease",
        }}>{QUESTIONS[doorKey]}</h1>

        {/* Gold divider */}
        <div style={{
          width: S._2xl, height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},0.50), transparent)`,
          marginBottom: S.lg,
          animation: "fadeUp 1s 382ms both ease",
        }} />

        {/* 10 subcategory nesting dolls */}
        <div style={{
          width: "100%",
          display: "flex", flexDirection: "column",
          gap: S.sm,
        }}>
          {subs.map((sub, i) => (
            <SubCard
              key={sub.id}
              sub={sub}
              rgb={rgb}
              index={i}
              doorKey={doorKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
