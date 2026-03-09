import React, { useState, useEffect } from "react";
import { fetchWiki } from "./wikiEngine.js";
import { S, A, IVORY, EASE, DISPLAY_STYLE, BODY_STYLE, ACCENT_STYLE } from "./phi.js";

export default function WikiSummary({ topic, rgb, index = 0 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || data) return;
    setLoading(true); setError(false);
    fetchWiki(topic).then(r => { setData(r); setLoading(false); }).catch(() => { setError(true); setLoading(false); });
  }, [open, topic, data]);

  return (
    <div style={{ border: `1px solid rgba(${rgb},${open ? A.ghost : A.ghost})`, borderRadius: S._3xs, overflow: "hidden", transition: `all 618ms ${EASE}`, animation: `fadeUp 618ms ${100 + index * 100}ms both ease` }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: S.xs,
        background: open ? `rgba(${rgb},${A.ghost})` : "transparent",
        border: "none", cursor: "pointer", padding: `${S.xs} ${S.sm}`, transition: `all 618ms ${EASE}`,
      }}>
        <span style={{ fontSize: S.sm }}>📖</span>
        <span style={{ ...BODY_STYLE, fontWeight: 400, fontSize: S.sm, color: `rgba(${rgb},${open ? A.phi : A.ghost})`, transition: `color 618ms ${EASE}`, flex: 1, textAlign: "left" }}>{topic}</span>
        <span style={{ fontSize: S._2xs, color: `rgba(${rgb},${A.ghost})`, transition: `all 618ms ${EASE}`, transform: open ? "rotate(180deg)" : "none", display: "inline-block" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: `0 ${S.sm} ${S.sm}`, animation: "fadeIn 382ms ease" }}>
          {loading && <div style={{ ...ACCENT_STYLE, fontSize: S.sm, color: `rgba(${rgb},${A.ghost})`, padding: `${S.xs} 0` }}>Loading...</div>}
          {error && <div style={{ ...BODY_STYLE, fontSize: S.sm, color: "rgba(220,100,100,0.618)", padding: `${S.xs} 0` }}>Could not load.</div>}
          {data && !loading && (
            <>
              {data.extract && <p style={{ ...BODY_STYLE, fontSize: S.sm, color: IVORY(A.phi), marginBottom: S.xs }}>{data.extract.length > 618 ? data.extract.slice(0, 618) + "..." : data.extract}</p>}
              {data.url && <a href={data.url} target="_blank" rel="noopener noreferrer" style={{ ...DISPLAY_STYLE, fontSize: S._3xs, color: `rgba(${rgb},${A.phi})`, textDecoration: "none", borderBottom: `1px solid rgba(${rgb},${A.ghost})` }}>READ ON WIKIPEDIA →</a>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
