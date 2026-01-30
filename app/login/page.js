"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  // tabs: entrar | criar | esqueci
  const [tab, setTab] = useState("entrar");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");

  const [msg, setMsg] = useState("");
  const [isErro, setIsErro] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reenvio com contador (60s) no "Esqueci a senha"
  const [cooldown, setCooldown] = useState(0);
  const podeReenviar = useMemo(() => cooldown <= 0, [cooldown]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  function limparMensagens() {
    setMsg("");
    setIsErro(false);
  }

  async function handleEntrar(e) {
    e.preventDefault();
    limparMensagens();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) throw error;

      router.push("/alertas");
    } catch (err) {
      setIsErro(true);
      setMsg(err?.message || "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCriarConta(e) {
    e.preventDefault();
    limparMensagens();

    if (senha.length < 6) {
      setIsErro(true);
      setMsg("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== senha2) {
      setIsErro(true);
      setMsg("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const origin = window.location.origin;

      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          // se você usa confirmação de e-mail, ajuste pra sua rota
          emailRedirectTo: `${origin}/confirm`,
        },
      });

      if (error) throw error;

      setIsErro(false);
      setMsg("Conta criada! Se a confirmação por e-mail estiver ativada, verifique sua caixa de entrada.");
      setTab("entrar");
      setSenha("");
      setSenha2("");
    } catch (err) {
      setIsErro(true);
      setMsg(err?.message || "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  async function enviarLinkReset(e) {
    e.preventDefault();
    limparMensagens();

    if (!email) {
      setIsErro(true);
      setMsg("Digite seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-senha`,
      });

      if (error) throw error;

      setIsErro(false);
      // Texto mais “confiável” sem parecer estranho:
      setMsg("Se este e-mail estiver correto, você receberá o link em instantes. Verifique o SPAM.");

      // inicia contador 60s para reenvio
      setCooldown(60);
    } catch (err) {
      setIsErro(true);
      setMsg(err?.message || "Não foi possível enviar o link.");
    } finally {
      setLoading(false);
    }
  }

  async function reenviarEmail() {
    limparMensagens();

    if (!podeReenviar) return;

    setLoading(true);
    try {
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-senha`,
      });

      if (error) throw error;

      setIsErro(false);
      setMsg("Link reenviado. Verifique sua caixa de entrada (e SPAM).");
      setCooldown(60);
    } catch (err) {
      setIsErro(true);
      setMsg(err?.message || "Não foi possível reenviar o link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6f7fb", padding: 16 }}>
      <div style={{ width: "min(720px, 100%)", background: "#fff", borderRadius: 18, padding: 18, boxShadow: "0 18px 40px rgba(0,0,0,.10)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#e5e7eb" }} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Alerta de Licitação</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Entrar / Criar conta / Redefinir senha</div>
          </div>
        </div>

        <div style={{ background: "#f3f4f6", padding: 8, borderRadius: 999, display: "flex", gap: 8, marginBottom: 14 }}>
          <button onClick={() => (setTab("entrar"), limparMensagens())}
            style={pillStyle(tab === "entrar")}>Entrar</button>
          <button onClick={() => (setTab("criar"), limparMensagens())}
            style={pillStyle(tab === "criar")}>Criar conta</button>
          <button onClick={() => (setTab("esqueci"), limparMensagens())}
            style={pillStyle(tab === "esqueci")}>Esqueci a senha</button>
        </div>

        {msg ? (
          <div style={{
            borderRadius: 12,
            padding: "12px 12px",
            border: `1px solid ${isErro ? "#fecaca" : "#bbf7d0"}`,
            background: isErro ? "#fef2f2" : "#ecfdf5",
            color: isErro ? "#991b1b" : "#065f46",
            marginBottom: 12
          }}>
            {msg}
          </div>
        ) : null}

        {tab === "entrar" && (
          <form onSubmit={handleEntrar}>
            <label style={labelStyle}>E-mail</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={inputStyle} placeholder="seuemail@dominio.com" />

            <label style={labelStyle}>Senha</label>
            <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" style={inputStyle} placeholder="Sua senha" />

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button disabled={loading} style={primaryBtn}>{loading ? "Entrando..." : "Entrar"}</button>
              <button type="button" onClick={() => router.push("/")} style={secondaryBtn}>Home</button>
            </div>
          </form>
        )}

        {tab === "criar" && (
          <form onSubmit={handleCriarConta}>
            <label style={labelStyle}>E-mail</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={inputStyle} placeholder="seuemail@dominio.com" />

            <label style={labelStyle}>Senha</label>
            <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" style={inputStyle} placeholder="Crie uma senha" />

            <label style={labelStyle}>Confirmar senha</label>
            <input value={senha2} onChange={(e) => setSenha2(e.target.value)} type="password" style={inputStyle} placeholder="Repita a senha" />

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button disabled={loading} style={primaryBtn}>{loading ? "Criando..." : "Criar conta"}</button>
              <button type="button" onClick={() => router.push("/")} style={secondaryBtn}>Home</button>
            </div>
          </form>
        )}

        {tab === "esqueci" && (
          <form onSubmit={enviarLinkReset}>
            <label style={labelStyle}>E-mail</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={inputStyle} placeholder="seuemail@dominio.com" />

            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <button disabled={loading} style={primaryBtn}>{loading ? "Enviando..." : "Enviar link"}</button>

              <button
                type="button"
                disabled={loading || !email || !podeReenviar}
                onClick={reenviarEmail}
                style={{
                  ...secondaryBtn,
                  opacity: (!email || !podeReenviar) ? 0.6 : 1,
                  cursor: (!email || !podeReenviar) ? "not-allowed" : "pointer",
                }}
              >
                {podeReenviar ? "Reenviar e-mail" : `Reenviar em ${cooldown}s`}
              </button>

              <button type="button" onClick={() => router.push("/")} style={secondaryBtn}>Home</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function pillStyle(active) {
  return {
    flex: 1,
    border: "none",
    borderRadius: 999,
    padding: "10px 12px",
    fontWeight: 800,
    cursor: "pointer",
    background: active ? "#111827" : "transparent",
    color: active ? "#fff" : "#111827",
  };
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 800, marginTop: 10, marginBottom: 6 };
const inputStyle = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: 14,
  background: "#f9fafb",
};
const primaryBtn = {
  border: "none",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 900,
  cursor: "pointer",
  background: "#111827",
  color: "#fff",
};
const secondaryBtn = {
  border: "1px solid #d1d5db",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 900,
  cursor: "pointer",
  background: "#fff",
  color: "#111827",
};
