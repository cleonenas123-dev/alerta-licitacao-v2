"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [msg, setMsg] = useState("");

  function setMsgOk(text) {
    setMsg(text);
  }
  function setMsgErro(text) {
    setMsg(`❌ Erro: ${text}`);
  }

  const tokenHash = useMemo(() => searchParams?.get("token_hash"), [searchParams]);
  const type = useMemo(() => searchParams?.get("type"), [searchParams]);

  useEffect(() => {
    async function init() {
      setMsg("");

      // 1) Caso venha token_hash (modo OTP)
      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type: type, // normalmente "recovery"
          token_hash: tokenHash,
        });

        if (error) {
          setMsgErro("Link inválido ou expirado. Peça um novo e-mail de redefinição.");
          setReady(true);
          return;
        }

        setReady(true);
        return;
      }

      // 2) Caso venha access_token no hash (#access_token=...)
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.replace("#", "");
        const h = new URLSearchParams(hash);
        const access_token = h.get("access_token");
        const refresh_token = h.get("refresh_token");

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) {
            setMsgErro("Link inválido ou expirado. Peça um novo e-mail de redefinição.");
            setReady(true);
            return;
          }
          setReady(true);
          return;
        }
      }

      // Se não veio nada, provavelmente abriram direto a página
      setMsgErro("Abra esta página pelo link do e-mail de redefinição de senha.");
      setReady(true);
    }

    init();
  }, [tokenHash, type]);

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    if (password.length < 6) {
      setMsgErro("A senha precisa ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== password2) {
      setMsgErro("As senhas não conferem.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMsgErro(error.message);
      setLoading(false);
      return;
    }

    setMsgOk("✅ Senha criada com sucesso! Você já pode entrar.");
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 520, background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: 32, margin: 0, marginBottom: 8 }}>Redefinir senha</h1>
        <p style={{ marginTop: 0, color: "#555", marginBottom: 18 }}>
          Digite sua nova senha abaixo.
        </p>

        {msg && (
          <div style={{ background: "#f6f7f9", border: "1px solid #e6e8ee", padding: 12, borderRadius: 12, marginBottom: 14 }}>
            {msg}
          </div>
        )}

        {ready && (
          <form onSubmit={handleUpdatePassword}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Nova senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd", marginBottom: 14 }}
              required
            />

            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Confirmar nova senha</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd", marginBottom: 14 }}
              required
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: "#16a34a",
                color: "#fff",
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#111827",
                fontWeight: 800,
                cursor: "pointer",
                marginTop: 10,
              }}
            >
              Voltar para login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
