/**
 * POEM UNIVERSE — Immersive poem reader
 * Each poem gets its own background canvas + flowing text
 */

import React, { useState, useEffect, useRef } from "react";
import { POEMS, ASK_POEMS, KAL_POEMS } from "./data.js";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const GOLD = (a) => `rgba(201,168,76,${a})`;
const IVORY = (a) => `rgba(232,228,210,${a})`;

const POEM_MAP = {
  ask: { lines: ASK_POEMS, title: "death or life", rgb: "190,140,220" },
  explore: { lines: POEMS, title: "it's the rhythm of life", rgb: "220,160,160" },
  kal: { lines: KAL_POEMS, title: "kaleidoscope sea", rgb: "100,180,220" },
};

// Simple background canvas — golden dust particles
function PoemCanvas({ rgb }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const [r, g, b] = rgb.split(",").map(Number);

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const motes = Array.from({ length: 80 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      size: 0.5 + Math.random() * 2,
      speed: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    function frame() {
      ctx.fillStyle = "rgba(3,3,10,0.06)";
      ctx.fillRect(0, 0, W, H);
      t += 0.008;

      motes.forEach((m) => {
        m.y -= m.speed;
        m.phase += 0.01;
        if (m.y < -10) {
          m.y = H + 10;
          m.x = Math.random() * W;
        }

        const alpha = 0.12 + Math.sin(m.phase) * 0.08;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(frame);
    }

    // Initial fill
    ctx.fillStyle = "#03030a";
    ctx.fillRect(0, 0, W, H);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [rgb]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}

export default function PoemUniverse({ poem, onBack }) {
  const cfg = POEM_MAP[poem];
  if (!cfg) return null;
  const { lines, title, rgb } = cfg;
  const [backH, setBackH] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Parse lines into stanzas
  const stanzas = [];
  let currentStanza = [];
  lines.forEach((line) => {
    if (line === "————") {
      if (currentStanza.length > 0) {
        stanzas.push(currentStanza);
        currentStanza = [];
      }
    } else if (line === "") {
      // Empty lines create breathing room within stanzas
      currentStanza.push("");
    } else {
      currentStanza.push(line);
    }
  });
  if (currentStanza.length > 0) stanzas.push(currentStanza);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#03030a",
        position: "relative",
      }}
    >
      <PoemCanvas rgb={rgb} />

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

      {/* Poem content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 1.618rem",
          paddingTop: "clamp(100px, 16vh, 160px)",
          paddingBottom: "6.854rem",
          opacity: visible ? 1 : 0,
          transition: `opacity 1.618s ${EASE}`,
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(24px, 4.5vw, 36px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: IVORY(0.88),
            textAlign: "center",
            marginBottom: "4.236rem",
            textShadow: `0 0 28px rgba(${rgb},0.28)`,
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </h1>

        {/* Stanzas */}
        {stanzas.map((stanza, si) => (
          <div
            key={si}
            style={{
              marginBottom: "2.618rem",
              textAlign: "center",
              animation: `fadeUp 1s ${0.3 + si * 0.15}s both ease`,
            }}
          >
            {stanza.map((line, li) => (
              <div
                key={li}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: line === ""
                    ? 0
                    : line === "&"
                      ? "clamp(16px, 2.6vw, 20px)"
                      : "clamp(20px, 3.4vw, 28px)",
                  fontWeight: 400,
                  color: line === "&" ? `rgba(${rgb},0.50)` : IVORY(0.88),
                  lineHeight: 1.618,
                  minHeight: line === "" ? "1.618rem" : "auto",
                  textShadow:
                    line !== "" && line !== "&"
                      ? "0 0 18px rgba(232,228,210,0.12)"
                      : "none",
                  whiteSpace: "pre-wrap",
                }}
              >
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
