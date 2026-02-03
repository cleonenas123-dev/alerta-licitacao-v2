// app/alertas/page.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { BottomNav, brand, styles, AppShell, Panel, Button, Badge } from "../../biblioteca/ui";

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

  if (loading) {
    return (
      <AppShell title="Alerta de Licitação" subtitle="Carregando..." active="alertas">
        <Panel>Carregando...</Panel>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Alerta de Licitação"
      subtitle="Seu painel"
      active="alertas"
      right={
        <Button variant="ghost" onClick={sair}>
          Sair
        </Button>
      }
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Badge>👤 {email}</Badge>
        <Badge tone="ok">✅ Conta ativa</Badge>
      </div>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        <Panel>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Seus alertas</div>
          <div style={{ color: "#566176", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            Você ainda não configurou nenhum alerta. Crie o seu primeiro e comece a receber oportunidades.
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button onClick={() => (window.location.href = "/config")}>
  + Criar alerta
</Button>

<Button
  variant="secondary"
  onClick={() => (window.location.href = "/favoritos")}
>
  Ver favoritos
</Button>
          </div>
        </Panel>

        <Panel>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Últimos resultados</div>
          <div style={{ color: "#566176", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            Assim que você criar alertas, os resultados aparecem aqui com filtros e favoritos.
          </div>

          <div style={{ marginTop: 12 }}>
            <div
              style={{
                border: "1px dashed rgba(0,0,0,.15)",
                borderRadius: 14,
                padding: 14,
                color: "#566176",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              Nenhum resultado ainda.
            </div>
          </div>
        </Panel>

        <Panel>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Dica rápida</div>
          <div style={{ color: "#566176", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            Quanto mais específicas as palavras-chave, melhor: “uniforme escolar”, “software gestão”, “materiais elétricos”.
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
