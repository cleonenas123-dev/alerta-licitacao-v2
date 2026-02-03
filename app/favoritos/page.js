// app/favoritos/page.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { AppShell, Panel, Button, Badge } from "../../biblioteca/ui";

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

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <AppShell title="Alerta de Licitação" subtitle="Favoritos" active="favoritos">
        <Panel>Carregando...</Panel>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Alerta de Licitação"
      subtitle="Favoritos"
      active="favoritos"
      right={
        <Button variant="ghost" onClick={sair}>
          Sair
        </Button>
      }
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Badge>👤 {email}</Badge>
        <Badge>⭐ Favoritos</Badge>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <Panel>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Suas oportunidades salvas</div>
          <div style={{ color: "#566176", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            Aqui você vai marcar licitações como favoritas para não perder prazo e comparar depois.
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
              Você ainda não tem favoritos.
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/alertas" style={{ textDecoration: "none" }}>
              <Button>Ver meus alertas</Button>
            </a>
            <Button
              variant="secondary"
              onClick={() => alert("Em breve: botão para abrir uma licitação e favoritar 🙂")}
            >
              Como funciona?
            </Button>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
