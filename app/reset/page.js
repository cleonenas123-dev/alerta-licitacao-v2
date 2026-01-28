"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPage({ searchParams }) {
  const [stage, setStage] = useState("verifying"); // verifying | form | done
  const [msg, setMsg] = useState("Validando link...");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function run() {
      const token_hash = searchParams?.token_hash;
      const type = searchParams?.type;

      if (!token_hash || !type) {
        setMsg("Link inválido. Solicite um novo e-mail de redefinição.");
        setStage("done");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({ token_hash, type });

      if (error) {
        setMsg("Não foi possível validar o link. Solicite um novo e-mail.");
        setStage("done");
        return;
      }

      setStage("form");
      setMsg("");
    }
    run();
  }, [searchParams]);

  async function updatePassword() {
    if (pass.length < 8) return setMsg("Use uma senha com pelo menos 8 caracteres.");
    if (pass !== pass2) return setMsg("As senhas não conferem.");

    const { error } = await supabase.auth.updateUser({ password: pass });

    if (error) return setMsg("Não foi possível atualizar. Tente novamente.");

    setStage("done");
    setMsg("Senha alterada com sucesso! Você pode entrar agora.");
    setTimeout(() => (window.location.href = "/login"), 900);
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: "min(520px, 100%)", background: "#fff", padding: 20, borderRadius: 14, border: "1px solid rgba(0,0,0,.08)" }}>
        <h2 style={{ marginTop: 0 }}>Redefinir senha</h2>

        {stage === "form" ? (
          <>
            <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>Nova senha</label>
            <input
              type={show ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
            />

            <label style={{ display: "block", fontWeight: 800, marginTop: 12, marginBottom: 6 }}>Confirmar senha</label>
            <input
              type={show ? "text" : "password"}
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
              <button
                onClick={() => setShow((v) => !v)}
                style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,.12)", background: "#fff", fontWeight: 800, cursor: "pointer" }}
              >
                {show ? "Ocultar" : "Mostrar"} senha
              </button>

              <button
                onClick={updatePassword}
                style={{ padding: "10px 12px", borderRadius: 12, border: "none", background: "#111827", color: "#fff", fontWeight: 900, cursor: "pointer" }}
              >
                Salvar nova senha
              </button>
            </div>
          </>
        ) : (
          <p style={{ marginBottom: 0 }}>{msg}</p>
        )}

        {msg && stage === "form" && (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 12, background: "#fff1f2", border: "1px solid #fecdd3", color: "#9f1239", fontWeight: 700 }}>
            {msg}
          </div>
        )}
      </div>
    </main>
  );
}
