"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { brand, styles } from "../../biblioteca/ui";

export default function ContaPage() {
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
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={styles.logo} />
            <div>
              <p style={styles.title}>{brand.name}</p>
              <div style={styles.subtitle}>Minha conta</div>
            </div>
          </div>

          <div style={styles.pills}>
            <a href="/alertas" style={styles.pill(false)}>📌 Alertas</a>
            <a href="/favoritos" style={styles.pill(false)}>⭐ Favoritos</a>
            <a href="/config" style={styles.pill(false)}>⚙️ Config</a>
            <a href="/conta" style={styles.pill(true)}>👤 Conta</a>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          <div style={styles.card}>
            <div style={styles.cardPad}>
              <h2 style={styles.h2}>Minha conta</h2>
              <p style={styles.p}>
                E-mail: <b>{email}</b>
              </p>

              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <div style={styles.badge("info")}>🧾 Plano: Em breve</div>
                <div style={styles.note}>
                  Aqui você pode colocar depois: plano atual, vencimento, upgrade e histórico de pagamento.
                </div>

                <div style={styles.badge("ok")}>🔒 Segurança</div>
                <div style={styles.note}>
                  Alteração de senha pode ser feita pelo fluxo “Esqueci a senha” no /login.
                  (Depois dá pra colocar um botão direto pra disparar reset.)
                </div>

                <div style={{ marginTop: 10, ...styles.row }}>
                  <a href="/login" style={styles.btnGhost}>Ir para Login</a>
                  <button onClick={sair} style={styles.btnPrimary}>Sair</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", padding: 12, color: "#6b7280", fontSize: 12 }}>
            {brand.name} • Conta (placeholder)
          </div>
        </div>
      </div>
    </main>
  );
}
