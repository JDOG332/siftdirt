/**
 * TRUTH SCREEN
 *
 * One unified composition after the 10s intro:
 *
 *   [S_eff := −log F_gated − log C_eff − log D̂]  ——  [Ψ = R₁₂ × (C_eff · D̂)]
 *                         EQUAL
 *
 *   "Truth is found by removing noise, watching without blinking,
 *    and holding reality from three angles until it can't slip away."
 *
 *                     [ ARCH DOOR ]
 *                    FIND YOUR TRUTH
 *
 * Click the door → particles scatter → 3 doors rise
 *
 * TIMELINE (single continuous breath):
 *   0.0 – 0.8s   fade from black
 *   0.4 – 3.5s   equation assembles (left terms → funnel → right terms)
 *   3.5 – 5.5s   EQUAL rises
 *   5.0 – 7.5s   quote rises phrase by phrase
 *   7.2 – 9.0s   door materializes
 *   9.0s+         everything holds and breathes
 */

import { useEffect, useRef, useState } from "react";

const PHI   = 1.6180339887;
const PHIi  = 0.6180339887;
const PHIi2 = 0.3819660113;

const CINZEL = "'Cinzel', serif";
const CORRO  = "'Cormorant Garamond', Georgia, serif";
const GOLD   = a => `rgba(201,168,76,${a})`;
const GOLDB  = a => `rgba(235,205,110,${a})`;
const BLUE   = a => `rgba(120,185,245,${a})`;
const BLUEDIM= a => `rgba(160,210,255,${a})`;
const SILVER = a => `rgba(210,210,225,${a})`;

function sm(t){ t=Math.max(0,Math.min(1,t)); return t*t*t*(t*(t*6-15)+10); }
function eo(t){ return 1-Math.pow(1-Math.max(0,Math.min(1,t)),3); }
function eio(t){ t=Math.max(0,Math.min(1,t)); return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }

// Clamp helper
const cl = (min,vw,max) => `clamp(${min}px,${vw}vw,${max}px)`;

// ── Particle dissolve canvas ─────────────────────────────────────
function Dissolve({ W, H, active }) {
  const cvRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const cv = cvRef.current; if (!cv) return;
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    const pts = Array.from({length:320}, () => {
      const a = Math.random()*Math.PI*2, s = 2+Math.random()*6;
      return {
        x: W/2+(Math.random()-.5)*W*.65,
        y: H/2+(Math.random()-.5)*H*.65,
        vx: Math.cos(a)*s, vy: Math.sin(a)*s-1.4,
        sz: 1+Math.random()*3,
        al: .5+Math.random()*.5,
        dc: .013+Math.random()*.022,
        gold: Math.random()>.32,
      };
    });
    function loop(){
      ctx.clearRect(0,0,W,H);
      let alive=false;
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=.05; p.vx*=.99; p.al-=p.dc;
        if(p.al>0){
          alive=true;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.sz*p.al,0,Math.PI*2);
          ctx.fillStyle = p.gold ? GOLD(p.al) : `rgba(120,170,230,${p.al*.65})`;
          ctx.fill();
        }
      });
      if(alive) rafRef.current=requestAnimationFrame(loop);
    }
    rafRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[active,W,H]);
  if(!active) return null;
  return <canvas ref={cvRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:200}}/>;
}

// ── Sacred geometry ornament ─────────────────────────────────────
function Ornament({ size, alpha=1 }) {
  const r=size/2, r2=r*PHIi, r3=r*PHIi2;
  const petals=Array.from({length:6},(_,i)=>{
    const a=(i/6)*Math.PI*2;
    const cx=r+Math.cos(a)*r3, cy=r+Math.sin(a)*r3;
    return `M${cx} ${cy} m-${r3} 0 a${r3} ${r3} 0 1 0 ${r3*2} 0 a${r3} ${r3} 0 1 0-${r3*2} 0`;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{opacity:alpha,overflow:"visible",display:"block"}}>
      <circle cx={r} cy={r} r={r*.92} fill="none" stroke={GOLD(.2)} strokeWidth=".5"/>
      {petals.map((d,i)=><path key={i} d={d} fill="none" stroke={GOLD(.26)} strokeWidth=".4"/>)}
      {[0,1,2,3,4,5].map(i=>{
        const a=(i/6)*Math.PI*2;
        return <line key={i}
          x1={r+Math.cos(a)*r2} y1={r+Math.sin(a)*r2}
          x2={r+Math.cos(a+Math.PI)*r2} y2={r+Math.sin(a+Math.PI)*r2}
          stroke={GOLD(.14)} strokeWidth=".4"/>;
      })}
      <circle cx={r} cy={r} r={r2} fill="none" stroke={GOLD(.2)} strokeWidth=".5"/>
      <circle cx={r} cy={r} r={r3} fill="none" stroke={GOLD(.26)} strokeWidth=".4"/>
      <circle cx={r} cy={r} r={3.5} fill={GOLD(.55)}/>
      {[0,Math.PI/2,Math.PI,3*Math.PI/2].map((a,i)=>(
        <line key={i}
          x1={r+Math.cos(a)*r3} y1={r+Math.sin(a)*r3}
          x2={r+Math.cos(a)*r*.88} y2={r+Math.sin(a)*r*.88}
          stroke={GOLD(.3)} strokeWidth=".6"/>
      ))}
    </svg>
  );
}

// ── Arch door ────────────────────────────────────────────────────
function Door({ w, h, alpha, onClick }) {
  const [hover,setHover]=useState(false);
  const hA=hover?1:0;
  const archH=w*PHIi;
  const m=w*.09;
  const ornSz=w*PHIi*.88;

  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      onClick={onClick}
      style={{
        position:"relative", width:w, height:h,
        cursor:"pointer", opacity:alpha, flexShrink:0,
        transform:`scale(${hover?1+PHIi2*.04:1})`,
        transition:`transform ${PHIi}s cubic-bezier(.23,1,.32,1), opacity .8s ease`,
      }}
    >
      {/* Glow */}
      <div style={{
        position:"absolute", inset:-16, pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 40%,
          ${GOLD(.1+hA*.09)} 0%, transparent 68%)`,
        borderRadius:`${w}px ${w}px 0 0`,
      }}/>

      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
        style={{position:"absolute",inset:0,display:"block"}}>
        <defs>
          <linearGradient id="dg-truth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(10,12,32,.98)"/>
            <stop offset="100%" stopColor="rgba(3,4,14,.99)"/>
          </linearGradient>
        </defs>
        <path d={`M0 ${archH} Q0 0 ${w/2} 0 Q${w} 0 ${w} ${archH}
                  L${w} ${h} L0 ${h} L0 ${archH}Z`}
          fill="url(#dg-truth)"/>
        <path d={`M1.5 ${archH} Q1.5 1.5 ${w/2} 1.5
                  Q${w-1.5} 1.5 ${w-1.5} ${archH}
                  L${w-1.5} ${h} L1.5 ${h} L1.5 ${archH}Z`}
          fill="none" stroke={GOLD(.3+hA*.25)} strokeWidth="1.1"/>
        {(()=>{
          const iaH=archH*PHIi, mt=archH*.35;
          return <path d={`M${m} ${mt+iaH} Q${m} ${mt} ${w/2} ${mt}
                            Q${w-m} ${mt} ${w-m} ${mt+iaH}
                            L${w-m} ${h*.87} L${m} ${h*.87} L${m} ${mt+iaH}Z`}
            fill="none" stroke={GOLD(.14+hA*.14)} strokeWidth=".5"/>;
        })()}
        {[[w*PHIi2,h*PHIi],[w*(1-PHIi2),h*PHIi],[w*PHIi2,h*.88],[w*(1-PHIi2),h*.88]]
          .map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.8" fill={GOLD(.26+hA*.18)}/>)}
        <line x1={w*.1} y1={h*PHIi} x2={w*.9} y2={h*PHIi}
          stroke={GOLD(.1+hA*.08)} strokeWidth=".4"/>
        <circle cx={w*.68} cy={h*.52} r="3.5"
          fill="none" stroke={GOLD(.35+hA*.28)} strokeWidth=".7"/>
        <circle cx={w*.68} cy={h*.52} r="1.4" fill={GOLD(.35+hA*.28)}/>
        <circle cx={w*.5} cy={h*.72} r="2.8"
          fill="none" stroke={GOLD(.18+hA*.18)} strokeWidth=".5"/>
        <line x1={w*.5} y1={h*.72+2.8} x2={w*.5} y2={h*.72+8}
          stroke={GOLD(.18+hA*.18)} strokeWidth=".5"/>
      </svg>

      <div style={{
        position:"absolute", top:archH*.38,
        left:"50%", transform:"translateX(-50%)",
        pointerEvents:"none",
      }}>
        <Ornament size={ornSz} alpha={.5+hA*.3}/>
      </div>
    </div>
  );
}

// ── Funnel canvas (runs behind equation center) ──────────────────
function FunnelCanvas({ W, H, funnelT, elapsed }) {
  const cvRef = useRef(null);
  useEffect(()=>{
    const cv = cvRef.current; if(!cv) return;
    cv.width=W; cv.height=H;
  },[W,H]);

  useEffect(()=>{
    const cv = cvRef.current; if(!cv) return;
    const ctx = cv.getContext("2d");
    ctx.clearRect(0,0,W,H);
    if(funnelT<=0) return;

    const te = eo(funnelT);
    const cx=W/2, cy=H*.36; // equation sits at 36% of screen height
    const fW=Math.min(W*.22,160)*te;
    const fH=Math.min(H*.07,42);
    const streams=18;

    for(let i=0;i<streams;i++){
      const frac=i/streams;
      const yOff=(frac-.5)*fH*2;
      const flow=((elapsed*.0011)+frac)%1;
      const sA=te*(.1+Math.sin(flow*Math.PI)*.16);

      const x0=cx-fW-24, y0=cy+yOff;
      const x1=cx-12,    y1=cy+yOff*.07;
      const gL=ctx.createLinearGradient(x0,y0,x1,y1);
      gL.addColorStop(0,`rgba(80,140,210,0)`);
      gL.addColorStop(.6,`rgba(130,185,255,${sA})`);
      gL.addColorStop(1,`rgba(200,225,255,${sA*.35})`);
      ctx.beginPath(); ctx.moveTo(x0,y0);
      ctx.bezierCurveTo(x0+fW*.35,y0, x1-20,y1, x1,y1);
      ctx.strokeStyle=gL; ctx.lineWidth=.5+Math.sin(flow*Math.PI*2)*.2; ctx.stroke();

      const x2=cx+12, y2=cy+yOff*.07;
      const x3=cx+fW+24, y3=cy+yOff*1.3;
      const gR=ctx.createLinearGradient(x2,y2,x3,y3);
      gR.addColorStop(0,`rgba(201,168,76,${sA*.35})`);
      gR.addColorStop(.4,`rgba(220,190,100,${sA})`);
      gR.addColorStop(1,`rgba(201,168,76,0)`);
      ctx.beginPath(); ctx.moveTo(x2,y2);
      ctx.bezierCurveTo(x2+20,y2, x3-fW*.35,y3, x3,y3);
      ctx.strokeStyle=gR; ctx.lineWidth=.5+Math.sin((flow+.5)*Math.PI*2)*.2; ctx.stroke();
    }

    // Throat
    const tA=te*(.45+Math.sin(elapsed*.004)*.14);
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,24*te);
    g.addColorStop(0,`rgba(255,255,255,${tA})`);
    g.addColorStop(.35,`rgba(180,215,255,${tA*.4})`);
    g.addColorStop(1,"rgba(100,160,220,0)");
    ctx.beginPath(); ctx.arc(cx,cy,24*te,0,Math.PI*2);
    ctx.fillStyle=g; ctx.fill();
  });

  return (
    <canvas ref={cvRef} style={{
      position:"absolute", inset:0,
      width:"100%", height:"100%",
      pointerEvents:"none",
    }}/>
  );
}

// ── Quote phrases ────────────────────────────────────────────────
const PHRASES = [
  "Truth is found",
  "by removing noise,",
  "watching without blinking,",
  "and holding reality from three angles",
  "until it can't slip away.",
];

// ── 50/50 random side doors ──────────────────────────────────────
const FLIP = Math.random() < .5;
const DOOR_DEFS = FLIP
  ? [
      {label:"PAPER", sublabel:"where we are",     href:"https://educationrevelation.com", delay:.14},
      {label:"POEMS", sublabel:"see our truth",     href:"https://educationrevelation.com", delay:0},
      {label:"PROOF", sublabel:"where we've been",  href:"https://educationrevelation.com", delay:.14},
    ]
  : [
      {label:"PROOF", sublabel:"where we've been",  href:"https://educationrevelation.com", delay:.14},
      {label:"POEMS", sublabel:"see our truth",     href:"https://educationrevelation.com", delay:0},
      {label:"PAPER", sublabel:"where we are",      href:"https://educationrevelation.com", delay:.14},
    ];

// ── Three doors screen ───────────────────────────────────────────
function ThreeDoors({ t, W, H }) {
  const isMobile = W < 640;
  const headT = eo(Math.max(0,(t-.08)/.42));

  let sideW, centerW;
  if(isMobile){
    centerW=Math.min(W*.5,170); sideW=Math.round(centerW*PHIi);
  } else {
    const usable=Math.min(W*.85,800);
    sideW=Math.round(usable/(2+PHI+2*PHIi));
    centerW=Math.round(sideW*PHI);
  }
  const sideH=Math.round(sideW*PHI*PHI);
  const centerH=Math.round(centerW*PHI*PHI);
  const doorGap=isMobile?Math.round(sideW*PHIi*.45):Math.round(sideW*PHIi);
  const labelFS=`clamp(9px,${(sideW*.078).toFixed(1)}px,14px)`;
  const subFS=`clamp(7px,${(sideW*.062).toFixed(1)}px,11px)`;
  const headFS=isMobile?"clamp(8px,2.8vw,11px)":"clamp(9px,1vw,12px)";

  return (
    <div style={{
      position:"fixed",inset:0,
      display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      background:"rgba(3,3,10,.97)",
      gap:isMobile?Math.round(centerW*PHIi2*.8):Math.round(centerW*PHIi2),
      padding:`0 clamp(12px,3vw,28px) clamp(16px,3vh,32px)`,
      boxSizing:"border-box",
    }}>
      <div style={{
        position:"absolute",inset:0,pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 48%,${GOLD(.05)} 0%,transparent 56%)`,
      }}/>

      <div style={{
        fontFamily:CINZEL, fontSize:headFS,
        letterSpacing:"0.55em", color:GOLD(.38*headT),
        opacity:headT, transform:`translateY(${(1-headT)*8}px)`,
        textAlign:"center", whiteSpace:"nowrap",
      }}>CHOOSE YOUR PATH</div>

      <div style={{
        display:"flex",
        flexDirection:isMobile?"column":"row",
        alignItems:isMobile?"center":"flex-end",
        justifyContent:"center",
        gap:doorGap,
      }}>
        {DOOR_DEFS.map(door=>{
          const isC=door.label==="POEMS";
          const dW=isC?centerW:sideW;
          const dH=isC?centerH:sideH;
          const dt=eo(Math.max(0,(t-door.delay)/.52));
          return (
            <div key={door.label} style={{
              display:"flex",flexDirection:"column",
              alignItems:"center",
              gap:Math.round(dW*PHIi2*.85),
              opacity:dt,
              transform:`translateY(${(1-dt)*36}px)`,
            }}>
              <Door w={dW} h={dH} alpha={1}
                onClick={()=>window.open(door.href,"_blank")}/>
              <div style={{
                fontFamily:CINZEL, fontSize:labelFS,
                letterSpacing:"0.42em",
                color:GOLD(isC?.78:.52),
                textAlign:"center", whiteSpace:"nowrap",
                textShadow:isC?`0 0 28px ${GOLD(.18)}`:"none",
              }}>{door.label}</div>
              <div style={{
                fontFamily:CORRO, fontStyle:"italic",
                fontSize:subFS, letterSpacing:"0.2em",
                color:SILVER(isC?.52:.36),
                textAlign:"center", whiteSpace:"nowrap",
                marginTop:-Math.round(dW*PHIi2*.45),
              }}>{door.sublabel}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        position:"absolute",inset:0,pointerEvents:"none",
        background:"radial-gradient(ellipse at center,transparent 36%,rgba(0,0,0,.44) 70%,rgba(0,0,0,.9) 100%)",
      }}/>
    </div>
  );
}

// ── MAIN TRUTH SCREEN ────────────────────────────────────────────
const TOTAL = 28000; // 28 seconds total (holds at end)

export default function TruthScreen({ onComplete }) {
  const [elapsed, setElapsed] = useState(0);
  const [phase,   setPhase]   = useState("truth"); // truth | dissolving | three
  const [dissolve, setDissolve] = useState(false);
  const [threeT,   setThreeT]  = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);
  const doneRef  = useRef(false);
  const [dims, setDims] = useState({W:window.innerWidth,H:window.innerHeight});
  const isMobile = dims.W < 640;

  useEffect(()=>{
    const fn=()=>setDims({W:window.innerWidth,H:window.innerHeight});
    window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);

  // Main timeline
  useEffect(()=>{
    if(phase!=="truth") return;
    function loop(now){
      if(!startRef.current) startRef.current=now;
      const e=now-startRef.current;
      setElapsed(e);
      rafRef.current=requestAnimationFrame(loop);
    }
    rafRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[phase]);

  // Three doors animation
  useEffect(()=>{
    if(phase!=="three") return;
    let s=null;
    function loop(now){
      if(!s)s=now;
      setThreeT(Math.min(1,(now-s)/1700));
      rafRef.current=requestAnimationFrame(loop);
    }
    rafRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[phase]);

  const handleDoorClick = () => {
    if(phase!=="truth") return;
    setPhase("dissolving"); setDissolve(true);
    setTimeout(()=>{ setDissolve(false); setPhase("three"); }, 950);
  };

  const {W,H} = dims;

  // ── DISSOLVING ────────────────────────────────────────────────
  if(phase==="dissolving"){
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(3,3,10,.95)"}}>
        <Dissolve W={W} H={H} active={dissolve}/>
      </div>
    );
  }

  // ── THREE DOORS ───────────────────────────────────────────────
  if(phase==="three"){
    return <ThreeDoors t={threeT} W={W} H={H}/>;
  }

  // ── TRUTH SCREEN (equation + quote + door) ────────────────────
  const t = elapsed / 1000; // seconds

  // Phase anchors (seconds)
  const EQ_START  = .4;
  const EQ_DUR    = 3.2;   // equation fully assembled by ~3.6s
  const EQL_START = 3.2;   // EQUAL
  const QT_START  = 4.8;   // quote
  const QT_DUR    = 2.6;
  const DR_START  = 7.0;   // door

  // Equation left terms
  const lBase = EQ_START;
  const lStep = EQ_DUR / 5;
  const t1L = sm(Math.max(0,(t-lBase)         / lStep));
  const t2L = sm(Math.max(0,(t-lBase-lStep)   / lStep));
  const t3L = sm(Math.max(0,(t-lBase-lStep*2) / lStep));
  const t4L = sm(Math.max(0,(t-lBase-lStep*3) / lStep));

  // Funnel
  const funnelT = sm(Math.max(0,(t-(EQ_START+EQ_DUR*.45)) / (EQ_DUR*.35)));

  // Equation right terms
  const rBase = EQ_START + EQ_DUR * .55;
  const t1R = sm(Math.max(0,(t-rBase)          / (EQ_DUR*.22)));
  const t2R = sm(Math.max(0,(t-rBase-.55)      / (EQ_DUR*.22)));
  const t3R = sm(Math.max(0,(t-rBase-1.1)      / (EQ_DUR*.22)));

  // EQUAL
  const equalT = eo(Math.max(0,(t-EQL_START)/.9));

  // Quote phrases
  const qT = (t-QT_START) / QT_DUR;
  const phraseTs = PHRASES.map((_,i) => eo(Math.max(0,(qT - i*.16)/.35)));

  // Door
  const doorT = eo(Math.max(0,(t-DR_START)/1.4));

  // Fade in from black
  const fadeIn = eo(Math.min(1,t/.8));

  // Responsive sizes
  // Equation font: scales with vw
  const eqMainFS  = isMobile ? cl(10,3.8,18)  : cl(13,1.7,22);   // left terms
  const eqPsiFS   = isMobile ? cl(28,9,44)    : cl(36,4.5,56);    // Ψ
  const eqRightFS = isMobile ? cl(13,4.2,21)  : cl(17,2.1,28);    // R₁₂ ×(...)
  const equalFS   = isMobile ? cl(20,6,30)    : cl(26,3.2,40);    // EQUAL
  const quoteMainFS = isMobile ? cl(14,4.2,22) : cl(16,1.9,24);   // first phrase
  const quoteSubFS  = isMobile ? cl(11,3.4,17) : cl(12,1.45,18);  // rest

  // Door size — proportional, smaller than old full-screen
  const doorW = isMobile ? Math.min(W*.44, 150) : Math.min(W*.18, 160);
  const doorH = Math.round(doorW*PHI*PHI);

  // Gap between sections — PHI-based fraction of viewport height
  const secGap = isMobile
    ? `clamp(16px,3.2vh,28px)`
    : `clamp(20px,3.5vh,38px)`;

  const subSz = ".58em";

  return (
    <div style={{
      position:"fixed", inset:0,
      background:"#03030a",
      opacity:fadeIn,
    }}>
      {/* Funnel canvas layer */}
      <FunnelCanvas W={W} H={H} funnelT={funnelT} elapsed={elapsed}/>

      {/* Gold radial glow (grows as Ψ assembles) */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 36%,
          ${GOLD(t1R*.04)} 0%, transparent 55%)`,
      }}/>

      {/* ── CONTENT STACK ─────────────────────────────────── */}
      <div style={{
        position:"relative", zIndex:10,
        height:"100%",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        gap:secGap,
        padding:isMobile?"0 16px":"0 clamp(20px,5vw,80px)",
        boxSizing:"border-box",
      }}>

        {/* ── EQUATION ──────────────────────────────────── */}
        <div style={{
          display:"flex",
          flexDirection:isMobile?"column":"row",
          alignItems:"center",
          justifyContent:"center",
          gap:isMobile?"4px":"clamp(6px,1vw,16px)",
          flexWrap:"nowrap",
          width:"100%",
        }}>

          {/* LEFT: S_eff := -log F_gated -log C_eff -log D̂ */}
          <div style={{
            display:"flex",
            flexDirection:isMobile?"column":"row",
            alignItems:isMobile?"flex-end":"baseline",
            gap:isMobile?"2px":"clamp(3px,.5vw,8px)",
            opacity:t1L,
          }}>
            {/* S_eff := */}
            <span style={{
              fontFamily:CORRO, fontStyle:"italic",
              fontSize:eqMainFS,
              color:BLUE(t1L),
              whiteSpace:"nowrap",
            }}>
              S<sub style={{fontSize:subSz}}>eff</sub>
              <span style={{fontStyle:"normal",margin:"0 .3em",color:BLUEDIM(t1L)}}>:=</span>
            </span>

            {/* log terms */}
            {[
              [t2L, <>−&thinsp;log F<sub style={{fontSize:subSz}}>gated</sub></>],
              [t3L, <>−&thinsp;log C<sub style={{fontSize:subSz}}>eff</sub></>],
              [t4L, <>−&thinsp;log D̂</>],
            ].map(([ti,content],i)=>(
              <span key={i} style={{
                fontFamily:CORRO, fontStyle:"italic",
                fontSize:eqMainFS,
                color:BLUE(ti*.9),
                opacity:ti,
                transform:`translateY(${(1-ti)*5}px)`,
                whiteSpace:"nowrap",
              }}>{content}</span>
            ))}
          </div>

          {/* FUNNEL label (desktop only) */}
          {!isMobile && funnelT > .3 && (
            <div style={{
              fontFamily:CINZEL,
              fontSize:"clamp(7px,.75vw,9px)",
              letterSpacing:"0.32em",
              color:`rgba(160,205,245,${eo((funnelT-.3)/.7)*.6})`,
              textAlign:"center", lineHeight:1.55,
              flexShrink:0,
              padding:"0 clamp(6px,.8vw,12px)",
            }}>
              LOGARITHMIC<br/>TRANSFORMATION
            </div>
          )}

          {/* RIGHT: Ψ = R₁₂ × (C_eff · D̂) */}
          <div style={{
            display:"flex", flexDirection:"row",
            alignItems:"center",
            gap:"clamp(3px,.4vw,7px)",
            opacity:t1R,
          }}>
            <span style={{
              fontFamily:CORRO, fontStyle:"italic",
              fontSize:eqPsiFS,
              color:GOLDB(t1R),
              lineHeight:1,
              display:"inline-block",
              transform:`scale(${.85+t1R*.15})`,
              textShadow:`0 0 50px ${GOLD(t1R*.6)},0 0 100px ${GOLD(t1R*.25)}`,
              letterSpacing:2,
            }}>Ψ</span>
            <span style={{
              fontFamily:CORRO,fontStyle:"normal",
              fontSize:eqRightFS,
              color:GOLD(t1R*.7),
              margin:"0 clamp(3px,.4vw,8px)",
            }}>=</span>
            <span style={{
              fontFamily:CORRO, fontStyle:"italic",
              fontSize:eqRightFS,
              color:GOLD(t2R*.9),
              opacity:t2R,
              transform:`translateX(${(1-t2R)*10}px)`,
              whiteSpace:"nowrap",
              textShadow:`0 0 28px ${GOLD(t2R*.28)}`,
            }}>
              R<sub style={{fontSize:subSz}}>12</sub>
              <span style={{fontStyle:"normal",margin:"0 clamp(3px,.4vw,7px)",color:GOLD(t2R*.6)}}>×</span>
            </span>
            <span style={{
              fontFamily:CORRO, fontStyle:"italic",
              fontSize:eqRightFS,
              color:GOLD(t3R*.9),
              opacity:t3R,
              transform:`translateX(${(1-t3R)*10}px)`,
              whiteSpace:"nowrap",
              textShadow:`0 0 28px ${GOLD(t3R*.28)}`,
            }}>
              <span style={{color:GOLD(t3R*.45),fontStyle:"normal"}}>(</span>
              C<sub style={{fontSize:subSz}}>eff</sub>
              <span style={{margin:"0 clamp(2px,.3vw,5px)",color:GOLD(t3R*.6)}}>·</span>
              D̂
              <span style={{color:GOLD(t3R*.45),fontStyle:"normal"}}>)</span>
            </span>
          </div>
        </div>

        {/* EQUAL */}
        {equalT > 0 && (
          <div style={{
            fontFamily:CINZEL, fontSize:equalFS,
            letterSpacing:"0.42em",
            color:SILVER(equalT*.82),
            textShadow:`0 0 55px rgba(180,200,230,${equalT*.1})`,
            opacity:equalT,
            transform:`translateY(${(1-equalT)*18}px)`,
            marginTop:isMobile?-8:-12,
          }}>EQUAL</div>
        )}

        {/* Thin divider — appears after EQUAL */}
        {equalT > .6 && (
          <div style={{
            width:`clamp(40px,${equalT*12}vw,100px)`,
            height:"1px",
            background:`linear-gradient(90deg,transparent,${GOLD(equalT*.25)},transparent)`,
            marginTop:isMobile?-8:-12,
          }}/>
        )}

        {/* ── QUOTE ────────────────────────────────────── */}
        <div style={{
          display:"flex", flexDirection:"column",
          alignItems:"center",
          gap:isMobile?"6px":"clamp(5px,1vh,10px)",
          textAlign:"center",
          maxWidth:isMobile?"100%":"clamp(320px,55vw,640px)",
        }}>
          {PHRASES.map((p,i)=>(
            <div key={i} style={{
              fontFamily:CORRO, fontStyle:"italic", fontWeight:300,
              fontSize:i===0?quoteMainFS:quoteSubFS,
              letterSpacing:i===0?"0.06em":"0.03em",
              lineHeight:1.5,
              color:i===0?`rgba(232,232,240,${phraseTs[i]*.88})`:`rgba(200,200,218,${phraseTs[i]*.62})`,
              opacity:phraseTs[i],
              transform:`translateY(${(1-phraseTs[i])*10}px)`,
              textShadow:i===0?`0 0 55px ${GOLD(phraseTs[i]*.07)}`:"none",
            }}>{p}</div>
          ))}
        </div>

        {/* ── DOOR ─────────────────────────────────────── */}
        {doorT > 0 && (
          <div style={{
            display:"flex", flexDirection:"column",
            alignItems:"center",
            gap:Math.round(doorW*PHIi2*.9),
          }}>
            <Door
              w={doorW} h={doorH}
              alpha={doorT}
              onClick={handleDoorClick}
            />
            <div style={{
              fontFamily:CINZEL,
              fontSize:isMobile?cl(8,2.5,11):cl(8,.95,11),
              letterSpacing:"0.5em",
              color:GOLD(doorT*.42),
              animation:"breathe 3.4s ease-in-out infinite",
              whiteSpace:"nowrap",
            }}>FIND YOUR TRUTH</div>
          </div>
        )}
      </div>

      {/* Vignette */}
      <div style={{
        position:"absolute",inset:0,pointerEvents:"none",
        background:"radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,.38) 68%,rgba(0,0,0,.8) 100%)",
      }}/>

      {/* Grain */}
      <div style={{
        position:"absolute",inset:0,pointerEvents:"none",opacity:.024,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:"256px 256px",
      }}/>

      <style>{`@keyframes breathe{0%,100%{opacity:.3}50%{opacity:.85}}`}</style>
    </div>
  );
}
