/**
 * TRUTH SCREEN — 9×16 portrait-first
 *
 * Layout (top → bottom):
 *   1. ARCH DOOR — fills most of the viewport
 *      · Quote inside the door body
 *      · "FIND YOUR TRUTH" label at door bottom
 *      · Sacred geometry ornament in the arch
 *   2. FORMULA — anchored at the bottom, the foundation
 *
 * Click door → particles → three doors
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

// ── Dissolve ─────────────────────────────────────────────────────
function Dissolve({ W, H, active }) {
  const cvRef=useRef(null), rafRef=useRef(null);
  useEffect(()=>{
    if(!active) return;
    const cv=cvRef.current; if(!cv) return;
    cv.width=W; cv.height=H;
    const ctx=cv.getContext("2d");
    const pts=Array.from({length:320},()=>{
      const a=Math.random()*Math.PI*2, s=2+Math.random()*6;
      return {
        x:W/2+(Math.random()-.5)*W*.65, y:H*.45+(Math.random()-.5)*H*.5,
        vx:Math.cos(a)*s, vy:Math.sin(a)*s-1.4,
        sz:1+Math.random()*3, al:.5+Math.random()*.5,
        dc:.013+Math.random()*.022, gold:Math.random()>.32,
      };
    });
    function loop(){
      ctx.clearRect(0,0,W,H); let alive=false;
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=.05; p.vx*=.99; p.al-=p.dc;
        if(p.al>0){
          alive=true;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.sz*p.al,0,Math.PI*2);
          ctx.fillStyle=p.gold?GOLD(p.al):`rgba(120,170,230,${p.al*.65})`;
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
      <circle cx={r} cy={r} r={r*.92} fill="none" stroke={GOLD(.22)} strokeWidth=".6"/>
      {petals.map((d,i)=><path key={i} d={d} fill="none" stroke={GOLD(.28)} strokeWidth=".5"/>)}
      {[0,1,2,3,4,5].map(i=>{
        const a=(i/6)*Math.PI*2;
        return <line key={i}
          x1={r+Math.cos(a)*r2} y1={r+Math.sin(a)*r2}
          x2={r+Math.cos(a+Math.PI)*r2} y2={r+Math.sin(a+Math.PI)*r2}
          stroke={GOLD(.16)} strokeWidth=".5"/>;
      })}
      <circle cx={r} cy={r} r={r2} fill="none" stroke={GOLD(.22)} strokeWidth=".6"/>
      <circle cx={r} cy={r} r={r3} fill="none" stroke={GOLD(.28)} strokeWidth=".5"/>
      <circle cx={r} cy={r} r={4}  fill={GOLD(.6)}/>
      {[0,Math.PI/2,Math.PI,3*Math.PI/2].map((a,i)=>(
        <line key={i}
          x1={r+Math.cos(a)*r3} y1={r+Math.sin(a)*r3}
          x2={r+Math.cos(a)*r*.9} y2={r+Math.sin(a)*r*.9}
          stroke={GOLD(.32)} strokeWidth=".7"/>
      ))}
    </svg>
  );
}

// ── Quote phrases ─────────────────────────────────────────────────
const PHRASES = [
  "Truth is found",
  "by removing noise,",
  "watching without blinking,",
  "and holding reality",
  "from three angles",
  "until it can't slip away.",
];

// ── 50/50 random side doors ───────────────────────────────────────
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

// ── Three doors screen ────────────────────────────────────────────
function ThreeDoors({ t, W, H }) {
  const isMobile=W<640;
  const headT=eo(Math.max(0,(t-.08)/.42));
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
    <div onClick={e=>e.stopPropagation()} style={{
      position:"fixed",inset:0,
      display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      background:"rgba(3,3,10,.97)",
      gap:isMobile?Math.round(centerW*PHIi2*.8):Math.round(centerW*PHIi2),
      padding:`0 clamp(12px,3vw,28px) clamp(16px,3vh,32px)`,
      boxSizing:"border-box",
    }}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 48%,${GOLD(.05)} 0%,transparent 56%)`}}/>
      <div style={{fontFamily:CINZEL,fontSize:headFS,letterSpacing:"0.55em",
        color:GOLD(.38*headT),opacity:headT,
        transform:`translateY(${(1-headT)*8}px)`,
        textAlign:"center",whiteSpace:"nowrap",
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
              display:"flex",flexDirection:"column",alignItems:"center",
              gap:Math.round(dW*PHIi2*.85),
              opacity:dt, transform:`translateY(${(1-dt)*36}px)`,
            }}>
              <SmallDoor w={dW} h={dH} isCenter={isC}
                onClick={()=>window.open(door.href,"_blank")}/>
              <div style={{fontFamily:CINZEL,fontSize:labelFS,letterSpacing:"0.42em",
                color:GOLD(isC?.78:.52),textAlign:"center",whiteSpace:"nowrap",
                textShadow:isC?`0 0 28px ${GOLD(.18)}`:"none"}}>{door.label}</div>
              <div style={{fontFamily:CORRO,fontStyle:"italic",fontSize:subFS,
                letterSpacing:"0.2em",color:SILVER(isC?.52:.36),
                textAlign:"center",whiteSpace:"nowrap",
                marginTop:-Math.round(dW*PHIi2*.45)}}>{door.sublabel}</div>
            </div>
          );
        })}
      </div>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:"radial-gradient(ellipse at center,transparent 36%,rgba(0,0,0,.44) 70%,rgba(0,0,0,.9) 100%)"}}/>
    </div>
  );
}

// ── Small door (three-doors screen) ──────────────────────────────
function SmallDoor({ w, h, isCenter, onClick }) {
  const [hover,setHover]=useState(false);
  const hA=hover?1:0;
  const archH=w*PHIi;
  const m=w*.09;
  const ornSz=w*PHIi*.88;
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      onClick={onClick}
      style={{position:"relative",width:w,height:h,cursor:"pointer",flexShrink:0,
        transform:`scale(${hover?1+PHIi2*.04:1})`,
        transition:`transform ${PHIi}s cubic-bezier(.23,1,.32,1)`}}>
      <div style={{position:"absolute",inset:-14,pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 40%,${GOLD(.08+hA*.09)} 0%,transparent 68%)`,
        borderRadius:`${w}px ${w}px 0 0`}}/>
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
        <path d={`M1.5 ${archH} Q1.5 1.5 ${w/2} 1.5 Q${w-1.5} 1.5 ${w-1.5} ${archH}
                  L${w-1.5} ${h} L1.5 ${h} L1.5 ${archH}Z`}
          fill="none" stroke={GOLD(.28+hA*.22)} strokeWidth={isCenter?"1.1":".9"}/>
        {(()=>{const iaH=archH*PHIi,mt=archH*.35;
          return <path d={`M${m} ${mt+iaH} Q${m} ${mt} ${w/2} ${mt}
                            Q${w-m} ${mt} ${w-m} ${mt+iaH}
                            L${w-m} ${h*.87} L${m} ${h*.87} L${m} ${mt+iaH}Z`}
            fill="none" stroke={GOLD(.13+hA*.13)} strokeWidth=".5"/>;})()}
        {[[w*PHIi2,h*PHIi],[w*(1-PHIi2),h*PHIi],[w*PHIi2,h*.88],[w*(1-PHIi2),h*.88]]
          .map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.8" fill={GOLD(.26+hA*.18)}/>)}
        <line x1={w*.1} y1={h*PHIi} x2={w*.9} y2={h*PHIi}
          stroke={GOLD(.1+hA*.08)} strokeWidth=".4"/>
        <circle cx={w*.68} cy={h*.52} r="3.5"
          fill="none" stroke={GOLD(.33+hA*.28)} strokeWidth=".7"/>
        <circle cx={w*.68} cy={h*.52} r="1.4" fill={GOLD(.33+hA*.28)}/>
        <circle cx={w*.5} cy={h*.72} r="2.8"
          fill="none" stroke={GOLD(.16+hA*.18)} strokeWidth=".5"/>
        <line x1={w*.5} y1={h*.72+2.8} x2={w*.5} y2={h*.72+8}
          stroke={GOLD(.16+hA*.18)} strokeWidth=".5"/>
      </svg>
      <div style={{position:"absolute",top:archH*.38,left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}}>
        <Ornament size={ornSz} alpha={.5+hA*.3}/>
      </div>
    </div>
  );
}

// ── BIG DOOR with quote inside ────────────────────────────────────
function BigDoor({ W, H, t, quoteT, labelT, onClick }) {
  const [hover,setHover]=useState(false);
  const hA=hover?1:0;

  // Door sizing: portrait 9:16 first
  // Width: 82vw on mobile, 42vw on desktop (capped)
  const doorW = Math.min(W * (W<640 ? .82 : .42), W<640 ? 340 : 380);
  // Height: fills up to 72vh on mobile, 78vh on desktop
  const maxH  = H * (W<640 ? .72 : .78);
  // Door height = doorW × PHI² but capped at maxH
  const doorH = Math.min(Math.round(doorW * PHI * PHI), maxH);
  const archH = doorW * PHIi;           // arch top portion
  const m     = doorW * .09;            // inner panel margin
  const ornSz = doorW * PHIi * .82;     // ornament in arch
  const fT    = eo(t);

  // Font sizes inside door — anchored to doorW
  const quoteMFS = `clamp(12px,${(doorW*.046).toFixed(1)}px,20px)`;
  const quoteOFS = `clamp(10px,${(doorW*.038).toFixed(1)}px,16px)`;
  const labelFS  = `clamp(9px,${(doorW*.034).toFixed(1)}px,13px)`;

  // Vertical space inside door for quote:
  // ornament occupies top archH. quote goes from archH+pad to bottom
  const quoteTop  = archH + doorW * .14;
  const quoteBot  = doorH * .82;
  const innerH    = quoteBot - quoteTop;

  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      onClick={onClick}
      style={{
        position:"relative",
        width:doorW, height:doorH,
        cursor:"pointer", flexShrink:0,
        opacity:fT,
        transform:`scale(${fT * (hover ? 1+PHIi2*.025 : 1)})`,
        transition:`transform ${PHIi}s cubic-bezier(.23,1,.32,1)`,
      }}
    >
      {/* Glow behind door */}
      <div style={{
        position:"absolute", inset:-20, pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 38%,
          ${GOLD(.12+hA*.08)} 0%, transparent 65%)`,
        borderRadius:`${doorW}px ${doorW}px 0 0`,
      }}/>

      {/* Door SVG frame */}
      <svg width={doorW} height={doorH} viewBox={`0 0 ${doorW} ${doorH}`}
        style={{position:"absolute",inset:0,display:"block"}}>
        <defs>
          <linearGradient id="bdg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(9,11,30,.98)"/>
            <stop offset="100%" stopColor="rgba(3,4,14,.99)"/>
          </linearGradient>
          {/* Subtle inner highlight */}
          <radialGradient id="bdglow" cx="50%" cy="30%" r="55%">
            <stop offset="0%"   stopColor={`rgba(201,168,76,${.04+hA*.03})`}/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>

        {/* Fill */}
        <path d={`M0 ${archH} Q0 0 ${doorW/2} 0 Q${doorW} 0 ${doorW} ${archH}
                  L${doorW} ${doorH} L0 ${doorH} L0 ${archH}Z`}
          fill="url(#bdg)"/>
        {/* Inner glow */}
        <path d={`M0 ${archH} Q0 0 ${doorW/2} 0 Q${doorW} 0 ${doorW} ${archH}
                  L${doorW} ${doorH} L0 ${doorH} L0 ${archH}Z`}
          fill="url(#bdglow)"/>

        {/* Outer frame */}
        <path d={`M1.5 ${archH} Q1.5 1.5 ${doorW/2} 1.5
                  Q${doorW-1.5} 1.5 ${doorW-1.5} ${archH}
                  L${doorW-1.5} ${doorH} L1.5 ${doorH} L1.5 ${archH}Z`}
          fill="none"
          stroke={GOLD(.35+hA*.28)}
          strokeWidth="1.4"/>

        {/* Inner panel border */}
        {(()=>{
          const iaH=archH*PHIi, mt=archH*.32;
          return <path d={`M${m} ${mt+iaH} Q${m} ${mt} ${doorW/2} ${mt}
                            Q${doorW-m} ${mt} ${doorW-m} ${mt+iaH}
                            L${doorW-m} ${doorH*.91}
                            L${m} ${doorH*.91}
                            L${m} ${mt+iaH}Z`}
            fill="none"
            stroke={GOLD(.16+hA*.14)}
            strokeWidth=".6"/>;
        })()}

        {/* Corner accents */}
        {[[doorW*PHIi2,doorH*.88],[doorW*(1-PHIi2),doorH*.88],
          [doorW*PHIi2,doorH*.93],[doorW*(1-PHIi2),doorH*.93]]
          .map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="2.2" fill={GOLD(.3+hA*.2)}/>
          ))}

        {/* Handle */}
        <circle cx={doorW*.7} cy={doorH*.55} r="4"
          fill="none" stroke={GOLD(.38+hA*.3)} strokeWidth=".8"/>
        <circle cx={doorW*.7} cy={doorH*.55} r="1.6"
          fill={GOLD(.38+hA*.3)}/>

        {/* Keyhole */}
        <circle cx={doorW*.5} cy={doorH*.87} r="3"
          fill="none" stroke={GOLD(.18+hA*.2)} strokeWidth=".6"/>
        <line x1={doorW*.5} y1={doorH*.87+3}
              x2={doorW*.5} y2={doorH*.87+9}
          stroke={GOLD(.18+hA*.2)} strokeWidth=".6"/>

        {/* Thin horizontal divider across golden ratio of height */}
        <line x1={m} y1={doorH*PHIi}
              x2={doorW-m} y2={doorH*PHIi}
          stroke={GOLD(.12+hA*.08)} strokeWidth=".5"/>
      </svg>

      {/* Ornament in arch */}
      <div style={{
        position:"absolute",
        top: archH * .35,
        left:"50%", transform:"translateX(-50%)",
        pointerEvents:"none",
      }}>
        <Ornament size={ornSz} alpha={.6+hA*.28}/>
      </div>

      {/* Quote inside door body */}
      <div style={{
        position:"absolute",
        top: quoteTop,
        left: m + doorW*.04,
        right: m + doorW*.04,
        height: innerH,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        gap:`clamp(4px,${(doorH*.012).toFixed(1)}px,10px)`,
        textAlign:"center",
        pointerEvents:"none",
      }}>
        {PHRASES.map((p,i)=>{
          const pt=eo(Math.max(0,(quoteT - i*.14)/.38));
          return (
            <div key={i} style={{
              fontFamily:CORRO, fontStyle:"italic", fontWeight:300,
              fontSize: i===0 ? quoteMFS : quoteOFS,
              letterSpacing: i===0 ? "0.05em" : "0.03em",
              lineHeight: 1.45,
              color: i===0
                ? `rgba(232,232,240,${pt*.85})`
                : `rgba(200,200,218,${pt*.6})`,
              opacity:pt,
              transform:`translateY(${(1-pt)*8}px)`,
            }}>{p}</div>
          );
        })}
      </div>

      {/* FIND YOUR TRUTH — inside door, bottom */}
      <div style={{
        position:"absolute",
        bottom: doorH*.065,
        left:0, right:0,
        textAlign:"center",
        pointerEvents:"none",
        fontFamily:CINZEL,
        fontSize: labelFS,
        letterSpacing:"0.45em",
        color: GOLD(labelT * (.42+hA*.28)),
        animation:"breathe 3.4s ease-in-out infinite",
      }}>FIND YOUR TRUTH</div>
    </div>
  );
}

// ── Formula display ───────────────────────────────────────────────
function Formula({ t, W }) {
  const isMobile=W<640;
  const fT=eo(t);
  if(fT<=0) return null;
  const sub=".56em";

  // All font sizes from one anchor: formulaBase
  const base = isMobile ? Math.min(W*.032, 13) : Math.min(W*.018, 17);
  const psiSz = `${Math.round(base*2.2)}px`;
  const mainSz= `${Math.round(base)}px`;

  return (
    <div style={{
      display:"flex",
      flexDirection:isMobile?"column":"row",
      alignItems:isMobile?"center":"baseline",
      justifyContent:"center",
      gap:isMobile?"clamp(2px,1vw,6px)":"clamp(4px,.6vw,10px)",
      opacity:fT,
      transform:`translateY(${(1-fT)*12}px)`,
      flexWrap:isMobile?"nowrap":"wrap",
      textAlign:"center",
    }}>

      {/* LEFT — S_eff := -log terms */}
      <div style={{
        display:"flex",
        flexDirection:isMobile?"row":"row",
        alignItems:"baseline",
        gap:`clamp(2px,.4vw,6px)`,
        flexWrap:"nowrap",
      }}>
        <span style={{fontFamily:CORRO,fontStyle:"italic",fontSize:mainSz,
          color:BLUE(fT*.75),whiteSpace:"nowrap"}}>
          S<sub style={{fontSize:sub}}>eff</sub>
          <span style={{fontStyle:"normal",margin:"0 .3em",color:BLUEDIM(fT*.6)}}>:=</span>
          −&thinsp;log F<sub style={{fontSize:sub}}>gated</sub>
        </span>
        <span style={{fontFamily:CORRO,fontStyle:"italic",fontSize:mainSz,
          color:BLUE(fT*.7),whiteSpace:"nowrap"}}>
          −&thinsp;log C<sub style={{fontSize:sub}}>eff</sub>
        </span>
        <span style={{fontFamily:CORRO,fontStyle:"italic",fontSize:mainSz,
          color:BLUE(fT*.7),whiteSpace:"nowrap"}}>
          −&thinsp;log D̂
        </span>
      </div>

      {/* Separator */}
      {!isMobile && (
        <span style={{
          fontFamily:CORRO,fontStyle:"normal",
          fontSize:`${Math.round(base*.85)}px`,
          color:GOLD(fT*.25),
          margin:"0 .4em",
          letterSpacing:".1em",
        }}>⟺</span>
      )}
      {isMobile && (
        <div style={{
          width:`clamp(24px,8vw,48px)`,
          height:"1px",
          background:`linear-gradient(90deg,transparent,${GOLD(fT*.2)},transparent)`,
          margin:"1px 0",
        }}/>
      )}

      {/* RIGHT — Ψ = R₁₂ × (C_eff · D̂) */}
      <div style={{
        display:"flex", flexDirection:"row",
        alignItems:"center",
        gap:`clamp(2px,.35vw,5px)`,
        flexWrap:"nowrap",
      }}>
        <span style={{fontFamily:CORRO,fontStyle:"italic",
          fontSize:psiSz,
          color:GOLDB(fT*.85),lineHeight:1,
          textShadow:`0 0 30px ${GOLD(fT*.4)}`,
          letterSpacing:1}}>Ψ</span>
        <span style={{fontFamily:CORRO,fontStyle:"normal",
          fontSize:mainSz,color:GOLD(fT*.6)}}>
          =
        </span>
        <span style={{fontFamily:CORRO,fontStyle:"italic",
          fontSize:mainSz,color:GOLD(fT*.8),
          textShadow:`0 0 20px ${GOLD(fT*.2)}`,
          whiteSpace:"nowrap"}}>
          R<sub style={{fontSize:sub}}>12</sub>
          <span style={{fontStyle:"normal",margin:"0 .25em",color:GOLD(fT*.55)}}>×</span>
          <span style={{color:GOLD(fT*.4),fontStyle:"normal"}}>(</span>
          C<sub style={{fontSize:sub}}>eff</sub>
          <span style={{margin:"0 .2em",color:GOLD(fT*.55)}}>·</span>
          D̂
          <span style={{color:GOLD(fT*.4),fontStyle:"normal"}}>)</span>
        </span>
      </div>
    </div>
  );
}

// ── MAIN TRUTH SCREEN ─────────────────────────────────────────────
export default function TruthScreen({ onComplete }) {
  const [elapsed,   setElapsed]  = useState(0);
  const [phase,     setPhase]    = useState("truth");
  const [dissolve,  setDissolve] = useState(false);
  const [threeT,    setThreeT]   = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);
  const [dims, setDims] = useState({W:window.innerWidth,H:window.innerHeight});
  const isMobile = dims.W < 640;

  useEffect(()=>{
    const fn=()=>setDims({W:window.innerWidth,H:window.innerHeight});
    window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);

  useEffect(()=>{
    if(phase!=="truth") return;
    function loop(now){
      if(!startRef.current) startRef.current=now;
      setElapsed(now-startRef.current);
      rafRef.current=requestAnimationFrame(loop);
    }
    rafRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[phase]);

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

  const {W,H}=dims;

  if(phase==="dissolving"){
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(3,3,10,.95)"}}>
        <Dissolve W={W} H={H} active={dissolve}/>
      </div>
    );
  }

  if(phase==="three"){
    return <ThreeDoors t={threeT} W={W} H={H}/>;
  }

  // ── TIMELINE (seconds) ─────────────────────────────────────────
  const t = elapsed / 1000;

  // Door: appears first and grows — it IS the content
  const DOOR_IN  = .3;
  const doorT    = sm(Math.max(0,(t-DOOR_IN)/1.2));

  // Quote: rises inside door after door is visible
  const QT_START = 1.4;
  const QT_DUR   = 3.0;
  const quoteRaw = (t-QT_START)/QT_DUR;
  const quoteT   = Math.max(0, quoteRaw);

  // "FIND YOUR TRUTH" label fades in after quote mostly done
  const labelT   = eo(Math.max(0,(t-4.8)/.9));

  // Formula: last to appear — foundation rises from below
  const FORM_IN  = 5.8;
  const formT    = sm(Math.max(0,(t-FORM_IN)/1.4));

  // Fade in
  const fadeIn   = eo(Math.min(1,t/.6));

  // Layout: door centered vertically, formula pinned below
  // On mobile portrait: door takes ~72vh, formula in remaining space
  // Gap between door and formula: PHI-scaled
  const doorAreaH = H * (isMobile?.72:.76);
  const formulaH  = H - doorAreaH;

  return (
    <div style={{
      position:"fixed", inset:0,
      background:"#03030a",
      opacity:fadeIn,
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"flex-start",
      overflow:"hidden",
    }}>

      {/* Ambient glow */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 42%,
          ${GOLD(doorT*.07)} 0%, transparent 58%)`,
      }}/>

      {/* ── DOOR AREA ─────────────────────────────────────── */}
      <div style={{
        flex:`0 0 ${Math.round(doorAreaH)}px`,
        width:"100%",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        position:"relative",
        zIndex:10,
      }}>
        <BigDoor
          W={W} H={H}
          t={doorT}
          quoteT={quoteT}
          labelT={labelT}
          onClick={handleDoorClick}
        />
      </div>

      {/* ── FORMULA — the foundation ──────────────────────── */}
      <div style={{
        flex:`0 0 ${Math.round(formulaH)}px`,
        width:"100%",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        padding:`0 clamp(12px,4vw,40px)`,
        boxSizing:"border-box",
        position:"relative", zIndex:10,
      }}>
        <Formula t={formT} W={W}/>
      </div>

      {/* Vignette */}
      <div style={{
        position:"absolute",inset:0,pointerEvents:"none",
        background:"radial-gradient(ellipse at center,transparent 25%,rgba(0,0,0,.35) 65%,rgba(0,0,0,.82) 100%)",
      }}/>

      {/* Grain */}
      <div style={{
        position:"absolute",inset:0,pointerEvents:"none",opacity:.022,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:"256px 256px",
      }}/>

      <style>{`@keyframes breathe{0%,100%{opacity:.28}50%{opacity:.78}}`}</style>
    </div>
  );
}
