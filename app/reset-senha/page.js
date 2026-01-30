"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetSenhaPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info"); // "error" | "success" | "info"

  const msgClass = useMemo(() => {
    if (msgType === "error") return "border-red-300 bg-red-50 text-red-800";
    if (msgType === "success") return "border-green-300 bg-green-50 text-green-800";
    return "border-blue-200 bg-blue-50 text-blue-900";
  }, [msgType]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg("");
      try {
        // 1) Se o Supabase estiver usando "code" (PKCE), ele vem como querystring
        const qs = new URLSearchParams(window.location.search);
        const code = qs.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setReady(true);
          return;
        }

        // 2) Se vier no HASH (#access_token=...&refresh_token=...&type=recovery)
        const hash = window.location.hash?.replace("#", "") || "";
        const hp = new URLSearchParams(hash);

        const type = hp.get("type");
        const access_token = hp.get("access_token");
        const refresh_token = hp.get("refresh_token");

        if (type !== "recovery" || !access_token || !refresh_token) {
          setMsgType("error");
          setMsg("Link inválido ou expirado. Clique em “Esqueci a senha” novamente para gerar um novo link.");
          return;
        }

        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) throw error;

        setReady(true);
      } catch (e) {
        setMsgType("error");
        setMsg("Não foi possível validar o link de redefinição. Gere um novo link em “Esqueci a senha”.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (senha.length < 6) {
      setMsgType("error");
      setMsg("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmar) {
      setMsgType("error");
      setMsg("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) throw error;

      setMsgType("success");
      setMsg("Senha criada com sucesso!");

      // opcional: limpa hash pra não reusar tokens
      window.history.replaceState(null, "", "/reset-senha");

    } catch (e) {
      setMsgType("error");
      setMsg("Não foi possível atualizar a senha. Gere um novo link e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (loading && !msg) {
    return (
      <div style={{ maxWidth: 520, margin: "48px auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Redefinir senha</h1>
        <p style={{ marginTop: 12 }}>Validando link…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "48px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Redefinir senha</h1>
      <p style={{ marginTop: 8, color: "#555" }}>
        Digite sua nova senha abaixo.
      </p>

      {msg && (
        <div
          className={msgClass}
          style={{
            marginTop: 16,
            border: "1px solid",
            borderRadius: 12,
            padding: 12,
          }}
        >
          {msg}
        </div>
      )}

      {ready && (
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>
            Nova senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginTop: 6,
            }}
            placeholder="Digite sua nova senha"
          />

          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>
            Confirmar senha
          </label>
          <input
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginTop: 6,
            }}
            placeholder="Digite novamente"
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 16,
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "none",
              background: "#0b1220",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              marginTop: 10,
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Voltar para a página inicial
          </button>
        </form>
      )}
    </div>
  );
}
