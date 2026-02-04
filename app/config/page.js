"use client";
import { AppShell, Panel, Button, Badge } from "../../biblioteca/ui";

export default function ConfigPage() {
  return (
    <AppShell title="Configurações" subtitle="Preferências do seu painel" active="config">
      <Panel>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Badge tone="ok">📱 Mobile-first</Badge>
          <Badge>Notificações</Badge>
          <Badge>Estados e nichos</Badge>
        </div>

        <div style={{ marginTop: 12, color: "rgba(255,255,255,.78)", lineHeight: 1.5 }}>
          Aqui você vai configurar seus estados, palavras-chave, frequência de alerta e preferências.
        </div>

        <div style={{ marginTop: 12 }}>
          <Button onClick={() => alert("Em breve: configurações ⚙️")}>Abrir configurações</Button>
        </div>
      </Panel>
    </AppShell>
  );
}
