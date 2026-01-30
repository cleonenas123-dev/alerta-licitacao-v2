"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

function traduzErroAuth(msg) {
  if (!msg) return "Ocorreu um erro. Tente novamente.";

  const m = String(msg);

  const mapa = new Map([
    ["Invalid login credentials", "E-mail ou senha inválidos."],
    ["Email not confirmed", "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada."],
    ["User already registered", "Este e-mail já está cadastrado. Faça login ou redefina a senha."],
    ["Password should be at least 6 characters", "A senha deve ter pelo menos 6 caracteres."],
    ["Signup requires a valid password", "Informe uma senha válida."],
    ["Unable to validate email address: invalid format", "Formato de e-mail inválido."],
    ["Email rate limit exceeded", "Muitas tentativas. Aguarde um pouco e tente novamente."],
    ["For security purposes, you can only request this once every 60 seconds", "Aguarde 60 segundos para reenviar."],
  ]);

  // match exato
  if (mapa.has(m)) return mapa.get(m);

  // match por trecho
  if (m.toLowerCase().includes("password")) return "Senha inválida. Verifique e tente novamente.";
  if (m.toLowerCase().includes("email")) return "Verifique o e-mail informado e tente novamente.";

  return "Ocorreu um erro. Tente novamente.";
}

export default function LoginPage() {
  const [tab, setTab] = useState("entrar"); // entrar | criar | esqueci

  // campos comuns
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // criar conta
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha2, setMostrarSenha2] = useState(false);

  // mensagens
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isErro, setIsErro] = useState(false);
  const [cadastroOk, setCadastroOk] = useState(false);
  const [emailCadastro, setEmailCadastro] = useState("");

  // cooldown reenviar (serve para “esqueci” e pode servir para “criar” se quiser)
  const [cooldown, setCooldown] = useState(0);

  const podeReenviar = useMemo(() => cooldown <= 0, [cooldown]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // limpa mensagens ao trocar aba
  useEffect(() => {
    setMsg("");
    setIsErro(false);
  }, [tab]);

  async function entrar(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setIsErro(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) {
        setIsErro(true);
        setMsg(traduzErroAuth(error.message));
        return;
      }

      // sucesso
      window.location.href = "/alertas";
    } catch (err) {
      setIsErro(true);
      setMsg("Falha ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function criarConta(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setIsErro(false);

    if (!email.trim()) {
      setIsErro(true);
      setMsg("Informe seu e-mail.");
      setLoading(false);
      return;
    }
    if (senha.length < 6) {
      setIsErro(true);
      setMsg("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }
    if (senha !== confirmarSenha) {
      setIsErro(true);
      setMsg("As senhas não conferem.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: {
          // após confirmar e-mail (se você usar), direciona pro login
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setIsErro(true);
        setMsg(traduzErroAuth(error.message));
        return;
      }

      setIsErro(false);
      setMsg("");
      setEmailCadastro(email.trim());
      setCadastroOk(true);

      setSenha("");
      setConfirmarSenha("");
      setMostrarSenha(false);
      setMostrarSenha2(false);
    } catch (err) {
      setIsErro(true);
      setMsg("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function enviarReset(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setIsErro(false);

    try {
      const emailLimpo = email.trim();
      if (!emailLimpo) {
        setIsErro(true);
        setMsg("Informe seu e-mail para receber o link.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(emailLimpo, {
       redirectTo: `https://alertadelicitacao.com/reset-senha`,
      });

      if (error) {
        setIsErro(true);
        setMsg(traduzErroAuth(error.message));
        return;
      }

      // Mensagem “confiante”, sem “se existir”
      setIsErro(false);
      setMsg("Pronto! Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada e o SPAM.");
      setCooldown(60);
    } catch (err) {
      setIsErro(true);
      setMsg("Não foi possível enviar o e-mail agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function reenviarReset() {
    if (!podeReenviar) return;
    setLoading(true);
    setMsg("");
    setIsErro(false);

    try {
      const emailLimpo = email.trim();
      if (!emailLimpo) {
        setIsErro(true);
        setMsg("Informe seu e-mail para reenviar o link.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(emailLimpo, {
        redirectTo: `${window.location.origin}/reset-senha`,
      });

      if (error) {
        setIsErro(true);
        setMsg(traduzErroAuth(error.message));
        return;
      }

      setIsErro(false);
      setMsg("Link reenviado! Verifique seu e-mail.");
      setCooldown(60);
    } catch (err) {
      setIsErro(true);
      setMsg("Não foi possível reenviar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.brandRow}>
            <div style={styles.logo} />
            <div>
              <div style={styles.title}>Alerta de Licitação</div>
              <div style={styles.subtitle}>Entrar / Criar conta / Redefinir senha</div>
            </div>
          </div>
        </div>

        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => setTab("entrar")}
            style={{ ...styles.tabBtn, ...(tab === "entrar" ? styles.tabActive : {}) }}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setTab("criar")}
            style={{ ...styles.tabBtn, ...(tab === "criar" ? styles.tabActive : {}) }}
          >
            Criar conta
          </button>
          <button
            type="button"
            onClick={() => setTab("esqueci")}
            style={{ ...styles.tabBtn, ...(tab === "esqueci" ? styles.tabActive : {}) }}
          >
            Esqueci a senha
          </button>
        </div>

        {msg ? (
          <div style={{ ...styles.alert, ...(isErro ? styles.alertErro : styles.alertOk) }}>
            {msg}
          </div>
        ) : null}

        {tab === "entrar" && (
          <form onSubmit={entrar} style={styles.form}>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@dominio.com"
              autoComplete="email"
            />

            <label style={styles.label}>Senha</label>
            <div style={styles.row}>
              <input
                style={{ ...styles.input, ...styles.inputFlex }}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
              />
              <button
                type="button"
                style={styles.smallBtn}
                onClick={() => setMostrarSenha((v) => !v)}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <div style={styles.actions}>
              <button type="submit" style={styles.primaryBtn} disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
              <a href="/" style={styles.secondaryBtnLink}>
                <span style={styles.secondaryBtn}>Home</span>
              </a>
            </div>
          </form>
        )}

        {tab === "criar" && (
          <form onSubmit={criarConta} style={styles.form}>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@dominio.com"
              autoComplete="email"
            />

            <label style={styles.label}>Senha</label>
            <div style={styles.row}>
              <input
                style={{ ...styles.input, ...styles.inputFlex }}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Crie uma senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="new-password"
              />
              <button
                type="button"
                style={styles.smallBtn}
                onClick={() => setMostrarSenha((v) => !v)}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <label style={styles.label}>Confirmar senha</label>
            <div style={styles.row}>
              <input
                style={{ ...styles.input, ...styles.inputFlex }}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a senha"
                type={mostrarSenha2 ? "text" : "password"}
                autoComplete="new-password"
              />
              <button
                type="button"
                style={styles.smallBtn}
                onClick={() => setMostrarSenha2((v) => !v)}
              >
                {mostrarSenha2 ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <div style={styles.actions}>
              <button type="submit" style={styles.primaryBtn} disabled={loading}>
                {loading ? "Criando..." : "Criar conta"}
              </button>
              <a href="/" style={styles.secondaryBtnLink}>
                <span style={styles.secondaryBtn}>Home</span>
              </a>
            </div>
          </form>
        )}

        {tab === "esqueci" && (
          <form onSubmit={enviarReset} style={styles.form}>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              autoComplete="email"
            />
            <div style={styles.hint}>
              Enviaremos um link para você criar uma nova senha.
            </div>

            <div style={styles.actions}>
              <button type="submit" style={styles.primaryBtn} disabled={loading}>
                {loading ? "Enviando..." : "Enviar link"}
              </button>

              <button
                type="button"
                style={{ ...styles.secondaryBtn, ...(podeReenviar ? {} : styles.disabledBtn) }}
                onClick={reenviarReset}
                disabled={!podeReenviar || loading}
                title={!podeReenviar ? `Aguarde ${cooldown}s` : "Reenviar e-mail"}
              >
                {podeReenviar ? "Reenviar e-mail" : `Reenviar em ${cooldown}s`}
              </button>

              <a href="/" style={styles.secondaryBtnLink}>
                <span style={styles.secondaryBtn}>Home</span>
              </a>
            </div>
          </form>
        )}
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
    width: "min(920px, 100%)",
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
  brandRow: { display: "flex", gap: 14, alignItems: "center" },
  logo: { width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.16)" },
  title: { fontSize: 28, fontWeight: 800, lineHeight: 1.1 },
  subtitle: { fontSize: 13, opacity: 0.8, marginTop: 2 },

  tabs: {
    display: "flex",
    gap: 10,
    padding: 18,
    background: "#f7f8fa",
  },
  tabBtn: {
    flex: 1,
    border: "1px solid #e4e7ee",
    background: "#fff",
    padding: "12px 14px",
    borderRadius: 999,
    fontWeight: 700,
    cursor: "pointer",
  },
  tabActive: {
    background: "#0b1020",
    color: "#fff",
    border: "1px solid #0b1020",
  },

  alert: {
    margin: "14px 18px 0 18px",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid transparent",
    fontWeight: 600,
  },
  alertOk: { background: "#e9fbf0", borderColor: "#bfead0", color: "#155d33" },
  alertErro: { background: "#fdecec", borderColor: "#f5c2c7", color: "#8a1c24" },

  form: { padding: 18, paddingTop: 16 },
  label: { display: "block", fontWeight: 800, margin: "12px 0 8px 0" },
 input: {
  width: "100%",
  boxSizing: "border-box",
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
    fontWeight: 800,
    cursor: "pointer",
    minWidth: 110,
  },
  hint: { marginTop: 8, fontSize: 13, opacity: 0.75 },

 actions: {
  display: "flex",
  gap: 12,
  marginTop: 18,
  flexWrap: "wrap",
  alignItems: "center",
},
  primaryBtn: {
    background: "#0b1020",
    color: "#fff",
    border: "1px solid #0b1020",
    padding: "13px 18px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 140,

    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
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

    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    
      },
  secondaryBtnLink: { textDecoration: "none" },
  disabledBtn: { opacity: 0.55, cursor: "not-allowed" },
};
