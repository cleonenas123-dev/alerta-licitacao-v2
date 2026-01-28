"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

function parseHash(hash) {
  const h = hash?.startsWith("#") ? hash.slice(1) : hash || "";
  const params = new URLSearchParams(h);
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
    type: params.get("type"),
  };
}

export default function ResetPage() {
  const router = useRouter();
  const [status, setStatus] = useState({ type: "info", text: "" });
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);

  const origin = useMemo(() => (typeof window !== "undefined" ? window.location.origin : ""), []);

  useEffect(() => {
    const run = async () => {
      try {
        // 1) Caso venha via ?code=...
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setReady(true);
          setStatus({ type: "ok", text: "Link validado. Defina sua nova senha." });
          return;
        }

        // 2) Caso venha via #access_token=...&type=recovery
        const { access_token, refresh_token, type } = parseHash(window.location.hash);
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;

          if (type !== "recovery") {
            setStatus({ type: "warn", text: "Este link não é de recuperação de senha." });
          } else {
            setStatus({ type: "ok", text: "Link validado. Defina sua nova senha." });
          }
          setReady(true);
          return;
        }

        setStatus({
          type: "error",
          text: `Link inválido ou expirado. Volte e peça um novo link em "Esqueci a senha". (${origin})`,
        });
      } catch (e) {
        setStatus({ type: "error", text: e?.message || "Falha ao validar link." });
      }
    };
    run();
  }, [origin]);

  const boxStyle = {
    maxWidth: 520,
    margin: "60px auto",
    padding: 24,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 12px 30px rgba(0,0,0,.12)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  };

  const alertStyle = (type) => {
    const base = { padding: 12, borderRadius: 12, marginTop: 12, fontSize: 14 };
    if (type === "ok") return { ...base, background: "#e8fff0", border: "1px solid #9be7b4" };
    if (type === "warn") return { ...base, background: "#fff7e6", border: "1px solid #ffd59a" };
    if (type === "error") return { ...base, background: "#ffecec", border: "1px solid #ffb2b2" };
    return { ...base, background: "#eef5ff", border: "1px solid #b9d4ff" };
  };

  const onSave = async () => {
    if (pw1.length < 6) return setStatus({ type: "error", text: "Senha muito curta (mínimo 6 caracteres)." });
    if (pw1 !== pw2) return setStatus({ type: "error", text: "As senhas não conferem." });

    setStatus({ type: "info", text: "Atualizando senha..." });

    const { error } = await supabase.auth.updateUser({ password: pw1 });
    if (error) return setStatus({ type: "error", text: error.message });

    setStatus({ type: "ok", text: "Senha atualizada com sucesso! Você já pode entrar." });
    setTimeout(() => router.push("/login"), 800);
  };

  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh", padding: 16 }}>
      <div style={boxStyle}>
        <h2 style={{ margin: 0 }}>Redefinir senha</h2>
        <p style={{ marginTop: 8, color: "#666" }}>Defina uma nova senha para sua conta.</p>

        <div style={alertStyle(status.type)}>{status.text || "Aguardando link..."}</div>

        <div style={{ marginTop: 16, opacity: ready ? 1 : 0.5, pointerEvents: ready ? "auto" : "none" }}>
          <label style={{ display: "block", fontWeight: 600, marginTop: 10 }}>Nova senha</label>
          <input
            type={show ? "text" : "password"}
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
          />

          <label style={{ display: "block", fontWeight: 600, marginTop: 10 }}>Confirmar senha</label>
          <input
            type={show ? "text" : "password"}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              onClick={() => setShow((s) => !s)}
              style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #ccc", background: "#fff" }}
            >
              {show ? "Ocultar" : "Mostrar"} senha
            </button>

            <button
              onClick={onSave}
              style={{ padding: "10px 14px", borderRadius: 12, border: "none", background: "#111827", color: "#fff" }}
            >
              Salvar nova senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
