/**
 * POEM UNIVERSE — Exact port of educationrevelation depth-2 experience
 *
 * poem="ask"     → Death or Life  → DiamondGenesisCanvas  + ASK_POEMS scroll
 * poem="explore" → Rhythm of Life → DreamMultiverseCanvas + POEMS scroll
 * poem="kal"     → Kaleidoscope Sea → KaleidoscopeSeaCanvas + KAL_POEMS scroll
 */
import { useState, useEffect, useRef } from "react";
import DreamMultiverseCanvas from "./components/dreamMultiverse.jsx";
import DiamondGenesisCanvas  from "./components/diamondGenesis.jsx";
import KaleidoscopeSeaCanvas from "./components/kaleidoscopeSea.jsx";
import { POEMS, ASK_POEMS, KAL_POEMS } from "./data.js";

const PHI    = 1.618033988749895;
const PHI_INV= 0.6180339887498949;
const PHI2   = PHI * PHI;
const CINZEL = "'Cinzel', serif";
const CORM   = "'Cormorant Garamond', serif";
const GOLD   = (a) => `rgba(201,168,76,${a})`;

// ── Back button ──────────────────────────────────────────────────
function BackButton({ onBack }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onBack}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position:"fixed", top:28, left:28, zIndex:9999,
        background:"none",
        border:"none",
        color: hover ? GOLD(1.0) : GOLD(0.72),
        fontFamily: CINZEL, fontSize:16, fontWeight:600,
        letterSpacing:"0.38em", padding:"10px 16px",
        cursor:"pointer", transition:"color 618ms ease",
      }}
    >← BACK</button>
  );
}

// KalPlaceholder removed — full canvas implemented

// ── Poem Wheel — exact port of PoemWheel from educationrevelation ─
function PoemWheel({ userPath, veilParted }) {
  const wheelRef  = useRef(null);
  const scrollRef = useRef(null);
  const frameRef  = useRef(null);

  useEffect(() => {
    if (!wheelRef.current || !scrollRef.current) return;
    const container = wheelRef.current;
    const scroller  = scrollRef.current;
    const viewH     = container.clientHeight;

    const activePoems   = userPath === "ask" ? ASK_POEMS
                     : userPath === "kal" ? KAL_POEMS
                     : POEMS;
    const oneCycleCount = activePoems.length;
    let oneCycleH = 0;
    const kids = scroller.children;
    for (let c = 0; c < oneCycleCount && c < kids.length; c++) {
      oneCycleH += kids[c].offsetHeight;
    }

    const cycleDuration = Math.round(PHI * PHI * 23.6) * 1000;
    const speed = oneCycleH / cycleDuration;

    const titleH = kids[0] ? kids[0].offsetHeight : 0;
    let y = (viewH - titleH) / 2;
    scroller.style.transform = `translateY(${y}px)`;
    scroller.style.opacity   = "0";

    const firstTitle = kids[0];
    for (let c = 1; c < kids.length; c++) kids[c].style.opacity = "0";

    if (firstTitle) {
      firstTitle.style.color = "rgba(255,255,255,0.9)";
      firstTitle.style.WebkitTextFillColor = "rgba(255,255,255,0.9)";
      firstTitle.style.background = "none";
      firstTitle.style.filter  = "blur(30px)";
      firstTitle.style.transform = "scale(0.05)";
    }

    const CRYSTALLIZE_DUR = 4236;
    let lastTime = null;

    const waitForVeil = () => {
      if (!veilParted) { frameRef.current = requestAnimationFrame(waitForVeil); return; }

      scroller.style.opacity = "1";

      if (firstTitle) {
        firstTitle.style.transition =
          `filter ${CRYSTALLIZE_DUR}ms cubic-bezier(0.23,1,0.32,1),` +
          `transform ${CRYSTALLIZE_DUR}ms cubic-bezier(0.23,1,0.32,1),` +
          `color ${CRYSTALLIZE_DUR}ms ease,` +
          `-webkit-text-fill-color ${CRYSTALLIZE_DUR}ms ease,` +
          `background ${CRYSTALLIZE_DUR}ms ease`;
        firstTitle.style.filter    = "blur(0px)";
        firstTitle.style.transform = "scale(1)";
        firstTitle.style.background =
          "linear-gradient(90deg,rgba(201,168,76,0.5) 0%,rgba(255,245,220,0.95) 25%,rgba(201,168,76,1) 50%,rgba(255,245,220,0.95) 75%,rgba(201,168,76,0.5) 100%)";
        firstTitle.style.backgroundSize         = "200% 100%";
        firstTitle.style.WebkitBackgroundClip   = "text";
        firstTitle.style.WebkitTextFillColor    = "transparent";
        firstTitle.style.backgroundClip         = "text";
      }

      setTimeout(() => {
        for (let c = 1; c < kids.length; c++) {
          kids[c].style.transition = "opacity 1.618s ease";
          kids[c].style.opacity    = "1";
        }
        frameRef.current = requestAnimationFrame(scroll);
      }, CRYSTALLIZE_DUR);
    };

    function scroll(now) {
      if (!lastTime) lastTime = now;
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      y -= speed * dt;
      if (y < viewH - oneCycleH * 2) y += oneCycleH;
      scroller.style.transform = `translateY(${y}px)`;
      frameRef.current = requestAnimationFrame(scroll);
    }

    frameRef.current = requestAnimationFrame(waitForVeil);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [veilParted]);

  const poemFontMin = Math.round(17 * PHI);
  const poemFontMax = Math.round(17 * PHI * PHI);
  const activePoems = userPath === "ask" ? ASK_POEMS
                     : userPath === "kal" ? KAL_POEMS
                     : POEMS;
  const bookendTitle = userPath === "ask" ? "death or life"
                    : userPath === "kal" ? "kaleidoscope sea"
                    : "it's the rhythm of life";

  return (
    <div ref={wheelRef} style={{
      position:"fixed", top:0, left:0, width:"100%", height:"100%",
      zIndex:5001, overflow:"hidden", pointerEvents:"none",
    }}>
      {/* Top fade */}
      <div style={{
        position:"absolute", top:0, left:0, width:"100%", height:"38.2%",
        background:"linear-gradient(to bottom,rgba(3,3,6,0.7) 0%,rgba(3,3,6,0.5) 30%,rgba(3,3,6,0) 100%)",
        zIndex:2, pointerEvents:"none",
      }}/>
      {/* Bottom fade */}
      <div style={{
        position:"absolute", bottom:0, left:0, width:"100%", height:"38.2%",
        background:"linear-gradient(to top,rgba(3,3,6,0.7) 0%,rgba(3,3,6,0.5) 30%,rgba(3,3,6,0) 100%)",
        zIndex:2, pointerEvents:"none",
      }}/>

      {/* Scrolling poem — 3 copies for seamless infinite scroll */}
      <div ref={scrollRef} style={{
        position:"absolute", left:0, width:"100%",
        display:"flex", flexDirection:"column", alignItems:"center",
        padding:"0 5%",
      }}>
        {[...activePoems, ...activePoems, ...activePoems].map((line, i) => {
          if (line === "") {
            return <div key={i} style={{ height:`${Math.round(38 * PHI)}px` }}/>;
          }
          const isBookend = (line === bookendTitle);
          const parts = line.split("\n");
          return (
            <div key={i} style={{
              fontFamily: isBookend ? CINZEL : CORM,
              fontSize: isBookend
                ? `clamp(${Math.round(poemFontMin*PHI)}px,${5.5*PHI}vw,${Math.round(poemFontMax*PHI)}px)`
                : `clamp(${poemFontMin}px,5.5vw,${poemFontMax}px)`,
              fontStyle:   "normal",
              fontWeight:  isBookend ? 500 : 400,
              color:       isBookend ? "rgba(201,168,76,0.9)" : "rgba(232,232,240,0.85)",
              textAlign:   "center",
              lineHeight:  1.5,
              letterSpacing: isBookend ? 4 : 0.8,
              marginBottom: Math.round(8 * PHI),
              maxWidth:    "618px",
              ...(isBookend ? {
                background:"linear-gradient(90deg,rgba(201,168,76,0.5) 0%,rgba(255,245,220,0.95) 25%,rgba(201,168,76,1) 50%,rgba(255,245,220,0.95) 75%,rgba(201,168,76,0.5) 100%)",
                backgroundSize:"200% 100%",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
                backgroundClip:"text",
                animation:"shimmerLine 5s ease-in-out infinite",
                filter:"drop-shadow(0 0 20px rgba(201,168,76,0.15)) drop-shadow(0 0 40px rgba(201,168,76,0.06))",
              } : {}),
            }}>
              {parts.map((p,j) => <span key={j}>{j>0&&<br/>}{p}</span>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main PoemUniverse ────────────────────────────────────────────
export default function PoemUniverse({ poem, onBack }) {
  const [veilParted, setVeilParted] = useState(false);

  // "kal" falls through to full canvas below

  return (
    <div style={{ position:"fixed", inset:0, background:"#03030a", zIndex:1000 }}>
      <BackButton onBack={onBack} />

      {/* Grain overlay */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:2,
        opacity:0.025,
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        backgroundRepeat:"repeat",
        backgroundSize:"128px 128px",
      }}/>

      {/* Vignette */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:1,
        background:"radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.4) 65%,rgba(0,0,0,0.7) 85%,rgba(0,0,0,0.85) 100%)",
      }}/>

      {/* Animation canvas — fills entire background */}
      <div style={{
        position:"fixed", inset:0, zIndex:0,
      }}>
        {poem === "ask"
          ? <DiamondGenesisCanvas    depth={2} onVeilParted={() => setVeilParted(true)} />
          : poem === "explore"
          ? <DreamMultiverseCanvas   depth={2} onVeilParted={() => setVeilParted(true)} />
          : <KaleidoscopeSeaCanvas            onVeilParted={() => setVeilParted(true)} />
        }
      </div>

      {/* Poem wheel — scrolls over the animation */}
      <PoemWheel userPath={poem} veilParted={veilParted} />
    </div>
  );
}
