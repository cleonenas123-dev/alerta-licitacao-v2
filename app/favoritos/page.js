"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { brand, styles } from "../../biblioteca/ui";

export default function FavoritosPage() {
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

  if (loading) return <div style={{ padding: 20 }}>Carregando...</div>;

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={styles.logo} />
            <div>
              <p style={styles.title}>{brand.name}</p>
              <div style={styles.subtitle}>Favoritos</div>
            </div>
          </div>

          <div style={styles.pills}>
            <a href="/alertas" style={styles.pill(false)}>📌 Alertas</a>
            <a href="/favoritos" style={styles.pill(true)}>⭐ Favoritos</a>
            <a href="/config" style={styles.pill(false)}>⚙️ Config</a>
            <a href="/conta" style={styles.pill(false)}>👤 Conta</a>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          <div style={styles.card}>
            <div style={styles.cardPad}>
              <h2 style={styles.h2}>Favoritos</h2>
              <p style={styles.p}>
                Logado como: <b>{email}</b>
              </p>

              <div style={{ marginTop: 12, ...styles.badge("info") }}>
                ⭐ Você ainda não favoritou nenhuma licitação.
              </div>

              <p style={styles.note}>
                Quando você clicar em “⭐ Favoritar” em uma licitação, ela aparece aqui para acompanhar depois.
              </p>

              <div style={{ marginTop: 12, ...styles.row }}>
                <a href="/alertas" style={styles.btnPrimary}>Voltar para alertas</a>
                <a href="/config" style={styles.btnGhost}>Criar / ajustar alertas</a>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", padding: 12, color: "#6b7280", fontSize: 12 }}>
            {brand.name} • Favoritos (placeholder)
          </div>
        </div>
      </div>
    </main>
  );
}
