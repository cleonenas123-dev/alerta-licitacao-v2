"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);

  // mensagens
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info"); // "error" | "success" | "info"

  function setErro(texto) {
    setMsgType("error");
    setMsg(texto);
  }
  function setSucesso(texto) {
    setMsgType("success");
    setMsg(texto);
  }
  function setInfo(texto) {
    setMsgType("info");
    setMsg(texto);
  }

  const msgStyle =
    msgType === "error"
      ? { border: "1px solid #f3b6b6", background: "#fff1f1", color: "#7a1111" }
      : msgType === "success"
      ? { border: "1px solid #b6f3c4", background: "#f1fff5", color: "#0f4d1f" }
      : { border: "1px solid #b6d6f3", background: "#f1f7ff", color: "#0b2a4a" };

  async function handleEntrar(e) {
    e.preventDefault();
    setMsg("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      setSucesso("Login realizado com sucesso! Indo para seus alertas...");
      router.push("/alertas");
    } catch (err) {
      setErro("Erro: e-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCriarConta() {
    setMsg("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha para criar a conta.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        // Se você usa confirmação por e-mail, pode usar:
        // options: { emailRedirectTo: `${window.location.origin}/confirm` }
      });

      if (error) throw error;

      setSucesso("Conta criada! Se houver confirmação por e-mail, verifique sua caixa de entrada.");
    } catch (err) {
      setErro("Erro: não foi possível criar a conta. Tente outro e-mail ou uma senha mais forte.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ AQUI está o PASSO 1 (redirectTo certo):
  async function handleEsqueciSenha() {
    setMsg("");

    if (!email) {
      setErro("Digite seu e-mail para receber o link de redefinição.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-senha`,
      });

      if (error) throw error;

      setSucesso("E-mail de redefinição enviado! Abra o e-mail e clique no botão para criar a nova senha.");
    } catch (err) {
      setErro("Erro: não foi possível enviar o e-mail de redefinição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "48px auto", padding: 16 }}>
      <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 8 }}>Alerta de Licitação</h1>
      <p style={{ color: "#555", marginBottom: 18 }}>
        Faça login para ver seus alertas e favoritos.
      </p>

      {msg ? (
        <div style={{ ...msgStyle, borderRadius: 12, padding: 12, marginBottom: 16 }}>
          {msg}
        </div>
      ) : null}

      <form onSubmit={handleEntrar} style={{ display: "grid", gap: 12 }}>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "#0b1220",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
            opacity: loading ? 0.75 : 1,
          }}
        >
          {loading ? "Aguarde..." : "Entrar"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleCriarConta}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            fontWeight: 900,
            cursor: "pointer",
            opacity: loading ? 0.75 : 1,
          }}
        >
          Criar conta
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleEsqueciSenha}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            fontWeight: 900,
            cursor: "pointer",
            opacity: loading ? 0.75 : 1,
          }}
        >
          Esqueci a senha
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "transparent",
            color: "#333",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Voltar para a página inicial
        </button>
      </form>
    </div>
  );
}
