"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Alertas() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function run() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        window.location.href = "/login";
        return;
      }
      setEmail(data.user.email || "");
      setLoading(false);
    }
    run();
  }, []);

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) return <div style={{ padding: 20 }}>Carregando...</div>;

  return (
    <main style={{ minHeight: "100vh", padding: 20, background: "#f7f7f7" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", background: "#fff", borderRadius: 14, padding: 16, border: "1px solid rgba(0,0,0,.08)" }}>
        <h2 style={{ marginTop: 0 }}>Meus alertas</h2>
        <p style={{ color: "#374151" }}>Logado como: <b>{email}</b></p>

        <p style={{ color: "#6b7280" }}>
          (Próximo passo: tela de nichos/estados/palavras + favoritos e expiração em 10 dias.)
        </p>

        <button
          onClick={sair}
          style={{ background: "#111827", color: "#fff", padding: "10px 14px", borderRadius: 12, border: "none", fontWeight: 900, cursor: "pointer" }}
        >
          Sair
        </button>
      </div>
    </main>
  );
}
