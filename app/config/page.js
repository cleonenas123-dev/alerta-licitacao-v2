"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { brand, styles } from "../../biblioteca/ui";

export default function ConfigPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  // placeholders (depois você liga no Supabase)
  const [uf, setUf] = useState("ES");
  const [segmento, setSegmento] = useState("Materiais / Serviços");
  const [palavras, setPalavras] = useState("licitação; pregão; contratação");
  const [notificarEmail, setNotificarEmail] = useState(true);

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

  function salvar() {
    // Placeholder: futuramente salva no Supabase (tabela alertas/config)
    alert("Config salva (placeholder). Depois conectamos no Supabase.");
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
              <div style={styles.subtitle}>Configurações</div>
            </div>
          </div>

          <div style={styles.pills}>
            <a href="/alertas" style={styles.pill(false)}>📌 Alertas</a>
            <a href="/favoritos" style={styles.pill(false)}>⭐ Favoritos</a>
            <a href="/config" style={styles.pill(true)}>⚙️ Config</a>
            <a href="/conta" style={styles.pill(false)}>👤 Conta</a>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          <div style={styles.card}>
            <div style={styles.cardPad}>
              <h2 style={styles.h2}>Criar / ajustar meu alerta</h2>
              <p style={styles.p}>
                Logado como: <b>{email}</b>
              </p>

              <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
                <div>
                  <div style={styles.label}>UF principal</div>
                  <input
                    value={uf}
                    onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))}
                    style={styles.input}
                    placeholder="Ex.: ES"
                  />
                </div>

                <div>
                  <div style={styles.label}>Segmento</div>
                  <input
                    value={segmento}
                    onChange={(e) => setSegmento(e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: TI, Construção, Saúde..."
                  />
                </div>

                <div>
                  <div style={styles.label}>Palavras-chave</div>
                  <input
                    value={palavras}
                    onChange={(e) => setPalavras(e.target.value)}
                    style={styles.input}
                    placeholder="Separe por ponto e vírgula"
                  />
                  <div style={styles.note}>
                    Ex.: “uniforme; camiseta; calça” ou “software; sistema; licenciamento”.
                  </div>
                </div>

                <div style={{ ...styles.row, justifyContent: "space-between" }}>
                  <div style={styles.badge(notificarEmail ? "ok" : "warn")}>
                    📩 Notificar por e-mail: {notificarEmail ? "Ativado" : "Desativado"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificarEmail((v) => !v)}
                    style={notificarEmail ? styles.btnPrimary : styles.btnGhost}
                  >
                    {notificarEmail ? "Ativado" : "Ativar"}
                  </button>
                </div>

                <div style={{ ...styles.row, marginTop: 6 }}>
                  <button onClick={salvar} style={styles.btnPrimary}>
                    Salvar
                  </button>
                  <a href="/alertas" style={styles.btnGhost}>
                    Voltar
                  </a>
                </div>

                <div style={styles.note}>
                  Próximo passo: salvar isso em uma tabela no Supabase e listar licitações filtradas no painel.
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", padding: 12, color: "#6b7280", fontSize: 12 }}>
            {brand.name} • Config (placeholder)
          </div>
        </div>
      </div>
    </main>
  );
}
