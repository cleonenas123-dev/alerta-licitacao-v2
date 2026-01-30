"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [tab, setTab] = useState("entrar"); // entrar | criar | esqueci

  // campos
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");

  // mensagens/estado
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'ok'|'err', text:string}

  // cooldown 60s
  const [cooldown, setCooldown] = useState(0);

  const origin = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  function startCooldown() {
    setCooldown(60);
  }

  function resetMsgs() {
    setMsg(null);
  }

  async function onEntrar(e) {
    e.preventDefault();
    resetMsgs();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) throw error;

      setMsg({ type: "ok", text: "Login realizado com sucesso!" });
      // redireciona para alertas
      window.location.href = "/alertas";
    } catch (err) {
      setMsg({ type: "err", text: err?.message || "Erro ao entrar." });
    } finally {
      setLoading(false);
    }
  }

  async function onCriarConta(e) {
    e.preventDefault();
    resetMsgs();

    if (senha.length < 6) {
      setMsg({ type: "err", text: "A senha precisa ter pelo menos 6 caracteres." });
      return;
    }
    if (senha !== senha2) {
      setMsg({ type: "err", text: "As senhas não conferem." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          // página de confirmação do seu app (você já tem /confirm)
          emailRedirectTo: `${origin}/confirm`,
        },
      });
      if (error) throw error;

      setMsg({
        type: "ok",
        text: "Conta criada! Se necessário, confirme seu e-mail para finalizar o acesso.",
      });

      // cooldown para evitar spam no “reenviar”
      startCooldown();
    } catch (err) {
      setMsg({ type: "err", text: err?.message || "Erro ao criar conta." });
    } finally {
      setLoading(false);
    }
  }

  async function enviarResetSenha() {
    resetMsgs();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-senha`,
      });
      if (error) throw error;

      setMsg({
        type: "ok",
        text: "Pronto! Se o e-mail existir, enviamos um link para redefinir sua senha (verifique SPAM).",
      });

      startCooldown();
    } catch (err) {
      setMsg({ type: "err", text: err?.message || "Erro ao enviar e-mail de redefinição." });
    } finally {
      setLoading(false);
    }
  }

  async function onEsqueciSenha(e) {
    e.preventDefault();
    await enviarResetSenha();
  }

  // UI simples (sem depender de libs)
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "min(720px, 100%)", background: "#fff", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,.12)", padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#E5E7EB" }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Alerta de Licitação</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Entrar / Criar conta / Redefinir senha</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, background: "#F3F4F6", borderRadius: 999, padding: 6, marginBottom: 18 }}>
          <button onClick={() => { setTab("entrar"); resetMsgs(); }} style={pill(tab === "entrar")}>Entrar</button>
          <button onClick={() => { setTab("criar"); resetMsgs(); }} style={pill(tab === "criar")}>Criar conta</button>
          <button onClick={() => { setTab("esqueci"); resetMsgs(); }} style={pill(tab === "esqueci")}>Esqueci a senha</button>
        </div>

        {msg && (
          <div style={{
            marginBottom: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid",
            borderColor: msg.type === "ok" ? "#86efac" : "#fecaca",
            background: msg.type === "ok" ? "#ecfdf5" : "#fff1f2",
            color: msg.type === "ok" ? "#065f46" : "#7f1d1d"
          }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={tab === "entrar" ? onEntrar : tab === "criar" ? onCriarConta : onEsqueciSenha}>
          <label style={label}>E-mail</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            type="email"
            required
            style={input}
          />

          {tab !== "esqueci" && (
            <>
              <label style={label}>Senha</label>
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                type="password"
                required
                style={input}
              />
            </>
          )}

          {tab === "criar" && (
            <>
              <label style={label}>Confirmar senha</label>
              <input
                value={senha2}
                onChange={(e) => setSenha2(e.target.value)}
                placeholder="Repita a senha"
                type="password"
                required
                style={input}
              />
            </>
          )}

          {tab === "esqueci" && (
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {tab === "entrar" && (
              <button disabled={loading} style={primaryBtn}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            )}

            {tab === "criar" && (
              <button disabled={loading} style={primaryBtn}>
                {loading ? "Criando..." : "Criar conta"}
              </button>
            )}

            {tab === "esqueci" && (
              <>
                <button disabled={loading} style={primaryBtn}>
                  {loading ? "Enviando..." : "Enviar link"}
                </button>

                <button
                  type="button"
                  disabled={loading || cooldown > 0}
                  onClick={enviarResetSenha}
                  style={{
                    ...secondaryBtn,
                    opacity: cooldown > 0 ? 0.6 : 1,
                    cursor: cooldown > 0 ? "not-allowed" : "pointer",
                  }}
                  title={cooldown > 0 ? `Aguarde ${cooldown}s para reenviar` : "Reenviar e-mail"}
                >
                  {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar e-mail"}
                </button>
              </>
            )}

            <button type="button" onClick={() => (window.location.href = "/")} style={secondaryBtn}>
              Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function pill(active) {
  return {
    flex: 1,
    border: "none",
    borderRadius: 999,
    padding: "10px 12px",
    fontWeight: 700,
    cursor: "pointer",
    background: active ? "#fff" : "transparent",
    boxShadow: active ? "0 2px 10px rgba(0,0,0,.08)" : "none",
  };
}

const label = { display: "block", marginTop: 12, marginBottom: 6, fontWeight: 700, fontSize: 13 };
const input = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid #D1D5DB",
  outline: "none",
  fontSize: 14,
};
const primaryBtn = {
  background: "#111827",
  color: "#fff",
  border: "none",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};
const secondaryBtn = {
  background: "#fff",
  color: "#111827",
  border: "1px solid #D1D5DB",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};
