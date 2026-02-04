"use client";
import { AppShell, Panel, Button, Badge } from "../../biblioteca/ui";

export default function FavoritosPage() {
  return (
    <AppShell title="Favoritos" subtitle="Salve oportunidades importantes" active="favoritos">
      <Panel>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Badge tone="warn">⭐ Em breve</Badge>
          <Badge>Organização por pastas</Badge>
          <Badge>Exportação</Badge>
        </div>

        <div style={{ marginTop: 12, color: "rgba(255,255,255,.78)", lineHeight: 1.5 }}>
          Aqui vão aparecer as licitações que você marcou como favoritas.
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button onClick={() => alert("Em breve: tela de favoritos ⭐")}>Ver favoritos</Button>
          <Button variant="ghost" href="/alertas">Voltar</Button>
        </div>
      </Panel>
    </AppShell>
  );
}
