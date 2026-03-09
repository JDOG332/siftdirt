/**
 * WIKI SUMMARY — Fetches and displays a brief Wikipedia summary
 */

import React, { useState, useEffect } from "react";
import { fetchWiki } from "./wikiEngine.js";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

export default function WikiSummary({ topic, rgb, index = 0 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || data) return;
    setLoading(true);
    setError(false);
    fetchWiki(topic)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [open, topic, data]);

  return (
    <div
      style={{
        border: `1px solid rgba(${rgb},${open ? 0.236 : 0.09})`,
        borderRadius: 4,
        overflow: "hidden",
        transition: `all 382ms ${EASE}`,
        animation: `fadeUp 0.618s ${0.1 + index * 0.06}s both ease`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.618rem",
          background: open ? `rgba(${rgb},0.05)` : "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0.618rem 1rem",
          transition: `all 382ms ${EASE}`,
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>📖</span>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(15px, 2.4vw, 18px)",
            fontWeight: 400,
            color: `rgba(${rgb},${open ? 0.92 : 0.618})`,
            transition: `color 382ms ${EASE}`,
            flex: 1,
            textAlign: "left",
          }}
        >
          {topic}
        </span>
        <span
          style={{
            fontSize: 11,
            color: `rgba(${rgb},${open ? 0.618 : 0.236})`,
            transition: `all 382ms ${EASE}`,
            transform: open ? "rotate(180deg)" : "none",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {/* Content */}
      {open && (
        <div
          style={{
            padding: "0 1rem 1rem",
            animation: "fadeIn 0.382s ease",
          }}
        >
          {loading && (
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 15,
                color: `rgba(${rgb},0.382)`,
                fontStyle: "italic",
                padding: "0.618rem 0",
              }}
            >
              Loading...
            </div>
          )}
          {error && (
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 15,
                color: "rgba(220,100,100,0.618)",
                padding: "0.618rem 0",
              }}
            >
              Could not load summary.
            </div>
          )}
          {data && !loading && (
            <>
              {data.extract && (
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(14px, 2.2vw, 17px)",
                    fontWeight: 400,
                    color: "rgba(232,228,210,0.78)",
                    lineHeight: 1.618,
                    marginBottom: "0.618rem",
                  }}
                >
                  {data.extract.length > 500
                    ? data.extract.slice(0, 500) + "..."
                    : data.extract}
                </p>
              )}
              {data.url && (
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: `rgba(${rgb},0.618)`,
                    textDecoration: "none",
                    borderBottom: `1px solid rgba(${rgb},0.236)`,
                    paddingBottom: 2,
                    transition: `color 250ms ${EASE}`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = `rgba(${rgb},1.0)`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = `rgba(${rgb},0.618)`)
                  }
                >
                  READ ON WIKIPEDIA →
                </a>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
