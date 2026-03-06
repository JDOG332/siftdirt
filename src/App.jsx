import React, { useState, useEffect, useRef, useCallback } from "react";
import { PHI, PHI_INV, classifyDesire } from "./data.js";
import IntroCanvas from "./IntroCanvas.jsx";
import "./global.css";

const GOLD  = "rgba(201,168,76,";
const BONE  = "rgba(232,232,240,";
const DARK  = "#03030a";
const CINZEL = "'Cinzel', serif";
const CORRO  = "'Cormorant Garamond', Georgia, serif";

function Grain() {
  return (
    <div style={{
      position:"fixed",inset:0,pointerEvents:"none",zIndex:999,opacity:0.03,
      backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      backgroundRepeat:"repeat",backgroundSize:"256px 256px",
      animation:"grainMove 0.5s steps(1) infinite",
    }}/>
  );
}

function Vignette() {
  return (
    <div style={{
      position:"fixed",inset:0,pointerEvents:"none",zIndex:1,
      background:"radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.35) 70%,rgba(0,0,0,0.72) 100%)",
    }}/>
  );
}

function DirtCanvas({active,onDone}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  useEffect(()=>{
    if(!active) return;
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight;
    const W=canvas.width,H=canvas.height;
    const dirt=Array.from({length:90},()=>({
      x:W*0.2+Math.random()*W*0.6,y:H*0.4+Math.random()*H*0.2,
      size:1+Math.random()*2.5,vx:(Math.random()-0.5)*1.4,vy:1.8+Math.random()*3,rot:Math.random()*Math.PI*2
    }));
    const gold=Array.from({length:35},()=>({
      x:W*0.3+Math.random()*W*0.4,y:H*0.5+Math.random()*H*0.1,
      size:1+Math.random()*2,vx:(Math.random()-0.5)*0.5,vy:-(1.8+Math.random()*2.5),delay:Math.random()*0.4
    }));
    const DURATION=1600;
    function frame(now){
      if(!startRef.current) startRef.current=now;
      const t=Math.min(1,(now-startRef.current)/DURATION);
      ctx.clearRect(0,0,W,H);
      dirt.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy*(1+t);p.rot+=0.05;
        const a=Math.max(0,0.85-t*1.3);
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
        ctx.fillStyle=`rgba(${70+Math.random()*40},${55+Math.random()*25},35,${a})`;
        ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.55);ctx.restore();
      });
      gold.forEach(g=>{
        if(t<g.delay) return;
        const lt=(t-g.delay)/(1-g.delay);
        g.x+=g.vx;g.y+=g.vy;
        const a=lt<0.3?lt/0.3:Math.max(0,1-(lt-0.3)/0.7);
        ctx.beginPath();ctx.arc(g.x,g.y,g.size*(0.4+lt*0.6),0,Math.PI*2);
        ctx.fillStyle=`rgba(201,168,76,${a*0.75})`;ctx.fill();
      });
      if(t<1){rafRef.current=requestAnimationFrame(frame);}
      else{startRef.current=null;onDone?.();}
    }
    rafRef.current=requestAnimationFrame(frame);
    return()=>{if(rafRef.current) cancelAnimationFrame(rafRef.current);};
  },[active,onDone]);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:50}}/>;
}

function DoorCard({door,desire,onReset}){
  const [show,setShow]=useState(false);
  const [showWords,setShowWords]=useState(false);
  const [showInvite,setShowInvite]=useState(false);
  const [r,g,b]=door.color;
  const C=(a)=>`rgba(${r},${g},${b},${a})`;
  useEffect(()=>{
    const t1=setTimeout(()=>setShow(true),80);
    const t2=setTimeout(()=>setShowWords(true),900);
    const t3=setTimeout(()=>setShowInvite(true),1900);
    return()=>[t1,t2,t3].forEach(clearTimeout);
  },[]);
  return(
    <div style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 28px",width:"100%",animation:"fadeIn 0.4s ease both"}}>
      <div style={{fontFamily:CORRO,fontSize:"clamp(14px,3vw,17px)",fontStyle:"italic",color:`${GOLD}0.4)`,letterSpacing:2,marginBottom:44,textAlign:"center",opacity:show?1:0,transform:show?"none":"translateY(6px)",transition:"all 1s ease 0.1s"}}>
        "{desire}"
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:18,opacity:show?1:0,transform:show?"none":"translateY(14px) scale(0.97)",transition:"all 1.3s cubic-bezier(0.23,1,0.32,1) 0.2s"}}>
        <div style={{fontFamily:CINZEL,fontSize:"clamp(10px,2vw,12px)",letterSpacing:"0.55em",color:C(0.3)}}>DOOR {door.num}</div>
        <div style={{fontFamily:CINZEL,fontSize:"clamp(34px,8.5vw,56px)",fontWeight:300,letterSpacing:"0.2em",color:C(0.92),textAlign:"center",lineHeight:1,textShadow:`0 0 70px ${C(0.22)},0 0 130px ${C(0.1)}`}}>
          {door.name}
        </div>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${C(0.45)},transparent)`,animation:show?"lineExpand 1.4s ease 0.6s both":"none"}}/>
        <div style={{fontFamily:CORRO,fontSize:"clamp(15px,3.5vw,20px)",fontStyle:"italic",fontWeight:300,color:`${BONE}0.55)`,textAlign:"center",maxWidth:460,lineHeight:1.75,letterSpacing:0.5,opacity:show?1:0,transition:"opacity 1s ease 0.85s"}}>
          {door.question}
        </div>
      </div>
      {showWords&&(
        <div style={{display:"flex",gap:28,marginTop:44,animation:"fadeUp 0.8s ease both"}}>
          {door.reflection.map((word,i)=>(
            <div key={word} style={{fontFamily:CINZEL,fontSize:"clamp(8px,1.8vw,11px)",letterSpacing:"0.45em",color:C(0.35+i*0.1),textTransform:"uppercase",animation:`fadeUp 0.6s ease ${i*0.15}s both`}}>
              {word}
            </div>
          ))}
        </div>
      )}
      {showInvite&&(
        <div style={{marginTop:60,display:"flex",flexDirection:"column",alignItems:"center",gap:22,animation:"fadeUp 1s ease both"}}>
          <div style={{fontFamily:CORRO,fontStyle:"italic",fontSize:"clamp(13px,2.5vw,15px)",color:`${BONE}0.22)`,letterSpacing:1,textAlign:"center"}}>
            this is just the surface
          </div>
          <a href="https://educationrevelation.com" target="_blank" rel="noopener noreferrer"
            style={{fontFamily:CINZEL,fontSize:"clamp(10px,2vw,12px)",letterSpacing:"0.45em",color:`${GOLD}0.55)`,textDecoration:"none",padding:"13px 32px",border:`1px solid ${GOLD}0.15)`,borderRadius:2,transition:"all 0.618s ease",cursor:"pointer"}}
            onMouseEnter={e=>{e.target.style.color=`${GOLD}0.92)`;e.target.style.borderColor=`${GOLD}0.4)`;e.target.style.boxShadow=`0 0 32px ${GOLD}0.1)`;}}
            onMouseLeave={e=>{e.target.style.color=`${GOLD}0.55)`;e.target.style.borderColor=`${GOLD}0.15)`;e.target.style.boxShadow="none";}}>
            GO DEEPER →
          </a>
          <button onClick={onReset}
            style={{fontFamily:CORRO,fontStyle:"italic",fontSize:"clamp(12px,2.5vw,14px)",color:`${BONE}0.18)`,background:"none",border:"none",cursor:"pointer",letterSpacing:1,transition:"color 0.4s ease",marginTop:2}}
            onMouseEnter={e=>{e.target.style.color=`${BONE}0.42)`;}}
            onMouseLeave={e=>{e.target.style.color=`${BONE}0.18)`;}}>
            sift again
          </button>
        </div>
      )}
    </div>
  );
}

export default function App(){
  const [scene,setScene]=useState("intro");
  const [introVisible,setIntroVisible]=useState(true);
  const [mainVisible,setMainVisible]=useState(false);
  const [input,setInput]=useState("");
  const [door,setDoor]=useState(null);
  const inputRef=useRef(null);

  const handleIntroComplete=useCallback(()=>{
    setScene("transitioning");
    setTimeout(()=>setIntroVisible(false),50);
    setTimeout(()=>{
      setMainVisible(true);
      setScene("idle");
      setTimeout(()=>inputRef.current?.focus(),800);
    },800);
  },[]);

  const handleSubmit=useCallback(()=>{
    if(input.trim().length<3) return;
    setDoor(classifyDesire(input));
    setScene("sifting");
  },[input]);

  const handleDone=useCallback(()=>setScene("revealed"),[]);
  const handleReset=useCallback(()=>{
    setScene("idle");setInput("");setDoor(null);
    setTimeout(()=>inputRef.current?.focus(),300);
  },[]);

  const bg=scene==="revealed"&&door
    ?`radial-gradient(ellipse at 50% 40%,rgba(${door.color[0]*0.06},${door.color[1]*0.06},${door.color[2]*0.06},1) 0%,${DARK} 70%)`
    :`radial-gradient(ellipse at 50% 35%,rgba(8,6,20,1) 0%,${DARK} 80%)`;

  const isSifting=scene==="sifting";

  return(
    <>
      {(scene==="intro"||scene==="transitioning")&&(
        <div style={{position:"fixed",inset:0,zIndex:100,opacity:introVisible?1:0,transition:"opacity 0.8s cubic-bezier(0.23,1,0.32,1)"}}>
          <IntroCanvas onComplete={handleIntroComplete}/>
        </div>
      )}
      <div style={{minHeight:"100vh",background:bg,transition:`background ${(PHI*PHI).toFixed(3)}s cubic-bezier(0.23,1,0.32,1),opacity 1s ease`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflowX:"hidden",opacity:mainVisible?1:0}}>
        <Grain/><Vignette/>
        <DirtCanvas active={isSifting} onDone={handleDone}/>
        {(scene==="idle"||scene==="typing"||scene==="sifting")&&(
          <div style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 24px",width:"100%",opacity:isSifting?0:1,transform:isSifting?"scale(0.97)":"scale(1)",transition:"opacity 0.6s ease,transform 0.8s ease"}}>
            <div style={{fontFamily:CINZEL,fontSize:"clamp(10px,2.2vw,12px)",letterSpacing:"0.6em",color:`${GOLD}0.28)`,marginBottom:52,opacity:mainVisible?1:0,animation:mainVisible?"breatheSlow 5s ease-in-out infinite 2s":"none",transition:"opacity 1.2s ease"}}>
              SIFTDIRT
            </div>
            <div style={{fontFamily:CORRO,fontSize:"clamp(28px,6.5vw,44px)",fontWeight:300,fontStyle:"italic",color:`${BONE}0.72)`,letterSpacing:2,marginBottom:42,textAlign:"center",lineHeight:1.4,opacity:mainVisible?1:0,transform:mainVisible?"none":"translateY(18px)",transition:"opacity 1.2s ease 0.2s,transform 1.4s cubic-bezier(0.23,1,0.32,1) 0.2s"}}>
              what do you want?
            </div>
            <div style={{width:"100%",maxWidth:530,opacity:mainVisible?1:0,transform:mainVisible?"none":"translateY(18px)",transition:"opacity 1.2s ease 0.45s,transform 1.4s cubic-bezier(0.23,1,0.32,1) 0.45s"}}>
              <textarea ref={inputRef} rows={1} value={input} placeholder="type your desire…"
                onChange={e=>{setInput(e.target.value);setScene(e.target.value.length>0?"typing":"idle");e.target.style.height="auto";e.target.style.height=e.target.scrollHeight+"px";}}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSubmit();}}}
                style={{width:"100%",padding:`${Math.round(10*PHI)}px ${Math.round(14*PHI)}px`,fontFamily:CORRO,fontSize:"clamp(16px,3.5vw,22px)",fontStyle:"italic",fontWeight:300,letterSpacing:1,color:`${BONE}0.88)`,background:"rgba(0,0,0,0.4)",border:`1px solid ${GOLD}${input.length>0?"0.35":"0.14"})`,borderRadius:2,outline:"none",resize:"none",overflow:"hidden",textAlign:"center",lineHeight:1.65,minHeight:58,transition:"border-color 0.618s ease,box-shadow 0.618s ease",boxShadow:input.length>0?`0 0 55px ${GOLD}0.09),inset 0 0 40px rgba(0,0,0,0.4)`:`inset 0 0 40px rgba(0,0,0,0.4)`,animation:input.length===0&&mainVisible?"goldPulse 3.5s ease-in-out infinite 2s":"none"}}
                onFocus={e=>{e.target.style.borderColor=`${GOLD}0.42)`;e.target.style.boxShadow=`0 0 65px ${GOLD}0.13),inset 0 0 40px rgba(0,0,0,0.4)`;}}
                onBlur={e=>{e.target.style.borderColor=`${GOLD}${input.length>0?"0.3":"0.14"})`;e.target.style.boxShadow=input.length>0?`0 0 55px ${GOLD}0.09),inset 0 0 40px rgba(0,0,0,0.4)`:`inset 0 0 40px rgba(0,0,0,0.4)`;}}
              />
              <div style={{textAlign:"center",marginTop:16,fontFamily:CORRO,fontStyle:"italic",fontSize:"clamp(11px,2vw,13px)",color:`${BONE}${input.trim().length>=3?"0.24":"0.08"})`,letterSpacing:2,transition:"color 0.618s ease"}}>
                {input.trim().length>=3?"press enter to sift":""}
              </div>
            </div>
          </div>
        )}
        {scene==="revealed"&&door&&<DoorCard door={door} desire={input} onReset={handleReset}/>}
      </div>
    </>
  );
}
