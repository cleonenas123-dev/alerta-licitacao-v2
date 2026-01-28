"use client";

import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

function MsgBox({ type, text }) {
  if (!text) return null;

  const styles = useMemo(() => {
    const base = {
      marginTop: 12,
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(0,0,0,.08)",
      fontWeight: 600,
    };
    if (type === "error") return { ...base, background: "#fff1f2", borderColor: "#fecdd3", color: "#9f1239" };
    if (type === "success") return { ...base, background: "#ecfdf5", borderColor: "#a7f3d0", color: "#065f46" };
    return { ...base, background: "#eff6ff", borderColor: "#bfdbfe", color: "#1e40af" };
  }, [type]);

  return <div style={styles}>{text}</div>;
}

export default function LoginPage() {
  const [tab, setTab] = useState("login"); // login | signup | forgot
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [msgType, setMsgType] = useState("info");
  const [msg, setMsg] = useState("");

  function setMessage(type, text) {
    setMsgType(type);
    setMsg(text);
  }

  async function doLogin() {
    setMessage("info", "");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return setMessage("error", "Credenciais inválidas. Confira e tente novamente.");
    window.location.href = "/alertas";
  }

  async function doSignup() {
    setMessage("info", "");

    if (!email || !pass || !pass2) return setMessage("error", "Preencha e-mail e senha.");
    if (pass !== pass2) return setMessage("error", "As senhas não conferem. Verifique e tente novamente.");
    if (pass.length < 8) return setMessage("error", "Use uma senha com pelo menos 8 caracteres.");

    const redirectTo = `${window.location.origin}/confirm`;

    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) return setMessage("error", "Não foi possível criar a conta. Tente novamente em instantes.");

    setMessage(
      "success",
      "Conta criada! Enviamos um e-mail de confirmação. Abra sua caixa de entrada (e SPAM) e clique no link para liberar o acesso."
    );
  }

  async function doForgot() {
    setMessage("info", "");
    if (!email) return setMessage("error", "Digite seu e-mail.");

    const redirectTo = `${window.location.origin}/reset`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) return setMessage("error", "Não foi possível enviar o e-mail agora. Tente novamente.");
    setMessage("success", "Pronto! Se o e-mail existir, enviamos um link para redefinir sua senha (verifique SPAM).");
  }

  const isSignup = tab === "signup";
  const isForgot = tab === "forgot";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #f7f7f7 0%, #efefef 100%)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 18px 60px rgba(0,0,0,.12)",
          padding: 24,
          border: "1px solid rgba(0,0,0,.06)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#e5e7eb" }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>Alerta de Licitação</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Entrar / Criar conta / Redefinir senha</div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            marginTop: 16,
            background: "#f3f4f6",
            borderRadius: 14,
            padding: 6,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 6,
          }}
        >
          {[
            { key: "login", label: "Entrar" },
            { key: "signup", label: "Criar conta" },
            { key: "forgot", label: "Esqueci a senha" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setMessage("info", "");
                setPass("");
                setPass2("");
              }}
              style={{
                border: "none",
                borderRadius: 12,
                padding: "10px 8px",
                fontWeight: 800,
                cursor: "pointer",
                background: tab === t.key ? "#fff" : "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ marginTop: 16 }}>
          <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>E-mail</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            style={{
              width: "100%",
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,.15)",
              outline: "none",
              fontSize: 14,
            }}
          />

          {!isForgot && (
            <>
              <label style={{ display: "block", fontWeight: 800, marginTop: 12, marginBottom: 6 }}>Senha</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                <input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  type={showPass ? "text" : "password"}
                  placeholder="********"
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,.15)",
                    outline: "none",
                    fontSize: 14,
                  }}
                />
                <button
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,.12)",
                    background: "#fff",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {showPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </>
          )}

          {isSignup && (
            <>
              <label style={{ display: "block", fontWeight: 800, marginTop: 12, marginBottom: 6 }}>
                Confirmar senha
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                <input
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  type={showPass2 ? "text" : "password"}
                  placeholder="********"
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,.15)",
                    outline: "none",
                    fontSize: 14,
                  }}
                />
                <button
                  onClick={() => setShowPass2((v) => !v)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,.12)",
                    background: "#fff",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {showPass2 ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, color: "#374151", background: "#eff6ff", padding: 10, borderRadius: 12, border: "1px solid #bfdbfe" }}>
                Ao criar conta, você receberá um e-mail de confirmação.
              </div>
            </>
          )}

          {isForgot && (
            <div style={{ marginTop: 10, fontSize: 12, color: "#374151", background: "#eff6ff", padding: 10, borderRadius: 12, border: "1px solid #bfdbfe" }}>
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </div>
          )}

          <MsgBox type={msgType} text={msg} />

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            {tab === "login" && (
              <button
                onClick={doLogin}
                style={{
                  background: "#111827",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Entrar
              </button>
            )}

            {tab === "signup" && (
              <button
                onClick={doSignup}
                style={{
                  background: "#111827",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Criar conta
              </button>
            )}

            {tab === "forgot" && (
              <button
                onClick={doForgot}
                style={{
                  background: "#111827",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Enviar link
              </button>
            )}

            <a
              href="/"
              style={{
                display: "inline-block",
                background: "#111827",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
