/**
 * DOOR SCENE — golden ratio throughout
 * PHI = 1.618  |  All sizes, gaps, fonts derived from PHI ladder
 *
 * States: idle → expanding → open → dissolving → three
 * POEMS always center. PAPER & PROOF 50/50 random sides each load.
 */

import { useState, useEffect, useRef, useCallback } from "react";

const PHI   = 1.6180339887;
const PHIi  = 0.6180339887;   // 1/PHI
const PHIi2 = 0.3819660113;   // 1/PHI²

const CINZEL = "'Cinzel', serif";
const CORRO  = "'Cormorant Garamond', Georgia, serif";
const GOLD   = a => `rgba(201,168,76,${a})`;
const GOLDB  = a => `rgba(235,205,110,${a})`;
const SILVER = a => `rgba(210,210,225,${a})`;

function easeOut(t)   { return 1-Math.pow(1-Math.max(0,Math.min(1,t)),3); }
function easeInOut(t) { t=Math.max(0,Math.min(1,t)); return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }

// ── 50/50 random sides, computed once per page load ─────────────
const FLIP = Math.random() < 0.5;
const DOOR_DEFS = FLIP
  ? [
      {label:"PAPER", sublabel:"where we are",     href:"https://educationrevelation.com", delay:0.14},
      {label:"POEMS", sublabel:"see our truth",     href:"https://educationrevelation.com", delay:0},
      {label:"PROOF", sublabel:"where we've been",  href:"https://educationrevelation.com", delay:0.14},
    ]
  : [
      {label:"PROOF", sublabel:"where we've been",  href:"https://educationrevelation.com", delay:0.14},
      {label:"POEMS", sublabel:"see our truth",     href:"https://educationrevelation.com", delay:0},
      {label:"PAPER", sublabel:"where we are",      href:"https://educationrevelation.com", delay:0.14},
    ];

// ── Sacred geometry ornament ────────────────────────────────────
function Ornament({ size, alpha=1 }) {
  const r=size/2, r2=r*PHIi, r3=r*PHIi2;
  const petals = Array.from({length:6},(_,i)=>{
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
        return <line key={i} x1={r+Math.cos(a)*r2} y1={r+Math.sin(a)*r2}
          x2={r+Math.cos(a+Math.PI)*r2} y2={r+Math.sin(a+Math.PI)*r2}
          stroke={GOLD(.14)} strokeWidth=".4"/>;
      })}
      <circle cx={r} cy={r} r={r2} fill="none" stroke={GOLD(.2)} strokeWidth=".5"/>
      <circle cx={r} cy={r} r={r3} fill="none" stroke={GOLD(.26)} strokeWidth=".4"/>
      <circle cx={r} cy={r} r={3.5} fill={GOLD(.55)}/>
      {[0,Math.PI/2,Math.PI,3*Math.PI/2].map((a,i)=>(
        <line key={i} x1={r+Math.cos(a)*r3} y1={r+Math.sin(a)*r3}
          x2={r+Math.cos(a)*r*.88} y2={r+Math.sin(a)*r*.88}
          stroke={GOLD(.3)} strokeWidth=".6"/>
      ))}
    </svg>
  );
}

// ── Arch door ────────────────────────────────────────────────────
function ArchDoor({ w, h, isCenter, glowAlpha=0, onClick }) {
  const [hover, setHover] = useState(false);
  const hA = hover ? 1 : 0;
  const archH = w * PHIi;   // arch height = w × 0.618 — golden
  const m     = w * 0.09;
  const ornSz = w * PHIi * .88;

  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      onClick={onClick}
      style={{
        position:"relative", width:w, height:h,
        cursor:"pointer", flexShrink:0,
        transform:`scale(${hover?1+PHIi2*.04:1})`,
        transition:`transform ${PHIi}s cubic-bezier(.23,1,.32,1)`,
      }}
    >
      {/* Glow */}
      <div style={{
        position:"absolute", inset:-14, pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 40%,
          ${GOLD(glowAlpha+hA*.08)} 0%, transparent 68%)`,
        borderRadius:`${w}px ${w}px 0 0`,
      }}/>

      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
        style={{position:"absolute",inset:0,display:"block"}}>
        <defs>
          <linearGradient id={`dg${isCenter?1:0}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={isCenter?"rgba(10,12,32,.98)":"rgba(7,9,24,.98)"}/>
            <stop offset="100%" stopColor="rgba(3,4,14,.99)"/>
          </linearGradient>
        </defs>

        {/* Fill */}
        <path d={`M0 ${archH} Q0 0 ${w/2} 0 Q${w} 0 ${w} ${archH}
                  L${w} ${h} L0 ${h} L0 ${archH}Z`}
          fill={`url(#dg${isCenter?1:0})`}/>

        {/* Outer frame */}
        <path d={`M1.5 ${archH} Q1.5 1.5 ${w/2} 1.5
                  Q${w-1.5} 1.5 ${w-1.5} ${archH}
                  L${w-1.5} ${h} L1.5 ${h} L1.5 ${archH}Z`}
          fill="none" stroke={GOLD(.28+hA*.22)} strokeWidth={isCenter?"1.1":".9"}/>

        {/* Inner panel */}
        {(()=>{
          const iaH=archH*PHIi, mt=archH*.35;
          return <path d={`M${m} ${mt+iaH} Q${m} ${mt} ${w/2} ${mt}
                            Q${w-m} ${mt} ${w-m} ${mt+iaH}
                            L${w-m} ${h*.87} L${m} ${h*.87} L${m} ${mt+iaH}Z`}
            fill="none" stroke={GOLD(.13+hA*.13)} strokeWidth=".5"/>;
        })()}

        {/* Corner dots */}
        {[[w*PHIi2,h*PHIi],[w*(1-PHIi2),h*PHIi],[w*PHIi2,h*.88],[w*(1-PHIi2),h*.88]]
          .map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.8" fill={GOLD(.26+hA*.18)}/>)}

        {/* Horizontal divider at PHI of height */}
        <line x1={w*.1} y1={h*PHIi} x2={w*.9} y2={h*PHIi}
          stroke={GOLD(.1+hA*.08)} strokeWidth=".4"/>

        {/* Handle */}
        <circle cx={w*.68} cy={h*.52} r="3.5"
          fill="none" stroke={GOLD(.33+hA*.28)} strokeWidth=".7"/>
        <circle cx={w*.68} cy={h*.52} r="1.4" fill={GOLD(.33+hA*.28)}/>

        {/* Keyhole */}
        <circle cx={w*.5} cy={h*.72} r="2.8"
          fill="none" stroke={GOLD(.16+hA*.18)} strokeWidth=".5"/>
        <line x1={w*.5} y1={h*.72+2.8} x2={w*.5} y2={h*.72+8}
          stroke={GOLD(.16+hA*.18)} strokeWidth=".5"/>
      </svg>

      {/* Ornament */}
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

// ── Dissolve canvas ──────────────────────────────────────────────
function Dissolve({ W, H, active }) {
  const canvasRef=useRef(null), rafRef=useRef(null);
  useEffect(()=>{
    if(!active) return;
    const cv=canvasRef.current; if(!cv) return;
    cv.width=W; cv.height=H;
    const ctx=cv.getContext("2d");
    const pts=Array.from({length:300},()=>{
      const a=Math.random()*Math.PI*2, s=1.8+Math.random()*5;
      return {
        x:W/2+(Math.random()-.5)*W*.6, y:H/2+(Math.random()-.5)*H*.6,
        vx:Math.cos(a)*s, vy:Math.sin(a)*s-1.2,
        sz:1+Math.random()*3, al:.5+Math.random()*.5,
        dc:.013+Math.random()*.022, gold:Math.random()>.35,
      };
    });
    function loop(){
      ctx.clearRect(0,0,W,H);
      let alive=false;
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=.045; p.vx*=.99; p.al-=p.dc;
        if(p.al>0){
          alive=true;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.sz*p.al,0,Math.PI*2);
          ctx.fillStyle=p.gold?GOLD(p.al):`rgba(140,170,220,${p.al*.7})`;
          ctx.fill();
        }
      });
      if(alive) rafRef.current=requestAnimationFrame(loop);
    }
    rafRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[active,W,H]);
  if(!active) return null;
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:50}}/>;
}

// ── Main component ───────────────────────────────────────────────
export default function DoorScene({ visible }) {
  const [state,    setState]   = useState("idle");
  const [expandT,  setExpandT] = useState(0);
  const [threeT,   setThreeT]  = useState(0);
  const [dissolve, setDissolve]= useState(false);
  const rafRef = useRef(null);
  const [dims, setDims] = useState({W:window.innerWidth, H:window.innerHeight});
  const isMobile = dims.W < 640;

  useEffect(()=>{
    const fn=()=>setDims({W:window.innerWidth,H:window.innerHeight});
    window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);

  // Expand
  useEffect(()=>{
    if(state!=="expanding") return;
    let s=null;
    const D=1100;
    function loop(now){
      if(!s)s=now;
      const t=Math.min(1,(now-s)/D);
      setExpandT(easeInOut(t));
      if(t<1) rafRef.current=requestAnimationFrame(loop);
      else setState("open");
    }
    rafRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[state]);

  // Three
  useEffect(()=>{
    if(state!=="three") return;
    let s=null;
    const D=1700;
    function loop(now){
      if(!s)s=now;
      const t=Math.min(1,(now-s)/D);
      setThreeT(t);
      if(t<1) rafRef.current=requestAnimationFrame(loop);
    }
    rafRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[state]);

  const onButton    = useCallback(()=>setState("expanding"),[]);
  const onMainDoor  = useCallback(()=>{
    if(state!=="open") return;
    setState("dissolving"); setDissolve(true);
    setTimeout(()=>{ setDissolve(false); setState("three"); }, 950);
  },[state]);

  if(!visible) return null;

  const {W,H} = dims;

  // ── Full door dims ─────────────────────────────────────────
  const fullW = Math.min(W*.62, 440);
  const fullH = Math.round(fullW*PHI*PHI);

  // ── Three-door dims (PHI ladder) ───────────────────────────
  // centerW = sideW × PHI
  // gap     = sideW × PHIi
  // 2×sideW + centerW + 2×gap = usable
  // → sideW = usable / (2 + PHI + 2×PHIi)
  let sideW, centerW;
  if(isMobile){
    centerW = Math.min(W*.5, 170);
    sideW   = Math.round(centerW*PHIi);
  } else {
    const usable = Math.min(W*.85, 800);
    sideW   = Math.round(usable/(2+PHI+2*PHIi));
    centerW = Math.round(sideW*PHI);
  }
  const sideH   = Math.round(sideW  *PHI*PHI);
  const centerH = Math.round(centerW*PHI*PHI);
  const doorGap = isMobile
    ? Math.round(sideW*PHIi*.45)
    : Math.round(sideW*PHIi);

  // Font sizes — PHI ladder anchored to sideW
  // Label:   sideW × .078  (clamp 9–14)
  // Sublabel:sideW × .06   (clamp 7–11)
  // Heading: viewport-relative
  const labelFS  = `clamp(9px,${(sideW*.078).toFixed(1)}px,14px)`;
  const subFS    = `clamp(7px,${(sideW*.062).toFixed(1)}px,11px)`;
  const headFS   = isMobile ? "clamp(8px,2.8vw,11px)" : "clamp(9px,1vw,12px)";
  const hintFS   = isMobile ? "clamp(8px,2.4vw,10px)" : "clamp(8px,.85vw,10px)";

  // ── IDLE ───────────────────────────────────────────────────
  if(state==="idle"){
    return <TruthButton onClick={onButton}/>;
  }

  // ── EXPANDING ──────────────────────────────────────────────
  if(state==="expanding"){
    const t=expandT;
    return(
      <div onClick={e=>e.stopPropagation()} style={{
        position:"fixed",inset:0,zIndex:100,
        display:"flex",alignItems:"center",justifyContent:"center",
        background:`rgba(3,3,10,${t*.9})`,
      }}>
        <ArchDoor w={200+(fullW-200)*t} h={52+(fullH-52)*t}
          isCenter glowAlpha={t*.13} onClick={()=>{}}/>
      </div>
    );
  }

  // ── OPEN ───────────────────────────────────────────────────
  if(state==="open"){
    return(
      <div onClick={e=>e.stopPropagation()} style={{
        position:"fixed",inset:0,zIndex:100,
        display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",
        gap:Math.round(fullW*PHIi2),
        background:"rgba(3,3,10,.93)",
      }}>
        <div style={{
          position:"absolute",inset:0,pointerEvents:"none",
          background:`radial-gradient(ellipse at 50% 46%,${GOLD(.06)} 0%,transparent 62%)`,
        }}/>
        <ArchDoor w={fullW} h={fullH} isCenter glowAlpha={.12} onClick={onMainDoor}/>
        <div style={{
          fontFamily:CORRO, fontStyle:"italic",
          fontSize:hintFS, letterSpacing:"0.3em",
          color:GOLD(.32),
          animation:"breathe 3.2s ease-in-out infinite",
        }}>open the door</div>
        <div style={{
          position:"absolute",inset:0,pointerEvents:"none",
          background:"radial-gradient(ellipse at center,transparent 32%,rgba(0,0,0,.42) 68%,rgba(0,0,0,.86) 100%)",
        }}/>
        <style>{`@keyframes breathe{0%,100%{opacity:.3}50%{opacity:.85}}`}</style>
      </div>
    );
  }

  // ── DISSOLVING ─────────────────────────────────────────────
  if(state==="dissolving"){
    return(
      <div onClick={e=>e.stopPropagation()} style={{
        position:"fixed",inset:0,zIndex:100,
        background:"rgba(3,3,10,.93)",
      }}>
        <Dissolve W={W} H={H} active={dissolve}/>
      </div>
    );
  }

  // ── THREE DOORS ────────────────────────────────────────────
  if(state==="three"){
    const headT=easeOut(Math.max(0,(threeT-.08)/.42));
    return(
      <div onClick={e=>e.stopPropagation()} style={{
        position:"fixed",inset:0,zIndex:100,
        display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",
        background:"rgba(3,3,10,.97)",
        gap: isMobile
          ? Math.round(centerW*PHIi2*.8)
          : Math.round(centerW*PHIi2),
        padding:`0 clamp(12px,3vw,28px) clamp(16px,3vh,32px)`,
        boxSizing:"border-box",
      }}>

        {/* Ambient */}
        <div style={{
          position:"absolute",inset:0,pointerEvents:"none",
          background:`radial-gradient(ellipse at 50% 48%,${GOLD(.05)} 0%,transparent 56%)`,
        }}/>

        {/* Heading */}
        <div style={{
          fontFamily:CINZEL, fontSize:headFS,
          letterSpacing:"0.55em",
          color:GOLD(.38*headT),
          opacity:headT,
          transform:`translateY(${(1-headT)*8}px)`,
          textAlign:"center", whiteSpace:"nowrap",
        }}>CHOOSE YOUR PATH</div>

        {/* Doors row / column */}
        <div style={{
          display:"flex",
          flexDirection:isMobile?"column":"row",
          alignItems:isMobile?"center":"flex-end",
          justifyContent:"center",
          gap:doorGap,
        }}>
          {DOOR_DEFS.map(door=>{
            const isC = door.label==="POEMS";
            const dW  = isC ? centerW : sideW;
            const dH  = isC ? centerH : sideH;
            const dt  = easeOut(Math.max(0,(threeT-door.delay)/.52));
            return(
              <div key={door.label} style={{
                display:"flex", flexDirection:"column",
                alignItems:"center",
                gap:Math.round(dW*PHIi2*.85),
                opacity:dt,
                transform:`translateY(${(1-dt)*36}px)`,
              }}>
                <ArchDoor
                  w={dW} h={dH}
                  isCenter={isC}
                  glowAlpha={isC?.1:.05}
                  onClick={()=>window.open(door.href,"_blank")}
                />
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

        {/* Vignette */}
        <div style={{
          position:"absolute",inset:0,pointerEvents:"none",
          background:"radial-gradient(ellipse at center,transparent 36%,rgba(0,0,0,.44) 70%,rgba(0,0,0,.9) 100%)",
        }}/>
      </div>
    );
  }

  return null;
}

// ── FIND YOUR TRUTH button ───────────────────────────────────────
function TruthButton({ onClick }) {
  const [hover,setHover]=useState(false);
  return(
    <div style={{
      position:"fixed",
      bottom:`clamp(28px,5vh,52px)`,
      left:"50%", transform:"translateX(-50%)",
      zIndex:100,
    }}>
      <button
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        onClick={onClick}
        style={{
          fontFamily:CINZEL,
          fontSize:"clamp(10px,2.2vw,13px)",
          letterSpacing:"0.45em",
          color:hover?GOLDB(.95):GOLD(.65),
          padding:`clamp(12px,1.8vh,18px) clamp(28px,4vw,52px)`,
          border:`1px solid ${hover?GOLD(.45):GOLD(.18)}`,
          borderRadius:"2px",
          background:hover?GOLD(.04):"transparent",
          boxShadow:hover?`0 0 40px ${GOLD(.1)},inset 0 0 30px rgba(0,0,0,.3)`:"inset 0 0 30px rgba(0,0,0,.3)",
          transition:`all .618s cubic-bezier(.23,1,.32,1)`,
          cursor:"pointer", whiteSpace:"nowrap",
          outline:"none", display:"block",
        }}
      >FIND YOUR TRUTH</button>
    </div>
  );
}
