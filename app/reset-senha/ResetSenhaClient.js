"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

function traduzErroAuth(msg) {
  if (!msg) return "Ocorreu um erro. Tente novamente.";
  const m = String(msg);
  const low = m.toLowerCase();

  if (low.includes("otp_expired")) return "Esse link expirou (ou já foi usado). Solicite um novo link.";
  if (low.includes("expired")) return "Link expirado. Solicite uma nova redefinição de senha.";
  if (low.includes("invalid")) return "Link inválido. Solicite uma nova redefinição de senha.";
  if (low.includes("password")) return "Senha inválida. Verifique e tente novamente.";
  if (low.includes("6 characters")) return "A senha deve ter pelo menos 6 caracteres.";

  return "Ocorreu um erro. Tente novamente.";
}

export default function ResetSenhaClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token_hash = useMemo(() => searchParams.get("token_hash"), [searchParams]);
  const type = useMemo(() => searchParams.get("type"), [searchParams]);

  const [verificado, setVerificado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [senha1, setSenha1] = useState("");
  const [senha2, setSenha2] = useState("");
  const [mostrar1, setMostrar1] = useState(false);
  const [mostrar2, setMostrar2] = useState(false);
  const [msg, setMsg] = useState("");
  const [isErro, setIsErro] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    const run = async () => {
      setMsg("");
      setIsErro(false);
      setLoading(true);
      
});
      try {
        const hash = typeof window !== "undefined" ? window.location.hash : "";

        // erro no hash (ex: otp_expired)
        if (hash && hash.includes("error=")) {
          const p = new URLSearchParams(hash.replace("#", ""));
          const errorCode = p.get("error_code");
          setIsErro(true);
          setMsg(errorCode === "otp_expired"
            ? "Esse link expirou (ou já foi usado). Solicite um novo link."
            : "Não foi possível validar o link. Solicite uma nova redefinição de senha."
          );
          setVerificado(false);
          setLoading(false);
          return;
        }

        // 1) ?code=
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setIsErro(true);
            setMsg(traduzErroAuth(error.message));
            setVerificado(false);
            setLoading(false);
            return;
          }
          setVerificado(true);
          setLoading(false);
          router.replace("/reset-senha");
          return;
        }

        // 2) token_hash + type
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({ token_hash, type });
          if (error) {
            setIsErro(true);
            setMsg(traduzErroAuth(error.message));
            setVerificado(false);
            setLoading(false);
            return;
          }
          setVerificado(true);
          setLoading(false);
          return;
        }

        // 3) #access_token=
        if (hash && hash.includes("access_token=")) {
          const p = new URLSearchParams(hash.replace("#", ""));
          const access_token = p.get("access_token");
          const refresh_token = p.get("refresh_token");
          const hashType = p.get("type");

          if (access_token && refresh_token && hashType === "recovery") {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) {
              setIsErro(true);
              setMsg(traduzErroAuth(error.message));
              setVerificado(false);
              setLoading(false);
              return;
            }
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
            setVerificado(true);
            setLoading(false);
            return;
          }
        }

        setIsErro(true);
        setMsg("Link inválido ou incompleto. Solicite uma nova redefinição de senha.");
        setVerificado(false);
        setLoading(false);
      } catch (e) {
        setIsErro(true);
        setMsg("Não foi possível validar o link. Solicite uma nova redefinição de senha.");
        setVerificado(false);
        setLoading(false);
      }
    };

    run();
  }, [searchParams, token_hash, type, router]);

  async function salvarNovaSenha(e) {
    e.preventDefault();
    setMsg("");
    setIsErro(false);

    if (!verificado) {
      setIsErro(true);
      setMsg("Link inválido ou expirado. Volte e solicite uma nova redefinição de senha.");
      return;
    }

    if (senha1.length < 6) {
      setIsErro(true);
      setMsg("A senha deve ter pelo menos 6 caracteres.");
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
      if (error) {
        setIsErro(true);
        setMsg(traduzErroAuth(error.message));
        return;
      }
      setSucesso(true);
      setSenha1("");
      setSenha2("");
    } catch (err) {
      setIsErro(true);
      setMsg("Não foi possível salvar a nova senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (sucesso) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.title}>Alerta de Licitação</div>
            <div style={styles.subtitle}>Senha redefinida</div>
          </div>

          <div style={{ padding: 22 }}>
            <div style={styles.successBox}>
              <div style={styles.thumb}>👍</div>
              <div style={styles.successTitle}>Senha criada com sucesso!</div>
              <div style={styles.successText}>Agora você já pode entrar na sua conta.</div>
              <a href="/login" style={{ textDecoration: "none" }}>
                <div style={styles.primaryBtn}>Entrar</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.title}>Alerta de Licitação</div>
          <div style={styles.subtitle}>Redefinir senha</div>
        </div>

        {msg ? (
          <div style={{ ...styles.alert, ...(isErro ? styles.alertErro : styles.alertOk) }}>{msg}</div>
        ) : null}

        <form onSubmit={salvarNovaSenha} style={{ padding: 22 }}>
          <label style={styles.label}>Nova senha</label>
          <div style={styles.row}>
            <input
              style={{ ...styles.input, ...styles.inputFlex }}
              type={mostrar1 ? "text" : "password"}
              value={senha1}
              onChange={(e) => setSenha1(e.target.value)}
              placeholder="Digite a nova senha"
              disabled={!verificado || loading}
            />
            <button
              type="button"
              style={styles.smallBtn}
              onClick={() => setMostrar1((v) => !v)}
              disabled={!verificado || loading}
            >
              {mostrar1 ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <label style={styles.label}>Confirmar nova senha</label>
          <div style={styles.row}>
            <input
              style={{ ...styles.input, ...styles.inputFlex }}
              type={mostrar2 ? "text" : "password"}
              value={senha2}
              onChange={(e) => setSenha2(e.target.value)}
              placeholder="Repita a nova senha"
              disabled={!verificado || loading}
            />
            <button
              type="button"
              style={styles.smallBtn}
              onClick={() => setMostrar2((v) => !v)}
              disabled={!verificado || loading}
            >
              {mostrar2 ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.primaryBtn} disabled={!verificado || loading}>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>

            <a href="/login" style={styles.secondaryBtnLink}>
              <span style={styles.secondaryBtn}>Voltar ao login</span>
            </a>

            <a href="/" style={styles.secondaryBtnLink}>
              <span style={styles.secondaryBtn}>Home</span>
            </a>

            {!verificado && !loading ? (
              <button type="button" style={styles.secondaryBtn} onClick={() => router.push("/login")}>
                Solicitar novo link
              </button>
            ) : null}
          </div>

          {!verificado && !loading ? (
            <div style={{ marginTop: 14, fontSize: 13, opacity: 0.75 }}>
              Dica: solicite novamente a redefinição de senha na tela de login.
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: "#f3f5f8",
  },
  card: {
    width: "min(980px, 100%)",
    borderRadius: 22,
    background: "#fff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(90deg, #0b1020, #0a0f1d)",
    padding: "22px 22px",
    color: "#fff",
  },
  title: { fontSize: 28, fontWeight: 900, lineHeight: 1.1 },
  subtitle: { fontSize: 13, opacity: 0.8, marginTop: 2 },

  alert: {
    margin: "14px 18px 0 18px",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid transparent",
    fontWeight: 700,
  },
  alertOk: { background: "#e9fbf0", borderColor: "#bfead0", color: "#155d33" },
  alertErro: { background: "#fdecec", borderColor: "#f5c2c7", color: "#8a1c24" },

  label: { display: "block", fontWeight: 900, margin: "12px 0 8px 0" },
  input: {
    width: "100%",
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid #d7ddea",
    outline: "none",
    fontSize: 16,
    minWidth: 0,
  },
  row: { display: "flex", gap: 10, alignItems: "center", minWidth: 0 },
  inputFlex: { flex: 1, minWidth: 0 },

  smallBtn: {
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #d7ddea",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 110,
    flexShrink: 0,
  },

  actions: { display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" },
  primaryBtn: {
    background: "#0b1020",
    color: "#fff",
    border: "1px solid #0b1020",
    padding: "13px 18px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 180,
    textAlign: "center",
  },
  secondaryBtn: {
    background: "#fff",
    color: "#0b1020",
    border: "1px solid #d7ddea",
    padding: "13px 18px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 160,
    textAlign: "center",
  },
  secondaryBtnLink: { textDecoration: "none" },

  successBox: {
    border: "1px solid #bfead0",
    background: "#e9fbf0",
    borderRadius: 18,
    padding: 22,
    textAlign: "center",
  },
  thumb: { fontSize: 44, marginBottom: 10 },
  successTitle: { fontSize: 20, fontWeight: 900, marginBottom: 6, color: "#155d33" },
  successText: { fontSize: 14, opacity: 0.85, marginBottom: 16, color: "#155d33" },
};
