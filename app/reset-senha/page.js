"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

function ResetSenhaInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token_hash = useMemo(() => searchParams.get("token_hash"), [searchParams]);
  const type = useMemo(() => searchParams.get("type"), [searchParams]);

  const [loading, setLoading] = useState(true);
  const [verificado, setVerificado] = useState(false);

  const [senha1, setSenha1] = useState("");
  const [senha2, setSenha2] = useState("");

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [msg, setMsg] = useState("");
  const [isErro, setIsErro] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const run = async () => {
      setMsg("");
      setIsErro(false);

      // O link precisa vir com token_hash e type=recovery
      if (!token_hash || !type) {
        setIsErro(true);
        setMsg("Link inválido ou incompleto. Solicite uma nova redefinição de senha.");
        setLoading(false);
        return;
      }

      try {
        // Confirma o OTP do recovery e cria sessão
        const { error } = await supabase.auth.verifyOtp({
          type: "recovery",
          token_hash,
        });

        if (error) {
          setIsErro(true);
          setMsg("Link inválido, expirado ou já utilizado. Solicite um novo link.");
          setVerificado(false);
        } else {
          setVerificado(true);
        }
      } catch (e) {
        setIsErro(true);
        setMsg("Não foi possível validar o link. Tente novamente.");
        setVerificado(false);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token_hash, type]);

  const onSalvar = async () => {
    setMsg("");
    setIsErro(false);

    if (!verificado) {
      setIsErro(true);
      setMsg("Link ainda não validado. Solicite um novo link.");
      return;
    }

    if (!senha1 || senha1.length < 6) {
      setIsErro(true);
      setMsg("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha1 !== senha2) {
      setIsErro(true);
      setMsg("As senhas não conferem.");
      return;
    }

    setSalvando(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: senha1 });
      if (error) {
        setIsErro(true);
        setMsg(error.message || "Não foi possível salvar a nova senha.");
        return;
      }

      // Opcional (recomendado): encerra a sessão de recovery
      await supabase.auth.signOut();

      router.replace("/reset-senha/sucesso");
    } catch (e) {
      setIsErro(true);
      setMsg("Erro inesperado ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Alerta de Licitação</div>
            <div style={styles.subtitle}>Redefinir senha</div>
          </div>
        </div>

        <div style={styles.body}>
          {loading ? (
            <div style={styles.infoBox}>Validando link…</div>
          ) : (
            <>
              {msg ? (
                <div style={{ ...styles.alert, ...(isErro ? styles.alertErr : styles.alertOk) }}>
                  {msg}
                </div>
              ) : null}

              <label style={styles.label}>Nova senha</label>
              <div style={styles.inputRow}>
                <input
                  style={styles.input}
                  type={show1 ? "text" : "password"}
                  value={senha1}
                  onChange={(e) => setSenha1(e.target.value)}
                  placeholder="Digite a nova senha"
                  disabled={!verificado || salvando}
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShow1((v) => !v)}
                  disabled={!verificado || salvando}
                >
                  {show1 ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <label style={styles.label}>Confirmar nova senha</label>
              <div style={styles.inputRow}>
                <input
                  style={styles.input}
                  type={show2 ? "text" : "password"}
                  value={senha2}
                  onChange={(e) => setSenha2(e.target.value)}
                  placeholder="Repita a nova senha"
                  disabled={!verificado || salvando}
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShow2((v) => !v)}
                  disabled={!verificado || salvando}
                >
                  {show2 ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={onSalvar}
                  disabled={!verificado || salvando}
                  style={{ ...styles.primaryBtn, opacity: !verificado || salvando ? 0.6 : 1 }}
                >
                  {salvando ? "Salvando…" : "Salvar nova senha"}
                </button>

                <button onClick={() => router.push("/login")} style={styles.secondaryBtn}>
                  Voltar ao login
                </button>

                <button onClick={() => router.push("/")} style={styles.secondaryBtn}>
                  Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetSenhaPage() {
  // Obrigatório no App Router quando usa useSearchParams
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Carregando…</div>}>
      <ResetSenhaInner />
    </Suspense>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "min(860px, 96vw)",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 18px 50px rgba(0,0,0,.12)",
    overflow: "hidden",
  },
  header: {
    background: "#0b1220",
    color: "#fff",
    padding: "18px 22px",
  },
  title: { fontSize: 22, fontWeight: 800, lineHeight: 1.1 },
  subtitle: { fontSize: 13, opacity: 0.85, marginTop: 4 },
  body: { padding: 22 },
  label: { display: "block", marginTop: 14, marginBottom: 6, fontWeight: 700 },
  inputRow: { display: "flex", gap: 10, alignItems: "center" },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #d6dbe6",
    outline: "none",
    fontSize: 14,
  },
  eyeBtn: {
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid #d6dbe6",
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  actions: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 },
  primaryBtn: {
    background: "#0b1220",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#fff",
    color: "#0b1220",
    border: "1px solid #d6dbe6",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  },
  alert: { borderRadius: 12, padding: "12px 14px", marginTop: 6, lineHeight: 1.35 },
  alertOk: { background: "#e8fff1", border: "1px solid #86efac", color: "#14532d" },
  alertErr: { background: "#fff1f2", border: "1px solid #fecdd3", color: "#7f1d1d" },
  infoBox: { background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 },
};
