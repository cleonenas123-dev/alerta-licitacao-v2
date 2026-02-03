"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { AppShell, Badge, Button, Card, CardBody, H1, P } from "../../biblioteca/ui";

export default function Alertas() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  // placeholder de “plano” só para vender bem (você troca depois pelo seu billing)
  const trialDaysLeft = 10;

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

  const saudacao = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Carregando...</div>;

  // por enquanto você ainda não tem alertas reais:
  const temAlertas = false;

  return (
    <AppShell active="alertas" userEmail={email}>
      <div style={{ display: "grid", gap: 14, paddingBottom: 70 }}>
        {/* Header do dashboard */}
        <Card style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
          <CardBody>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ minWidth: 240 }}>
                <H1>{saudacao}! 👋</H1>
                <P style={{ marginTop: 6 }}>
                  Configure seus alertas e receba oportunidades no seu nicho.
                </P>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                  <Badge tone="ok">Teste grátis — {trialDaysLeft} dias restantes</Badge>
                  <Badge>Notificações por e-mail</Badge>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                  onClick={() => alert("Próximo passo: abrir a tela de criar alerta")}
                  style={{ minWidth: 170 }}
                >
                  + Criar alerta
                </Button>
                <Button variant="ghost" onClick={sair} style={{ minWidth: 140 }}>
                  Sair
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Conteúdo principal */}
        {!temAlertas ? (
          <Card>
            <CardBody>
              <H1 style={{ fontSize: 18 }}>Crie seu primeiro alerta</H1>
              <P style={{ marginTop: 6 }}>
                Em 2 minutos você configura palavras-chave e estados. A partir daí,
                o sistema te avisa quando surgir uma licitação com o seu perfil.
              </P>

              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                <div style={stepRow}>
                  <div style={stepNum}>1</div>
                  <div>
                    <div style={stepTitle}>Escolha seu nicho</div>
                    <div style={stepDesc}>Ex: construção, eventos, TI, alimentação, limpeza.</div>
                  </div>
                </div>

                <div style={stepRow}>
                  <div style={stepNum}>2</div>
                  <div>
                    <div style={stepTitle}>Defina estados e palavras-chave</div>
                    <div style={stepDesc}>Você pode usar várias palavras e variações.</div>
                  </div>
                </div>

                <div style={stepRow}>
                  <div style={stepNum}>3</div>
                  <div>
                    <div style={stepTitle}>Receba por e-mail</div>
                    <div style={stepDesc}>E depois veja tudo organizado aqui dentro.</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                <Button
                  onClick={() => alert("Próximo passo: abrir a tela de criar alerta")}
                  style={{ minWidth: 210 }}
                >
                  Criar meu primeiro alerta
                </Button>

                <a href="/" style={{ textDecoration: "none" }}>
                  <Button variant="ghost" style={{ minWidth: 140 }}>
                    Voltar ao site
                  </Button>
                </a>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody>
              <H1 style={{ fontSize: 18 }}>Meus alertas</H1>
              <P style={{ marginTop: 6 }}>
                (Aqui entra sua listagem real de alertas e últimos resultados.)
              </P>
            </CardBody>
          </Card>
        )}

        {/* Credibilidade / confiança */}
        <Card style={{ borderStyle: "dashed" }}>
          <CardBody>
            <H1 style={{ fontSize: 16 }}>Confiança e privacidade</H1>
            <P style={{ marginTop: 6 }}>
              Seus dados ficam protegidos e você pode cancelar quando quiser.
              Nosso objetivo é te fazer ganhar tempo e não perder oportunidade.
            </P>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}

const stepRow = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  padding: 12,
  borderRadius: 16,
  border: "1px solid rgba(15, 23, 42, 0.10)",
  background: "#fff",
};

const stepNum = {
  width: 34,
  height: 34,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  fontWeight: 950,
  background: "#0b1020",
  color: "#fff",
  flex: "0 0 auto",
};

const stepTitle = { fontWeight: 950, color: "#0b1020" };
const stepDesc = { marginTop: 3, fontSize: 13, color: "#667085", lineHeight: 1.4 };
