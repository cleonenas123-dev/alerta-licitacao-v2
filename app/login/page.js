"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [aba, setAba] = useState("entrar"); // entrar | criar | esqueci

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [msg, setMsg] = useState("");
  const [isErro, setIsErro] = useState(false);
  const [loading, setLoading] = useState(false);

  // cooldown de 60s para "reenviar"
  const [cooldown, setCooldown] = useState(0);
  const podeReenviar = useMemo(() => cooldown <= 0 && !loading, [cooldown, loading]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const limparMsg = () => {
    setMsg("");
    setIsErro(false);
  };

  const startCooldown60 = () => setCooldown(60);

  const entrar = async () => {
    limparMsg();

    if (!email || !senha) {
      setIsErro(true);
      setMsg("Erro: preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
      setIsErro(true);
      setMsg("Erro: e-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    setIsErro(false);
    setMsg("Pronto! Login realizado.");
    setLoading(false);

    router.push("/alertas");
  };

  const criarConta = async () => {
    limparMsg();

    if (!email || !senha) {
      setIsErro(true);
      setMsg("Erro: preencha e-mail e senha.");
      return;
    }

    if (senha.length < 6) {
      setIsErro(true);
      setMsg("Erro: a senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    // IMPORTANTE: redirectTo garante que o e-mail de confirmação vai para /confirm
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`,
      },
    });

    if (error) {
      setIsErro(true);
      setMsg("Erro: não foi possível criar a conta. Tente novamente.");
      setLoading(false);
      return;
    }

    setIsErro(false);
    setMsg("Pronto! Se o e-mail existir, enviamos a confirmação (verifique SPAM).");
    setLoading(false);

    startCooldown60();
  };

  const esqueciSenha = async () => {
    limparMsg();

    if (!email) {
      setIsErro(true);
      setMsg("Erro: informe seu e-mail.");
      return;
    }

    setLoading(true);

    // redirectTo manda o usuário cair em /reset-senha quando clicar no e-mail
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-senha`,
    });

    if (error) {
      setIsErro(true);
      setMsg("Erro: não foi possível enviar o link. Tente novamente.");
      setLoading(false);
      return;
    }

    setIsErro(false);
    setMsg("Pronto! Se o e-mail existir, enviamos um link para redefinir sua senha (verifique SPAM).");
    setLoading(false);

    startCooldown60();
  };

  // Reenviar (serve para a aba "esqueci" e para a aba "criar" também)
  const reenviar = async () => {
    limparMsg();

    if (!email) {
      setIsErro(true);
      setMsg("Erro: informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      if (aba === "esqueci") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-senha`,
        });
        if (error) throw error;
        setIsErro(false);
        setMsg("Pronto! Reenviamos o link de redefinição (verifique SPAM).");
      } else if (aba === "criar") {
        // Reenvio de confirmação de e-mail (signup)
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
          options: { emailRedirectTo: `${window.location.origin}/confirm` },
        });
        if (error) throw error;
        setIsErro(false);
        setMsg("Pronto! Reenviamos o e-mail de confirmação (verifique SPAM).");
      } else {
        setIsErro(true);
        setMsg("Erro: o reenviar só funciona em 'Criar conta' ou 'Esqueci a senha'.");
      }

      startCooldown60();
    } catch (e) {
      setIsErro(true);
      setMsg("Erro: não foi possível reenviar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.title}>Alerta de Licitação</div>
          <div style={styles.sub}>Entrar / Criar conta / Redefinir senha</div>
        </div>

        <div style={styles.body}>
          <div style={styles.tabs}>
            <button
              onClick={() => (setAba("entrar"), limparMsg())}
              style={{ ...styles.tab, ...(aba === "entrar" ? styles.tabOn : {}) }}
            >
              Entrar
            </button>
            <button
              onClick={() => (setAba("criar"), limparMsg())}
              style={{ ...styles.tab, ...(aba === "criar" ? styles.tabOn : {}) }}
            >
              Criar conta
            </button>
            <button
              onClick={() => (setAba("esqueci"), limparMsg())}
              style={{ ...styles.tab, ...(aba === "esqueci" ? styles.tabOn : {}) }}
            >
              Esqueci a senha
            </button>
          </div>

          <label style={styles.label}>E-mail</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
          />

          {aba !== "esqueci" && (
            <>
              <label style={styles.label}>Senha</label>
              <input
                style={styles.input}
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
              />
            </>
          )}

          {msg && (
            <div style={{ ...styles.msg, ...(isErro ? styles.msgErro : styles.msgOk) }}>
              {msg}
            </div>
          )}

          <div style={styles.row}>
            {aba === "entrar" && (
              <button style={styles.btnDark} onClick={entrar} disabled={loading}>
                Entrar
              </button>
            )}

            {aba === "criar" && (
              <>
                <button style={styles.btnDark} onClick={criarConta} disabled={loading}>
                  Criar conta
                </button>

                <button
                  style={{ ...styles.btnOutline, ...(podeReenviar ? {} : styles.btnDisabled) }}
                  onClick={reenviar}
                  disabled={!podeReenviar}
                >
                  {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar e-mail"}
                </button>
              </>
            )}

            {aba === "esqueci" && (
              <>
                <button style={styles.btnDark} onClick={esqueciSenha} disabled={loading}>
                  Enviar link
                </button>

                <button
                  style={{ ...styles.btnOutline, ...(podeReenviar ? {} : styles.btnDisabled) }}
                  onClick={reenviar}
                  disabled={!podeReenviar}
                >
                  {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar link"}
                </button>

                <button style={styles.btnDark} onClick={() => router.push("/")}>
                  Home
                </button>
              </>
            )}
          </div>
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
    width: "min(760px, 92vw)",
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
  tabs: {
    display: "flex",
    gap: 8,
    background: "rgba(0,0,0,.05)",
    padding: 6,
    borderRadius: 12,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  tab: {
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 800,
    background: "transparent",
  },
  tabOn: { background: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,.08)" },
  label: { display: "block", fontWeight: 800, marginTop: 12, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,.18)",
    outline: "none",
  },
  row: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" },
  btnDark: {
    background: "#0b1220",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: 10,
    fontWeight: 900,
    cursor: "pointer",
  },
  btnOutline: {
    background: "#fff",
    color: "#0b1220",
    border: "1px solid rgba(0,0,0,.22)",
    padding: "12px 16px",
    borderRadius: 10,
    fontWeight: 900,
    cursor: "pointer",
  },
  btnDisabled: { opacity: 0.55, cursor: "not-allowed" },
  msg: { marginTop: 14, padding: 12, borderRadius: 12, fontWeight: 800 },
  msgOk: { background: "#e7f7ed", border: "1px solid #a6e7bf", color: "#0f5132" },
  msgErro: { background: "#fdecec", border: "1px solid #f3b4b4", color: "#7a1b1b" },
};
