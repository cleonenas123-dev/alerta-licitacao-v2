"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  async function signUp() {
    setMsg("Criando conta...");
    const { error } = await supabase.auth.signUp({ email, password: senha });
    setMsg(error ? error.message : "Conta criada! Agora clique em Entrar.");
  }

  async function signIn() {
    setMsg("Entrando...");
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setMsg(error ? error.message : "Logado! Vá em Meus alertas.");
  }

  return (
    <div style={card()}>
      <h2 style={{ marginTop: 0 }}>Entrar / Criar conta</h2>

      <label style={lbl()}>E-mail</label>
      <input style={inp()} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@..." />

      <label style={lbl()}>Senha</label>
      <input style={inp()} type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Crie uma senha" />

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button style={btn("#2563eb")} onClick={signIn}>Entrar</button>
        <button style={btn("#111827")} onClick={signUp}>Criar conta</button>
        <Link href="/alertas" style={btnLink("#10b981")}>Meus alertas</Link>
      </div>

      <p style={{ marginTop: 12, color: "#6b7280" }}>{msg}</p>
      <p style={{ fontSize: 12, color: "#6b7280" }}>
        Ao criar conta, o teste grátis de 3 dias é ativado automaticamente.
      </p>

      <div style={{ marginTop: 10 }}>
        <Link href="/" style={{ color: "#2563eb" }}>← Voltar</Link>
      </div>
    </div>
  );
}

function card() { return { background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #e5e7eb" }; }
function lbl() { return { display: "block", marginTop: 10, fontWeight: 900 }; }
function inp() { return { width: "100%", padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }; }
function btn(bg) { return { background: bg, color: "#fff", border: 0, padding: "10px 12px", borderRadius: 10, fontWeight: 900, cursor: "pointer" }; }
function btnLink(bg) { return { background: bg, color: "#fff", padding: "10px 12px", borderRadius: 10, textDecoration: "none", fontWeight: 900 }; }
