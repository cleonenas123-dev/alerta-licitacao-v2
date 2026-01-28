"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ConfirmPage({ searchParams }) {
  const [status, setStatus] = useState("Confirmando seu e-mail...");

  useEffect(() => {
    async function run() {
      const token_hash = searchParams?.token_hash;
      const type = searchParams?.type;

      if (!token_hash || !type) {
        setStatus("Link inválido. Tente novamente pelo e-mail mais recente.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({ token_hash, type });

      if (error) {
        setStatus("Não foi possível confirmar. Solicite um novo link e tente novamente.");
        return;
      }

      setStatus("E-mail confirmado! Você já pode entrar.");
      setTimeout(() => (window.location.href = "/login"), 900);
    }
    run();
  }, [searchParams]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: "min(520px, 100%)", background: "#fff", padding: 20, borderRadius: 14, border: "1px solid rgba(0,0,0,.08)" }}>
        <h2 style={{ marginTop: 0 }}>Alerta de Licitação</h2>
        <p style={{ marginBottom: 0 }}>{status}</p>
      </div>
    </main>
  );
}
