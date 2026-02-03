// app/config/page.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { AppShell, Panel, Button, Badge } from "../../biblioteca/ui";

export default function ConfigPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  // placeholders de config (sem salvar ainda)
  const [freq, setFreq] = useState("diaria"); // imediata | diaria | semanal
  const [canal, setCanal] = useState("email"); // email | whatsapp (futuro)
  const [notificacoes, setNotificacoes] = useState(true);

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

  if (loading) {
    return (
      <AppShell title="Alerta de Licitação" subtitle="Configurações" active="config">
        <Panel>Carregando...</Panel>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Alerta de Licitação"
      subtitle="Configurações"
      active="config"
      right={
        <Button variant="ghost" onClick={sair}>
          Sair
        </Button>
      }
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Badge>👤 {email}</Badge>
        <Badge>⚙️ Preferências</Badge>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <Panel>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Notificações</div>
          <div style={{ color: "#566176", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            Ajuste como você prefere receber avisos. (Por enquanto é uma prévia visual — vamos
            salvar isso no banco quando você quiser.)
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Frequência</div>
              <select
                value={freq}
                onChange={(e) => setFreq(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,.12)",
                  fontWeight: 800,
                }}
              >
                <option value="imediata">Imediata (recomendado)</option>
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
              </select>
            </div>

            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Canal</div>
              <select
                value={canal}
                onChange={(e) => setCanal(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,.12)",
                  fontWeight: 800,
                }}
              >
                <option value="email">E-mail</option>
                <option value="whatsapp">WhatsApp (em breve)</option>
              </select>
            </div>

            <label
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: 12,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,.12)",
                fontWeight: 900,
              }}
            >
              <input
                type="checkbox"
                checked={notificacoes}
                onChange={(e) => setNotificacoes(e.target.checked)}
              />
              Ativar notificações
            </label>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button onClick={() => alert("Em breve: salvar configurações no banco 🙂")}>
              Salvar configurações
            </Button>
            <a href="/alertas" style={{ textDecoration: "none" }}>
              <Button variant="secondary">Voltar</Button>
            </a>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
