"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { AppShell, Panel, Button, Badge } from "../../biblioteca/ui";

export default function ContaPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        window.location.href = "/login";
        return;
      }
      setEmail(data.user.email || "");
    })();
  }, []);

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <AppShell title="Minha conta" subtitle="Gerencie seu acesso e plano" active="conta" right={<Button variant="ghost" onClick={sair}>Sair</Button>}>
      <Panel>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Badge tone="ok">✅ Conta ativa</Badge>
          <Badge>📩 {email || "carregando..."}</Badge>
        </div>

        <div style={{ marginTop: 12, color: "rgba(255,255,255,.78)", lineHeight: 1.5 }}>
          Em breve: plano, cobrança, trocar senha e preferências.
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button onClick={() => alert("Em breve: plano e cobrança 💳")}>Ver plano</Button>
          <Button variant="secondary" onClick={() => alert("Em breve: trocar senha 🔐")}>Trocar senha</Button>
        </div>
      </Panel>
    </AppShell>
  );
}
