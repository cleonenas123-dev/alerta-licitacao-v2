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

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info"); // info | error | success
  const [loading, setLoading] = useState(false);

  const [senhaErro, setSenhaErro] = useState(false);
  const [confirmErro, setConfirmErro] = useState(false);

  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );

  function resetErros() {
    setSenhaErro(false);
    setConfirmErro(false);
  }

  async function entrar() {
    setMsg("");
    setMsgType("info");
    resetErros();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setMsgType("error");

      const m = (error.message || "").toLowerCase();
      if (m.includes("invalid login credentials")) {
        setMsg(
          "E-mail ou senha incorretos. Se você acabou de criar a conta, confirme seu e-mail (caixa de entrada e SPAM) antes de entrar."
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
    setMsgType("info");
    resetErros();
    setLoading(true);

    if (senha.length < 6) {
      setMsgType("error");
      setMsg("A senha precisa ter pelo menos 6 caracteres.");
      setSenhaErro(true);
      setLoading(false);
      return;
    }

    if (senha !== confirmar) {
      setMsgType("error");
      setMsg("As senhas não conferem.");
      setConfirmErro(true);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: `${origin}/alertas`,
      },
    });

    if (error) {
      setMsgType("error");
      setMsg(`Erro: ${error.message}`);
      setLoading(false);
      return;
    }

    setMsgType("success");
    setMsg(
      "Conta criada! Enviamos um e-mail de confirmação. Abra sua caixa de entrada (e SPAM) e clique no link para liberar o acesso."
    );
    setLoading(false);
  }

  async function esqueciSenha() {
    setMsg("");
    setMsgType("info");
    resetErros();
    setLoading(true);

    if (!email || !email.includes("@")) {
      setMsgType("error");
      setMsg("Digite um e-mail válido para receber o link.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset`,
});

    if (error) {
      setMsgType("error");
      setMsg(`Erro: ${error.message}`);
      setLoading(false);
      return;
    }

    setMsgType("success");
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
          <button style={tabBtn(mode === "login")} onClick={() => setMode("login")}>
            Entrar
          </button>
          <button style={tabBtn(mode === "signup")} onClick={() => setMode("signup")}>
            Criar conta
          </button>
          <button style={tabBtn(mode === "forgot")} onClick={() => setMode("forgot")}>
            Esqueci a senha
          </button>
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
                style={{
                  ...inp(),
                  flex: 1,
                  marginTop: 0,
                  border: senhaErro ? "2px solid #ef4444" : "1px solid #e5e7eb",
                }}
                type={showSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
              />
              <button style={smallBtn()} onClick={() => setShowSenha((s) => !s)}>
                {showSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </>
        )}

        {mode === "signup" && (
          <>
            <label style={lbl()}>Confirmar senha</label>
            <div style={row()}>
              <input
                style={{
                  ...inp(),
                  flex: 1,
                  marginTop: 0,
                  border: confirmErro ? "2px solid #ef4444" : "1px solid #e5e7eb",
                }}
                type={showConfirm ? "text" : "password"}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repita sua senha"
              />
              <button style={smallBtn()} onClick={() => setShowConfirm((s) => !s)}>
                {showConfirm ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <div style={hintInfo()}>
              Ao criar conta, você receberá um <b>e-mail de confirmação</b>.
            </div>
          </>
        )}

        {mode === "forgot" && (
          <div style={hintInfo()}>
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

          <Link href="/" style={btnLink("#111827")}>
            Home
          </Link>
        </div>

        {msg && <div style={msgBox(msgType)}>{msg}</div>}
      </div>
    </div>
  );
}

function wrap() {
  return { minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 };
}

function card() {
  return {
    width: "min(560px,100%)",
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    border: "1px solid #e5e7eb",
    boxShadow: "0 14px 40px rgba(0,0,0,0.10)",
  };
}

function logo() {
  return { width: 36, height: 36, borderRadius: 10, background: "#e5e7eb" };
}

function tabs() {
  return { display: "flex", gap: 8, marginTop: 14, background: "#f3f4f6", borderRadius: 12, padding: 6 };
}

function tabBtn(active) {
  return { flex: 1, padding: "10px", borderRadius: 10, border: 0, cursor: "pointer", fontWeight: 900, background: active ? "#fff" : "transparent" };
}

function lbl() {
  return { display: "block", marginTop: 12, fontWeight: 900 };
}

function inp() {
  return { width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 6 };
}

function row() {
  return { display: "flex", gap: 8, alignItems: "center", marginTop: 6 };
}

function smallBtn() {
  return { padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 900 };
}

function btn(bg) {
  return { background: bg, color: "#fff", border: 0, padding: "10px 12px", borderRadius: 12, fontWeight: 900, cursor: "pointer" };
}

function btnLink(bg) {
  return { background: bg, color: "#fff", padding: "10px 12px", borderRadius: 12, textDecoration: "none", fontWeight: 900 };
}

function hintInfo() {
  return { marginTop: 12, padding: 10, borderRadius: 12, background: "#EFF6FF", border: "1px solid #93C5FD", color: "#1E3A8A", fontSize: 13 };
}

function msgBox(type) {
  const map = {
    error: { bg: "#FEF2F2", bd: "#FCA5A5", tx: "#991B1B" },
    success: { bg: "#ECFDF5", bd: "#6EE7B7", tx: "#065F46" },
    info: { bg: "#EFF6FF", bd: "#93C5FD", tx: "#1E3A8A" },
  };
  const c = map[type] || map.info;
  return { marginTop: 12, padding: 10, borderRadius: 12, background: c.bg, border: `1px solid ${c.bd}`, color: c.tx };
}
