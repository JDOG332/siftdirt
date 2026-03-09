import React, { useState, useEffect, useRef } from "react";
import { SUBCATEGORIES } from "./subcategories.js";
import { TOPIC_CARDS } from "./topicCards.js";
import { DOOR_META } from "./DoorHall.jsx";
import WikiSummary from "./WikiSummary.jsx";
import { F, S, A, GOLD, IVORY, EASE, TEXT, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE, textGlow, boxGlow } from "./phi.js";

function SenseCard({ sense, rgb, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      padding: open ? `${S.md} ${S.md}` : `${S.sm} ${S.sm}`,
      background: open ? `rgba(${rgb},0.10)` : `rgba(${rgb},0.03)`,
      border: `1px solid rgba(${rgb},${open ? 0.50 : A.ghost})`,
      borderRadius: S._2xs, cursor: "pointer",
      transition: `all 382ms ${EASE}`,
      display: "flex", flexDirection: "column", gap: S.xs,
      boxShadow: open ? `0 4px 24px rgba(${rgb},0.08)` : "none",
      animation: `fadeUp 618ms ${618 + index * 80}ms both ease`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: S.xs }}>
        <span style={{ fontSize: "clamp(20px, 3vmin, 26px)", lineHeight: 1 }}>{sense.icon}</span>
        <span style={{ ...DISPLAY_STYLE, fontSize: TEXT.caption, color: `rgba(${rgb},${open ? A.full : A.phi})`, transition: `color 382ms` }}>{sense.sense}</span>
        <span style={{ marginLeft: "auto", fontSize: TEXT.caption, color: `rgba(${rgb},${open ? A.phi : A.ghost})`, transition: `all 382ms ${EASE}`, display: "inline-block", transform: open ? "rotate(90deg)" : "none" }}>▶</span>
      </div>
      {open && <div style={{ ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.body, color: IVORY(A.phi), paddingTop: S.xs, borderTop: `1px solid rgba(${rgb},${A.ghost})`, animation: "fadeIn 382ms ease" }}>{sense.text}</div>}
    </div>
  );
}

function SongRow({ song, rgb }) {
  const [open, setOpen] = useState(false);
  const q = encodeURIComponent(`${song.title} ${song.artist}`);
  const links = [
    { label: "Spotify", url: `https://open.spotify.com/search/${q}` },
    { label: "YouTube", url: `https://music.youtube.com/search?q=${q}` },
    { label: "Apple", url: `https://music.apple.com/search?term=${q}` },
  ];
  return (
    <div>
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: S._2xs, cursor: "pointer",
        padding: `${S.xs} 0`, borderBottom: `1px solid rgba(${rgb},${open ? A.ghost : 0.12})`,
      }}>
        <span style={{ ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.body, color: IVORY(open ? A.phi : A.ghost), flex: 1, transition: `color 250ms` }}>♪ {song.title}</span>
        <span style={{ ...DISPLAY_STYLE, fontSize: TEXT.caption, color: IVORY(A.ghost) }}>{song.artist}</span>
        <span style={{ fontSize: TEXT.caption, color: `rgba(${rgb},${open ? A.phi : A.ghost})`, transition: `all 250ms ${EASE}`, transform: open ? "rotate(180deg)" : "none", display: "inline-block", marginLeft: S._2xs }}>▾</span>
      </div>
      {open && (
        <div style={{ display: "flex", gap: S.xs, padding: `${S.xs} 0`, animation: "fadeIn 382ms ease", flexWrap: "wrap" }}>
          {links.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" style={{
              ...DISPLAY_STYLE, fontSize: TEXT.caption, color: `rgba(${rgb},${A.phi})`, textDecoration: "none",
              padding: `${S._2xs} ${S.xs}`, border: `1px solid rgba(${rgb},${A.ghost})`, borderRadius: S._3xs,
              transition: `all 250ms ${EASE}`,
            }}>{l.label}</a>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, rgb, children, defaultOpen = false, delay = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ width: "100%", animation: `fadeUp 618ms ${delay}ms both ease` }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: S.xs,
        background: "none", border: "none", cursor: "pointer",
        padding: `${S.xs} 0`, borderBottom: `1px solid rgba(${rgb},${open ? A.ghost : 0.09})`,
      }}>
        <span style={{ ...DISPLAY_STYLE, fontSize: TEXT.caption, color: `rgba(${rgb},${open ? A.phi : A.ghost})`, transition: `color 382ms` }}>{title}</span>
        <div style={{ flex: 1, height: "1px", background: `rgba(${rgb},0.06)` }} />
        <span style={{ fontSize: TEXT.caption, color: `rgba(${rgb},${open ? A.phi : A.ghost})`, transition: `all 382ms ${EASE}`, transform: open ? "rotate(180deg)" : "none", display: "inline-block" }}>▾</span>
      </button>
      {open && <div style={{ padding: `${S.sm} 0`, animation: "fadeIn 382ms ease" }}>{children}</div>}
    </div>
  );
}

function NavBtn({ label, rgb, disabled, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: "none",
        border: `1px solid rgba(${rgb},${disabled ? 0.06 : h ? A.phi : A.ghost})`,
        borderRadius: S._3xs, padding: `${S._2xs} ${S.sm}`,
        ...DISPLAY_STYLE, fontSize: TEXT.caption,
        color: `rgba(${rgb},${disabled ? A.ghost : h ? A.phi : A.ghost})`,
        cursor: disabled ? "default" : "pointer",
        transition: `all 382ms ${EASE}`,
        opacity: disabled ? A.ghost : A.full,
      }}
    >{label}</button>
  );
}

export default function RoomPage({ doorKey, subId, cardId, onBack }) {
  const meta = DOOR_META[doorKey]; if (!meta) return null;
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
      <span style={{ ...BODY_STYLE, color: IVORY(A.phi) }}>No cards found.</span>
      <button onClick={onBack} style={{ marginLeft: S.sm, background: "none", border: `1px solid ${GOLD(A.ghost)}`, color: GOLD(A.phi), padding: `${S._2xs} ${S.sm}`, cursor: "pointer", ...DISPLAY_STYLE, fontSize: TEXT.caption, borderRadius: S._3xs }}>BACK</button>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 8%, rgba(${rgb},0.05) 0%, #03030a 50%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: `0 ${S.sm}`, paddingBottom: S._2xl,
    }}>
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "61.8vw", height: "23.6vh",
        background: `radial-gradient(ellipse, rgba(${rgb},0.05) 0%, transparent 61.8%)`,
        pointerEvents: "none",
      }} />

      <button onClick={onBack} onMouseEnter={() => setBackH(true)} onMouseLeave={() => setBackH(false)} style={{
        position: "fixed", top: S.md, left: S.md, zIndex: 99,
        background: "none", border: "none", cursor: "pointer",
        ...DISPLAY_STYLE, fontSize: TEXT.label,
        color: `rgba(${rgb},${backH ? A.full : A.phi})`,
        transition: `color 618ms ${EASE}`, padding: `${S.xs} ${S.sm}`,
      }}>← BACK</button>

      <div style={{ width: "100%", maxWidth: "40rem", paddingTop: "clamp(80px, 12vh, 110px)", display: "flex", flexDirection: "column", gap: S.xs, zIndex: 1 }}>
        <div style={{ ...DISPLAY_STYLE, fontSize: TEXT.caption, color: `rgba(${rgb},${A.ghost})`, animation: "fadeUp 618ms 100ms both ease" }}>{emoji} {name} → {sub?.name || subId}</div>

        <h1 style={{ ...DISPLAY_STYLE, fontSize: TEXT.hero, color: IVORY(A.full), animation: "fadeUp 618ms 236ms both ease", textShadow: `0 0 28px rgba(232,228,210,0.12)` }}>{activeCard.title}</h1>

        {activeCard.subtitle && <p style={{ ...ACCENT_STYLE, fontSize: TEXT.body, color: `rgba(${rgb},${A.phi})`, animation: "fadeUp 618ms 382ms both ease" }}>{activeCard.subtitle}</p>}

        <div style={{ width: S._2xl, height: "1px", background: `linear-gradient(90deg, rgba(${rgb},${A.phi}), transparent)`, margin: `${S.xs} 0`, animation: "fadeUp 618ms 382ms both ease" }} />

        {activeCard.simple && <div style={{ ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.body, color: IVORY(A.phi), animation: "fadeUp 618ms 618ms both ease", padding: `${S.xs} 0` }}>{activeCard.simple}</div>}

        {activeCard.intuition && (
          <Section title="GO DEEPER" rgb={rgb} delay={618}>
            <div style={{ ...BODY_STYLE, fontWeight: 400, fontSize: TEXT.body, color: IVORY(A.phi) }}>{activeCard.intuition}</div>
          </Section>
        )}

        {activeCard.advanced && (
          <Section title="THE FULL PICTURE" rgb={rgb} delay={618}>
            <div style={{ ...BODY_STYLE, fontSize: TEXT.label, color: IVORY(A.ghost) }}>{activeCard.advanced}</div>
          </Section>
        )}

        {activeCard.senses?.length > 0 && (
          <Section title="FIVE SENSES" rgb={rgb} delay={618}>
            <div style={{ display: "flex", flexDirection: "column", gap: S.xs }}>
              {activeCard.senses.map((s, i) => <SenseCard key={s.sense || i} sense={s} rgb={rgb} index={i} />)}
            </div>
          </Section>
        )}

        {activeCard.songs?.length > 0 && (
          <Section title="LISTEN" rgb={rgb} delay={618}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {activeCard.songs.map((s, i) => <SongRow key={i} song={s} rgb={rgb} />)}
            </div>
          </Section>
        )}

        {activeCard.wiki?.length > 0 && (
          <Section title="EXPLORE FURTHER" rgb={rgb} delay={618}>
            <div style={{ display: "flex", flexDirection: "column", gap: S.xs }}>
              {activeCard.wiki.map((topic, i) => <WikiSummary key={topic} topic={topic} rgb={rgb} index={i} />)}
            </div>
          </Section>
        )}

        {cards.length > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: S.lg, padding: `${S.sm} 0`, borderTop: `1px solid rgba(${rgb},0.09)` }}>
            <NavBtn label="← PREV" rgb={rgb} disabled={cardIdx <= 0} onClick={() => setCardIdx(i => Math.max(0, i - 1))} />
            <span style={{ ...DISPLAY_STYLE, fontSize: TEXT.caption, color: `rgba(${rgb},${A.ghost})` }}>{cardIdx + 1} / {cards.length}</span>
            <NavBtn label="NEXT →" rgb={rgb} disabled={cardIdx >= cards.length - 1} onClick={() => setCardIdx(i => Math.min(cards.length - 1, i + 1))} />
          </div>
        )}
      </div>
    </div>
  );
}
