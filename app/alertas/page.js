"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

export default function AlertasPage() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [msg, setMsg] = useState("");

  async function loadAll() {
    const { data: sessionData } = await supabase.auth.getSession();
    const u = sessionData?.session?.user || null;
    setUser(u);
    if (!u) return;

    const { data: p, error: pErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", u.id)
      .single();

    if (pErr) setMsg(`Perfil: ${pErr.message}`);
    setPerfil(p || null);

    const { data: n, error: nErr } = await supabase
      .from("niches")
      .select("*")
      .order("created_at", { ascending: false });

    if (nErr) setMsg(`Alertas: ${nErr.message}`);
    setAlertas(n || []);
  }

  useEffect(() => { loadAll(); }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function excluir(id) {
    if (!confirm("Excluir este alerta?")) return;
    const { error } = await supabase.from("niches").delete().eq("id", id);
    if (error) return alert(error.message);
    loadAll();
  }

  const plano = (perfil?.plan_id || "pro").toUpperCase();
  const max = plano === "PREMIUM" ? 3 : 1;

  return (
    <div style={card()}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ marginTop: 0 }}>Meus alertas</h2>
          <div style={{ color: "#6b7280", fontSize: 12 }}>
            {perfil ? (
              <>Plano: <b>{plano}</b> • Status: <b>{perfil.subscription_status}</b></>
            ) : (
              <>Entre para ver seus alertas</>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/" style={btnLink("#111827")}>Home</Link>
          {user ? (
            <button onClick={logout} style={btn("#ef4444")}>Sair</button>
          ) : (
            <Link href="/login" style={btnLink("#2563eb")}>Login</Link>
          )}
        </div>
      </div>

      {!user && (
        <div style={warn()}>
          Você ainda não está logado. <Link href="/login">Clique aqui para entrar</Link>.
        </div>
      )}

      {user && (
        <>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={pill()}>Limite do plano: <b>{max}</b> alerta(s)</div>
            <Link href="/favoritos" style={btnLink("#10b981")}>⭐ Favoritos</Link>
          </div>

          <div style={{ marginTop: 14 }}>
            {alertas.length === 0 ? (
              <div style={{ color: "#6b7280" }}>Nenhum alerta criado ainda.</div>
            ) : (
              alertas.map((a) => (
                <div key={a.id} style={item()}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      Tipo: <b>{a.type}</b> • UF: <b>{(a.ufs || []).join(", ")}</b>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link href={`/historico?niche=${a.id}`} style={mini("#111827")}>Histórico</Link>
                    <button onClick={() => excluir(a.id)} style={miniBtn("#ef4444")}>Excluir</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: 14, color: "#6b7280" }}>
            Próximo passo: criar a tela de <b>Novo alerta</b> (com “Quero receber” / “Não quero receber” / UF / Serviço ou Venda).
          </div>
        </>
      )}

      {msg && <div style={{ marginTop: 10, color: "#6b7280" }}>{msg}</div>}
    </div>
  );
}

function card() { return { background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #e5e7eb" }; }
function warn() { return { marginTop: 12, padding: 10, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa" }; }
function item() { return { display: "flex", gap: 12, alignItems: "center", padding: 12, border: "1px solid #e5e7eb", borderRadius: 14, marginTop: 10, flexWrap: "wrap" }; }
function pill() { return { padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 999, background: "#f9fafb" }; }
function btn(bg) { return { background: bg, color: "#fff", border: 0, padding: "10px 12px", borderRadius: 10, fontWeight: 900, cursor: "pointer" }; }
function btnLink(bg) { return { background: bg, color: "#fff", padding: "10px 12px", borderRadius: 10, textDecoration: "none", fontWeight: 900 }; }
function mini(bg) { return { background: bg, color: "#fff", padding: "8px 10px", borderRadius: 10, textDecoration: "none", fontWeight: 900, fontSize: 12 }; }
function miniBtn(bg) { return { background: bg, color: "#fff", border: 0, padding: "8px 10px", borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: "pointer" }; }
