/**
 * ROOM PAGE — Experience a single topic card
 * Three depth levels: Simple → Intuitive → Advanced
 * Five senses lock the truth in
 */

import React, { useState, useEffect, useRef } from "react";
import { PHI } from "./data.js";
import { SUBCATEGORIES } from "./subcategories.js";
import { TOPIC_CARDS } from "./topicCards.js";
import { DOOR_META } from "./DoorHall.jsx";
import WikiSummary from "./WikiSummary.jsx";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const GOLD = (a) => `rgba(201,168,76,${a})`;
const IVORY = (a) => `rgba(232,228,210,${a})`;

// ── Sense Card ────────────────────────────────────────────────────
function SenseCard({ sense, rgb, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((o) => !o)}
      style={{
        padding: open ? "1.618rem" : "1rem",
        background: open ? `rgba(${rgb},0.08)` : `rgba(${rgb},0.02)`,
        border: `1px solid rgba(${rgb},${open ? 0.382 : 0.12})`,
        borderRadius: 4,
        cursor: "pointer",
        transition: `all 382ms ${EASE}`,
        display: "flex",
        flexDirection: "column",
        gap: "0.618rem",
        animation: `fadeUp 0.618s ${0.5 + index * 0.08}s both ease`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.618rem" }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{sense.icon}</span>
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 11,
            letterSpacing: "0.236em",
            fontWeight: 600,
            color: `rgba(${rgb},${open ? 1.0 : 0.618})`,
            transition: `color 382ms ${EASE}`,
          }}
        >
          {sense.sense}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: `rgba(${rgb},${open ? 0.72 : 0.28})`,
            transition: `all 382ms ${EASE}`,
            display: "inline-block",
            transform: open ? "rotate(90deg)" : "none",
          }}
        >
          ▶
        </span>
      </div>
      {open && (
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(17px, 2.8vw, 22px)",
            fontWeight: 400,
            color: IVORY(0.92),
            lineHeight: 1.618,
            paddingTop: "0.618rem",
            borderTop: `1px solid rgba(${rgb},0.146)`,
            animation: "fadeIn 0.382s ease",
          }}
        >
          {sense.text}
        </div>
      )}
    </div>
  );
}

// ── Song Row ──────────────────────────────────────────────────────
function SongRow({ song, rgb }) {
  const [open, setOpen] = useState(false);
  const q = encodeURIComponent(`${song.title} ${song.artist}`);
  const links = [
    { label: "Spotify", url: `https://open.spotify.com/search/${q}` },
    { label: "YouTube", url: `https://music.youtube.com/search?q=${q}` },
    { label: "Apple", url: `https://music.apple.com/search?term=${q}` },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.382rem",
          cursor: "pointer",
          padding: "0.618rem 0",
          borderBottom: `1px solid rgba(${rgb},${open ? 0.18 : 0.08})`,
          transition: `all 250ms ${EASE}`,
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(16px, 2.6vw, 20px)",
            fontWeight: 400,
            color: IVORY(open ? 0.92 : 0.72),
            flex: 1,
            transition: `color 250ms ${EASE}`,
          }}
        >
          ♪ {song.title}
        </span>
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 11,
            color: IVORY(0.382),
            letterSpacing: "0.04em",
          }}
        >
          {song.artist}
        </span>
        <span
          style={{
            fontSize: 12,
            color: `rgba(${rgb},${open ? 0.72 : 0.382})`,
            transition: `all 250ms ${EASE}`,
            transform: open ? "rotate(180deg)" : "none",
            display: "inline-block",
            marginLeft: "0.382rem",
          }}
        >
          ▾
        </span>
      </div>
      {open && (
        <div
          style={{
            display: "flex",
            gap: "0.618rem",
            padding: "0.618rem 0",
            animation: "fadeIn 0.382s ease",
            flexWrap: "wrap",
          }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 10,
                letterSpacing: "0.146em",
                color: `rgba(${rgb},0.72)`,
                textDecoration: "none",
                padding: "0.382rem 0.618rem",
                border: `1px solid rgba(${rgb},0.18)`,
                borderRadius: 2,
                transition: `all 250ms ${EASE}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `rgba(${rgb},0.50)`;
                e.currentTarget.style.color = `rgba(${rgb},1.0)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `rgba(${rgb},0.18)`;
                e.currentTarget.style.color = `rgba(${rgb},0.72)`;
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section Toggle ───────────────────────────────────────────────
function Section({ title, rgb, children, defaultOpen = false, delay = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        width: "100%",
        animation: `fadeUp 0.618s ${delay}s both ease`,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.618rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0.618rem 0",
          borderBottom: `1px solid rgba(${rgb},${open ? 0.236 : 0.09})`,
          transition: `all 382ms ${EASE}`,
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(10px, 1.4vmin, 12px)",
            letterSpacing: "0.382em",
            fontWeight: 600,
            color: `rgba(${rgb},${open ? 0.88 : 0.50})`,
            transition: `color 382ms ${EASE}`,
          }}
        >
          {title}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: `rgba(${rgb},${open ? 0.12 : 0.05})`,
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: `rgba(${rgb},${open ? 0.72 : 0.28})`,
            transition: `all 382ms ${EASE}`,
            transform: open ? "rotate(180deg)" : "none",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div style={{ padding: "1rem 0", animation: "fadeIn 0.382s ease" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROOM PAGE
// ═══════════════════════════════════════════════════════════════════

export default function RoomPage({ doorKey, subId, cardId, onBack }) {
  const meta = DOOR_META[doorKey];
  if (!meta) return null;
  const { rgb, name, emoji } = meta;

  const subs = SUBCATEGORIES[doorKey] || [];
  const sub = subs.find((s) => s.id === subId);
  const cards = TOPIC_CARDS[doorKey]?.[subId] || [];

  // Find card — use cardId if provided, otherwise first card
  const card = cardId ? cards.find((c) => c.id === cardId) : cards[0];
  const [activeCard, setActiveCard] = useState(card);
  const [cardIdx, setCardIdx] = useState(
    cards.findIndex((c) => c.id === (card?.id || "")) || 0
  );
  const [backH, setBackH] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setActiveCard(cards[cardIdx] || null);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [cardIdx, cards]);

  if (!activeCard) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#03030a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: IVORY(0.618),
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20,
        }}
      >
        No cards found.
        <button
          onClick={onBack}
          style={{
            marginLeft: "1rem",
            background: "none",
            border: `1px solid ${GOLD(0.382)}`,
            color: GOLD(0.72),
            padding: "0.382rem 1rem",
            cursor: "pointer",
            fontFamily: "'Cinzel', serif",
            fontSize: 12,
            letterSpacing: "0.236em",
            borderRadius: 2,
          }}
        >
          BACK
        </button>
      </div>
    );
  }

  const hasSenses = activeCard.senses && activeCard.senses.length > 0;
  const hasSongs = activeCard.songs && activeCard.songs.length > 0;
  const hasWiki = activeCard.wiki && activeCard.wiki.length > 0;

  return (
    <div
      ref={contentRef}
      style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse at 50% 8%, rgba(${rgb},0.04) 0%, #03030a 50%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 1rem",
        paddingBottom: "4.236rem",
        overflowX: "hidden",
        overflowY: "auto",
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
          color: `rgba(${rgb},${backH ? 1.0 : 0.618})`,
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
          maxWidth: 640,
          position: "relative",
          zIndex: 1,
          paddingTop: "clamp(80px, 12vh, 110px)",
          display: "flex",
          flexDirection: "column",
          gap: "0.618rem",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 10,
            letterSpacing: "0.236em",
            color: `rgba(${rgb},0.50)`,
            animation: "fadeUp 0.618s 0.1s both ease",
          }}
        >
          {emoji} {name} → {sub?.name || subId}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(28px, 5.5vw, 42px)",
            fontWeight: 500,
            color: IVORY(0.95),
            lineHeight: 1.236,
            animation: "fadeUp 0.8s 0.15s both ease",
            textShadow: "0 0 28px rgba(232,228,210,0.12)",
          }}
        >
          {activeCard.title}
        </h1>

        {/* Subtitle */}
        {activeCard.subtitle && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(16px, 2.6vw, 20px)",
              fontWeight: 400,
              fontStyle: "italic",
              color: `rgba(${rgb},0.72)`,
              lineHeight: 1.618,
              animation: "fadeUp 0.8s 0.2s both ease",
            }}
          >
            {activeCard.subtitle}
          </p>
        )}

        {/* Gold divider */}
        <div
          style={{
            width: 89,
            height: 1,
            background: `linear-gradient(90deg, rgba(${rgb},0.50), transparent)`,
            margin: "0.618rem 0",
            animation: "fadeUp 0.618s 0.25s both ease",
          }}
        />

        {/* ── SIMPLE (always visible) ── */}
        {activeCard.simple && (
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(20px, 3.4vw, 26px)",
              fontWeight: 400,
              color: IVORY(0.92),
              lineHeight: 1.618,
              animation: "fadeUp 0.8s 0.3s both ease",
              padding: "0.618rem 0",
            }}
          >
            {activeCard.simple}
          </div>
        )}

        {/* ── INTUITION (collapsible) ── */}
        {activeCard.intuition && (
          <Section title="GO DEEPER" rgb={rgb} delay={0.4}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(17px, 2.8vw, 22px)",
                fontWeight: 400,
                color: IVORY(0.85),
                lineHeight: 1.618,
              }}
            >
              {activeCard.intuition}
            </div>
          </Section>
        )}

        {/* ── ADVANCED (collapsible) ── */}
        {activeCard.advanced && (
          <Section title="THE FULL PICTURE" rgb={rgb} delay={0.5}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(15px, 2.4vw, 19px)",
                fontWeight: 400,
                color: IVORY(0.78),
                lineHeight: 1.618,
              }}
            >
              {activeCard.advanced}
            </div>
          </Section>
        )}

        {/* ── 5 SENSES ── */}
        {hasSenses && (
          <Section title="FIVE SENSES" rgb={rgb} delay={0.55}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.618rem",
              }}
            >
              {activeCard.senses.map((s, i) => (
                <SenseCard
                  key={s.sense || i}
                  sense={s}
                  rgb={rgb}
                  index={i}
                />
              ))}
            </div>
          </Section>
        )}

        {/* ── SONGS ── */}
        {hasSongs && (
          <Section title="LISTEN" rgb={rgb} delay={0.6}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {activeCard.songs.map((s, i) => (
                <SongRow key={i} song={s} rgb={rgb} />
              ))}
            </div>
          </Section>
        )}

        {/* ── WIKIPEDIA ── */}
        {hasWiki && (
          <Section title="EXPLORE FURTHER" rgb={rgb} delay={0.65}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.618rem",
              }}
            >
              {activeCard.wiki.map((topic, i) => (
                <WikiSummary key={topic} topic={topic} rgb={rgb} index={i} />
              ))}
            </div>
          </Section>
        )}

        {/* ── Card navigation ── */}
        {cards.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2.618rem",
              padding: "1rem 0",
              borderTop: `1px solid rgba(${rgb},0.09)`,
            }}
          >
            <NavBtn
              label="← PREV"
              rgb={rgb}
              disabled={cardIdx <= 0}
              onClick={() => setCardIdx((i) => Math.max(0, i - 1))}
            />
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 10,
                letterSpacing: "0.236em",
                color: `rgba(${rgb},0.382)`,
              }}
            >
              {cardIdx + 1} / {cards.length}
            </span>
            <NavBtn
              label="NEXT →"
              rgb={rgb}
              disabled={cardIdx >= cards.length - 1}
              onClick={() =>
                setCardIdx((i) => Math.min(cards.length - 1, i + 1))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

function NavBtn({ label, rgb, disabled, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: "none",
        border: `1px solid rgba(${rgb},${disabled ? 0.06 : h ? 0.382 : 0.146})`,
        borderRadius: 2,
        padding: "0.382rem 1rem",
        fontFamily: "'Cinzel', serif",
        fontSize: 11,
        letterSpacing: "0.236em",
        fontWeight: 500,
        color: `rgba(${rgb},${disabled ? 0.18 : h ? 0.88 : 0.50})`,
        cursor: disabled ? "default" : "pointer",
        transition: `all 382ms ${EASE}`,
        opacity: disabled ? 0.382 : 1,
      }}
    >
      {label}
    </button>
  );
}
