"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function AlertasPage() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [alertas, setAlertas] = useState([]);

  async function loadAll() {
    const { data: sessionData } = await supabase.auth.getSession();
    const u = sessionData?.session?.user || null;
    setUser(u);
    if (!u) return;

    const { data: p } = await supabase.from("profiles").select("*").eq("user_id", u.id).single();
    setPerfil(p || null);

    const { data: n } = await supabase.from("niches").select("*").order("created_at", { ascending: false });
    setAlertas(n || []);
  }

  useEffect(() => { loadAll(); }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
    setAlertas([]);
  }

  const plano = perfil?.plan_id || "pro";
  const max = plano === "premium" ? 3 : 1;

  return (
    <div style={card()}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap" }}>
        <div>
          <h2 style={{ marginTop:0 }}>Meus alertas</h2>
          <div style={{ color:"#6b7280", fontSize:12 }}>
            Plano: <b>{plano.toUpperCase()}</b> • Limite: <b>{max}</b> alerta(s)
          </div>
          {perfil?.subscription_status && (
            <div style={{ color:"#6b7280", fontSize:12, marginTop:4 }}>
              Status: <b>{perfil.subscription_status}</b>
            </div>
          )}
        </div>

        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <Link href="/" style={btnLink("#111827")}>Home</Link>
          <button onClick={logout} style={btn("#ef4444")}>Sair</button>
        </div>
      </div>

      {!user && (
        <div style={warn()}>
          Você ainda não está logado. <Link href="/login">Clique aqui para entrar</Link>.
        </div>
      )}

      {user && (
        <div style={{ marginTop: 14, color:"#6b7280" }}>
          Próximo passo: vamos criar as telas “Novo alerta” e “Editar alerta”.
        </div>
      )}
    </div>
  );
}

function card(){return{background:"#fff",borderRadius:14,padding:16,border:"1px solid #e5e7eb"}}
function warn(){return{marginTop:12,padding:10,borderRadius:12,background:"#fff7ed",border:"1px solid #fed7aa"}}
function btn(bg){return{background:bg,color:"#fff",border:0,padding:"10px 12px",borderRadius:10,fontWeight:900,cursor:"pointer"}}
function btnLink(bg){return{background:bg,color:"#fff",padding:"10px 12px",borderRadius:10,textDecoration:"none",fontWeight:900}}
