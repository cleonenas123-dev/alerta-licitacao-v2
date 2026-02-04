// app/alertas/page.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { AppShell, Panel, Button, Badge, Card } from "../../biblioteca/ui";

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
        <Card title="Seus alertas" desc="Crie seu primeiro alerta e comece a receber oportunidades.">
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
    <Button onClick={() => alert("Próximo passo: criar tela de criação de alertas 🙂")}>
      + Criar alerta
    </Button>
    <Button
      variant="secondary"
      onClick={() => alert("Próximo passo: tela de favoritos 🙂")}
    >
      Ver favoritos
    </Button>
  </div>
</Card>

<Card title="Últimos resultados" desc="Assim que você criar alertas, os resultados aparecem aqui com filtros e favoritos.">
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
</Card>

<Card title="Dica rápida" desc="Quanto mais específicas as palavras-chave, melhor: “uniforme escolar”, “software gestão”, “materiais elétricos”.">
  <div style={{ marginTop: 10 }}>
    <Badge tone="ok">Sugestão</Badge>
  </div>
</Card>
      </div>
    </AppShell>
  );
}
