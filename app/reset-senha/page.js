"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function ResetSenha() {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setOk(!!data?.session);
      if (!data?.session) setMsg("Abra esta página pelo link enviado ao seu e-mail.");
    })();
  }, []);

  async function salvar() {
    setMsg("");
    if (senha.length < 6) return setMsg("A senha precisa ter pelo menos 6 caracteres.");
    if (senha !== confirmar) return setMsg("As senhas não conferem.");

    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) return setMsg(`Erro: ${error.message}`);

    setMsg("Senha atualizada! Redirecionando...");
    setTimeout(() => (window.location.href = "/alertas"), 800);
  }

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "min(520px,100%)", background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #e5e7eb", boxShadow: "0 14px 40px rgba(0,0,0,0.10)" }}>
        <h2 style={{ marginTop: 0 }}>Criar nova senha</h2>

        {!ok ? (
          <p>{msg}</p>
        ) : (
          <>
            <label style={{ fontWeight: 900 }}>Nova senha</label>
            <input style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 6 }} type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

            <label style={{ fontWeight: 900, marginTop: 12, display: "block" }}>Confirmar</label>
            <input style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", marginTop: 6 }} type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <button style={{ background: "#2563eb", color: "#fff", border: 0, padding: "10px 12px", borderRadius: 12, fontWeight: 900, cursor: "pointer" }} onClick={salvar}>
                Salvar
              </button>
              <Link href="/login">Voltar</Link>
            </div>
          </>
        )}

        {msg && <div style={{ marginTop: 12, padding: 10, borderRadius: 12, background: "#f9fafb", border: "1px solid #e5e7eb" }}>{msg}</div>}
      </div>
    </div>
  );
}
