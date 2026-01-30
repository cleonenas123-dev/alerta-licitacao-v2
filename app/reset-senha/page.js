"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetSenhaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token_hash = useMemo(() => searchParams.get("token_hash"), [searchParams]);
  const type = useMemo(() => searchParams.get("type"), [searchParams]);

  const [loading, setLoading] = useState(true);
  const [verificado, setVerificado] = useState(false);

  const [senha1, setSenha1] = useState("");
  const [senha2, setSenha2] = useState("");

  const [msg, setMsg] = useState("");
  const [isErro, setIsErro] = useState(false);

  useEffect(() => {
    const run = async () => {
      setMsg("");
      setIsErro(false);

      // Precisa vir do e-mail
      if (!token_hash || !type) {
        setIsErro(true);
        setMsg("Erro: link inválido ou incompleto. Solicite uma nova redefinição de senha.");
        setLoading(false);
        return;
      }

      // Para reset, o type deve ser "recovery"
      if (type !== "recovery") {
        setIsErro(true);
        setMsg("Erro: tipo de link inválido. Solicite a redefinição de senha novamente.");
        setLoading(false);
        return;
      }

      // Verifica o token e cria sessão
      const { error } = await supabase.auth.verifyOtp({
        type: "recovery",
        token_hash,
      });

      if (error) {
        setIsErro(true);
        setMsg("Erro: link expirado ou já utilizado. Clique em 'Esqueci a senha' e gere um novo link.");
        setLoading(false);
        return;
      }

      setVerificado(true);
      setLoading(false);
    };

    run();
  }, [token_hash, type]);

  const salvarNovaSenha = async () => {
    setMsg("");
    setIsErro(false);

    if (!senha1 || !senha2) {
      setIsErro(true);
      setMsg("Erro: preencha os dois campos de senha.");
      return;
    }

    if (senha1.length < 6) {
      setIsErro(true);
      setMsg("Erro: a senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha1 !== senha2) {
      setIsErro(true);
      setMsg("Erro: as senhas não conferem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: senha1 });

    if (error) {
      setIsErro(true);
      setMsg("Erro: não foi possível alterar a senha. Tente novamente.");
      setLoading(false);
      return;
    }

    setIsErro(false);
    setMsg("Senha criada com sucesso! Você já pode entrar no sistema.");
    setLoading(false);

    // opcional: deslogar sessão de recovery e mandar pro login
    setTimeout(async () => {
      await supabase.auth.signOut();
      router.push("/login");
    }, 1200);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.title}>Alerta de Licitação</div>
          <div style={styles.sub}>Redefinição de senha</div>
        </div>

        <div style={styles.body}>
          {loading && <p style={styles.text}>Carregando…</p>}

          {!loading && !verificado && (
            <>
              <p style={styles.text}>{msg}</p>
              <button style={styles.btnDark} onClick={() => router.push("/login")}>
                Voltar ao login
              </button>
            </>
          )}

          {!loading && verificado && (
            <>
              <h2 style={styles.h2}>Digite sua nova senha</h2>

              <label style={styles.label}>Nova senha</label>
              <input
                style={styles.input}
                type="password"
                value={senha1}
                onChange={(e) => setSenha1(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />

              <label style={styles.label}>Confirmar nova senha</label>
              <input
                style={styles.input}
                type="password"
                value={senha2}
                onChange={(e) => setSenha2(e.target.value)}
                placeholder="Repita a senha"
              />

              {msg && (
                <div style={{ ...styles.msg, ...(isErro ? styles.msgErro : styles.msgOk) }}>
                  {msg}
                </div>
              )}

              <div style={styles.row}>
                <button style={styles.btnGreen} onClick={salvarNovaSenha} disabled={loading}>
                  Salvar senha
                </button>
                <button style={styles.btnDark} onClick={() => router.push("/")}>
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

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 20,
    background: "#ffffff",
  },
  card: {
    width: "min(720px, 92vw)",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 18px 60px rgba(0,0,0,.12)",
    border: "1px solid rgba(0,0,0,.06)",
  },
  header: {
    background: "#0b1220",
    color: "#fff",
    padding: "18px 22px",
  },
  title: { fontSize: 20, fontWeight: 800 },
  sub: { fontSize: 13, opacity: 0.85, marginTop: 2 },
  body: { padding: 22 },
  h2: { margin: "0 0 14px 0", fontSize: 22 },
  text: { margin: "10px 0" },
  label: { display: "block", fontWeight: 700, marginTop: 12, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,.18)",
    outline: "none",
  },
  row: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" },
  btnGreen: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
  },
  btnDark: {
    background: "#0b1220",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
  },
  msg: { marginTop: 14, padding: 12, borderRadius: 12, fontWeight: 700 },
  msgOk: { background: "#e7f7ed", border: "1px solid #a6e7bf", color: "#0f5132" },
  msgErro: { background: "#fdecec", border: "1px solid #f3b4b4", color: "#7a1b1b" },
};
