"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ResetSenhaPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <ResetSenhaInner />
    </Suspense>
  );
}

function LoadingCard() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 6 }}>Redefinir senha</div>
        <div style={styles.alertInfo}>Carregando...</div>
      </div>
    </div>
  );
}

function ResetSenhaInner() {
  const searchParams = useSearchParams();

  const token_hash = useMemo(() => searchParams.get("token_hash"), [searchParams]);
  const type = useMemo(() => searchParams.get("type"), [searchParams]);

  const [verificando, setVerificando] = useState(true);
  const [tokenOk, setTokenOk] = useState(false);

  const [senha1, setSenha1] = useState("");
  const [senha2, setSenha2] = useState("");

  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // reenviar (60s)
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const origin = useMemo(() => (typeof window !== "undefined" ? window.location.origin : ""), []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    async function run() {
      setMsg("");
      setErro(false);

      // precisa ter token_hash e type=recovery
      if (!token_hash || !type) {
        setVerificando(false);
        setTokenOk(false);
        setErro(true);
        setMsg("Link inválido ou incompleto. Solicite um novo link de redefinição.");
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          type: "recovery",
          token_hash,
        });

        if (error) {
          setTokenOk(false);
          setErro(true);
          setMsg("Link expirado ou inválido. Solicite um novo link.");
        } else {
          setTokenOk(true);
          setErro(false);
          setMsg("");
        }
      } catch (e) {
        setTokenOk(false);
        setErro(true);
        setMsg("Erro ao validar o link. Solicite um novo link.");
      } finally {
        setVerificando(false);
      }
    }

    run();
  }, [token_hash, type]);

  async function salvarNovaSenha(e) {
    e.preventDefault();
    setMsg("");
    setErro(false);

    if (senha1.length < 6) {
      setErro(true);
      setMsg("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (senha1 !== senha2) {
      setErro(true);
      setMsg("As senhas não conferem.");
      return;
    }

    setSalvando(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: senha1 });
      if (error) {
        setErro(true);
        setMsg("Não foi possível atualizar a senha: " + error.message);
      } else {
        setErro(false);
        setMsg("Senha criada com sucesso!");
      }
    } catch (e) {
      setErro(true);
      setMsg("Erro inesperado ao atualizar a senha.");
    } finally {
      setSalvando(false);
    }
  }

  async function reenviarLink(e) {
    e.preventDefault();
    setMsg("");
    setErro(false);

    if (!email.trim()) {
      setErro(true);
      setMsg("Digite seu e-mail para reenviar o link.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-senha`,
      });

      if (error) {
        setErro(true);
        setMsg("Não foi possível reenviar agora. Tente novamente.");
      } else {
        setErro(false);
        setMsg("Pronto! Se o e-mail existir, reenviamos o link (verifique SPAM).");
        setCooldown(60);
      }
    } catch (e) {
      setErro(true);
      setMsg("Erro inesperado ao reenviar.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 6 }}>Redefinir senha</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 14 }}>
          Crie uma nova senha para sua conta.
        </div>

        {verificando ? (
          <div style={styles.alertInfo}>Validando link...</div>
        ) : (
          <>
            {msg && <div style={erro ? styles.alertErr : styles.alertOk}>{msg}</div>}

            {tokenOk ? (
              <form onSubmit={salvarNovaSenha} style={styles.form}>
                <label style={styles.label}>Nova senha</label>
                <input style={styles.input} type="password" value={senha1} onChange={(e) => setSenha1(e.target.value)} />

                <label style={styles.label}>Confirmar nova senha</label>
                <input style={styles.input} type="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} />

                <button style={styles.primaryBtn} type="submit" disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar nova senha"}
                </button>

                <button
                  type="button"
                  style={styles.secondaryBtn}
                  onClick={() => (window.location.href = "/")}
                >
                  Voltar para Home
                </button>
              </form>
            ) : (
              <form onSubmit={reenviarLink} style={styles.form}>
                <div style={styles.help}>
                  Como o link não é válido/expirou, você pode reenviar um novo.
                </div>

                <label style={styles.label}>Seu e-mail</label>
                <input style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />

                <button style={styles.primaryBtn} type="submit" disabled={cooldown > 0}>
                  {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar link"}
                </button>

                <button
                  type="button"
                  style={styles.secondaryBtn}
                  onClick={() => (window.location.href = "/login")}
                >
                  Voltar para Login
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#fff", padding: 24 },
  card: {
    width: "min(560px, 92vw)",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
    padding: 28,
    background: "#fff",
  },
  form: { display: "grid", gap: 10, marginTop: 12 },
  label: { fontWeight: 800, fontSize: 13, marginTop: 6 },
  input: { height: 42, borderRadius: 12, border: "1px solid #d1d5db", padding: "0 12px", fontSize: 14 },
  help: { fontSize: 12, opacity: 0.75 },
  primaryBtn: {
    marginTop: 8,
    height: 42,
    borderRadius: 12,
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryBtn: {
    height: 42,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  alertOk: { background: "#dcfce7", border: "1px solid #86efac", padding: 12, borderRadius: 12, marginTop: 8, fontWeight: 800, color: "#14532d", fontSize: 13 },
  alertErr: { background: "#fee2e2", border: "1px solid #fecaca", padding: 12, borderRadius: 12, marginTop: 8, fontWeight: 800, color: "#7f1d1d", fontSize: 13 },
  alertInfo: { background: "#e5e7eb", border: "1px solid #d1d5db", padding: 12, borderRadius: 12, marginTop: 8, fontWeight: 800, color: "#111827", fontSize: 13 },
};
