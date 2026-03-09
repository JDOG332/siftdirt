/**
 * WIKI CARD — Click to fetch Wikipedia summary
 * Uses the Ψ-based wikiEngine to score sentences and return
 * the top 5 most important points with emoji rankings.
 * Then links to the full Wikipedia article at the bottom.
 */

import React, { useState } from "react";
import { fetchWiki } from "./wikiEngine.js";
import { F, S, A, GOLD, IVORY, EASE, TEXT, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE, textGlow, boxGlow } from "./phi.js";

export default function WikiCard({ label, url, rgb, index = 0 }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hover, setHover] = useState(false);

  function handleClick() {
    setOpen(o => {
      const next = !o;
      // Fetch on first open
      if (next && !data && !loading) {
        setLoading(true);
        setError(false);
        fetchWiki(label)
          .then((result) => {
            setData(result);
            setLoading(false);
          })
          .catch(() => {
            setError(true);
            setLoading(false);
          });
      }
      return next;
    });
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Header — clickable */}
      <button onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: S.xs,
          background: hover
            ? `rgba(${rgb},${A.ghost})`
            : open
              ? `rgba(${rgb},0.10)`
              : `rgba(${rgb},0.04)`,
          border: `1px solid rgba(${rgb},${hover ? A.phi : A.ghost})`,
          borderRadius: open ? `${S._2xs} ${S._2xs} 0 0` : S._2xs,
          cursor: "pointer",
          padding: `${S.xs} ${S.sm}`,
          transition: `all 382ms ${EASE}`,
          boxShadow: hover ? `0 0 18px rgba(${rgb},0.08)` : "none",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: S.xs, flex: 1 }}>
          <span style={{ fontSize: TEXT.body }}>📖</span>
          <span style={{
            ...BODY_STYLE, fontWeight: 400,
            fontSize: TEXT.body,
            color: `rgba(${rgb},${hover ? A.full : A.phi})`,
            transition: `color 382ms ${EASE}`,
          }}>{label}</span>
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

      {/* Expanded content — Wikipedia summary */}
      {open && (
        <div style={{
          padding: S.sm,
          background: `rgba(${rgb},0.03)`,
          border: `1px solid rgba(${rgb},${A.ghost})`,
          borderTop: "none",
          borderRadius: `0 0 ${S._2xs} ${S._2xs}`,
          animation: "fadeIn 382ms ease",
          display: "flex", flexDirection: "column",
          gap: S.xs,
        }}>
          {/* Loading state */}
          {loading && (
            <div style={{
              ...ACCENT_STYLE,
              fontSize: TEXT.body,
              color: `rgba(${rgb},${A.phi})`,
              textAlign: "center",
              padding: `${S.sm} 0`,
              animation: "breathe 1.618s ease-in-out infinite",
            }}>Sifting Wikipedia...</div>
          )}

          {/* Error state */}
          {error && (
            <div style={{
              ...BODY_STYLE,
              fontSize: TEXT.body,
              color: "rgba(220,100,100,0.618)",
              textAlign: "center",
              padding: `${S.xs} 0`,
            }}>Could not fetch this article. Try the direct link below.</div>
          )}

          {/* Results — emoji bullet points */}
          {data && !loading && data.points && data.points.length > 0 && (
            <>
              {/* Article title + source */}
              {data.title && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: S._3xs, marginBottom: S._3xs }}>
                  <div style={{
                    ...DISPLAY_STYLE,
                    fontSize: TEXT.label,
                    letterSpacing: "0.06em",
                    color: `rgba(${rgb},${A.phi})`,
                    textAlign: "center",
                  }}>{data.title}</div>
                  <div style={{
                    ...BODY_STYLE,
                    fontSize: TEXT.caption,
                    color: `rgba(${rgb},${A.ghost})`,
                  }}>{data.source === "simple" ? "Simple English Wikipedia" : "Wikipedia"}</div>
                </div>
              )}

              {/* Bullet points — simplified, ranked by truth (scores hidden) */}
              <div style={{ display: "flex", flexDirection: "column", gap: S._2xs }}>
                {data.points.map((point, i) => (
                  <div key={i} style={{
                    display: "flex", gap: S.xs,
                    alignItems: "flex-start",
                    padding: `${S._2xs} ${S._2xs}`,
                    background: i === 0 ? `rgba(${rgb},0.06)` : "transparent",
                    borderRadius: S._3xs,
                  }}>
                    <span style={{
                      fontSize: TEXT.body,
                      lineHeight: 1,
                      flexShrink: 0,
                      marginTop: S._3xs,
                    }}>{point.emoji}</span>
                    <div style={{
                      ...BODY_STYLE, fontWeight: 400,
                      fontSize: TEXT.body,
                      color: IVORY(i === 0 ? A.full : A.phi),
                      lineHeight: 1.618,
                      flex: 1,
                    }}>{point.text}</div>
                  </div>
                ))}
              </div>

              {/* Gold divider */}
              <div style={{
                width: "61.8%", height: 1,
                background: `linear-gradient(90deg, transparent, rgba(${rgb},${A.ghost}), transparent)`,
                alignSelf: "center",
                margin: `${S._2xs} 0`,
              }} />
            </>
          )}

          {/* No results */}
          {data && !loading && (!data.points || data.points.length === 0) && (
            <div style={{
              ...BODY_STYLE,
              fontSize: TEXT.body,
              color: IVORY(A.ghost),
              textAlign: "center",
              padding: `${S.xs} 0`,
            }}>No summary available.</div>
          )}

          {/* Full article link — always show if we have a URL */}
          <a href={data?.url || url} target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: S.xs,
              padding: `${S.xs} ${S.sm}`,
              background: `rgba(${rgb},0.06)`,
              border: `1px solid rgba(${rgb},${A.ghost})`,
              borderRadius: S._3xs,
              textDecoration: "none",
              transition: `all 382ms ${EASE}`,
              alignSelf: "center",
              width: "100%",
              maxWidth: "20rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${rgb},${A.ghost})`;
              e.currentTarget.style.borderColor = `rgba(${rgb},${A.phi})`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `rgba(${rgb},0.06)`;
              e.currentTarget.style.borderColor = `rgba(${rgb},${A.ghost})`;
            }}
          >
            <span style={{
              ...DISPLAY_STYLE,
              fontSize: TEXT.label,
              letterSpacing: "0.06em",
              color: `rgba(${rgb},${A.phi})`,
            }}>READ FULL ARTICLE →</span>
          </a>
        </div>
      )}
    </div>
  );
}
