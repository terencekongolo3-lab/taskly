import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
// ─── THEME ────────────────────────────────────────────────────────────────────
const N = "#1B1F3B";       // navy
const O = "#F97316";       // orange
const G = "#059669";       // green
const BG = "#F4F4F8";
const W = "#FFFFFF";
const BD = "#E4E4ED";
const MU = "#8A8FA8";
const TX = "#1B1F3B";
const GOLD = "#F59E0B";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TASKS = [
  { id:"cv",        icon:"🔥", label:"CV-ketel",        sub:"plaatsen / verplaatsen" },
  { id:"stuc",      icon:"🪣", label:"Stucen",          sub:"wanden & plafonds" },
  { id:"badkamer",  icon:"🚿", label:"Badkamer",        sub:"renovatie & toilet" },
  { id:"dak",       icon:"🏠", label:"Dakkapel",        sub:"plaatsen & renoveren" },
  { id:"elektra",   icon:"⚡", label:"Elektra",         sub:"groepenkast & bedrading" },
  { id:"vloer",     icon:"🪵", label:"Vloer",           sub:"leggen & schuren" },
  { id:"schilder",  icon:"✏️", label:"Schilderwerk",    sub:"binnen & buiten" },
  { id:"tuin",      icon:"🌿", label:"Tuin",            sub:"aanleg & bestrating" },
  { id:"keuken",    icon:"🍳", label:"Keuken",          sub:"plaatsen & verbouwen" },
  { id:"isolatie",  icon:"🧱", label:"Isolatie",        sub:"spouw & vloer" },
  { id:"kozijnen",  icon:"🪟", label:"Kozijnen",        sub:"HR++ & draaikiepramen" },
  { id:"verwarming",icon:"♨️", label:"Vloerverwarming", sub:"aanleg & onderhoud" },
  { id:"diversen",  icon:"🔩", label:"Diversen",        sub:"overige klussen" },
];

const TASK_Q = {
  dak:      [{ id:"breedte",label:"Breedte (cm)",type:"number",ph:"bijv. 250"},{ id:"hoogte",label:"Hoogte (cm)",type:"number",ph:"bijv. 160"},{ id:"daktype",label:"Type dak",type:"select",opts:["Plat dak","Zadeldak","Schilddak"]}],
  stuc:     [{ id:"m2",label:"Aantal m²",type:"number",ph:"bijv. 40"},{ id:"ruimtes",label:"Welke ruimtes",type:"text",ph:"bijv. woonkamer + slaapkamer"},{ id:"type",label:"Type stuc",type:"select",opts:["Glad stucwerk","Sierpleister","Spachtelputz"]}],
  vloer:    [{ id:"m2",label:"Aantal m²",type:"number",ph:"bijv. 55"},{ id:"type",label:"Vloertype",type:"select",opts:["Laminaat","Parket","PVC","Tegels","Tapijt"]},{ id:"nu",label:"Huidige vloer",type:"text",ph:"bijv. beton / oude tegels"}],
  badkamer: [{ id:"m2",label:"Oppervlakte (m²)",type:"number",ph:"bijv. 6"},{ id:"toilet",label:"Inclusief toilet?",type:"select",opts:["Ja","Nee"]},{ id:"douche",label:"Douche type",type:"select",opts:["Inloopdouche","Douche+bad","Alleen bad"]}],
  cv:       [{ id:"merk",label:"Huidig merk",type:"text",ph:"bijv. Nefit"},{ id:"actie",label:"Wat moet er?",type:"select",opts:["Vervangen","Verplaatsen","Onderhoud"]}],
  keuken:   [{ id:"breedte",label:"Breedte (cm)",type:"number",ph:"bijv. 300"},{ id:"type",label:"Type keuken",type:"select",opts:["Rechte keuken","Hoekopstelling","Eiland"]}],
  schilder: [{ id:"m2",label:"Aantal m²",type:"number",ph:"bijv. 80"},{ id:"type",label:"Wat schilderen?",type:"select",opts:["Binnenmuren","Buitenmuren","Kozijnen","Alles"]}],
  tuin:     [{ id:"m2",label:"Tuinoppervlak (m²)",type:"number",ph:"bijv. 60"},{ id:"type",label:"Werkzaamheden",type:"select",opts:["Aanleg nieuw","Herinrichting","Bestrating","Onderhoud"]}],
};

const [pros, setPros] = useState([]);

useEffect(() => {
  supabase.from('vakmensen').select('*').then(({ data }) => {
    if (data) setPros(data);
  });
}, []);
const PLUS_JOBS = [
  { id:"p1", title:"Volledig dak leggen", location:"Kasteel Hoensbroek", budget:"€45.000 – €60.000", hamers:5, blur:true, img:"🏰", tags:["Groot project","Dakdekker","Spoedklus"] },
  { id:"p2", title:"Complete renovatie herenhuis", location:"Amsterdam Oud-Zuid", budget:"€80.000+", hamers:5, blur:true, img:"🏛️", tags:["Totaalrenovatie","Aannemer","Premium"] },
  { id:"p3", title:"Nieuwbouw aanbouw 60m²", location:"Utrecht Leidsche Rijn", budget:"€35.000 – €50.000", hamers:4, blur:true, img:"🏗️", tags:["Nieuwbouw","Aanbouw","Vergunning"] },
];

const INIT_MATCHES = [
  { id:"m1", proId:2, proName:"Stukadoors Maas", proAvatar:"SM", proColor:"#3B82F6",
    klus:"Stucen woonkamer 40m²", prijs:1840, status:"chatting",
    myConfirm:false, proConfirm:false, afspraak:null,
    msgs:[
      { from:"pro",  text:"Goedemiddag! Ik heb je aanvraag bekeken. 40m² stucen, dat doe ik graag voor €1.840 all-in.", time:"14:32" },
      { from:"klant",text:"Klinkt goed! Wanneer kunt u beginnen?", time:"14:35" },
      { from:"pro",  text:"Ik kan volgende week al starten. Donderdag of vrijdag past u?", time:"14:37" },
    ]
  },
];

const CAL_SLOTS = [
  { date:"Ma 14 apr", slots:["09:00","13:00","16:00"] },
  { date:"Di 15 apr", slots:["09:00","11:00"] },
  { date:"Do 17 apr", slots:["08:00","10:00","14:00"] },
  { date:"Vr 18 apr", slots:["09:00","12:00"] },
  { date:"Ma 21 apr", slots:["09:00","13:00"] },
];

// ─── MICRO UI ──────────────────────────────────────────────────────────────────
const Stars = ({ r, sm }) => (
  <span style={{ color:GOLD, fontSize:sm?11:13, fontFamily:"monospace" }}>
    {"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}
    <span style={{ color:MU, fontSize:sm?10:11, marginLeft:3 }}>{r}</span>
  </span>
);
const Hamers = ({ n }) => (
  <span style={{ fontSize:12, letterSpacing:1 }}>{"🔨".repeat(n)}{"○".repeat(5-n).split("").map((c,i)=><span key={i} style={{opacity:0.2}}>🔨</span>)}</span>
);
const Pill = ({ color, bg, children, small }) => (
  <span style={{ background:bg||"#EEF2FF", color:color||N, fontSize:small?10:11, fontWeight:700,
    padding:small?"2px 7px":"3px 10px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
    {children}
  </span>
);
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background:W, borderRadius:16, padding:16,
    border:`1px solid ${BD}`, boxShadow:"0 1px 6px rgba(0,0,0,0.05)",
    marginBottom:12, cursor:onClick?"pointer":"default", ...style }}>
    {children}
  </div>
);
const Lbl = ({ children }) => (
  <div style={{ fontSize:11, fontWeight:700, color:MU, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>{children}</div>
);
const OBtn = ({ label, onClick, disabled, full, outline, danger, small }) => (
  <button onClick={disabled?undefined:onClick} style={{
    width:full?"100%":undefined,
    background:outline||danger?"transparent":disabled?"#E5E7EB":`linear-gradient(135deg,${O},#EA580C)`,
    color:danger?"#EF4444":outline?N:disabled?MU:W,
    border:outline?`2px solid ${N}`:danger?`2px solid #EF4444`:"none",
    borderRadius:50, padding:small?"9px 18px":"13px 24px",
    fontSize:small?12:14, fontWeight:700,
    cursor:disabled?"not-allowed":"pointer",
    boxShadow:outline||disabled||danger?"none":`0 4px 14px rgba(249,115,22,0.4)`,
    transition:"all 0.15s", whiteSpace:"nowrap",
  }}>{label}</button>
);
const BackBtn = ({ onPress, light }) => (
  <button onClick={onPress} style={{ background:"none", border:"none",
    color:light?W:N, fontSize:13, fontWeight:700, cursor:"pointer", padding:"6px 0",
    display:"flex", alignItems:"center", gap:4 }}>← Terug</button>
);
const Av = ({ label, color, size=44 }) => (
  <div style={{ width:size, height:size, borderRadius:size*0.28, background:color,
    display:"flex", alignItems:"center", justifyContent:"center",
    color:W, fontWeight:800, fontSize:size*0.33, flexShrink:0 }}>{label}</div>
);
const Input = ({ value, onChange, placeholder, type="text" }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${BD}`,
      fontSize:14, background:W, color:TX, outline:"none", boxSizing:"border-box" }}/>
);
const Sel = ({ value, onChange, opts }) => (
  <select value={value} onChange={onChange}
    style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${BD}`,
      fontSize:14, background:W, color:TX, outline:"none" }}>
    <option value="">Kies...</option>
    {opts.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);
const ProgressBar = ({ step, total }) => (
  <div style={{ display:"flex", gap:5, padding:"4px 16px 14px" }}>
    {Array.from({length:total}).map((_,i) => (
      <div key={i} style={{ flex:1, height:5, borderRadius:3,
        background:i<step?N:"#E5E7EB", transition:"background 0.3s" }}/>
    ))}
  </div>
);
const BottomBar = ({ children }) => (
  <div style={{ padding:"12px 16px 24px", background:`linear-gradient(transparent,${BG} 35%)`, position:"sticky", bottom:0 }}>
    {children}
  </div>
);
const Phone = ({ children }) => (
  <div style={{ width:390, minHeight:"100vh", margin:"0 auto", background:BG,
    fontFamily:"'DM Sans','Segoe UI',sans-serif",
    boxShadow:"0 0 60px rgba(0,0,0,0.15), 0 0 0 1px #ddd",
    display:"flex", flexDirection:"column", overflow:"hidden" }}>
    {children}
  </div>
);

// ─── TABS ──────────────────────────────────────────────────────────────────────
function TabBar({ active, onChange, matchBadge }) {
  const tabs = [
    { id:"home",    icon:"🏠", label:"Home" },
    { id:"search",  icon:"🔍", label:"Zoeken" },
    { id:"post",    icon:"📋", label:"Klus" },
    { id:"matches", icon:"💬", label:"Matches" },
    { id:"profiel", icon:"👤", label:"Profiel" },
  ];
  return (
    <div style={{ display:"flex", background:W, borderTop:`1px solid ${BD}`, position:"sticky", bottom:0, zIndex:30 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex:1, padding:"10px 4px 12px", background:"none", border:"none",
          display:"flex", flexDirection:"column", alignItems:"center", gap:3,
          cursor:"pointer", position:"relative" }}>
          <span style={{ fontSize:21 }}>{t.icon}</span>
          <span style={{ fontSize:10, fontWeight:active===t.id?700:400, color:active===t.id?N:MU }}>{t.label}</span>
          {t.id==="matches" && matchBadge > 0 && (
            <div style={{ position:"absolute", top:5, right:"50%", transform:"translateX(10px)",
              background:O, color:W, fontSize:9, fontWeight:700, width:15, height:15,
              borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {matchBadge}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [profiel, setProfiel] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const [role, setRole]   = useState(null);
  const [tab, setTab]     = useState("home");
  const [sub, setSub]     = useState(null);
  const [subD, setSubD]   = useState(null);
  
  const [radius, setRadius]   = useState(40);
  const [filterTask, setFT]   = useState(null);
  
  const [pStep, setPStep]     = useState(1);
  const [pTasks, setPTasks]   = useState([]);
  const [pAnswers, setPAns]   = useState({});
  const [pDesc, setPDesc]     = useState("");
  const [pPhoto, setPPhoto]   = useState(null);
  const [pTiming, setPTiming] = useState("");
  const [pPosted, setPPosted] = useState(false);
  
  const [matches, setMatches]   = useState(INIT_MATCHES);
  const [chatMsg, setChatMsg]   = useState("");
  const [calOpen, setCalOpen]   = useState(false);
  const [propDate, setPropDate] = useState(null);
  const [hasPlusAcc, setPlus]   = useState(false);
  const [agendaItems, setAgenda]= useState([]);
  
  const go = (s, d=null) => { setSub(s); setSubD(d); };
  if (!user) return <Auth onLogin={(u, p) => { setUser(u); setProfiel(p); }} />;

  const unreadMatches = matches.filter(m => m.status === "chatting" && !m.myConfirm).length;

  // ── HOME ──────────────────────────────────────────────────────────────────
  const HomeScreen = () => (
    <div style={{ overflowY:"auto", flex:1 }}>
      <div style={{ background:"linear-gradient(150deg,#0f0c29,#1B1F3B,#2d2850)", padding:"32px 20px 36px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:240, height:240, background:"rgba(249,115,22,0.1)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ fontSize:11, color:"#FED7AA", letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>🇳🇱 100% Nederlands platform</div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:900, color:W, lineHeight:1.2, margin:"0 0 12px" }}>
          Taskly.<br/>Vind jouw vakman.<br/>Zonder gedoe.
        </h1>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, lineHeight:1.7, marginBottom:22 }}>
          Geen €35 per lead. Betaal alleen bij succes.<br/>Jij bepaalt wie je inhuurt.
        </p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <button style={{ background:`linear-gradient(135deg,${O},#EA580C)`, color:W, border:"none", borderRadius:50, padding:"12px 22px", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 18px rgba(249,115,22,0.4)" }}
            onClick={() => setTab("post")}>📋 Post een klus</button>
          <button style={{ background:"rgba(255,255,255,0.12)", color:W, border:"1px solid rgba(255,255,255,0.25)", borderRadius:50, padding:"12px 22px", fontSize:14, fontWeight:700, cursor:"pointer" }}
            onClick={() => setTab("search")}>🔍 Zoek vakman</button>
        </div>
      </div>

      {role === "vakman" && (
      <div style={{ margin:"16px 16px 4px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:TX }}>⭐ Premium Klussen</div>
          {!hasPlusAcc && <Pill color={GOLD} bg="#FEF3C7">Plus account</Pill>}
        </div>
        {PLUS_JOBS.map(j => (
          <div key={j.id} style={{ background:W, borderRadius:16, marginBottom:10, overflow:"hidden",
            border:`1px solid ${BD}`, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", cursor:"pointer" }}
            onClick={() => { if(!hasPlusAcc) go("plus-upsell"); }}>
            <div style={{ position:"relative" }}>
              <div style={{ background:`linear-gradient(135deg,#1B1F3B,#312E81)`, padding:"20px 16px" }}>
                <div style={{ fontSize:32, marginBottom:6 }}>{j.img}</div>
                <div style={{ display:"flex", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                  {j.tags.map(t => <Pill key={t} color={GOLD} bg="rgba(245,158,11,0.2)" small>{t}</Pill>)}
                </div>
                {hasPlusAcc ? (
                  <>
                    <div style={{ fontWeight:700, fontSize:16, color:W }}>{j.title}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginTop:2 }}>📍 {j.location}</div>
                    <div style={{ fontSize:15, fontWeight:800, color:GOLD, marginTop:4 }}>{j.budget}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight:700, fontSize:16, color:W, filter:"blur(5px)", userSelect:"none" }}>████████████████</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginTop:2, filter:"blur(4px)" }}>📍 ██████████████</div>
                    <div style={{ fontSize:15, fontWeight:800, color:GOLD, marginTop:4, filter:"blur(4px)" }}>€██.███ – €██.███</div>
                  </>
                )}
              </div>
              {!hasPlusAcc && (
                <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  background:"rgba(27,31,59,0.6)", backdropFilter:"blur(2px)" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>🔒</div>
                  <div style={{ fontWeight:700, color:W, fontSize:13 }}>Plus account vereist</div>
                  <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11, marginTop:3 }}>Klus grootte: <Hamers n={j.hamers}/></div>
                </div>
              )}
            </div>
          </div>
        ))}
        {!hasPlusAcc && (
          <button style={{ width:"100%", padding:"12px", background:GOLD, color:W, border:"none",
            borderRadius:12, fontWeight:700, fontSize:14, cursor:"pointer",
            boxShadow:"0 4px 14px rgba(245,158,11,0.4)", marginBottom:4 }}
            onClick={() => go("plus-upsell")}>
            ⭐ Ontgrendel Plus account →
          </button>
        )}
      </div>
      )}

      {role === "klant" && (
        <div style={{ margin:"16px 16px 4px" }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:TX, marginBottom:12 }}>
            Twee manieren om te starten
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:8 }}>
            <div style={{ background:W, borderRadius:16, padding:16, border:`1px solid ${BD}`,
              cursor:"pointer", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}
              onClick={() => setTab("post")}>
              <div style={{ fontSize:28, marginBottom:8 }}>📋</div>
              <div style={{ fontWeight:700, fontSize:14, color:TX, marginBottom:4 }}>Post je klus</div>
              <div style={{ fontSize:12, color:MU, lineHeight:1.5 }}>Vakmensen reageren met een offerte</div>
              <div style={{ marginTop:10, color:O, fontSize:12, fontWeight:700 }}>Start →</div>
            </div>
            <div style={{ background:W, borderRadius:16, padding:16, border:`1px solid ${BD}`,
              cursor:"pointer", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}
              onClick={() => setTab("search")}>
              <div style={{ fontSize:28, marginBottom:8 }}>🔍</div>
              <div style={{ fontWeight:700, fontSize:14, color:TX, marginBottom:4 }}>Zoek zelf</div>
              <div style={{ fontSize:12, color:MU, lineHeight:1.5 }}>Blader door vakmensen in jouw buurt</div>
              <div style={{ marginTop:10, color:O, fontSize:12, fontWeight:700 }}>Start →</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding:"8px 16px 24px" }}>
        <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:TX, marginBottom:12 }}>Waarom Taskly?</div>
        {[["🎯","Betaal bij succes","Vakmensen betalen geen lead-kosten"],["💬","Chat direct","Ingebouwde chat na een match"],["📅","Gedeelde agenda","Plan afspraken samen in de app"],["🔍","KvK geverifieerd","Alleen echte professionals"],["🇳🇱","100% Nederlands","NL bedrijf, NL support"]].map(([ic,ti,de],i) => (
          <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"11px 0", borderTop:`1px solid ${BD}` }}>
            <div style={{ fontSize:20, width:32, textAlign:"center", flexShrink:0 }}>{ic}</div>
            <div><div style={{ fontWeight:700, fontSize:13, color:TX }}>{ti}</div><div style={{ fontSize:12, color:MU, marginTop:2 }}>{de}</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── PLUS UPSELL ──────────────────────────────────────────────────────────
  if (sub === "plus-upsell") return (
    <Phone>
      <div style={{ overflowY:"auto", flex:1 }}>
        <div style={{ background:"linear-gradient(135deg,#78350F,#92400E,#B45309)", padding:"24px 20px 28px" }}>
          <BackBtn light onPress={() => go(null)} />
          <div style={{ textAlign:"center", paddingTop:8 }}>
            <div style={{ fontSize:48, marginBottom:8 }}>⭐</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:900, color:W }}>Taskly Plus</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginTop:6 }}>Voor vakmensen die groot willen denken</div>
          </div>
        </div>
        <div style={{ padding:"20px 16px" }}>
          <Card>
            <Lbl>Wat je krijgt</Lbl>
            {["Toegang tot premium klussen (🔨🔨🔨🔨🔨)","Klussen van €10.000+","Exclusieve projecten: kastelen, herrenhuizen, nieuwbouw","Als eerste reageren op grote opdrachten","Verified Plus badge op je profiel","Prioriteit in zoekresultaten"].map((t,i) => (
              <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderTop:i?`1px solid ${BD}`:"none" }}>
                <span style={{ color:GOLD, fontWeight:700 }}>✓</span>
                <span style={{ fontSize:13, color:TX }}>{t}</span>
              </div>
            ))}
          </Card>
          <Card>
            <Lbl>Voorbeeld Plus klussen</Lbl>
            {PLUS_JOBS.map(j => (
              <div key={j.id} style={{ display:"flex", gap:12, padding:"10px 0", borderTop:`1px solid ${BD}` }}>
                <span style={{ fontSize:24 }}>{j.img}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:TX }}>{j.title}</div>
                  <div style={{ fontSize:12, color:MU }}>📍 {j.location} · {j.budget}</div>
                  <Hamers n={j.hamers}/>
                </div>
              </div>
            ))}
          </Card>
          <div style={{ background:`linear-gradient(135deg,#78350F,#B45309)`, borderRadius:16, padding:20, marginBottom:16, textAlign:"center" }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>Prijs</div>
            <div style={{ fontSize:36, fontWeight:900, color:W }}>€49<span style={{ fontSize:16, fontWeight:400 }}>/maand</span></div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:4 }}>Maandelijks opzegbaar. Geen verborgen kosten.</div>
          </div>
          <button style={{ width:"100%", padding:"15px", background:GOLD, color:W, border:"none",
            borderRadius:50, fontWeight:700, fontSize:16, cursor:"pointer",
            boxShadow:"0 4px 18px rgba(245,158,11,0.5)" }}
            onClick={() => { setPlus(true); go(null); setTab("home"); }}>
            ⭐ Start Plus account
          </button>
          <div style={{ height:24 }}/>
        </div>
      </div>
      <TabBar active={tab} onChange={t => { setTab(t); go(null); }} matchBadge={unreadMatches}/>
    </Phone>
  );

  // ── SEARCH ────────────────────────────────────────────────────────────────
  const SearchScreen = () => {
    const filtered = pros.filter(p =>
      p.distance <= radius &&
      (!filterTask || p.tasks.includes(filterTask))
    );
    if (sub === "pro-detail") {
      const p = subD;
      return (
        <div style={{ overflowY:"auto", flex:1 }}>
          <div style={{ background:`linear-gradient(135deg,${N},#2d2850)`, padding:"14px 16px 22px" }}>
            <BackBtn light onPress={() => go(null)}/>
            <div style={{ display:"flex", gap:14, alignItems:"center", marginTop:12 }}>
              <Av label={p.avatar} color={p.color} size={56}/>
              <div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:W }}>{p.name}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:2 }}>📍 {p.city} · {p.distance} km</div>
                <Stars r={p.rating}/>
              </div>
            </div>
            <div style={{ display:"flex", gap:7, marginTop:12, flexWrap:"wrap" }}>
              {p.verified ? <Pill color="#ECFDF5" bg="rgba(5,150,105,0.3)">🔍 KvK geverifieerd</Pill>
                : <Pill color="#FEF3C7" bg="rgba(217,119,6,0.3)">⏳ Niet geverifieerd</Pill>}
              <Pill color="#EEF2FF" bg="rgba(255,255,255,0.15)">{p.price} prijsklasse</Pill>
              <Pill color="#EEF2FF" bg="rgba(255,255,255,0.15)"><Hamers n={p.hamers}/></Pill>
            </div>
          </div>
          <div style={{ padding:16 }}>
            <Card>
              <Lbl>Werkzaamheden</Lbl>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {p.tasks.map(t => { const tk = TASKS.find(x=>x.id===t); return tk ? <span key={t} style={{ background:"#F3F4F6", borderRadius:20, padding:"4px 10px", fontSize:12, color:"#374151" }}>{tk.icon} {tk.label}</span> : null; })}
              </div>
            </Card>
            <Card>
              <Lbl>Offerte aanvragen</Lbl>
              <div style={{ fontSize:13, color:MU, lineHeight:1.6, marginBottom:14 }}>
                Vrijblijvend. <strong style={{color:G}}>Betaal alleen als je inhuurt.</strong>
              </div>
              <OBtn label="📄 Offerte aanvragen" full onClick={() => go(null)}/>
              <div style={{ marginTop:10 }}><OBtn label="💬 Start chat" full outline onClick={() => go(null)}/></div>
            </Card>
            <Card style={{ background:"#F9FAFB" }}>
              <Lbl>Transparantie</Lbl>
              <div style={{ fontSize:12, color:MU, lineHeight:1.6 }}>
                Taskly rekent <strong style={{color:TX}}>geen lead-kosten</strong>. Alleen een kleine success-fee bij een deal.
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div style={{ overflowY:"auto", flex:1 }}>
        <div style={{ background:N, padding:"14px 16px 16px" }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:W, marginBottom:12 }}>Zoek een vakman</div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:4 }}>
            <span>📍 Zoekgebied</span><span style={{ fontWeight:700, color:O }}>{radius} km</span>
          </div>
          <input type="range" min={5} max={100} step={5} value={radius} onChange={e=>setRadius(Number(e.target.value))} style={{ width:"100%", accentColor:O }}/>
        </div>
        <div style={{ padding:"10px 16px 4px", display:"flex", gap:7, overflowX:"auto", paddingBottom:10 }}>
          <span onClick={() => setFT(null)} style={{ background:!filterTask?N:W, color:!filterTask?W:MU,
            border:`1px solid ${BD}`, borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:700,
            cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>Alles</span>
          {TASKS.map(t => (
            <span key={t.id} onClick={() => setFT(filterTask===t.id?null:t.id)}
              style={{ background:filterTask===t.id?N:W, color:filterTask===t.id?W:MU,
                border:`1px solid ${BD}`, borderRadius:20, padding:"5px 12px", fontSize:12,
                cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
              {t.icon} {t.label}
            </span>
          ))}
        </div>
        <div style={{ padding:"4px 16px 4px", fontSize:12, color:MU }}>
          <strong style={{color:TX}}>{filtered.length} vakmensen</strong> gevonden
        </div>
        <div style={{ padding:"4px 16px" }}>
          {filtered.map((p, i) => (
            <div key={p.id} onClick={() => go("pro-detail", p)}
              style={{ background:W, borderRadius:18, padding:16, marginBottom:12,
                border:`1px solid ${BD}`, cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", gap:12 }}>
                <Av label={p.avatar} color={p.color}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div style={{ fontWeight:700, fontSize:15, color:TX }}>{p.name}</div>
                    <span style={{ fontWeight:800, color:O }}>{p.price}</span>
                  </div>
                  <div style={{ fontSize:12, color:MU, marginTop:1 }}>📍 {p.city} · {p.distance} km</div>
                  <Stars r={p.rating}/><span style={{ color:"#ccc", fontSize:11 }}> ({p.reviews})</span>
                  <div style={{ marginTop:5, display:"flex", gap:6, flexWrap:"wrap" }}>
                    {p.verified && <Pill color={N} bg="#EEF2FF" small>🔍 Geverifieerd</Pill>}
                    <Pill color={MU} bg="#F3F4F6" small><Hamers n={p.hamers}/></Pill>
                  </div>
                </div>
              </div>
              <div style={{ marginTop:10, fontSize:12, color:p.available==="Deze week"?G:"#D97706" }}>● {p.available}</div>
            </div>
          ))}
          <div style={{ height:20 }}/>
        </div>
      </div>
    );
  };

  // ── POST KLUS ─────────────────────────────────────────────────────────────
  const PostScreen = () => {
    const TOTAL = 4;
    const fileRef = useRef();

    if (pPosted) return (
      <div style={{ overflowY:"auto", flex:1, padding:"40px 20px", textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:TX, marginBottom:8 }}>Klus geplaatst!</div>
        <div style={{ fontSize:14, color:MU, lineHeight:1.7, marginBottom:28 }}>
          Vakmensen in jouw regio kunnen nu reageren. Je ontvangt een melding zodra er een match is.
        </div>
        <Card>
          <Lbl>Geplaatste klussen</Lbl>
          {pTasks.map(tid => {
            const tk = TASKS.find(t=>t.id===tid);
            return (
              <div key={tid} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderTop:`1px solid ${BD}` }}>
                <span style={{ fontSize:22 }}>{tk?.icon}</span>
                <div style={{ fontWeight:600, fontSize:13, color:TX }}>{tk?.label}</div>
              </div>
            );
          })}
          {pPhoto && <div style={{ fontSize:12, color:G, marginTop:8 }}>📎 Foto bijgevoegd</div>}
        </Card>
        <OBtn label="💬 Bekijk matches" full onClick={() => { setPPosted(false); setPStep(1); setPTasks([]); setPAns({}); setPDesc(""); setPPhoto(null); setPTiming(""); setTab("matches"); }}/>
      </div>
    );

    if (pStep === 1) return (
      <div style={{ display:"flex", flexDirection:"column", flex:1 }}>
        <div style={{ padding:"16px 16px 4px" }}>
          <ProgressBar step={1} total={TOTAL}/>
          <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:TX, marginBottom:4 }}>Welke klussen wil je plaatsen?</div>
          <div style={{ fontSize:13, color:MU, marginBottom:12 }}>Selecteer één of meerdere klussen</div>
        </div>
        <div style={{ overflowY:"auto", flex:1, padding:"4px 16px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {TASKS.map(t => {
              const active = pTasks.includes(t.id);
              return (
                <div key={t.id} onClick={() => setPTasks(prev => prev.includes(t.id) ? prev.filter(x=>x!==t.id) : [...prev, t.id])}
                  style={{ background:active?"#EEF2FF":W, border:`2px solid ${active?N:BD}`,
                    borderRadius:16, padding:"18px 10px 14px", textAlign:"center",
                    cursor:"pointer", position:"relative", transition:"all 0.15s" }}>
                  <div style={{ position:"absolute", top:10, right:10, width:18, height:18, borderRadius:5,
                    border:`2px solid ${active?N:"#D1D5DB"}`, background:active?N:"transparent",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {active && <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div style={{ fontSize:30, marginBottom:7 }}>{t.icon}</div>
                  <div style={{ fontWeight:700, fontSize:13, color:TX, lineHeight:1.3 }}>{t.label}</div>
                  <div style={{ fontSize:11, color:MU, marginTop:3 }}>{t.sub}</div>
                </div>
              );
            })}
          </div>
          <div style={{ height:80 }}/>
        </div>
        <BottomBar>
          {pTasks.length > 0 && <div style={{ fontSize:12, color:MU, textAlign:"center", marginBottom:8 }}>{pTasks.length} klus{pTasks.length>1?"sen":""} geselecteerd</div>}
          <OBtn label="Volgende →" full disabled={pTasks.length===0} onClick={() => setPStep(2)}/>
        </BottomBar>
      </div>
    );

    if (pStep === 2) return (
      <div style={{ display:"flex", flexDirection:"column", flex:1 }}>
        <div style={{ padding:"16px 16px 4px" }}>
          <BackBtn onPress={() => setPStep(1)}/>
          <ProgressBar step={2} total={TOTAL}/>
          <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:TX, marginBottom:4 }}>Specificaties</div>
          <div style={{ fontSize:13, color:MU, marginBottom:12 }}>Vul per klus de details in</div>
        </div>
        <div style={{ overflowY:"auto", flex:1, padding:"4px 16px" }}>
          {pTasks.map(tid => {
            const tk = TASKS.find(t=>t.id===tid);
            const qs = TASK_Q[tid] || [];
            return (
              <Card key={tid}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
                  <span style={{ fontSize:24 }}>{tk?.icon}</span>
                  <div style={{ fontWeight:700, fontSize:15, color:TX }}>{tk?.label}</div>
                </div>
                {qs.length > 0 ? qs.map((q, i) => (
                  <div key={q.id} style={{ marginBottom:i<qs.length-1?14:0 }}>
                    <label style={{ fontSize:13, fontWeight:600, color:TX, display:"block", marginBottom:6 }}>{q.label}</label>
                    {q.type==="select"
                      ? <Sel value={pAnswers[`${tid}_${q.id}`]||""} onChange={e => setPAns({...pAnswers,[`${tid}_${q.id}`]:e.target.value})} opts={q.opts}/>
                      : <Input type={q.type} value={pAnswers[`${tid}_${q.id}`]||""} placeholder={q.ph} onChange={e => setPAns({...pAnswers,[`${tid}_${q.id}`]:e.target.value})}/>
                    }
                  </div>
                )) : <div style={{ fontSize:13, color:MU }}>Omschrijf de klus in stap 3.</div>}
              </Card>
            );
          })}
          <div style={{ height:80 }}/>
        </div>
        <BottomBar><OBtn label="Volgende →" full onClick={() => setPStep(3)}/></BottomBar>
      </div>
    );

    if (pStep === 3) return (
      <div style={{ display:"flex", flexDirection:"column", flex:1 }}>
        <div style={{ padding:"16px 16px 4px" }}>
          <BackBtn onPress={() => setPStep(2)}/>
          <ProgressBar step={3} total={TOTAL}/>
          <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:TX, marginBottom:4 }}>Toelichting & foto</div>
          <div style={{ fontSize:13, color:MU, marginBottom:12 }}>Help vakmensen met een goede omschrijving</div>
        </div>
        <div style={{ overflowY:"auto", flex:1, padding:"4px 16px" }}>
          <Card>
            <Lbl>Omschrijving (optioneel)</Lbl>
            <textarea value={pDesc} onChange={e => setPDesc(e.target.value)}
              placeholder="Beschrijf bijzonderheden, gewenst materiaal, toegankelijkheid…"
              style={{ width:"100%", minHeight:90, padding:"11px 14px", borderRadius:10,
                border:`1px solid ${BD}`, fontSize:13, color:TX, resize:"none",
                outline:"none", lineHeight:1.6, boxSizing:"border-box" }}/>
          </Card>
          <Card>
            <Lbl>Foto toevoegen (optioneel)</Lbl>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
              onChange={e => { if(e.target.files[0]) setPPhoto(e.target.files[0].name); }}/>
            {!pPhoto ? (
              <div onClick={() => fileRef.current.click()}
                style={{ border:`2px dashed ${BD}`, borderRadius:12, padding:"24px 16px",
                  textAlign:"center", cursor:"pointer", background:"#FAFAFA" }}>
                <div style={{ fontSize:32, marginBottom:6 }}>📷</div>
                <div style={{ fontWeight:600, fontSize:14, color:TX, marginBottom:4 }}>Foto uploaden</div>
                <div style={{ fontSize:12, color:MU }}>Tik om een foto te kiezen van je telefoon</div>
              </div>
            ) : (
              <div style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 14px",
                background:"#ECFDF5", borderRadius:12, border:"1px solid #A7F3D0" }}>
                <span style={{ fontSize:24 }}>🖼️</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:G }}>Foto toegevoegd</div>
                  <div style={{ fontSize:12, color:MU, marginTop:1 }}>{pPhoto}</div>
                </div>
                <button onClick={() => setPPhoto(null)} style={{ background:"none", border:"none",
                  color:"#EF4444", fontSize:18, cursor:"pointer", padding:4 }}>✕</button>
              </div>
            )}
          </Card>
          <Card>
            <Lbl>Wanneer moet het klaar zijn?</Lbl>
            {[{id:"spoed",lb:"Met spoed"},{id:"2weken",lb:"Binnen 2 weken"},{id:"maand",lb:"Binnen een maand"},{id:"flex",lb:"Geen haast"}].map(t => (
              <div key={t.id} onClick={() => setPTiming(t.id)}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"13px 0", borderBottom:`1px solid ${BD}`, cursor:"pointer" }}>
                <span style={{ fontSize:14, fontWeight:pTiming===t.id?700:400, color:pTiming===t.id?N:TX }}>{t.lb}</span>
                <div style={{ width:18, height:18, borderRadius:"50%",
                  border:`2px solid ${pTiming===t.id?N:"#D1D5DB"}`,
                  background:pTiming===t.id?N:"transparent",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {pTiming===t.id && <div style={{ width:6, height:6, borderRadius:"50%", background:W }}/>}
                </div>
              </div>
            ))}
          </Card>
          <div style={{ height:80 }}/>
        </div>
        <BottomBar><OBtn label="Controleer →" full onClick={() => setPStep(4)}/></BottomBar>
      </div>
    );

    if (pStep === 4) return (
      <div style={{ display:"flex", flexDirection:"column", flex:1 }}>
        <div style={{ padding:"16px 16px 4px" }}>
          <BackBtn onPress={() => setPStep(3)}/>
          <ProgressBar step={4} total={TOTAL}/>
          <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:TX, marginBottom:4 }}>Controleer je klus</div>
        </div>
        <div style={{ overflowY:"auto", flex:1, padding:"4px 16px" }}>
          <Card>
            <Lbl>Geselecteerde klussen</Lbl>
            {pTasks.map(tid => {
              const tk = TASKS.find(t=>t.id===tid);
              return (
                <div key={tid} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderTop:`1px solid ${BD}` }}>
                  <span style={{ fontSize:22 }}>{tk?.icon}</span>
                  <div style={{ fontWeight:600, fontSize:14, color:TX }}>{tk?.label}</div>
                </div>
              );
            })}
          </Card>
          {pDesc && <Card><Lbl>Omschrijving</Lbl><div style={{ fontSize:13, color:MU, lineHeight:1.6 }}>{pDesc}</div></Card>}
          {pPhoto && <Card><Lbl>Foto</Lbl><div style={{ fontSize:13, color:G }}>📎 {pPhoto}</div></Card>}
          {pTiming && <Card><Lbl>Timing</Lbl><div style={{ fontSize:14, fontWeight:600, color:TX }}>{{spoed:"Met spoed",["2weken"]:"Binnen 2 weken",maand:"Binnen een maand",flex:"Geen haast"}[pTiming]}</div></Card>}
          <div style={{ background:"#ECFDF5", border:"1px solid #A7F3D0", borderRadius:16, padding:16, marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#065F46", marginBottom:6 }}>✅ Wat gebeurt er?</div>
            <div style={{ fontSize:13, color:"#047857", lineHeight:1.7 }}>• Vakmensen zien je klus<br/>• Ze sturen een offerte<br/>• Jij accepteert → chat start automatisch<br/>• Plan samen een afspraak in de app</div>
          </div>
          <div style={{ height:80 }}/>
        </div>
        <BottomBar><OBtn label="🚀 Klus plaatsen" full onClick={() => setPPosted(true)}/></BottomBar>
      </div>
    );
    return null;
  };

  // ── CHAT SCREEN ───────────────────────────────────────────────────────────
  if (sub === "chat") {
    const match = matches.find(m => m.id === subD);
    if (!match) return null;

    const sendMsg = () => {
      if (!chatMsg.trim()) return;
      setMatches(prev => prev.map(m => m.id === match.id
        ? { ...m, msgs: [...m.msgs, { from:"klant", text:chatMsg.trim(), time:new Date().toLocaleTimeString("nl",{hour:"2-digit",minute:"2-digit"}) }] }
        : m
      ));
      setChatMsg("");
    };

    const proposeDate = (date, time) => {
      const dateStr = `${date} ${time}`;
      setPropDate({ matchId:match.id, date, time });
      setCalOpen(false);
      setMatches(prev => prev.map(m => m.id === match.id
        ? { ...m, msgs: [...m.msgs, {
            from:"klant", time:new Date().toLocaleTimeString("nl",{hour:"2-digit",minute:"2-digit"}),
            text:`📅 Ik stel voor: ${dateStr}`, isDateProp:true, dateStr }] }
        : m
      ));
    };

    const acceptDeal = () => {
      setMatches(prev => prev.map(m => m.id === match.id ? {...m, myConfirm:true} : m));
      if (match.proConfirm) {
        const slot = propDate ? `${propDate.date} ${propDate.time}` : match.afspraak;
        setAgenda(prev => [...prev, { id: Date.now(), title: match.klus, with: match.proName, time: slot, color: match.proColor }]);
      }
    };

    const bothConfirmed = match.myConfirm && match.proConfirm;

    return (
      <Phone>
        <div style={{ background:`linear-gradient(135deg,${N},#2d2850)`, padding:"12px 16px 14px" }}>
          <BackBtn light onPress={() => go(null)}/>
          <div style={{ display:"flex", gap:12, alignItems:"center", marginTop:10 }}>
            <Av label={match.proAvatar} color={match.proColor} size={42}/>
            <div>
              <div style={{ fontWeight:700, fontSize:16, color:W }}>{match.proName}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>{match.klus}</div>
            </div>
            <div style={{ marginLeft:"auto", textAlign:"right" }}>
              <div style={{ fontSize:18, fontWeight:900, color:GOLD }}>€{match.prijs.toLocaleString("nl")}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)" }}>offerte</div>
            </div>
          </div>
        </div>

        {!bothConfirmed && (
          <div style={{ background:match.myConfirm?"#ECFDF5":"#FFF7ED", padding:"10px 16px",
            borderBottom:`1px solid ${BD}`, display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:16 }}>{match.myConfirm?"⏳":"🤝"}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:match.myConfirm?"#065F46":"#92400E" }}>
                {match.myConfirm ? `Wachten op bevestiging van ${match.proName}...` : `Deal sluiten voor €${match.prijs.toLocaleString("nl")}?`}
              </div>
            </div>
            {!match.myConfirm && (
              <button onClick={acceptDeal} style={{ background:G, color:W, border:"none",
                borderRadius:20, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer",
                flexShrink:0 }}>
                ✅ Deal — €{match.prijs.toLocaleString("nl")}
              </button>
            )}
          </div>
        )}

        {bothConfirmed && (
          <div style={{ background:"#ECFDF5", padding:"10px 16px", borderBottom:`1px solid #A7F3D0`,
            display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:18 }}>🎉</span>
            <div style={{ fontSize:13, fontWeight:700, color:"#065F46" }}>Deal gesloten! Afspraak staat in je agenda.</div>
          </div>
        )}

        <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
          {match.msgs.map((msg, i) => {
            const isMe = msg.from === "klant";
            return (
              <div key={i} style={{ display:"flex", justifyContent:isMe?"flex-end":"flex-start", marginBottom:10 }}>
                {!isMe && <Av label={match.proAvatar} color={match.proColor} size={28}/>}
                <div style={{ maxWidth:"75%" }}>
                  <div style={{
                    background:msg.isDateProp?(isMe?"#1B1F3B":"#EEF2FF"):isMe?N:W,
                    border:isMe?"none":`1px solid ${BD}`,
                    color:isMe?W:TX,
                    padding:"10px 14px", borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",
                    fontSize:13, lineHeight:1.5,
                  }}>
                    {msg.isDateProp && <span style={{ fontSize:16, marginRight:6 }}>📅</span>}
                    {msg.text}
                  </div>
                  <div style={{ fontSize:10, color:MU, marginTop:3, textAlign:isMe?"right":"left" }}>{msg.time}</div>
                </div>
              </div>
            );
          })}

          {calOpen && (
            <div style={{ background:W, borderRadius:16, padding:16, border:`2px solid ${N}`, marginBottom:12 }}>
              <div style={{ fontWeight:700, fontSize:14, color:TX, marginBottom:12 }}>📅 Kies een datum & tijd</div>
              {CAL_SLOTS.map(day => (
                <div key={day.date} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:MU, marginBottom:6 }}>{day.date}</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {day.slots.map(sl => (
                      <button key={sl} onClick={() => proposeDate(day.date, sl)}
                        style={{ padding:"7px 14px", borderRadius:20, border:`1px solid ${BD}`,
                          background:W, color:TX, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                        {sl}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => setCalOpen(false)} style={{ width:"100%", padding:"10px",
                background:"#F3F4F6", border:"none", borderRadius:10, fontSize:13,
                color:MU, cursor:"pointer", marginTop:4 }}>Annuleer</button>
            </div>
          )}
        </div>

        <div style={{ padding:"10px 16px 20px", background:W, borderTop:`1px solid ${BD}` }}>
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <button onClick={() => setCalOpen(!calOpen)}
              style={{ padding:"8px 14px", borderRadius:20, border:`1px solid ${BD}`,
                background:calOpen?"#EEF2FF":W, color:N, fontSize:12, fontWeight:700, cursor:"pointer" }}>
              📅 Datum voorstellen
            </button>
            {!match.myConfirm && (
              <button onClick={acceptDeal}
                style={{ padding:"8px 14px", borderRadius:20, border:`2px solid ${G}`,
                  background:"#ECFDF5", color:G, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                ✅ Deal €{match.prijs.toLocaleString("nl")}
              </button>
            )}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key==="Enter" && sendMsg()}
              placeholder="Typ een bericht…"
              style={{ flex:1, padding:"11px 16px", borderRadius:50, border:`1px solid ${BD}`,
                fontSize:13, background:"#F9FAFB", outline:"none" }}/>
            <button onClick={sendMsg}
              style={{ width:42, height:42, borderRadius:"50%", background:`linear-gradient(135deg,${O},#EA580C)`,
                border:"none", color:W, fontSize:18, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 8px rgba(249,115,22,0.4)" }}>
              ↑
            </button>
          </div>
        </div>
        <TabBar active={tab} onChange={t => { setTab(t); go(null); }} matchBadge={unreadMatches}/>
      </Phone>
    );
  }

  // ── MATCHES ───────────────────────────────────────────────────────────────
  const MatchesScreen = () => (
    <div style={{ overflowY:"auto", flex:1 }}>
      <div style={{ background:N, padding:"14px 16px 16px" }}>
        <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:W }}>Matches & Chat</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:3 }}>Jouw actieve gesprekken met vakmensen</div>
      </div>
      <div style={{ padding:"12px 16px" }}>
        {matches.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 20px", color:MU }}>
            <div style={{ fontSize:48, marginBottom:12 }}>💬</div>
            <div style={{ fontWeight:700, fontSize:16, color:TX, marginBottom:6 }}>Nog geen matches</div>
            <div style={{ fontSize:13 }}>Post een klus of neem contact op met een vakman.</div>
          </div>
        ) : matches.map(m => {
          const lastMsg = m.msgs[m.msgs.length-1];
          const dealDone = m.myConfirm && m.proConfirm;
          return (
            <div key={m.id} onClick={() => go("chat", m.id)}
              style={{ background:W, borderRadius:18, padding:16, marginBottom:12,
                border:`${!m.myConfirm?2:1}px solid ${!m.myConfirm?O+"44":BD}`,
                cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <Av label={m.proAvatar} color={m.proColor}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ fontWeight:700, fontSize:15, color:TX }}>{m.proName}</div>
                    <span style={{ fontSize:18, fontWeight:900, color:N }}>€{m.prijs.toLocaleString("nl")}</span>
                  </div>
                  <div style={{ fontSize:12, color:MU, marginTop:1 }}>{m.klus}</div>
                  <div style={{ fontSize:12, color:MU, marginTop:6, lineHeight:1.5 }}>
                    {lastMsg?.text?.slice(0,60)}{lastMsg?.text?.length > 60 ? "…" : ""}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
                {dealDone
                  ? <Pill color="#065F46" bg="#ECFDF5">🎉 Deal gesloten</Pill>
                  : m.myConfirm
                  ? <Pill color="#92400E" bg="#FFF7ED">⏳ Wachten op vakman</Pill>
                  : <Pill color={O} bg="#FFF7ED">🤝 Deal openstaand</Pill>
                }
                <Pill color={N} bg="#EEF2FF">💬 Open chat</Pill>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── PROFILE ───────────────────────────────────────────────────────────────
  const ProfielScreen = () => (
    <div style={{ overflowY:"auto", flex:1 }}>
      <div style={{ background:`linear-gradient(135deg,${N},#2d2850)`, padding:"32px 20px 28px" }}>
        <div style={{ width:72, height:72, borderRadius:20, background:O,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:W, fontWeight:800, fontSize:26, marginBottom:14 }}>{profiel?.naam ? profiel.naam.substring(0,2).toUpperCase() : "??"}</div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:W }}>{profiel?.naam || user?.email}</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginTop:4 }}>📍 {profiel?.stad || "Locatie onbekend"} · Lid sinds 2025</div>
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          <Pill color="#ECFDF5" bg="rgba(5,150,105,0.25)">✓ Geverifieerd</Pill>
          {hasPlusAcc && <Pill color="#FEF3C7" bg="rgba(245,158,11,0.3)">⭐ Plus</Pill>}
          <Pill color="#EEF2FF" bg="rgba(255,255,255,0.15)">🇳🇱 NL</Pill>
          <Pill color={role==="vakman"?"#FED7AA":"#EEF2FF"} bg={role==="vakman"?"rgba(249,115,22,0.25)":"rgba(255,255,255,0.15)"}>
            {role==="vakman"?"🔨 Vakman":"🏠 Klant"}
          </Pill>
        </div>
        <button onClick={() => setRole(null)} style={{ marginTop:12, background:"rgba(255,255,255,0.1)",
          border:"1px solid rgba(255,255,255,0.2)", borderRadius:20, padding:"6px 14px",
          color:"rgba(255,255,255,0.7)", fontSize:12, cursor:"pointer" }}>
          Wissel van rol →
        </button>
        <button onClick={async () => { await supabase.auth.signOut(); setUser(null); setProfiel(null); }} 
  style={{ marginTop:8, background:"rgba(255,255,255,0.1)",
  border:"1px solid rgba(255,255,255,0.2)", borderRadius:20, padding:"6px 14px",
  color:"rgba(255,255,255,0.7)", fontSize:12, cursor:"pointer" }}>
  Uitloggen →
</button>
      </div>

      <div style={{ padding:"16px" }}>
        <Card>
          <Lbl>📅 Mijn agenda</Lbl>
          {agendaItems.length === 0 ? (
            <div style={{ fontSize:13, color:MU, padding:"8px 0" }}>Nog geen afspraken gepland. Sluit een deal om je agenda te vullen.</div>
          ) : agendaItems.map((item, i) => (
            <div key={item.id} style={{ display:"flex", gap:12, alignItems:"center",
              padding:"10px 0", borderTop:i?`1px solid ${BD}`:"none" }}>
              <div style={{ width:40, height:40, borderRadius:10, background:item.color,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:W, fontSize:16, flexShrink:0 }}>📅</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:TX }}>{item.title}</div>
                <div style={{ fontSize:12, color:MU, marginTop:1 }}>Met: {item.with}</div>
                <div style={{ fontSize:12, color:G, marginTop:1, fontWeight:600 }}>🕐 {item.time || "Tijd nog te bepalen"}</div>
              </div>
            </div>
          ))}
          {matches.filter(m=>m.myConfirm&&m.proConfirm).map(m => (
            <div key={m.id} style={{ display:"flex", gap:12, alignItems:"center",
              padding:"10px 0", borderTop:`1px solid ${BD}` }}>
              <div style={{ width:40, height:40, borderRadius:10, background:m.proColor,
                display:"flex", alignItems:"center", justifyContent:"center", color:W, fontSize:16, flexShrink:0 }}>✅</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:TX }}>{m.klus}</div>
                <div style={{ fontSize:12, color:MU, marginTop:1 }}>Met: {m.proName}</div>
                {m.afspraak && <div style={{ fontSize:12, color:G, marginTop:1, fontWeight:600 }}>🕐 {m.afspraak}</div>}
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <Lbl>Mijn activiteit</Lbl>
          {[["📋","Geplaatste klussen","2"],["💬","Actieve chats",matches.length.toString()],["✅","Deals gesloten",matches.filter(m=>m.myConfirm&&m.proConfirm).length.toString()]].map(([ic,lb,val],i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"10px 0", borderTop:i?`1px solid ${BD}`:"none" }}>
              <div style={{ display:"flex", gap:10 }}><span style={{ fontSize:18 }}>{ic}</span><span style={{ fontSize:14, color:TX }}>{lb}</span></div>
              <span style={{ fontWeight:700, fontSize:16, color:N }}>{val}</span>
            </div>
          ))}
        </Card>

        {role === "vakman" && !hasPlusAcc && (
          <div style={{ background:"linear-gradient(135deg,#78350F,#B45309)", borderRadius:16, padding:18, marginBottom:12, cursor:"pointer" }}
            onClick={() => go("plus-upsell")}>
            <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:W, marginBottom:6 }}>⭐ Upgrade naar Plus</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", marginBottom:12 }}>Ontgrendel premium klussen van €10.000+</div>
            <button style={{ background:GOLD, color:W, border:"none", borderRadius:50, padding:"9px 20px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Bekijk Plus →
            </button>
          </div>
        )}

        <Card>
          <Lbl>Instellingen</Lbl>
          {["Accountgegevens","Notificaties","Betalingen","Privacy","Help & contact"].map((item,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"12px 0", borderTop:i?`1px solid ${BD}`:"none", cursor:"pointer" }}>
              <span style={{ fontSize:14, color:TX }}>{item}</span><span style={{ color:MU }}>›</span>
            </div>
          ))}
        </Card>
        <div style={{ textAlign:"center", padding:"8px 0 16px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:N }}>Task<span style={{color:O}}>ly</span></div>
          <div style={{ fontSize:11, color:MU }}>100% Nederlands · v1.0</div>
        </div>
      </div>
    </div>
  );

  // ── ROLE PICKER ───────────────────────────────────────────────────────────
  if (!role) return (
    <Phone>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"32px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:32, fontWeight:900, color:N }}>
            Task<span style={{color:O}}>ly</span>
          </div>
          <div style={{ fontSize:14, color:MU, marginTop:8 }}>100% Nederlands vakmannenplatform</div>
        </div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:TX, textAlign:"center", marginBottom:6 }}>
          Wie ben jij?
        </div>
        <div style={{ fontSize:13, color:MU, textAlign:"center", marginBottom:28 }}>
          Kies je rol om de juiste ervaring te zien
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div onClick={() => setRole("klant")}
            style={{ background:W, border:`2px solid ${BD}`, borderRadius:20, padding:"22px 20px",
              cursor:"pointer", display:"flex", gap:16, alignItems:"center",
              boxShadow:"0 2px 12px rgba(0,0,0,0.07)", transition:"all 0.15s" }}>
            <div style={{ width:56, height:56, borderRadius:16, background:"#EEF2FF",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🏠</div>
            <div>
              <div style={{ fontWeight:700, fontSize:17, color:TX, marginBottom:4 }}>Ik ben klant</div>
              <div style={{ fontSize:13, color:MU, lineHeight:1.5 }}>Ik zoek een vakman voor mijn verbouwing of klus</div>
            </div>
            <span style={{ marginLeft:"auto", color:MU, fontSize:20 }}>›</span>
          </div>
          <div onClick={() => setRole("vakman")}
            style={{ background:`linear-gradient(135deg,#1B1F3B,#2d2850)`, border:"2px solid transparent",
              borderRadius:20, padding:"22px 20px", cursor:"pointer",
              display:"flex", gap:16, alignItems:"center",
              boxShadow:"0 4px 18px rgba(27,31,59,0.25)", transition:"all 0.15s" }}>
            <div style={{ width:56, height:56, borderRadius:16, background:"rgba(249,115,22,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🔨</div>
            <div>
              <div style={{ fontWeight:700, fontSize:17, color:W, marginBottom:4 }}>Ik ben vakman</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.5 }}>Ik bied mijn diensten aan en zoek nieuwe opdrachten</div>
            </div>
            <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.4)", fontSize:20 }}>›</span>
          </div>
        </div>
        <div style={{ marginTop:32, textAlign:"center", fontSize:11, color:MU }}>
          Je kunt dit later wijzigen in je profiel
        </div>
      </div>
    </Phone>
  );

  const renderTab = () => {
    switch(tab) {
      case "home":    return <HomeScreen/>;
      case "search":  return <SearchScreen/>;
      case "post":    return <PostScreen/>;
      case "matches": return <MatchesScreen/>;
      case "profiel": return <ProfielScreen/>;
      default:        return <HomeScreen/>;
    }
  };

  return (
    <Phone>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {renderTab()}
      </div>
      <TabBar active={tab} onChange={t => { setTab(t); go(null); }} matchBadge={unreadMatches}/>
    </Phone>
  );
}
