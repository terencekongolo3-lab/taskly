import { useState } from "react";
import { supabase } from "./supabase";

const N = "#1B1F3B";
const O = "#F97316";
const W = "#FFFFFF";
const BG = "#F4F4F8";
const BD = "#E4E4ED";
const MU = "#8A8FA8";
const TX = "#1B1F3B";
const G = "#059669";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [rol, setRol] = useState(null); // klant | vakman
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [naam, setNaam] = useState("");
  const [stad, setStad] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState(null);
  const [succes, setSucces] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setFout(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord });
    if (error) {
      setFout("Verkeerd e-mailadres of wachtwoord.");
    } else {
      // Haal profiel op
      const { data: profiel } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      onLogin(data.user, profiel);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!naam || !email || !wachtwoord || !rol) {
      setFout("Vul alle verplichte velden in.");
      return;
    }
    setLoading(true);
    setFout(null);

    const { data, error } = await supabase.auth.signUp({ email, password: wachtwoord });
    if (error) {
      setFout(error.message);
      setLoading(false);
      return;
    }

    // Sla profiel op
    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      naam,
      rol,
      stad,
      telefoon,
    });

    setSucces("Account aangemaakt! Check je e-mail om te bevestigen.");
    setLoading(false);
  };

  // Rol kiezen
  if (mode === "register" && !rol) return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:900, color:N }}>
            Task<span style={{color:O}}>ly</span>
          </div>
          <div style={{ fontSize:14, color:MU, marginTop:6 }}>Maak een account aan</div>
        </div>

        <div style={{ fontSize:18, fontWeight:700, color:TX, textAlign:"center", marginBottom:20 }}>Wie ben jij?</div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div onClick={() => setRol("klant")}
            style={{ background:W, border:`2px solid ${BD}`, borderRadius:20, padding:"20px 18px",
              cursor:"pointer", display:"flex", gap:14, alignItems:"center",
              boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:36 }}>🏠</div>
            <div>
              <div style={{ fontWeight:700, fontSize:16, color:TX }}>Ik ben klant</div>
              <div style={{ fontSize:13, color:MU, marginTop:2 }}>Ik zoek een vakman voor mijn klus</div>
            </div>
          </div>
          <div onClick={() => setRol("vakman")}
            style={{ background:`linear-gradient(135deg,#1B1F3B,#2d2850)`, border:"2px solid transparent",
              borderRadius:20, padding:"20px 18px", cursor:"pointer",
              display:"flex", gap:14, alignItems:"center",
              boxShadow:"0 4px 16px rgba(27,31,59,0.2)" }}>
            <div style={{ fontSize:36 }}>🔨</div>
            <div>
              <div style={{ fontWeight:700, fontSize:16, color:W }}>Ik ben vakman</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginTop:2 }}>Ik bied mijn diensten aan</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:20 }}>
          <span style={{ fontSize:13, color:MU }}>Al een account? </span>
          <span onClick={() => setMode("login")} style={{ fontSize:13, color:O, fontWeight:700, cursor:"pointer" }}>Inloggen</span>
        </div>
      </div>
    </div>
  );

  if (succes) return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:420, textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:TX, marginBottom:8 }}>Account aangemaakt!</div>
        <div style={{ fontSize:14, color:MU, lineHeight:1.7, marginBottom:24 }}>{succes}</div>
        <button onClick={() => { setMode("login"); setSucces(null); }}
          style={{ background:`linear-gradient(135deg,${O},#EA580C)`, color:W, border:"none",
            borderRadius:50, padding:"13px 28px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
          Inloggen →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:420 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:900, color:N }}>
            Task<span style={{color:O}}>ly</span>
          </div>
          <div style={{ fontSize:14, color:MU, marginTop:6 }}>
            {mode === "login" ? "Welkom terug!" : `Account aanmaken als ${rol}`}
          </div>
        </div>

        {/* Card */}
        <div style={{ background:W, borderRadius:20, padding:28, boxShadow:"0 4px 24px rgba(0,0,0,0.08)", border:`1px solid ${BD}` }}>

          {fout && (
            <div style={{ background:"#FEE2E2", border:"1px solid #FECACA", borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:13, color:"#DC2626" }}>
              ⚠️ {fout}
            </div>
          )}

          {mode === "register" && (
            <>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:MU, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Naam *</label>
                <input value={naam} onChange={e => setNaam(e.target.value)} placeholder="Jouw volledige naam"
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${BD}`, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:MU, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Stad</label>
                <input value={stad} onChange={e => setStad(e.target.value)} placeholder="bijv. Amsterdam"
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${BD}`, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:MU, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Telefoonnummer</label>
                <input value={telefoon} onChange={e => setTelefoon(e.target.value)} placeholder="bijv. 06-12345678"
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${BD}`, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
              </div>
            </>
          )}

          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, color:MU, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>E-mailadres *</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="jouw@email.nl" type="email"
              style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${BD}`, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
          </div>

          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:12, fontWeight:700, color:MU, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Wachtwoord *</label>
            <input value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} placeholder="Minimaal 6 tekens" type="password"
              style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${BD}`, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
          </div>

          <button onClick={mode === "login" ? handleLogin : handleRegister} disabled={loading}
            style={{ width:"100%", background:loading?"#E5E7EB":`linear-gradient(135deg,${O},#EA580C)`,
              color:loading?MU:W, border:"none", borderRadius:50, padding:"14px",
              fontSize:15, fontWeight:700, cursor:loading?"not-allowed":"pointer",
              boxShadow:loading?"none":"0 4px 14px rgba(249,115,22,0.4)" }}>
            {loading ? "Even geduld..." : mode === "login" ? "Inloggen →" : "Account aanmaken →"}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:16 }}>
          {mode === "login" ? (
            <>
              <span style={{ fontSize:13, color:MU }}>Nog geen account? </span>
              <span onClick={() => { setMode("register"); setRol(null); }} style={{ fontSize:13, color:O, fontWeight:700, cursor:"pointer" }}>Registreren</span>
            </>
          ) : (
            <>
              <span style={{ fontSize:13, color:MU }}>Al een account? </span>
              <span onClick={() => setMode("login")} style={{ fontSize:13, color:O, fontWeight:700, cursor:"pointer" }}>Inloggen</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
