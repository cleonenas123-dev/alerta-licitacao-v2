"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function setMsgOk(text) {
    setMsg(text);
  }

  function setMsgErro(text) {
    setMsg(`❌ Erro: ${text}`);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsgErro(error.message);
      setLoading(false);
      return;
    }

    setMsgOk("✅ Login realizado com sucesso! Redirecionando...");
    setLoading(false);
    router.push("/alertas");
  }

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://alertadelicitacao.com";

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/confirm`,
      },
    });

    if (error) {
      setMsgErro(error.message);
      setLoading(false);
      return;
    }

    setMsgOk("✅ Conta criada! Confira seu e-mail para confirmar o cadastro.");
    setLoading(false);
  }

  async function handleForgot(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://alertadelicitacao.com";

    // ✅ ESSA É A PARTE QUE RESOLVE O “VOLTA PRA HOME”
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-senha`,
    });

    if (error) {
      setMsgErro(error.message);
      setLoading(false);
      return;
    }

    setMsgOk("✅ Enviamos um link para redefinir sua senha. Verifique seu e-mail.");
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 520, background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: 36, margin: 0, marginBottom: 8 }}>Alerta de Licitação</h1>
        <p style={{ marginTop: 0, color: "#555", marginBottom: 18 }}>
          {mode === "login" && "Faça login para ver seus alertas e favoritos."}
          {mode === "signup" && "Crie sua conta para começar a receber alertas."}
          {mode === "forgot" && "Informe seu e-mail para receber o link de redefinição."}
        </p>

        <form onSubmit={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            required
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd", marginBottom: 14 }}
          />

          {mode !== "forgot" && (
            <>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd", marginBottom: 14 }}
              />
            </>
          )}

          {msg && (
            <div style={{ background: "#f6f7f9", border: "1px solid #e6e8ee", padding: 12, borderRadius: 12, marginBottom: 14 }}>
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "none",
              background: "#111827",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
          </button>
        </form>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {mode !== "login" && (
            <button
              onClick={() => setMode("login")}
              style={{ background: "transparent", border: "none", color: "#111827", cursor: "pointer", fontWeight: 700 }}
            >
              Voltar para login
            </button>
          )}

          {mode === "login" && (
            <>
              <button
                onClick={() => setMode("signup")}
                style={{ background: "transparent", border: "none", color: "#111827", cursor: "pointer", fontWeight: 700 }}
              >
                Criar conta
              </button>
              <button
                onClick={() => setMode("forgot")}
                style={{ background: "transparent", border: "none", color: "#111827", cursor: "pointer", fontWeight: 700 }}
              >
                Esqueci a senha
              </button>
            </>
          )}

          {mode === "signup" && (
            <button
              onClick={() => setMode("forgot")}
              style={{ background: "transparent", border: "none", color: "#111827", cursor: "pointer", fontWeight: 700 }}
            >
              Esqueci a senha
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
