/**
 * TRUTH SCREEN — 100% PHI-derived
 *
 * ONE SEED: doorW = W × PHIi  (portrait mobile)
 *           doorW = H × PHIi² (landscape desktop)
 *
 * Every size, gap, opacity, and timing is a power of PHI from that seed.
 *
 * OPACITY SYSTEM (PHI ladder only — no arbitrary alphas):
 *   O1 = PHIi⁵ = 0.090  whisper / grain
 *   O2 = PHIi⁴ = 0.146  ghost / decoration
 *   O3 = PHIi³ = 0.236  secondary text / borders
 *   O4 = PHIi² = 0.382  present / formula
 *   O5 = PHIi¹ = 0.618  primary / quote
 *   O6 = 1.000          full / hover peak
 *
 * TIMING SYSTEM (base T = PHIi = 0.618s):
 *   0.000s  door fades in
 *   0.618s  door visible
 *   1.000s  quote phrase 1         (T×PHI)
 *   +0.382s each phrase            (T×PHIi each)
 *   1.618s  FIND YOUR TRUTH        (T×PHI²)
 *   2.618s  formula rises          (T×PHI³)
 *
 * LAYOUT (mobile portrait 9:16):
 *   [DOOR — fills ~75vh — quote lives inside]
 *   [thin gold bridge line]
 *   [FIND YOUR TRUTH — the threshold]
 *   [thin gold bridge line]
 *   [FORMULA — the foundation]
 */

import { useEffect, useRef, useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────
// PHI SYSTEM — ONE SOURCE OF TRUTH
// ─────────────────────────────────────────────────────────────────
const PHI   = 1.6180339887498948;
const PHIi  = 0.6180339887498949;   // 1/PHI
const PHI2  = 2.6180339887498948;   // PHI²
const PHI3  = 4.2360679774997896;   // PHI³
const PHIi2 = 0.3819660112501051;   // 1/PHI²
const PHIi3 = 0.2360679774997896;   // 1/PHI³
const PHIi4 = 0.1458980337503153;   // 1/PHI⁴
const PHIi5 = 0.0901699437494742;   // 1/PHI⁵
const PHIi6 = 0.0557280899954210;   // 1/PHI⁶

// PHI opacity ladder — the ONLY values used for alpha anywhere
const O = {
  whisper:  PHIi5,   // 0.090
  ghost:    PHIi4,   // 0.146
  dim:      PHIi3,   // 0.236
  mid:      PHIi2,   // 0.382
  pres:     PHIi,    // 0.618
  full:     1.0,
};

// PHI time ladder — base T = PHIi seconds
const T = PHIi;
const TIME = {
  doorIn:   0,
  doorFull: T,             // 0.618s
  q0:       T * PHI,       // 1.000s
  qStep:    T * PHIi,      // 0.382s between phrases
  label:    T * PHI2,      // 1.618s
  formula:  T * PHI3,      // 2.618s
};

const CINZEL = "'Cinzel', serif";
const CORRO  = "'Cormorant Garamond', Georgia, serif";

const GOLD  = a => `rgba(201,168,76,${a})`;
const GOLDB = a => `rgba(235,205,110,${a})`;
const BLUE  = a => `rgba(120,185,245,${a})`;
const SILVER= a => `rgba(210,210,225,${a})`;

// Easing — all derived from PHI (smooth step + ease-out)
function sm(t) { t=Math.max(0,Math.min(1,t)); return t*t*t*(t*(t*6-15)+10); }
function eo(t) { return 1-Math.pow(1-Math.max(0,Math.min(1,t)),3); }
function eio(t){ t=Math.max(0,Math.min(1,t)); return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }

// ─────────────────────────────────────────────────────────────────
// PHI SIZING ENGINE  — one seed → all measurements
// ─────────────────────────────────────────────────────────────────
function buildSystem(W, H) {
  const isMobile = W < 640;

  // SEED: doorW
  // Mobile portrait: W × PHIi  (door = 62% of viewport width)
  // Desktop landscape: H × PHIi² (door height = H×PHIi, width = H×PHIi²)
  const rawDoorW = isMobile
    ? W * PHIi
    : Math.min(H * PHIi2, W * PHIi3);
  const doorW = Math.round(rawDoorW);

  // doorH — mobile: tall arch (w×PHI²), desktop: golden rect (w×PHI)
  const doorH = isMobile
    ? Math.round(doorW * PHI2)    // portrait arch
    : Math.round(doorW * PHI);    // landscape golden rect

  // Arch — top curved portion = doorW × PHIi
  const archH = Math.round(doorW * PHIi);

  // Ornament — lives in arch center = archH × PHIi
  const ornSz = Math.round(archH * PHIi);

  // Inner panel margin
  const panM  = Math.round(doorW * PHIi3);

  // Bridge height between door and formula
  const bridgeH = Math.round(doorW * PHIi4);

  // Quote horizontal padding inside door
  const quoteM = Math.round(doorW * PHIi3);

  // Gap between quote phrases
  const phraseGap = Math.round(doorW * PHIi5);

  // FONT SIZES — PHI ladder from doorW × PHIi⁵
  const fBase    = doorW * PHIi5;           // ~22px mobile
  const fSub     = doorW * PHIi6;           // ~13px mobile
  const fLabel   = doorW * PHIi6;           // FIND YOUR TRUTH, formula
  const fPsi     = doorW * PHIi4;           // Ψ symbol ~35px mobile
  const fHead    = doorW * PHIi6 * PHIi;    // CHOOSE YOUR PATH ~8px

  // PHI breathing rule: minHeight = doorH × PHI
  // Guarantees golden margin (doorH × PHIi) above + below content on any screen
  const minH = Math.round(doorH * PHI);

  return {
    isMobile, doorW, doorH, archH, ornSz,
    panM, bridgeH, quoteM, phraseGap,
    fBase, fSub, fLabel, fPsi, fHead,
    minH,
  };
}

// ─────────────────────────────────────────────────────────────────
// SACRED GEOMETRY ORNAMENT
// ─────────────────────────────────────────────────────────────────
function Ornament({ size, alpha = O.pres }) {
  const r  = size / 2;
  const r1 = r * PHIi;    // outer ring
  const r2 = r * PHIi2;   // petal circle
  const r3 = r * PHIi3;   // inner ring

  // 6 petal flower of life
  const petals = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    const cx = r + Math.cos(a) * r2;
    const cy = r + Math.sin(a) * r2;
    return `M${cx} ${cy} m-${r2} 0 a${r2} ${r2} 0 1 0 ${r2*2} 0 a${r2} ${r2} 0 1 0-${r2*2} 0`;
  });

  // PHI spiral points
  const spiralPts = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 8;  // 4 rotations
    const spiral_r = r3 * Math.pow(PHI, i / 12);
    const x = r + Math.cos(a) * Math.min(spiral_r, r1);
    const y = r + Math.sin(a) * Math.min(spiral_r, r1);
    return i === 0 ? `M${x} ${y}` : `L${x} ${y}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ opacity: alpha, overflow: "visible", display: "block", flexShrink: 0 }}>

      {/* Outer containment ring */}
      <circle cx={r} cy={r} r={r * .94}
        fill="none" stroke={GOLD(O.dim)} strokeWidth=".5"/>

      {/* PHI spiral */}
      <path d={spiralPts} fill="none"
        stroke={GOLD(O.ghost)} strokeWidth=".4"/>

      {/* Flower of life petals */}
      {petals.map((d, i) =>
        <path key={i} d={d} fill="none"
          stroke={GOLD(O.dim)} strokeWidth=".5"/>
      )}

      {/* Hexagram lines */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i}
          x1={r + Math.cos(a) * r1} y1={r + Math.sin(a) * r1}
          x2={r + Math.cos(a + Math.PI) * r1} y2={r + Math.sin(a + Math.PI) * r1}
          stroke={GOLD(O.ghost)} strokeWidth=".4"/>;
      })}

      {/* Rings */}
      <circle cx={r} cy={r} r={r1}
        fill="none" stroke={GOLD(O.dim)} strokeWidth=".5"/>
      <circle cx={r} cy={r} r={r2}
        fill="none" stroke={GOLD(O.dim)} strokeWidth=".5"/>
      <circle cx={r} cy={r} r={r3}
        fill="none" stroke={GOLD(O.mid)} strokeWidth=".5"/>

      {/* Cardinal compass ticks — PHI-ratio lengths */}
      {[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].map((a, i) => (
        <line key={i}
          x1={r + Math.cos(a) * r3} y1={r + Math.sin(a) * r3}
          x2={r + Math.cos(a) * r * .92} y2={r + Math.sin(a) * r * .92}
          stroke={GOLD(O.mid)} strokeWidth=".7"/>
      ))}

      {/* Center jewel */}
      <circle cx={r} cy={r} r={3.5} fill={GOLD(O.pres)}/>
      <circle cx={r} cy={r} r={1.5} fill={GOLDB(O.full)}/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// ARCH DOOR (big, with quote and label inside)
// ─────────────────────────────────────────────────────────────────
const PHRASES = [
  "Truth is found",
  "by removing noise,",
  "watching without blinking,",
  "and holding reality",
  "from three angles",
  "until it can't slip away.",
];

function BigDoor({ sys, t, quoteT, onClick }) {
  const [hover, setHover] = useState(false);
  const hA = hover ? 1 : 0;
  const { doorW: w, doorH: h, archH, ornSz, panM, quoteM, phraseGap,
          fBase, fSub, isMobile } = sys;

  const fT = eo(t);

  // Derived SVG measurements — ALL from sys (PHI-derived)
  const m = panM;
  const iaH = archH * PHIi;    // inner arch panel height
  const mt  = archH * PHIi2;   // inner arch panel top margin

  // Quote area: from archH + quoteM to h × PHI ratio
  const quoteTop  = archH + quoteM;
  const quoteBot  = Math.round(h * PHIi);   // bottom of quote zone at h×PHIi
  const quoteInH  = quoteBot - quoteTop;    // total available for quote

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        position: "relative",
        width: w, height: h,
        cursor: "pointer",
        flexShrink: 0,
        opacity: fT,
        transform: `scale(${fT * (hover ? 1 + PHIi5 * PHI : 1)})`,
        transition: `transform ${PHIi}s cubic-bezier(.23,1,.32,1)`,
      }}
    >
      {/* Radial glow — scales with hover and doorT */}
      <div style={{
        position: "absolute",
        inset: -Math.round(w * PHIi4),
        pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 38%,
          ${GOLD(O.dim + hA * O.ghost)} 0%,
          transparent ${Math.round(68 + hA * 8)}%)`,
        borderRadius: `${w}px ${w}px 0 0`,
      }}/>

      {/* ── SVG DOOR FRAME ────────────────────────────── */}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
        style={{ position: "absolute", inset: 0, display: "block" }}>
        <defs>
          <linearGradient id="bdg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(10,12,34,.99)"/>
            <stop offset="100%" stopColor="rgba(3,4,14,.99)"/>
          </linearGradient>
          <radialGradient id="bglow" cx="50%" cy="28%" r="58%">
            <stop offset="0%"   stopColor={GOLD(O.ghost + hA * O.ghost)}/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>

        {/* Fill */}
        <path d={`M0 ${archH} Q0 0 ${w/2} 0 Q${w} 0 ${w} ${archH}
                  L${w} ${h} L0 ${h} L0 ${archH}Z`}
          fill="url(#bdg)"/>
        <path d={`M0 ${archH} Q0 0 ${w/2} 0 Q${w} 0 ${w} ${archH}
                  L${w} ${h} L0 ${h} L0 ${archH}Z`}
          fill="url(#bglow)"/>

        {/* Outer frame — O3 at rest, O5 on hover */}
        <path d={`M1.5 ${archH} Q1.5 1.5 ${w/2} 1.5
                  Q${w-1.5} 1.5 ${w-1.5} ${archH}
                  L${w-1.5} ${h} L1.5 ${h} L1.5 ${archH}Z`}
          fill="none"
          stroke={GOLD(O.dim + hA * (O.mid - O.dim))}
          strokeWidth="1.4"/>

        {/* Inner panel */}
        <path d={`M${m} ${mt+iaH} Q${m} ${mt} ${w/2} ${mt}
                  Q${w-m} ${mt} ${w-m} ${mt+iaH}
                  L${w-m} ${h*PHIi} L${m} ${h*PHIi} L${m} ${mt+iaH}Z`}
          fill="none"
          stroke={GOLD(O.ghost + hA * O.ghost)}
          strokeWidth=".5"/>

        {/* Golden ratio divider — at h×PHIi (1/PHI of total height) */}
        <line
          x1={m * 2} y1={h * PHIi}
          x2={w - m*2} y2={h * PHIi}
          stroke={GOLD(O.ghost + hA * O.ghost)}
          strokeWidth=".5"/>

        {/* Second divider — at h×PHIi² */}
        <line
          x1={m * 2.5} y1={h * PHIi2}
          x2={w - m*2.5} y2={h * PHIi2}
          stroke={GOLD(O.whisper + hA * O.ghost)}
          strokeWidth=".4"/>

        {/* Corner jewels — at PHI-ratio positions */}
        {[
          [w * PHIi3, h * (PHIi + PHIi4)],
          [w * (1-PHIi3), h * (PHIi + PHIi4)],
          [w * PHIi3, h * (1 - PHIi4)],
          [w * (1-PHIi3), h * (1 - PHIi4)],
        ].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="2"
            fill={GOLD(O.dim + hA * O.mid)}/>
        ))}

        {/* Handle — at golden ratio of width × vertical center */}
        <circle cx={w * (PHIi + PHIi4)} cy={h * PHIi2 * PHI}
          r={Math.round(w * PHIi5)}
          fill="none" stroke={GOLD(O.mid + hA * O.mid)} strokeWidth=".8"/>
        <circle cx={w * (PHIi + PHIi4)} cy={h * PHIi2 * PHI}
          r={Math.round(w * PHIi6)}
          fill={GOLD(O.mid + hA * O.mid)}/>

        {/* Keyhole — below PHIi divider */}
        <circle cx={w/2} cy={h * (PHIi + PHIi3)}
          r={Math.round(w * PHIi6 * PHI)}
          fill="none" stroke={GOLD(O.ghost + hA * O.dim)} strokeWidth=".6"/>
        <line
          x1={w/2} y1={h * (PHIi + PHIi3) + w*PHIi6*PHI}
          x2={w/2} y2={h * (PHIi + PHIi3) + w*PHIi6*PHI + w*PHIi5}
          stroke={GOLD(O.ghost + hA * O.dim)} strokeWidth=".6"/>
      </svg>

      {/* Ornament — centered in arch */}
      <div style={{
        position: "absolute",
        top: Math.round(archH * PHIi2),
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}>
        <Ornament size={ornSz} alpha={O.mid + hA * O.dim}/>
      </div>

      {/* ── QUOTE INSIDE DOOR ──────────────────────────── */}
      <div style={{
        position: "absolute",
        top: quoteTop,
        left: quoteM,
        right: quoteM,
        height: quoteInH,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: phraseGap,
        textAlign: "center",
        pointerEvents: "none",
      }}>
        {PHRASES.map((p, i) => {
          const delay = TIME.q0 + i * TIME.qStep;
          const pt = eo(Math.max(0, (quoteT - delay) / (TIME.qStep * PHI)));
          const isFirst = i === 0;
          return (
            <div key={i} style={{
              fontFamily: CORRO,
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: `${Math.round(isFirst ? fBase : fSub)}px`,
              letterSpacing: isFirst ? "0.06em" : "0.03em",
              lineHeight: PHIi + 1,   // 1.618 — golden line height
              color: isFirst
                ? SILVER(O.pres * pt)
                : SILVER(O.mid * pt),
              opacity: pt,
              transform: `translateY(${(1 - pt) * Math.round(w * PHIi6)}px)`,
              transition: "none",
            }}>{p}</div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FORMULA ROW
// ─────────────────────────────────────────────────────────────────
function Formula({ sys, t }) {
  const fT = eo(t);
  if (fT <= 0.01) return null;
  const { fLabel, fPsi, fSub: sys_fSub, isMobile } = sys;
  const sub = `${Math.round(fLabel * PHIi)}px`;

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: isMobile ? `${Math.round(fLabel * PHIi)}px` : `${Math.round(fLabel)}px`,
      opacity: fT,
      transform: `translateY(${(1 - fT) * 10}px)`,
      width: "100%",
    }}>

      {/* S_eff := −log terms (blue, entropy side) */}
      <div style={{
        display: "flex", flexDirection: "row",
        alignItems: "baseline",
        gap: `${Math.round(fLabel * PHIi2)}px`,
        flexWrap: "nowrap",
      }}>
        <span style={{
          fontFamily: CORRO, fontStyle: "italic",
          fontSize: `${Math.round(fLabel)}px`,
          color: BLUE(O.mid),
          whiteSpace: "nowrap",
        }}>
          S<sub style={{fontSize:sub}}>eff</sub>
          <span style={{ fontStyle:"normal", margin: `0 .28em`, color: BLUE(O.dim) }}>:=</span>
          −log&thinsp;F<sub style={{fontSize:sub}}>gated</sub>
        </span>
        <span style={{
          fontFamily: CORRO, fontStyle: "italic",
          fontSize: `${Math.round(fLabel)}px`,
          color: BLUE(O.mid),
          whiteSpace: "nowrap",
        }}>
          −log&thinsp;C<sub style={{fontSize:sub}}>eff</sub>
        </span>
        <span style={{
          fontFamily: CORRO, fontStyle: "italic",
          fontSize: `${Math.round(fLabel)}px`,
          color: BLUE(O.mid),
          whiteSpace: "nowrap",
        }}>
          −log&thinsp;D̂
        </span>
      </div>

      {/* Bridge separator — thin line or ⟺ */}
      {isMobile
        ? <div style={{
            width: `${Math.round(sys.doorW * PHIi3)}px`,
            height: "1px",
            background: `linear-gradient(90deg,transparent,${GOLD(O.ghost)},transparent)`,
          }}/>
        : <span style={{
            fontFamily: CORRO,
            fontSize: `${Math.round(fLabel * PHIi)}px`,
            color: GOLD(O.ghost),
            margin: `0 ${Math.round(fLabel * PHIi2)}px`,
          }}>⟺</span>
      }

      {/* Ψ = R₁₂ × (C_eff · D̂) (gold, Ψ side) */}
      <div style={{
        display: "flex", flexDirection: "row",
        alignItems: "center",
        gap: `${Math.round(fLabel * PHIi3)}px`,
      }}>
        <span style={{
          fontFamily: CORRO, fontStyle: "italic",
          fontSize: `${Math.round(fPsi)}px`,
          color: GOLDB(O.pres),
          lineHeight: 1,
          textShadow: `0 0 ${Math.round(fPsi * PHIi)}px ${GOLD(O.mid)}`,
          letterSpacing: 2,
        }}>Ψ</span>
        <span style={{
          fontFamily: CORRO,
          fontSize: `${Math.round(fLabel)}px`,
          color: GOLD(O.mid),
        }}>=</span>
        <span style={{
          fontFamily: CORRO, fontStyle: "italic",
          fontSize: `${Math.round(fLabel)}px`,
          color: GOLD(O.pres),
          whiteSpace: "nowrap",
          textShadow: `0 0 ${Math.round(fLabel * PHIi)}px ${GOLD(O.dim)}`,
        }}>
          R<sub style={{fontSize:sub}}>12</sub>
          <span style={{ margin: `0 .25em`, color: GOLD(O.mid) }}>×</span>
          <span style={{ color: GOLD(O.mid) }}>(</span>
          C<sub style={{fontSize:sub}}>eff</sub>
          <span style={{ margin: `0 .2em`, color: GOLD(O.mid) }}>·</span>
          D̂
          <span style={{ color: GOLD(O.mid) }}>)</span>
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// DISSOLVE
// ─────────────────────────────────────────────────────────────────
function Dissolve({ W, H, active }) {
  const cvRef = useRef(null), rafRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const cv = cvRef.current; if (!cv) return;
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    const pts = Array.from({ length: 280 }, () => {
      const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 5;
      return {
        x: W/2 + (Math.random()-.5)*W*.6,
        y: H * PHIi2 + (Math.random()-.5)*H*.45,
        vx: Math.cos(a)*s, vy: Math.sin(a)*s - 1.2,
        sz: 1+Math.random()*2.5, al:.5+Math.random()*.5,
        dc: .014+Math.random()*.02, gold: Math.random() > .35,
      };
    });
    function loop() {
      ctx.clearRect(0,0,W,H); let alive=false;
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.vy+=.046; p.vx*=.99; p.al-=p.dc;
        if(p.al>0){
          alive=true;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.sz*p.al,0,Math.PI*2);
          ctx.fillStyle = p.gold ? GOLD(p.al) : `rgba(120,170,230,${p.al*.6})`;
          ctx.fill();
        }
      });
      if(alive) rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, W, H]);
  if (!active) return null;
  return <canvas ref={cvRef}
    style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:200 }}/>;
}

// ─────────────────────────────────────────────────────────────────
// 50/50 SIDE DOORS (random each load)
// ─────────────────────────────────────────────────────────────────
const FLIP = Math.random() < .5;
const DOOR_DEFS = FLIP
  ? [
      { label:"PAPER", sublabel:"where we are",     href:"https://educationrevelation.com", delay:.14 },
      { label:"POEMS", sublabel:"see our truth",    href:"https://educationrevelation.com", delay:0   },
      { label:"PROOF", sublabel:"where we've been", href:"https://educationrevelation.com", delay:.14 },
    ]
  : [
      { label:"PROOF", sublabel:"where we've been", href:"https://educationrevelation.com", delay:.14 },
      { label:"POEMS", sublabel:"see our truth",    href:"https://educationrevelation.com", delay:0   },
      { label:"PAPER", sublabel:"where we are",     href:"https://educationrevelation.com", delay:.14 },
    ];

// ─────────────────────────────────────────────────────────────────
// SMALL DOOR (three-doors screen)
// ─────────────────────────────────────────────────────────────────
function SmallDoor({ w, h, isCenter, onClick }) {
  const [hover, setHover] = useState(false);
  const hA = hover ? 1 : 0;
  const archH = Math.round(w * PHIi);
  const m = Math.round(w * PHIi3);
  const ornSz = Math.round(archH * PHIi * .9);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        position:"relative", width:w, height:h, cursor:"pointer", flexShrink:0,
        transform:`scale(${hover ? 1+PHIi5*PHI : 1})`,
        transition:`transform ${PHIi}s cubic-bezier(.23,1,.32,1)`,
      }}>
      <div style={{
        position:"absolute", inset: -Math.round(w*PHIi4), pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 40%,${GOLD(O.ghost+hA*O.dim)} 0%,transparent 68%)`,
        borderRadius:`${w}px ${w}px 0 0`,
      }}/>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
        style={{position:"absolute",inset:0,display:"block"}}>
        <defs>
          <linearGradient id={`sdg${isCenter?1:0}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isCenter?"rgba(10,12,32,.98)":"rgba(7,9,24,.98)"}/>
            <stop offset="100%" stopColor="rgba(3,4,14,.99)"/>
          </linearGradient>
        </defs>
        <path d={`M0 ${archH} Q0 0 ${w/2} 0 Q${w} 0 ${w} ${archH} L${w} ${h} L0 ${h} L0 ${archH}Z`}
          fill={`url(#sdg${isCenter?1:0})`}/>
        <path d={`M1 ${archH} Q1 1 ${w/2} 1 Q${w-1} 1 ${w-1} ${archH} L${w-1} ${h} L1 ${h} L1 ${archH}Z`}
          fill="none" stroke={GOLD(O.dim+hA*(O.mid-O.dim))} strokeWidth={isCenter?"1.1":".8"}/>
        {(()=>{
          const iaH=archH*PHIi, mt=archH*PHIi2;
          return <path d={`M${m} ${mt+iaH} Q${m} ${mt} ${w/2} ${mt}
                            Q${w-m} ${mt} ${w-m} ${mt+iaH}
                            L${w-m} ${h*PHIi} L${m} ${h*PHIi} L${m} ${mt+iaH}Z`}
            fill="none" stroke={GOLD(O.ghost+hA*O.ghost)} strokeWidth=".4"/>;
        })()}
        {[[w*PHIi3,h*PHIi],[w*(1-PHIi3),h*PHIi],[w*PHIi3,h*.9],[w*(1-PHIi3),h*.9]]
          .map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.6" fill={GOLD(O.dim+hA*O.mid)}/>)}
        <circle cx={w*.68} cy={h*.52} r={w*PHIi6*PHI}
          fill="none" stroke={GOLD(O.mid+hA*O.mid)} strokeWidth=".6"/>
        <circle cx={w*.68} cy={h*.52} r={w*PHIi6}
          fill={GOLD(O.mid+hA*O.mid)}/>
        <circle cx={w/2} cy={h*.75} r={w*PHIi6*PHI}
          fill="none" stroke={GOLD(O.ghost+hA*O.dim)} strokeWidth=".5"/>
        <line x1={w/2} y1={h*.75+w*PHIi6*PHI} x2={w/2} y2={h*.75+w*PHIi5}
          stroke={GOLD(O.ghost+hA*O.dim)} strokeWidth=".5"/>
      </svg>
      <div style={{
        position:"absolute", top: Math.round(archH*PHIi2),
        left:"50%", transform:"translateX(-50%)", pointerEvents:"none",
      }}>
        <Ornament size={ornSz} alpha={O.mid+hA*O.dim}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// THREE DOORS SCREEN
// ─────────────────────────────────────────────────────────────────
function ThreeDoors({ t, W, H }) {
  const sys = buildSystem(W, H);
  const { isMobile } = sys;
  const headT = eo(Math.max(0, (t - .08) / .42));

  // Side/center door sizes — PHI-derived from viewport
  let sideW, centerW;
  if (isMobile) {
    centerW = Math.min(W * PHIi2, 170);
    sideW   = Math.round(centerW * PHIi);
  } else {
    const usable = Math.min(W * .85, 820);
    sideW   = Math.round(usable / (2 + PHI + 2*PHIi));
    centerW = Math.round(sideW * PHI);
  }
  const sideH   = Math.round(sideW * PHI2);
  const centerH = Math.round(centerW * PHI2);
  const doorGap = isMobile
    ? Math.round(sideW * PHIi2)
    : Math.round(sideW * PHIi);

  // Font sizes — PHI-ladder from sideW
  const labelFS = `${Math.round(sideW * PHIi5)}px`;
  const subFS   = `${Math.round(sideW * PHIi6)}px`;
  const headFS  = isMobile
    ? `${Math.round(W * PHIi6 * PHIi)}px`
    : `${Math.round(W * PHIi6 * PHIi2)}px`;

  return (
    <div onClick={e => e.stopPropagation()} style={{
      position:"fixed", inset:0,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"rgba(3,3,10,.97)",
      gap: isMobile ? Math.round(centerW * PHIi4) : Math.round(centerW * PHIi3),
      padding:`0 clamp(12px,3vw,28px) clamp(14px,2.5vh,28px)`,
      boxSizing:"border-box",
    }}>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 48%,${GOLD(O.whisper)} 0%,transparent 56%)`,
      }}/>

      <div style={{
        fontFamily: CINZEL,
        fontSize: headFS,
        letterSpacing: "0.55em",
        color: GOLD(O.mid * headT),
        opacity: headT,
        transform: `translateY(${(1-headT)*8}px)`,
        textAlign:"center", whiteSpace:"nowrap",
      }}>CHOOSE YOUR PATH</div>

      <div style={{
        display:"flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "center" : "flex-end",
        justifyContent:"center",
        gap: doorGap,
      }}>
        {DOOR_DEFS.map(door => {
          const isC = door.label === "POEMS";
          const dW = isC ? centerW : sideW;
          const dH = isC ? centerH : sideH;
          const dt = eo(Math.max(0, (t - door.delay) / .52));
          return (
            <div key={door.label} style={{
              display:"flex", flexDirection:"column",
              alignItems:"center",
              gap: Math.round(dW * PHIi5),
              opacity: dt,
              transform: `translateY(${(1-dt)*34}px)`,
            }}>
              <SmallDoor w={dW} h={dH} isCenter={isC}
                onClick={() => window.open(door.href, "_blank")}/>
              <div style={{
                fontFamily: CINZEL, fontSize: labelFS,
                letterSpacing: "0.42em",
                color: GOLD(isC ? O.pres : O.mid),
                textAlign:"center", whiteSpace:"nowrap",
                textShadow: isC ? `0 0 ${Math.round(dW*PHIi3)}px ${GOLD(O.dim)}` : "none",
              }}>{door.label}</div>
              <div style={{
                fontFamily: CORRO, fontStyle:"italic",
                fontSize: subFS, letterSpacing:"0.2em",
                color: SILVER(isC ? O.mid : O.dim),
                textAlign:"center", whiteSpace:"nowrap",
                marginTop: -Math.round(dW * PHIi5 * PHIi),
              }}>{door.sublabel}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse at center,transparent 36%,rgba(0,0,0,.42) 70%,rgba(0,0,0,.9) 100%)",
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN TRUTH SCREEN
// ─────────────────────────────────────────────────────────────────
export default function TruthScreen() {
  const [elapsed,  setElapsed]  = useState(0);
  const [phase,    setPhase]    = useState("truth");
  const [dissolve, setDissolve] = useState(false);
  const [threeT,   setThreeT]   = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);
  const [dims, setDims] = useState({ W: window.innerWidth, H: window.innerHeight });

  useEffect(() => {
    const fn = () => setDims({ W: window.innerWidth, H: window.innerHeight });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    if (phase !== "truth") return;
    function loop(now) {
      if (!startRef.current) startRef.current = now;
      setElapsed(now - startRef.current);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== "three") return;
    let s = null;
    function loop(now) {
      if (!s) s = now;
      setThreeT(Math.min(1, (now - s) / (TIME.doorFull * 1000 * PHI2)));
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  const handleDoorClick = () => {
    if (phase !== "truth") return;
    setPhase("dissolving"); setDissolve(true);
    setTimeout(() => { setDissolve(false); setPhase("three"); }, Math.round(TIME.doorFull * 1000 * PHI));
  };

  const { W, H } = dims;
  const sys = useMemo(() => buildSystem(W, H), [W, H]);
  const { isMobile, doorW, doorH, bridgeH, fLabel, fSub } = sys;

  if (phase === "dissolving") {
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(3,3,10,.95)" }}>
        <Dissolve W={W} H={H} active={dissolve}/>
      </div>
    );
  }

  if (phase === "three") {
    return <ThreeDoors t={threeT} W={W} H={H}/>;
  }

  // ── TIMELINE (seconds) ─────────────────────────────────────
  const t = elapsed / 1000;

  const doorT  = sm(Math.max(0, (t - TIME.doorIn)  / TIME.doorFull));
  const quoteT = t;   // phrases handle their own delay via TIME.q0 + i×TIME.qStep
  const labelT = eo(Math.max(0, (t - TIME.label)   / (TIME.qStep * PHI)));
  const formT  = sm(Math.max(0, (t - TIME.formula)  / TIME.doorFull));
  const fadeIn = eo(Math.min(1, t / (TIME.doorFull * PHIi)));

  // Layout: door area + bridge + formula pinned at bottom
  // Use flexbox with spacer to push formula to bottom
  const doorAreaTop  = Math.round((H - doorH - bridgeH * 3 - Math.round(fLabel * PHI2)) / 2);
  const clampedTop   = Math.max(Math.round(H * PHIi5), doorAreaTop);

  // PHI breathing rule
  const minH = sys.minH;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      minHeight: `${minH}px`,   // doorH × PHI — always fits, any screen
      background: "#03030a",
      opacity: fadeIn,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflow: "visible",
    }}>
      {/* Fixed background layers — stay behind scroll */}
      {/* Ambient gold — fixed so it doesn't scroll */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:`radial-gradient(ellipse at 50% ${Math.round(PHIi2*100)}%,
          ${GOLD(O.whisper * doorT)} 0%, transparent 55%)`,
      }}/>

      {/* ── CONTENT (above fixed bg layers) ──────────────── */}
      <div style={{
        position:"relative", zIndex:1,
        width:"100%", display:"flex", flexDirection:"column",
        alignItems:"center", flex:"none",
        paddingTop: `${clampedTop}px`,
      }}>

      {/* ── BIG DOOR ─────────────────────────────────────── */}
      <BigDoor
        sys={sys}
        t={doorT}
        quoteT={quoteT}
        onClick={handleDoorClick}
      />

      {/* ── BRIDGE — door → FIND YOUR TRUTH → formula ───── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        paddingBottom: Math.round(minH * PHIi4),
        minHeight: Math.round(bridgeH * 3 + fLabel * PHI2),
        width: "100%",
      }}>
        {/* Top bridge line */}
        <div style={{
          width: "1px",
          height: bridgeH,
          background: `linear-gradient(180deg, ${GOLD(O.ghost * labelT)}, ${GOLD(O.whisper * labelT)})`,
        }}/>

        {/* FIND YOUR TRUTH — the threshold inscription */}
        <div style={{
          fontFamily: CINZEL,
          fontSize: `${Math.round(fLabel)}px`,
          letterSpacing: "0.5em",
          color: GOLD(O.mid * labelT),
          textAlign: "center",
          whiteSpace: "nowrap",
          padding: `${Math.round(bridgeH * PHIi)}px 0`,
          animation: labelT > .9 ? "breathe 3.4s ease-in-out infinite" : "none",
        }}>FIND YOUR TRUTH</div>

        {/* Bottom bridge line */}
        <div style={{
          width: "1px",
          height: bridgeH,
          background: `linear-gradient(180deg, ${GOLD(O.whisper * formT)}, ${GOLD(O.ghost * formT)})`,
        }}/>

        {/* ── FORMULA — the foundation ─────────────────── */}
        <div style={{
          paddingTop: Math.round(bridgeH * PHIi2),
          paddingLeft: `clamp(${Math.round(doorW * PHIi4)}px, 5vw, ${Math.round(doorW * PHIi2)}px)`,
          paddingRight: `clamp(${Math.round(doorW * PHIi4)}px, 5vw, ${Math.round(doorW * PHIi2)}px)`,
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Formula sys={sys} t={formT}/>
        </div>
      </div>

      </div>{/* end content wrapper */}

      {/* Vignette — fixed */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:`radial-gradient(ellipse at center,
          transparent ${Math.round(PHIi3*100)}%,
          rgba(0,0,0,${O.dim}) ${Math.round(PHIi*100)}%,
          rgba(0,0,0,${O.pres}) 100%)`,
      }}/>

      {/* Grain — fixed */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", opacity: O.whisper, zIndex:0,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:"256px 256px",
      }}/>

      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: ${O.mid}; }
          50%       { opacity: ${O.pres}; }
        }
      `}</style>
    </div>
  );
}
