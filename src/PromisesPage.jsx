import React, { useState } from "react";
import { F, S, A, GOLD, IVORY, EASE, TEXT, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE, textGlow } from "./phi.js";

const PHI = 1.618033988749895;

const PROMISES = [
  {
    num: "I", title: "SAFETY",
    offering: "You deserve to move through life knowing that the ground beneath you is solid. Not because you earned it, but because you exist. The shelter, the steadiness, the knowing that someone already thought ahead...those were always meant to be yours. You were made to always breathe deeply and live life to its fullest.",
    heart: "The ground will always hold you."
  },
  {
    num: "II", title: "TO BE SEEN",
    offering: "You deserve to be fully seen and known. Not the version of you that performs for the world. The one who cries alone. The one who fails. The one who laughs at strange and silly jokes. The unpolished, unfiltered you is the only one worth knowing.",
    heart: "You are meant to be whole."
  },
  {
    num: "III", title: "AGENCY",
    offering: "Your body is yours. Your time is yours. Your no is a complete sentence and you never have to defend it. Any love that requires your shrinking is not love at all. The way you see the world is not wrong. It is rare.",
    heart: "You do not need permission to take up space. The space was made for you."
  },
  {
    num: "IV", title: "PARTNERSHIP",
    offering: "You deserve someone who notices who you truly are. The invisible labor, the unspoken weight, the things you hold in your head that nobody sees... you are never meant to hold all of that alone. You deserve a partner, not a project.",
    heart: "If you are carrying something heavy... it is real, and it deserves to be shared."
  },
  {
    num: "V", title: "TO BE BELIEVED",
    offering: "When you say something hurts, or something is wrong, you are meant to be heard. Your voice was never meant to be an echo. It was meant to be heard.",
    heart: "You deserve to be believed the first time you speak."
  },
  {
    num: "VI", title: "PURPOSE",
    offering: "You are not just someone's child, someone's partner, someone's parent, someone's employee. You are a whole person with a fire that existed before any role was ever assigned to you. Your right to chase whatever lights you up is sacred... even when it is inconvenient for others.",
    heart: "You are rare and you do not look like anyone else... on the inside or the outside."
  },
  {
    num: "VII", title: "REST WITHOUT GUILT",
    offering: "You do not have to earn a nap. You do not have to finish the list before you sit down. Rest is not a reward for productivity. It is a birthright. Your body has been asking you to stop. Listen to it.",
    heart: "You are a living thing that needs stillness to grow."
  },
  {
    num: "VIII", title: "TO BE HELD",
    offering: "You have carried everyone else's feelings long enough. You have been the strong one, the steady one, the one who holds the room together when it wants to fall apart. You are allowed to put that weight down. You are allowed to fall into someone else's arms and let them hold you for a while.",
    heart: "The silence between two people who trust each other is the safest place on earth."
  },
  {
    num: "IX", title: "COMMUNITY",
    offering: "The people who love you are not in competition with each other. Your friendships are oxygen that keep you alive in ways no single person can. Answer the call. Take the trip. Show up for the people who show up for you. Your people are not a threat to your love. They are the proof of it.",
    heart: "You were never meant to be everything to one person or one person to everything."
  },
  {
    num: "X", title: "CHOSEN EVERY SINGLE DAY",
    offering: "You deserve to be chosen out loud, in front of people, in the small moments, and in the hard ones. Not won and then coasted on. Not claimed and then forgotten. The thousandth day in your relationships should feel like the third... intentional, specific, and unmistakable.",
    heart: "You should never have to wonder."
  },
];

export default function PromisesPage({ onBack }) {
  const [backH, setBackH] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 15%, rgba(40,20,30,0.5) 0%, #03030a 50%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 1rem",
      paddingBottom: "4rem",
    }}>

      <style>{`
        @keyframes starGlow {
          0%, 100% { text-shadow: 0 0 12px rgba(201,168,76,0.5), 0 0 32px rgba(201,168,76,0.2); }
          50%      { text-shadow: 0 0 24px rgba(201,168,76,0.8), 0 0 56px rgba(201,168,76,0.4); }
        }
      `}</style>

      {/* Frosted header */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 99,
        height: "clamp(56px, 8vh, 72px)",
        background: "linear-gradient(180deg, rgba(3,3,10,0.92) 0%, rgba(3,3,10,0.6) 70%, transparent 100%)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center",
        paddingLeft: "1.618rem",
        pointerEvents: "none",
      }}>
        <button onClick={onBack}
          onMouseEnter={() => setBackH(true)}
          onMouseLeave={() => setBackH(false)}
          style={{
            pointerEvents: "auto",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Playfair Display', serif", fontWeight: 900,
            fontSize: "clamp(22px, 3.4vmin, 34px)",
            color: `rgba(220,160,160,1.0)`,
            letterSpacing: "-0.0382em",
            transition: `color 618ms ${EASE}`,
            padding: 0,
          }}>← BACK</button>
      </div>

      {/* Content */}
      <div style={{
        width: "100%", maxWidth: "36rem",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: "clamp(80px, 14vh, 130px)",
      }}>

        {/* Heart */}
        <div style={{
          fontSize: 30, color: "rgba(201,168,76,1.0)",
          marginBottom: "1rem",
          animation: "fadeUp 618ms 100ms both ease",
        }}>♡</div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(30px, 6.2vw, 46px)",
          letterSpacing: "0.15em", fontWeight: 400,
          background: "linear-gradient(180deg, rgba(255,255,255,1.0) 0%, rgba(201,168,76,1.0) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "0.618rem",
          textAlign: "center",
          animation: "fadeUp 618ms 200ms both ease",
        }}>TEN PROMISES</h1>

        {/* Subtitle */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(24px, 4vw, 30px)",
          fontStyle: "italic", color: "rgba(232,228,210,1.0)",
          lineHeight: 1.618,
          textAlign: "center",
          animation: "fadeUp 618ms 300ms both ease",
          marginBottom: "0.618rem",
        }}>from the universe to you</div>

        {/* Gold divider */}
        <div style={{
          width: "61.8%", height: 1, maxWidth: 200,
          margin: "2.618rem auto",
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent)",
          animation: "fadeUp 618ms 400ms both ease",
        }} />

        {/* The Ten Promises */}
        {PROMISES.map((p, i) => (
          <div key={i} style={{
            textAlign: "center",
            marginBottom: `${Math.round(21 * PHI)}px`,
            animation: `fadeUp 618ms ${500 + i * 100}ms both ease`,
          }}>
            {/* Number */}
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 7.5vw, 52px)",
              color: "rgba(201,168,76,0.618)",
              fontWeight: 400, letterSpacing: "0.1em",
              marginBottom: "0.382rem",
            }}>{p.num}</div>

            {/* Title */}
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 4.5vw, 34px)",
              letterSpacing: "0.2em",
              color: "rgba(232,228,210,1.0)",
              marginBottom: "0.618rem",
              animation: `starGlow ${4 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`,
            }}>{p.title}</div>

            <div style={{ fontSize: 20, color: "rgba(201,168,76,1.0)", marginBottom: "0.618rem" }}>♡</div>

            {/* The offering */}
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(22px, 3.5vw, 28px)",
              fontStyle: "italic", color: "rgba(232,228,210,1.0)",
              lineHeight: 1.9, maxWidth: 460, margin: "0 auto",
              marginBottom: "1rem",
            }}>{p.offering}</div>

            {/* The quiet truth */}
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(20px, 3.2vw, 26px)",
              fontStyle: "italic", color: "rgba(201,168,76,1.0)",
              lineHeight: 1.8, maxWidth: 420, margin: "0 auto",
            }}>{p.heart}</div>

            {/* Divider between promises */}
            {i < 9 && <div style={{
              width: `${Math.round(30 * PHI)}px`, height: 1,
              margin: `${Math.round(13 * PHI)}px auto 0`,
              background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)",
            }} />}
          </div>
        ))}

        {/* ═══ CLOSING ═══ */}
        <div style={{ textAlign: "center", marginTop: "1rem", marginBottom: "2.618rem" }}>
          <div style={{
            width: `${Math.round(60 * PHI)}px`, height: 1,
            margin: `0 auto ${Math.round(8 * PHI)}px`,
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)",
          }} />

          <div style={{ fontSize: 26, color: "rgba(201,168,76,1.0)", marginBottom: "1rem" }}>♡</div>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(22px, 3.5vw, 28px)",
            fontStyle: "italic", color: "rgba(232,228,210,1.0)",
            lineHeight: 2.0, maxWidth: 440, margin: "0 auto",
            marginBottom: "1.618rem",
          }}>
            these are not rules to follow.<br />
            they are not rewards to earn.<br />
            they are rights you were born with —<br />
            written into the fabric of your existence<br />
            before you took your first breath.<br /><br />
            love that must be earned<br />
            was never love at all.
          </div>

          <div style={{
            width: `${Math.round(30 * PHI)}px`, height: 1,
            margin: `${Math.round(8 * PHI)}px auto`,
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)",
          }} />

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(20px, 4vw, 30px)",
            letterSpacing: "0.15em",
            color: "rgba(201,168,76,1.0)",
            marginTop: "1.618rem",
            animation: "starGlow 5s ease-in-out infinite",
          }}>YOU WERE LOVED BEFORE YOU ARRIVED</div>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(20px, 4vw, 28px)",
            fontStyle: "italic", color: "rgba(232,228,210,1.0)",
            lineHeight: 1.9,
            maxWidth: 400, margin: "1.618rem auto 0",
            animation: "starGlow 6s 1s ease-in-out infinite",
          }}>and you will be loved long after you leave</div>
        </div>

        {/* ═══ THE MIRROR ═══ */}
        <div style={{
          textAlign: "center",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(26px, 4vw, 36px)",
          fontStyle: "italic",
          background: "linear-gradient(180deg, rgba(255,255,255,1.0) 0%, rgba(201,168,76,1.0) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "2.618rem",
          animation: "breathe 8s ease-in-out infinite",
        }}>because true love is free</div>

        {/* ═══ WOW MOM WOW ═══ */}
        <div style={{ textAlign: "center", marginBottom: "2.618rem" }}>
          <div style={{
            width: `${Math.round(60 * PHI)}px`, height: 1,
            margin: `0 auto ${Math.round(13 * PHI)}px`,
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)",
          }} />

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(30px, 6.2vw, 46px)",
            letterSpacing: "0.3em",
            background: "linear-gradient(180deg, rgba(255,255,255,1.0) 0%, rgba(201,168,76,1.0) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "breathe 8s ease-in-out infinite",
          }}>WOW MOM WOW</div>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(18px, 2.5vw, 22px)",
            fontStyle: "italic", color: "rgba(201,168,76,1.0)",
            marginTop: "1rem",
            letterSpacing: 1,
          }}>read it forward · read it backward · flip it upside down</div>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(20px, 2.8vw, 26px)",
            fontStyle: "italic", color: "rgba(232,228,210,1.0)",
            marginTop: "0.618rem",
          }}>it cannot be broken</div>
        </div>

        {/* ═══ THE LAST WHISPER ═══ */}
        <div style={{ textAlign: "center", padding: "2.618rem 0" }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(26px, 4.5vw, 38px)",
            fontStyle: "italic", color: "rgba(232,228,210,1.0)",
            letterSpacing: 1, lineHeight: 1.618,
            marginBottom: "1rem",
            animation: "starGlow 5s ease-in-out infinite",
          }}>"...the end of fear is where we begin..."</div>

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(16px, 2.5vw, 20px)",
            letterSpacing: 4, color: "rgba(201,168,76,1.0)",
          }}>— LET LOVE IN</div>
        </div>

        {/* Navigation back */}
        <button onClick={onBack} style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "12px 28px",
          background: "none",
          border: "1px solid rgba(201,168,76,0.35)",
          borderRadius: 6,
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(16px, 2.2vmin, 20px)",
          letterSpacing: "0.15em",
          fontWeight: 700,
          color: "rgba(201,168,76,1.0)",
          cursor: "pointer",
        }}>← SEARCH & EXPLORE</button>
      </div>
    </div>
  );
}
