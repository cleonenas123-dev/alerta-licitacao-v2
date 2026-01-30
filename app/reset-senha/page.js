"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ResetSenhaPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, fontFamily: "Arial" }}>Carregando...</div>}>
      <ResetSenhaInner />
    </Suspense>
  );
}

function ResetSenhaInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  const [senha1, setSenha1] = useState("");
  const [senha2, setSenha2] = useState("");

  const [email, setEmail] = useState(""); // para reenviar link
  const [cooldown, setCooldown] = useState(0);

  const [msg, setMsg] = useState("");
  const [isErro, setIsErro] = useState(false);

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

  // 1) Quando o usuário chega do e-mail, o Supabase pode mandar:
  // - via hash: #access_token=...&refresh_token=...&type=recovery
  // - via query: ?token_hash=...&type=recovery
  useEffect(() => {
    const run = async () => {
      limparMensagens();
      setLoading(true);

      try {
        // Caso A: veio via hash (mais comum)
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash && hash.includes("access_token=")) {
          const params = new URLSearchParams(hash.replace("#", ""));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;

            setAutenticado(true);
            setLoading(false);
            return;
          }
        }

        // Caso B: veio via query token_hash/type
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type"); // deve ser "recovery"

        if (token_hash && type) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });

          if (error) throw error;
          if (!data?.session) {
            throw new Error("Link inválido ou expirado. Reenvie o e-mail de recuperação.");
          }

          setAutenticado(true);
          setLoading(false);
          return;
        }

        // Se não veio nada:
        setAutenticado(false);
        setLoading(false);
        setIsErro(true);
        setMsg("Link inválido ou expirado. Você pode reenviar um novo link abaixo.");
      } catch (err) {
        setAutenticado(false);
        setLoading(false);
        setIsErro(true);
        setMsg(err?.message || "Não foi possível validar o link. Reenvie um novo link.");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function salvarNovaSenha(e) {
    e.preventDefault();
    limparMensagens();

    if (senha1.length < 6) {
      setIsErro(true);
      setMsg("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha1 !== senha2) {
      setIsErro(true);
      setMsg("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: senha1 });
      if (error) throw error;

      setIsErro(false);
      setMsg("Senha criada com sucesso! Você já pode entrar.");
      setSenha1("");
      setSenha2("");
    } catch (err) {
      setIsErro(true);
      setMsg(err?.message || "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
    }
  }

  async function reenviarLink() {
    limparMensagens();

    if (!podeReenviar) return;
    if (!email) {
      setIsErro(true);
      setMsg("Digite seu e-mail para reenviar o link.");
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
        <div style={{ background: "#0b1220", color: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Alerta de Licitação</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Redefinir senha</div>
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

        {loading ? (
          <div style={{ color: "#6b7280" }}>Validando link...</div>
        ) : autenticado ? (
          <form onSubmit={salvarNovaSenha}>
            <label style={labelStyle}>Nova senha</label>
            <input value={senha1} onChange={(e) => setSenha1(e.target.value)} type="password" style={inputStyle} placeholder="Digite a nova senha" />

            <label style={labelStyle}>Confirmar nova senha</label>
            <input value={senha2} onChange={(e) => setSenha2(e.target.value)} type="password" style={inputStyle} placeholder="Repita a nova senha" />

            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <button disabled={loading} style={primaryBtn}>{loading ? "Salvando..." : "Salvar nova senha"}</button>
              <button type="button" onClick={() => router.push("/login")} style={secondaryBtn}>Voltar ao login</button>
              <button type="button" onClick={() => router.push("/")} style={secondaryBtn}>Home</button>
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Não recebeu ou o link expirou?</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
                Digite seu e-mail e reenviamos um novo link (o botão libera após 60s).
              </div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={inputStyle} placeholder="seuemail@dominio.com" />
              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  disabled={loading || !email || !podeReenviar}
                  onClick={reenviarLink}
                  style={{
                    ...secondaryBtn,
                    opacity: (!email || !podeReenviar) ? 0.6 : 1,
                    cursor: (!email || !podeReenviar) ? "not-allowed" : "pointer",
                  }}
                >
                  {podeReenviar ? "Reenviar e-mail" : `Reenviar em ${cooldown}s`}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ fontSize: 14, color: "#374151", marginBottom: 10 }}>
              Este link parece inválido/expirado. Reenvie um novo link abaixo:
            </div>

            <label style={labelStyle}>E-mail</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={inputStyle} placeholder="seuemail@dominio.com" />

            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                disabled={loading || !email || !podeReenviar}
                onClick={reenviarLink}
                style={{
                  ...primaryBtn,
                  opacity: (!email || !podeReenviar) ? 0.6 : 1,
                  cursor: (!email || !podeReenviar) ? "not-allowed" : "pointer",
                }}
              >
                {podeReenviar ? "Reenviar e-mail" : `Reenviar em ${cooldown}s`}
              </button>

              <button type="button" onClick={() => router.push("/login")} style={secondaryBtn}>Voltar ao login</button>
              <button type="button" onClick={() => router.push("/")} style={secondaryBtn}>Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 900, marginTop: 10, marginBottom: 6 };
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
