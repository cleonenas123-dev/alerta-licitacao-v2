"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { BRAND } from "../../lib/brand";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );

  async function entrar() {
    setMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      const m = (error.message || "").toLowerCase();
      if (m.includes("invalid login credentials")) {
        setMsg(
          "E-mail/senha incorretos OU seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada e SPAM."
        );
      } else {
        setMsg(`Erro: ${error.message}`);
      }
      setLoading(false);
      return;
    }

    window.location.href = "/alertas";
  }

  async function criarConta() {
    setMsg("");

    if (senha.length < 6) return setMsg("A senha precisa ter pelo menos 6 caracteres.");
    if (senha !== confirmar) return setMsg("As senhas não conferem.");

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: `${origin}/alertas`,
      },
    });

    if (error) {
      setMsg(`Erro: ${error.message}`);
      setLoading(false);
      return;
    }

    setMsg(
      "Conta criada! Enviamos um e-mail de confirmação. Abra sua caixa de entrada (e SPAM) e clique no link para liberar o acesso."
    );
    setLoading(false);
  }

  async function esqueciSenha() {
    setMsg("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-senha`,
    });

    if (error) {
      setMsg(`Erro: ${error.message}`);
      setLoading(false);
      return;
    }

    setMsg("Link enviado! Verifique seu e-mail (e SPAM) para redefinir a senha.");
    setLoading(false);
  }

  return (
    <div style={wrap()}>
      <div style={card()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={logo()} />
          <div>
            <div style={{ fontWeight: 1000, fontSize: 18 }}>{BRAND.name}</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              Entrar / Criar conta / Redefinir senha
            </div>
          </div>
        </div>

        <div style={tabs()}>
          <button style={tabBtn(mode === "login")} onClick={() => setMode("login")}>Entrar</button>
          <button style={tabBtn(mode === "signup")} onClick={() => setMode("signup")}>Criar conta</button>
          <button style={tabBtn(mode === "forgot")} onClick={() => setMode("forgot")}>Esqueci a senha</button>
        </div>

        <label style={lbl()}>E-mail</label>
        <input
          style={inp()}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@..."
        />

        {(mode === "login" || mode === "signup") && (
          <>
            <label style={lbl()}>Senha</label>
            <div style={row()}>
              <input
                style={{ ...inp(), flex: 1, marginTop: 0 }}
                type={show1 ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
              />
              <button style={smallBtn()} onClick={() => setShow1((s) => !s)}>
                {show1 ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </>
        )}

        {mode === "signup" && (
          <>
            <label style={lbl()}>Confirmar senha</label>
            <div style={row()}>
              <input
                style={{ ...inp(), flex: 1, marginTop: 0 }}
                type={show2 ? "text" : "password"}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repita sua senha"
              />
              <button style={smallBtn()} onClick={() => setShow2((s) => !s)}>
                {show2 ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div style={hint()}>
              Ao criar conta, você receberá um <b>e-mail de confirmação</b> (lead real).
            </div>
          </>
        )}

        {mode === "forgot" && (
          <div style={hint()}>
            Digite seu e-mail cadastrado e clique em <b>Enviar link</b>.
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          {mode === "login" && (
            <button style={btn(BRAND.primary)} onClick={entrar} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          )}
          {mode === "signup" && (
            <button style={btn(BRAND.dark)} onClick={criarConta} disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </button>
          )}
          {mode === "forgot" && (
            <button style={btn(BRAND.primary)} onClick={esqueciSenha} disabled={loading}>
              {loading ? "Enviando..." : "Enviar link"}
            </button>
          )}
          <Link href="/" style={btnLink("#111827")}>Home</Link>
        </div>

        {msg && <div style={msgBox()}>{msg}</div>}
      </div>
    </div>
  );
}

function wrap(){return{minHeight:"70vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
function card(){return{width:"min(520px,100%)",background:"#fff",borderRadius:18,padding:18,border:"1px solid #e5e7eb",boxShadow:"0 14px 40px rgba(0,0,0,0.10)"}}
function logo(){return{width:36,height:36,borderRadius:10,background:"#e5e7eb"}}
function tabs(){return{display:"flex",gap:8,marginTop:14,background:"#f3f4f6",borderRadius:12,padding:6}}
function tabBtn(active){return{flex:1,padding:"10px",borderRadius:10,border:0,cursor:"pointer",fontWeight:900,background:active?"#fff":"transparent"}}
function lbl(){return{display:"block",marginTop:12,fontWeight:900}}
function inp(){return{width:"100%",padding:10,borderRadius:12,border:"1px solid #e5e7eb",marginTop:6}}
function row(){return{display:"flex",gap:8,alignItems:"center",marginTop:6}}
function smallBtn(){return{padding:"10px 12px",borderRadius:12,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontWeight:900}}
function btn(bg){return{background:bg,color:"#fff",border:0,padding:"10px 12px",borderRadius:12,fontWeight:900,cursor:"pointer"}}
function btnLink(bg){return{background:bg,color:"#fff",padding:"10px 12px",borderRadius:12,textDecoration:"none",fontWeight:900}}
function hint(){return{marginTop:12,padding:10,borderRadius:12,background:"#f0f9ff",border:"1px solid #bae6fd",color:"#075985",fontSize:13}}
function msgBox(){return{marginTop:12,padding:10,borderRadius:12,background:"#f9fafb",border:"1px solid #e5e7eb",color:"#111827"}}
