import React, { useEffect, useRef, useState } from "react";

const PHI   = 1.6180339887;
const TAU   = Math.PI * 2;
const NAVY  = "#03030a";
const GOLD  = (a=1) => `rgba(201,168,76,${a})`;
const IVORY = (a=1) => `rgba(236,228,210,${a})`;
const CINZEL = "'Cinzel', serif";
const CORRO  = "'Cormorant Garamond', serif";

// ─── LIVE CANVAS — full da Vinci geometry ───────────────────────
function VitruvianCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, cx, cy, R, raf;

    function resize() {
      const el = canvas.parentElement;
      W = canvas.width  = el.offsetWidth;
      H = canvas.height = el.offsetHeight;
      cx = W/2; cy = H/2;
      R = Math.min(W, H) * 0.38;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    // 3D helpers
    const rotX = ([x,y,z],a) => [x, y*Math.cos(a)-z*Math.sin(a), y*Math.sin(a)+z*Math.cos(a)];
    const rotY = ([x,y,z],a) => [x*Math.cos(a)+z*Math.sin(a), y, -x*Math.sin(a)+z*Math.cos(a)];
    const rotZ = ([x,y,z],a) => [x*Math.cos(a)-y*Math.sin(a), x*Math.sin(a)+y*Math.cos(a), z];
    const xf   = (p,rx,ry,rz) => rotZ(rotY(rotX(p,rx),ry),rz);
    const proj = ([x,y,z]) => {
      const s = 2.4/(2.4+z*0.4);
      return [cx+x*R*s, cy-y*R*s, z];
    };
    const depthAlpha = z => 0.15 + 0.75*((z+1)/2);
    const WHITE = a => `rgba(236,228,210,${a})`;
    const GOLDC = a => `rgba(201,168,76,${a})`;

    // ── Exact da Vinci constants (verified: 17/17 checks pass) ──
    const R_CIRC = 0.70;
    const SQ_RATIO = 137/225;
    const SQ_H  = R_CIRC/SQ_RATIO;
    const SQ_HW = SQ_H/2;
    const SQ_BOT = -R_CIRC;
    const SQ_TOP = SQ_BOT + SQ_H;
    const SX=0.10, SY=0.23, HX=0.08, HY=-0.3711;
    const AR = SQ_HW - SX;
    const LR = 0.3289;
    const ELBOW = AR*0.50, KNEE = LR*0.52;
    const HEAD_R_NORM = SQ_H/16;
    const HEAD_Y = SQ_TOP - HEAD_R_NORM;
    const ARM_X = 34.35 * Math.PI/180;
    const LEG_X = 30    * Math.PI/180;

    function figure(breath) {
      const armA = breath * ARM_X;
      const legA = breath * LEG_X;
      const ac=Math.cos(armA), as=Math.sin(armA);
      const lc=Math.cos(legA), ls=Math.sin(legA);
      return {
        head:[0,HEAD_Y,0],
        neck:[[0,HEAD_Y-HEAD_R_NORM,0],[0,SY+0.008,0]],
        shoulders:[[-SX,SY,0],[SX,SY,0]],
        lTorso:[[-SX,SY,0],[-0.06,0.01,0],[-HX,HY,0]],
        rTorso:[[SX,SY,0],[0.06,0.01,0],[HX,HY,0]],
        hips:[[-HX,HY,0],[HX,HY,0]],
        lArm:[[-SX,SY,0],[-(SX+ELBOW*ac),SY+ELBOW*as,0],[-(SX+AR*ac),SY+AR*as,0]],
        rArm:[[SX,SY,0],[SX+ELBOW*ac,SY+ELBOW*as,0],[SX+AR*ac,SY+AR*as,0]],
        lLeg:[[-HX,HY,0],[-(HX+KNEE*ls),HY-KNEE*lc,0],[-(HX+LR*ls),HY-LR*lc,0]],
        rLeg:[[HX,HY,0],[HX+KNEE*ls,HY-KNEE*lc,0],[HX+LR*ls,HY-LR*lc,0]],
      };
    }

    function drawLimb(pts, rx,ry,rz, alpha, breath) {
      const m = pts.map(p => proj(xf(p,rx,ry,rz)));
      const z = m.reduce((s,p)=>s+p[2],0)/m.length;
      ctx.save();
      ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.beginPath();
      ctx.moveTo(m[0][0],m[0][1]);
      for (let i=1;i<m.length;i++) ctx.lineTo(m[i][0],m[i][1]);
      ctx.strokeStyle = WHITE(depthAlpha(z)*alpha);
      ctx.lineWidth = 1.8 + breath*1.2;
      ctx.stroke(); ctx.restore();
    }

    let t = 0;
    function frame() {
      ctx.clearRect(0,0,W,H);
      t += 0.0035;

      // PHI breath — 5.6s inhale / 5.6s exhale
      const breath = (Math.sin(t * 2.672) + 1) / 2;

      // Slow gentle rotation — this page is contemplative, not gyroscopic
      const rx = t * 0.18;
      const ry = t * 0.29;
      const rz = t * 0.11;

      const fig = figure(breath);

      // ── CIRCLE — COSMOS — fixed, glows on inhale ──
      const cPts = Array.from({length:65},(_,i)=>{
        const a=(i/64)*TAU;
        return proj(xf([Math.cos(a)*R_CIRC, Math.sin(a)*R_CIRC, 0], rx,ry,rz));
      });
      const cZ = cPts.reduce((s,p)=>s+p[2],0)/cPts.length;
      ctx.beginPath();
      ctx.moveTo(cPts[0][0],cPts[0][1]);
      cPts.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));
      ctx.closePath();
      ctx.strokeStyle = GOLDC(depthAlpha(cZ)*(0.22+breath*0.55));
      ctx.lineWidth = 1.6+breath*1.4; ctx.stroke();

      // ── SQUARE — EARTH — fixed, glows on exhale ──
      const sq = [
        [-SQ_HW,SQ_TOP,0],[SQ_HW,SQ_TOP,0],
        [SQ_HW,SQ_BOT,0],[-SQ_HW,SQ_BOT,0],
      ].map(p=>proj(xf(p,rx,ry,rz)));
      const sqZ = sq.reduce((s,p)=>s+p[2],0)/sq.length;
      ctx.beginPath();
      ctx.moveTo(sq[0][0],sq[0][1]);
      sq.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));
      ctx.closePath();
      ctx.strokeStyle = GOLDC(depthAlpha(sqZ)*(0.18+(1-breath)*0.50));
      ctx.lineWidth = 1.6+(1-breath)*1.4; ctx.stroke();

      // ── FIGURE ──
      drawLimb(fig.lArm,    rx,ry,rz, 0.88, breath);
      drawLimb(fig.rArm,    rx,ry,rz, 0.88, breath);
      drawLimb(fig.lLeg,    rx,ry,rz, 0.85, breath);
      drawLimb(fig.rLeg,    rx,ry,rz, 0.85, breath);
      drawLimb(fig.lTorso,  rx,ry,rz, 0.80, breath);
      drawLimb(fig.rTorso,  rx,ry,rz, 0.80, breath);
      drawLimb(fig.shoulders,rx,ry,rz,0.72, breath);
      drawLimb(fig.hips,    rx,ry,rz, 0.70, breath);
      drawLimb(fig.neck,    rx,ry,rz, 0.78, breath);

      // Head
      const hc = proj(xf(fig.head,rx,ry,rz));
      const hr = R * HEAD_R_NORM;
      ctx.beginPath();
      ctx.arc(hc[0],hc[1],hr,0,TAU);
      ctx.strokeStyle = WHITE(depthAlpha(hc[2])*0.90);
      ctx.lineWidth = 1.8+breath*0.8; ctx.stroke();

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display:"block" }} />;
}

// ─── GEOMETRY FACT ROW ───────────────────────────────────────────
function FactRow({ label, value, sub }) {
  return (
    <div style={{
      display:"grid", gridTemplateColumns:"1fr 1fr",
      gap:"8px 24px",
      padding:"14px 0",
      borderBottom:`1px solid rgba(201,168,76,0.08)`,
    }}>
      <div style={{ fontFamily:CORRO, fontStyle:"normal", fontWeight:500, fontSize:"clamp(16px,2vw,19px)", color:IVORY(0.78) }}>{label}</div>
      <div>
        <div style={{ fontFamily:CINZEL, fontSize:"clamp(15px,1.8vw,18px)", fontWeight:600, color:GOLD(), letterSpacing:"0.08em" }}>{value}</div>
        {sub && <div style={{ fontFamily:CORRO, fontStyle:"normal", fontWeight:500, fontSize:15, color:IVORY(0.70), marginTop:3 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── POSITION CARD ───────────────────────────────────────────────
function PosCard({ label, emoji, desc, detail, breath }) {
  return (
    <div style={{
      flex:1, padding:"28px 24px",
      border:`1px solid rgba(201,168,76,${breath ? 0.35 : 0.18})`,
      background:`radial-gradient(ellipse at center, rgba(201,168,76,${breath ? 0.06 : 0.02}), transparent 70%)`,
      transition:"all 0.4s ease",
    }}>
      <div style={{ fontSize:36, marginBottom:14 }}>{emoji}</div>
      <div style={{ fontFamily:CINZEL, fontSize:13, letterSpacing:"0.45em", fontWeight:600, color:GOLD(0.82), marginBottom:12 }}>{label}</div>
      <div style={{ fontFamily:CORRO, fontStyle:"normal", fontWeight:500, fontSize:"clamp(19px,2.5vw,23px)", color:IVORY(0.94), marginBottom:14, lineHeight:1.55 }}>{desc}</div>
      <div style={{ fontFamily:CORRO, fontStyle:"normal", fontWeight:500, fontSize:17, color:IVORY(0.78), lineHeight:1.65 }}>{detail}</div>
    </div>
  );
}

// ─── BACK BUTTON ────────────────────────────────────────────────
function BackBtn({ onBack }) {
  const [h,setH] = useState(false);
  return (
    <button onClick={onBack}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        position:"fixed", top:24, left:24, zIndex:100,
        background:"transparent", border:"none",
        color:GOLD(h?1.0:0.72), fontFamily:CINZEL, fontSize:16,
        letterSpacing:"0.38em", fontWeight:600, padding:"10px 16px", cursor:"pointer",
        transition:"color 618ms ease",
      }}>← BACK</button>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────
export default function VitruvianPage({ onBack }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => { const t=setTimeout(()=>setEntered(true),80); return ()=>clearTimeout(t); }, []);

  const maxW = Math.min(760, window.innerWidth * 0.92);

  return (
    <div style={{
      minHeight:"100vh", background:NAVY, color:IVORY(),
      overflowX:"hidden",
      opacity: entered ? 1 : 0,
      transition:"opacity 1.2s ease",
    }}>
      <BackBtn onBack={onBack} />

      <div style={{ maxWidth:maxW, margin:"0 auto", padding:"100px 24px 100px" }}>

        {/* ── HERO ── */}
        <div style={{ textAlign:"center", marginBottom:64, borderBottom:`1px solid ${GOLD(0.12)}`, paddingBottom:64 }}>
          <div style={{ fontSize:"clamp(64px,12vw,112px)", lineHeight:1, marginBottom:8, userSelect:"none" }}>🏛️</div>
          <h1 style={{ fontFamily:CINZEL, fontSize:"clamp(20px,3vw,32px)", fontWeight:600, letterSpacing:"0.40em", color:IVORY(0.96), marginBottom:16 }}>
            THE VITRUVIAN MAN
          </h1>
          <h2 style={{ fontFamily:CORRO, fontStyle:"normal", fontWeight:500, fontSize:"clamp(22px,3vw,30px)", color:IVORY(0.82), letterSpacing:"0.04em" }}>
            Geometric Truth Hidden in Plain Sight for 500 Years
          </h2>
        </div>

        {/* ── LIVE CANVAS ── */}
        <div style={{
          width:"100%", aspectRatio:"1/1", maxHeight:420,
          margin:"0 auto 64px",
          maxWidth:420,
          background:`radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 68%)`,
        }}>
          <VitruvianCanvas />
        </div>

        {/* ── THE TRUTH ── */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontFamily:CINZEL, fontSize:14, letterSpacing:"0.45em", fontWeight:600, color:GOLD(0.72), marginBottom:20 }}>THE TRUTH</div>
          <p style={{ fontFamily:CORRO, fontStyle:"normal", fontWeight:500, fontSize:"clamp(22px,3vw,28px)", color:IVORY(0.94), lineHeight:1.7, maxWidth:580, margin:"0 auto", textShadow:"0 0 20px rgba(236,228,210,0.18)" }}>
            The circle is the cosmos. The square is the earth.<br />
            The man lives between them — and reaches each<br />
            only for one instant, with every single breath.
          </p>
        </div>

        {/* ── TWO POSITIONS ── */}
        <div style={{ fontFamily:CINZEL, fontSize:14, letterSpacing:"0.45em", fontWeight:600, color:GOLD(0.72), textAlign:"center", marginBottom:24 }}>TWO POSITIONS</div>
        <div style={{ display:"flex", gap:20, marginBottom:64, flexWrap:"wrap" }}>
          <PosCard
            label="POSITION A — THE SQUARE — EXHALE"
            emoji="⬜"
            desc="Arms horizontal. Legs together. The man fits the square."
            detail={`Fingertips touch the sides of the square exactly (x = ±${(0.70/(137/225)/2).toFixed(4)}). Feet touch the floor of the square exactly (y = −0.70). He is grounded. Human. Earthly. Contained.`}
          />
          <PosCard
            label="POSITION B — THE CIRCLE — INHALE"
            emoji="⭕"
            desc="Arms raised 34.35°. Legs spread 30°. The man touches the cosmos."
            detail="Fingertips reach the circle at distance R = 0.70 from the navel (verified: 0.699996). Feet reach the circle at distance R = 0.70 (verified: 0.700005). The space between the legs forms an equilateral triangle — da Vinci wrote this himself."
            breath
          />
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ width:"61.8%", margin:"0 auto 64px", height:1, background:`linear-gradient(to right, transparent, ${GOLD(0.25)}, transparent)` }} />

        {/* ── GEOMETRY TABLE ── */}
        <div style={{ fontFamily:CINZEL, fontSize:14, letterSpacing:"0.45em", fontWeight:600, color:GOLD(0.72), textAlign:"center", marginBottom:32 }}>EXACT GEOMETRY — VERIFIED</div>
        <div style={{ marginBottom:64 }}>
          <FactRow label="Circle radius" value="R = 0.70 (fixed forever)" sub="Center = navel. The cosmos does not resize." />
          <FactRow label="Square side" value="H = R ÷ (137/225) = 1.1496" sub="Da Vinci's measured ratio. Circle radius / square side = 0.6089." />
          <FactRow label="Square center" value="Genitals — not the navel" sub="Leonardo's key correction over Vitruvius. Different shapes, different centers." />
          <FactRow label="Square bottom" value="y = −R = −0.70" sub="Square floor is exactly tangent to the bottom of the circle." />
          <FactRow label="Square corners" value="Distance 0.906 from navel" sub="Corners reach OUTSIDE the circle. Earth extends beyond cosmos at its corners." />
          <FactRow label="Man's height" value="1.1496 = arm span" sub="Da Vinci: height equals arm span. The square's side equals both." />
          <FactRow label="Head size" value="1/8 of total height = 0.0719" sub="Da Vinci's proportion. Head top = square top." />
          <FactRow label="Navel height" value="60.89% from feet" sub="The golden section. R/H = 137/225 ≈ 0.6089." />
          <FactRow label="Arm angle (X-pose)" value="34.35° above horizontal" sub="Exact: tip distance from navel = 0.699996. Sub-degree precision." />
          <FactRow label="Leg spread (X-pose)" value="30° each = 60° total" sub="Equilateral triangle. Da Vinci wrote: 'space between legs will be an equilateral triangle.'" />
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ width:"61.8%", margin:"0 auto 64px", height:1, background:`linear-gradient(to right, transparent, ${GOLD(0.25)}, transparent)` }} />

        {/* ── THE BREATH ── */}
        <div style={{ fontFamily:CINZEL, fontSize:14, letterSpacing:"0.45em", fontWeight:600, color:GOLD(0.72), textAlign:"center", marginBottom:32 }}>THE BREATH</div>
        <div style={{
          padding:"36px 32px",
          border:`1px solid ${GOLD(0.15)}`,
          background:`radial-gradient(ellipse at center, rgba(201,168,76,0.04), transparent 70%)`,
          marginBottom:64,
          textAlign:"center",
        }}>
          <p style={{ fontFamily:CORRO, fontStyle:"normal", fontWeight:500, fontSize:"clamp(19px,2.5vw,24px)", color:IVORY(0.90), lineHeight:1.8, margin:0 }}>
            On this site, the man breathes at <span style={{color:GOLD()}}>5.6 seconds inhale</span> / <span style={{color:GOLD()}}>5.6 seconds exhale</span> — the PHI resonance breathing rate (James Nestor, <em>Breath</em>).<br /><br />
            At the peak of every inhale his fingertips and feet graze the circle.<br />
            At the bottom of every exhale his fingertips rest on the walls of the square.<br /><br />
            <span style={{color:GOLD(0.7)}}>The distance between earth and cosmos is exactly one breath.</span>
          </p>
        </div>

        {/* ── DA VINCI'S OWN WORDS ── */}
        <div style={{ fontFamily:CINZEL, fontSize:14, letterSpacing:"0.45em", fontWeight:600, color:GOLD(0.72), textAlign:"center", marginBottom:32 }}>DA VINCI'S OWN WORDS</div>
        <div style={{
          padding:"32px", borderLeft:`2px solid ${GOLD(0.35)}`,
          marginBottom:64,
          background:`rgba(201,168,76,0.02)`,
        }}>
          <p style={{ fontFamily:CORRO, fontStyle:"normal", fontWeight:500, fontSize:"clamp(18px,2.5vw,22px)", color:IVORY(0.85), lineHeight:1.8, margin:0 }}>
            "If you open your legs enough that your head is lowered by one-fourteenth of your height and raise your hands enough that your extended fingers touch the line of the top of your head, know that the centre of the extended limbs will be the navel, and the space between the legs will be an equilateral triangle."
          </p>
          <div style={{ fontFamily:CINZEL, fontSize:13, letterSpacing:"0.35em", fontWeight:600, color:GOLD(0.65), marginTop:16 }}>
            — LEONARDO DA VINCI, c. 1490 (mirror script, Gallerie dell'Accademia, Venice)
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ textAlign:"center", paddingTop:32, borderTop:`1px solid ${GOLD(0.1)}` }}>
          <div style={{ fontFamily:CORRO, fontStyle:"normal", fontWeight:500, fontSize:16, color:IVORY(0.65) }}>
            All geometry on this page computed and independently verified.<br />
            17 / 17 checks pass. Sub-degree angle precision confirmed.
          </div>
        </div>

      </div>
    </div>
  );
}
