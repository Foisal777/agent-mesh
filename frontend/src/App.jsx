import { useState, useEffect, useRef } from "react";
import sdk from "@farcaster/frame-sdk";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { overflow: hidden; background: #020c03; }
  .scanlines::before { content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px); pointer-events: none; z-index: 9999; }
  .scanlines::after { content: ''; position: fixed; top: -100%; left: 0; right: 0; height: 200%; background: linear-gradient(transparent 0%, rgba(0,255,65,0.015) 50%, transparent 100%); animation: scanMove 10s linear infinite; pointer-events: none; z-index: 9998; }
  @keyframes scanMove { 0%{transform:translateY(0)} 100%{transform:translateY(50%)} }
  @keyframes glitch { 0%,88%,100%{text-shadow:0 0 12px #00ff41,0 0 30px rgba(0,255,65,0.4);transform:none;} 89%{text-shadow:-3px 0 #ff00ff,3px 0 #00e5ff;transform:skewX(-1.5deg);} 93%{text-shadow:0 0 12px #00ff41;transform:none;} 95%{text-shadow:-4px 0 #ff3131,4px 0 #00e5ff;transform:skewX(-2deg);} 97%{text-shadow:0 0 12px #00ff41;transform:none;} }
  @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 8px currentColor} 50%{opacity:0.3} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes borderFlow { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes priceUp { 0%{color:#b8ffb8} 40%{color:#00ff41;text-shadow:0 0 10px #00ff41} 100%{color:#b8ffb8} }
  @keyframes priceDn { 0%{color:#b8ffb8} 40%{color:#ff3131;text-shadow:0 0 10px #ff3131} 100%{color:#b8ffb8} }
  .panel { background: rgba(3,12,4,0.97); position: relative; overflow: hidden; }
  .panel-glow::before { content: ''; position: absolute; inset: 0; border: 1px solid transparent; background: linear-gradient(90deg,#00ff41,#00e5ff,#ff00ff,#ff3131,#00ff41) border-box; background-size: 400% 100%; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask-composite: exclude; animation: borderFlow 6s linear infinite; opacity: 0.25; pointer-events: none; z-index: 1; }
  .agent-card { border: 1px solid #0d2b0d; padding: 7px 9px; margin-bottom: 4px; background: rgba(0,255,65,0.02); transition: all 0.15s; cursor: pointer; position: relative; }
  .agent-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--sc, #00ff41); opacity: 0.6; }
  .agent-card:hover { background: rgba(0,255,65,0.06); transform: translateX(2px); }
  .agent-card.active { background: rgba(0,255,65,0.07); border-color: var(--sc, #00ff41); }
  .sdot { display:inline-block; width:6px; height:6px; border-radius:50%; animation:pulse 2s infinite; }
  .msg-u { background:rgba(0,229,255,0.04); border-left:2px solid #00e5ff; padding:7px 11px; margin:5px 0; animation:fadeUp 0.2s ease; }
  .msg-a { background:rgba(0,255,65,0.03); border-left:2px solid #00ff41; padding:7px 11px; margin:5px 0; animation:fadeUp 0.2s ease; }
  .blink::after { content:'|'; animation:blink 0.8s infinite; color:#00ff41; }
  .logo { font-family:'Orbitron',monospace; font-weight:900; font-size:14px; letter-spacing:4px; animation:glitch 8s infinite; color:#00ff41; text-shadow:0 0 12px #00ff41; }
  .ptitle { font-family:'Orbitron',monospace; font-size:8px; letter-spacing:3px; color:#00ff41; text-transform:uppercase; }
  .btn { background:transparent; border:1px solid #00ff41; color:#00ff41; font-family:'Share Tech Mono',monospace; font-size:10px; padding:4px 10px; cursor:pointer; letter-spacing:1px; transition:all 0.2s; }
  .btn:hover { background:rgba(0,255,65,0.12); box-shadow:0 0 12px rgba(0,255,65,0.3); }
  .btn:disabled { opacity:0.4; cursor:not-allowed; }
  .fcbtn { background:rgba(100,65,255,0.15); border:1px solid #6441ff; color:#a78bff; font-family:'Share Tech Mono',monospace; font-size:10px; padding:4px 10px; cursor:pointer; transition:all 0.2s; }
  .fcbtn:hover { background:rgba(100,65,255,0.3); }
  .inp { background:transparent; border:none; outline:none; color:#00e5ff; font-family:'Share Tech Mono',monospace; font-size:12px; width:100%; caret-color:#00ff41; }
  .inp::placeholder { color:#1a3a1a; }
  .txrow { padding:5px 0; border-bottom:1px solid #0a1e0a; animation:slideIn 0.3s ease; }
  ::-webkit-scrollbar { width:2px; } ::-webkit-scrollbar-track { background:#020b03; } ::-webkit-scrollbar-thumb { background:#0d3b0d; }
  .pu { animation:priceUp 0.8s ease; } .pd { animation:priceDn 0.8s ease; }
  .tline { animation:fadeUp 0.2s ease; line-height:1.5; }
  @media (max-width:640px) { .donly { display:none !important; } .main-grid { grid-template-columns:1fr !important; } }
`;

const AGENTS = [
  {id:"AGT-001",name:"ORACLE", role:"Market Analyst",  addr:"0x1a2b...9f0e",status:"active",    task:"Scanning Base mempool",       txc:247},
  {id:"AGT-002",name:"CIPHER", role:"Security Auditor",addr:"0x5e6f...3c4d",status:"active",    task:"Verifying contract ABIs",     txc:183},
  {id:"AGT-003",name:"NEXUS",  role:"Coordinator",     addr:"0x9c8d...1a2b",status:"active",    task:"Orchestrating swarm",         txc:512},
  {id:"AGT-004",name:"PHANTOM",role:"Tx Router",       addr:"0x3k4l...7o8p",status:"idle",      task:"Awaiting orders",             txc:89},
  {id:"AGT-005",name:"VECTOR", role:"Data Aggregator", addr:"0x7u8v...1y2z",status:"processing",task:"Aggregating on-chain signals",txc:334},
  {id:"AGT-006",name:"SPECTER",role:"Privacy Layer",   addr:"0x2e3f...6i7j",status:"offline",   task:"Thermal limit exceeded",      txc:0},
];
const SC={active:"#00ff41",idle:"#ffff00",processing:"#00e5ff",offline:"#333"};
const TXTYPE=["SWAP","TRANSFER","STAKE","BRIDGE","ATTEST","MINT"];
const TS=()=>new Date().toLocaleTimeString("en-US",{hour12:false});
const rnd=n=>Math.random().toString(16).substr(2,n);

function genTx(){
  const pool=AGENTS.filter(a=>a.status!=="offline");
  const ag=pool[Math.floor(Math.random()*pool.length)];
  return{id:"0x"+rnd(8)+"...",agent:ag.name,type:TXTYPE[Math.floor(Math.random()*TXTYPE.length)],amt:(Math.random()*4+0.001).toFixed(4)+" ETH",time:TS(),ok:Math.random()>0.12,blk:(Math.floor(Math.random()*9999)+18200000)};
}
function genPrice(prev){
  const E=prev?Math.max(1800,parseFloat(prev.E)+(Math.random()*18-9)).toFixed(2):"2487.34";
  const B=prev?Math.max(40000,parseFloat(prev.B)+(Math.random()*180-90)).toFixed(2):"68421.00";
  const G=(Math.random()*3.5+0.4).toFixed(4);
  const ed=prev?(parseFloat(E)>=parseFloat(prev.E)?"u":"d"):"u";
  const bd=prev?(parseFloat(B)>=parseFloat(prev.B)?"u":"d"):"u";
  return{E,B,G,ed,bd};
}

function Topo({agents,sel,onSel}){
  const cx=65,cy=65,r=44;
  const pos=agents.map((_,i)=>{const a=(i/agents.length)*2*Math.PI-Math.PI/2;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};});
  return(
    <svg width="130" height="130" style={{display:"block",margin:"0 auto"}}>
      <circle cx={cx} cy={cy} r={9} fill="none" stroke="#00ff41" strokeWidth={0.8} opacity={0.5}/>
      <circle cx={cx} cy={cy} r={5} fill="rgba(0,255,65,0.15)" stroke="#00ff41" strokeWidth={1}/>
      <text x={cx} y={cy+3} textAnchor="middle" fill="#00ff41" fontSize={4.5} fontFamily="Orbitron">N</text>
      {agents.map((ag,i)=>(<line key={ag.id} x1={cx} y1={cy} x2={pos[i].x} y2={pos[i].y} stroke={SC[ag.status]} strokeWidth={0.5} opacity={ag.status==="offline"?0.1:0.25} strokeDasharray={ag.status==="idle"?"2,3":"none"}/>))}
      {agents.map((ag,i)=>(<g key={ag.id} onClick={()=>onSel(ag)} style={{cursor:"pointer"}}>
        <circle cx={pos[i].x} cy={pos[i].y} r={10} fill={sel?.id===ag.id?`${SC[ag.status]}22`:"rgba(0,0,0,0.5)"} stroke={SC[ag.status]} strokeWidth={sel?.id===ag.id?1.5:0.8} opacity={ag.status==="offline"?0.3:1}/>
        <text x={pos[i].x} y={pos[i].y+3} textAnchor="middle" fill={SC[ag.status]} fontSize={5} fontFamily="Orbitron" opacity={ag.status==="offline"?0.3:1}>{ag.name.substr(0,3)}</text>
      </g>))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0d2b0d" strokeWidth={0.5} strokeDasharray="1,4"/>
    </svg>
  );
}

export default function App(){
  const[wallet,setWallet]=useState(null);
  const[fcUser,setFcUser]=useState(null);
  const[isMini,setIsMini]=useState(false);
  const[msgs,setMsgs]=useState([{r:"a",c:"> NEXUS ONLINE.\n> Multi-agent swarm initialized. 5/6 agents active on Base Chain.\n> SPECTER offline — thermal limit exceeded.\n\nEnter command."}]);
  const[hist,setHist]=useState([]);
  const[inp,setInp]=useState("");
  const[load,setLoad]=useState(false);
  const[price,setPrice]=useState(genPrice(null));
  const[pflash,setPflash]=useState({});
  const[txs,setTxs]=useState(()=>[genTx(),genTx(),genTx(),genTx()]);
  const[tlog,setTlog]=useState([
    {t:TS(),m:"[SYS] AGENT//MESH v2.4.1 — Synthesis Hackathon 2026",tp:"s"},
    {t:TS(),m:"[NET] Connected to Base Chain mainnet",tp:"n"},
    {t:TS(),m:"[AGT] 5 agents verified and active on-chain",tp:"a"},
    {t:TS(),m:"[WARN] SPECTER offline — thermal shutdown triggered",tp:"w"},
  ]);
  const[sel,setSel]=useState(null);
  const endRef=useRef(null);

  useEffect(()=>{
    (async()=>{
      try{
        const ctx=await sdk.context;
        if(ctx?.user){setIsMini(true);setFcUser(ctx.user);const addr=ctx.user.verifiedAddresses?.ethAddresses?.[0];if(addr)setWallet(addr.slice(0,6)+"..."+addr.slice(-4));setTlog(p=>[...p,{t:TS(),m:`[FC] @${ctx.user.username} connected`,tp:"n"}].slice(-25));}
        await sdk.actions.ready();
      }catch{/* browser mode */}
    })();
  },[]);

  useEffect(()=>{const id=setInterval(()=>{setPrice(prev=>{const next=genPrice(prev);setPflash({e:next.ed,b:next.bd});setTimeout(()=>setPflash({}),800);return next;});},2800);return()=>clearInterval(id);},[]);
  useEffect(()=>{const id=setInterval(()=>{const tx=genTx();setTxs(p=>[tx,...p].slice(0,8));setTlog(p=>[...p,{t:TS(),m:`[${tx.agent}] ${tx.type} ${tx.amt} — ${tx.id}`,tp:"a"}].slice(-25));},3500);return()=>clearInterval(id);},[]);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const connFC=async()=>{try{const acc=await sdk.wallet.ethProvider.request({method:"eth_requestAccounts"});if(acc[0]){const a=acc[0].slice(0,6)+"..."+acc[0].slice(-4);setWallet(a);setTlog(p=>[...p,{t:TS(),m:`[WALLET] ${a} · Base`,tp:"n"}].slice(-25));}}catch(e){alert("Error: "+e.message);}};
  const connMM=async()=>{if(window.ethereum){const acc=await window.ethereum.request({method:"eth_requestAccounts"});const a=acc[0].slice(0,6)+"..."+acc[0].slice(-4);setWallet(a);setTlog(p=>[...p,{t:TS(),m:`[WALLET] ${a} · Base`,tp:"n"}].slice(-25));}else alert("Open in Farcaster or install MetaMask.");};

  const send=async()=>{
    const txt=inp.trim();if(!txt||load)return;
    setInp("");setMsgs(p=>[...p,{r:"u",c:txt}]);setLoad(true);
    const nextHist=[...hist,{role:"user",content:txt}];
    try{
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:nextHist})});
      const data=await res.json();
      const reply=data.content?.[0]?.text||"> ERROR: Signal lost.";
      setMsgs(p=>[...p,{r:"a",c:reply}]);
      setHist([...nextHist,{role:"assistant",content:reply}]);
    }catch{setMsgs(p=>[...p,{r:"a",c:"> ERROR: Network disruption."}]);}
    setLoad(false);
  };
  const onKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};
  const TC={s:"#00ff41",n:"#00e5ff",a:"#7acc7a",w:"#ffff00"};
  const PC=d=>d==="u"?"#00ff41":d==="d"?"#ff3131":"#00e5ff";
  const PA=d=>d==="u"?"pu":d==="d"?"pd":"";

  return(<><style>{STYLE}</style>
  <div className="scanlines" style={{height:"100dvh",width:"100vw",display:"flex",flexDirection:"column",background:"#020c03",fontFamily:"'Share Tech Mono',monospace",color:"#b8ffb8",overflow:"hidden"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 12px",borderBottom:"1px solid #0d2b0d",background:"rgba(0,0,0,0.9)",flexShrink:0,gap:8,flexWrap:"wrap"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span className="logo">AGENT//MESH</span>
        {isMini&&<span style={{fontSize:7,color:"#6441ff",border:"1px solid #6441ff",padding:"1px 5px"}}>FC MINI APP</span>}
      </div>
      <div className="donly" style={{display:"flex",gap:14,fontSize:10}}>
        {[{l:"ETH",v:`$${price.E}`,d:pflash.e||price.ed},{l:"BTC",v:`$${price.B}`,d:pflash.b||price.bd},{l:"GAS",v:`${price.G}g`,d:"n"}].map(p=>(
          <span key={p.l} style={{color:"#2a4a2a"}}>{p.l} <span className={PA(p.d)} style={{color:PC(p.d)}}>{p.d==="u"?"↑":p.d==="d"?"↓":""}{p.v}</span></span>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        {fcUser&&<span style={{fontSize:8,color:"#a78bff"}}>@{fcUser.username}</span>}
        {wallet?(<span style={{fontSize:9,color:"#00e5ff",border:"1px solid #003a5a",padding:"2px 7px"}}>◆ {wallet}</span>):isMini?(<button className="fcbtn" onClick={connFC}>⬡ CONNECT</button>):(<button className="btn" onClick={connMM}>CONNECT WALLET</button>)}
      </div>
    </div>
    <div className="main-grid" style={{flex:1,display:"grid",gridTemplateColumns:"200px 1fr 240px",overflow:"hidden"}}>
      <div className="panel panel-glow donly" style={{borderRight:"1px solid #0d2b0d",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"7px 10px",borderBottom:"1px solid #0d2b0d",display:"flex",alignItems:"center",gap:6}}><span style={{color:"#00ff41",fontSize:9}}>◈</span><span className="ptitle">AGENT REGISTRY</span></div>
        <div style={{padding:"8px 0 4px",borderBottom:"1px solid #0a1e0a"}}>
          <Topo agents={AGENTS} sel={sel} onSel={ag=>setSel(p=>p?.id===ag.id?null:ag)}/>
          <div style={{textAlign:"center",fontSize:7,color:"#1a3a1a",letterSpacing:2,marginTop:2}}>SWARM TOPOLOGY · BASE</div>
        </div>
        <div style={{flex:1,overflow:"auto",padding:"5px 7px"}}>
          {AGENTS.map(ag=>(<div key={ag.id} className={`agent-card${sel?.id===ag.id?" active":""}`} style={{"--sc":SC[ag.status]}} onClick={()=>setSel(p=>p?.id===ag.id?null:ag)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
              <span style={{fontFamily:"Orbitron,monospace",fontSize:9,color:SC[ag.status]}}>{ag.name}</span>
              <div style={{display:"flex",alignItems:"center",gap:3}}><span className="sdot" style={{backgroundColor:SC[ag.status]}}/><span style={{fontSize:7,color:SC[ag.status]}}>{ag.status.toUpperCase()}</span></div>
            </div>
            <div style={{fontSize:7,color:"#2a4a2a",marginBottom:2}}>{ag.role}</div>
            <div style={{fontSize:8,color:"#7acc7a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ag.task}</div>
            {sel?.id===ag.id&&(<div style={{marginTop:5,paddingTop:5,borderTop:"1px solid #0d2b0d",fontSize:7,color:"#2a4a2a"}}><div>ADDR: {ag.addr}</div><div>TXS: {ag.txc} · {ag.id}</div></div>)}
          </div>))}
        </div>
        <div style={{padding:"6px 10px",borderTop:"1px solid #0d2b0d",fontSize:7,color:"#2a4a2a"}}>
          {[["TOTAL TXS","1,365","#00ff41"],["ACTIVE","5/6","#00e5ff"],["CHAIN","BASE","#00ff41"]].map(([k,v,c])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span>{k}</span><span style={{color:c}}>{v}</span></div>))}
        </div>
      </div>
      <div className="panel panel-glow" style={{borderRight:"1px solid #0d2b0d",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"7px 12px",borderBottom:"1px solid #0d2b0d",display:"flex",alignItems:"center",gap:7}}><span style={{color:"#00e5ff",fontSize:9}}>◈</span><span className="ptitle" style={{color:"#00e5ff"}}>NEXUS AI COORDINATOR</span><span style={{marginLeft:"auto",fontSize:7,color:"#1a3a1a",letterSpacing:2}}>GROQ · LLAMA3</span></div>
        <div style={{flex:1,overflow:"auto",padding:"8px 12px"}}>
          {msgs.map((m,i)=>(<div key={i} className={m.r==="u"?"msg-u":"msg-a"}><div style={{fontSize:7,color:"#1a3a1a",marginBottom:3,letterSpacing:2}}>{m.r==="u"?`▸ OPERATOR [${wallet||"UNAUTH"}]`:"▸ NEXUS [AI COORDINATOR]"}</div><div style={{fontSize:11,lineHeight:1.65,whiteSpace:"pre-wrap",color:m.r==="u"?"#00e5ff":"#b8ffb8"}}>{m.c}</div></div>))}
          {load&&(<div className="msg-a"><div style={{fontSize:7,color:"#1a3a1a",marginBottom:3}}>▸ NEXUS [PROCESSING]</div><span className="blink" style={{fontSize:11,color:"#00ff41"}}>ROUTING QUERY</span></div>)}
          <div ref={endRef}/>
        </div>
        <div style={{padding:"8px 12px",borderTop:"1px solid #0d2b0d",display:"flex",alignItems:"center",gap:6,background:"rgba(0,0,0,0.5)"}}>
          <span style={{color:"#0d3b0d",fontSize:12,flexShrink:0}}>{">"}</span>
          <input className="inp" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={onKey} placeholder="ENTER COMMAND FOR THE SWARM..." disabled={load}/>
          <button className="btn" onClick={send} disabled={load} style={{padding:"3px 9px",flexShrink:0}}>{load?"···":"EXEC"}</button>
        </div>
      </div>
      <div className="panel panel-glow donly" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"7px 10px",borderBottom:"1px solid #0d2b0d",display:"flex",alignItems:"center",gap:6}}><span style={{color:"#ff00ff",fontSize:9}}>◈</span><span className="ptitle" style={{color:"#ff00ff"}}>CHAIN MONITOR</span></div>
        <div style={{padding:"8px 10px",borderBottom:"1px solid #0d2b0d"}}>
          <div style={{fontSize:7,color:"#1a3a1a",letterSpacing:3,marginBottom:7}}>LIVE SIGNALS · BASE</div>
          {[{l:"ETH/USD",v:`$${price.E}`,d:price.ed,s:"Base L2"},{l:"BTC/USD",v:`$${price.B}`,d:price.bd,s:"BTC"},{l:"GAS",v:`${price.G} GWEI`,d:"n",s:"Base"},{l:"BLOCK",v:"18,204,831",d:"u",s:"latest"}].map(p=>(<div key={p.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div><div style={{fontSize:8,color:"#2a4a2a"}}>{p.l}</div><div style={{fontSize:6,color:"#1a3a1a"}}>{p.s}</div></div><span style={{fontSize:11,color:PC(p.d),fontFamily:"monospace"}}>{p.d==="u"?"↑ ":p.d==="d"?"↓ ":""}{p.v}</span></div>))}
        </div>
        <div style={{padding:"6px 10px",borderBottom:"1px solid #0d2b0d",display:"flex",alignItems:"center",gap:6}}><span style={{color:"#ffff00",fontSize:9}}>◈</span><span className="ptitle" style={{color:"#ffff00"}}>TX LOG</span></div>
        <div style={{flex:1,overflow:"auto",padding:"3px 10px"}}>
          {txs.map((tx,i)=>(<div key={i} className="txrow"><div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><span style={{fontSize:9,color:"#00e5ff"}}>{tx.type}</span><span style={{fontSize:7,color:tx.ok?"#00ff41":"#ffff00"}}>{tx.ok?"✓ CONF":"⟳ PEND"}</span></div><div style={{fontSize:9,color:"#b8ffb8",marginBottom:1}}>{tx.amt}</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:7,color:"#2a4a2a"}}>{tx.agent}</span><span style={{fontSize:7,color:"#2a4a2a"}}>{tx.time}</span></div><div style={{fontSize:7,color:"#0d2b0d"}}>{tx.id} · #{tx.blk}</div></div>))}
        </div>
      </div>
    </div>
    <div style={{height:58,flexShrink:0,borderTop:"1px solid #0d2b0d",background:"rgba(0,0,0,0.95)",padding:"3px 12px",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div style={{fontSize:7,color:"#0d2b0d",letterSpacing:3,marginBottom:2}}>SYSTEM LOG</div>
      {tlog.slice(-3).map((l,i)=>(<div key={i} className="tline" style={{fontSize:8,color:TC[l.tp]||"#2a4a2a"}}><span style={{color:"#0d2b0d"}}>{l.t} </span>{l.m}</div>))}
    </div>
  </div></>);
}
