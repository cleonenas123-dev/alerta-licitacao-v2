// app/page.js
import { Card, Panel, Button, Badge } from "../biblioteca/ui";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: "linear-gradient(180deg, #f7f7f7 0%, #eef2f7 100%)",
      }}
    >
      <Card style={{ width: "min(980px, 100%)" }}>
        <div
          style={{
            background: "linear-gradient(90deg, #0b1020, #0a0f1d)",
            padding: 22,
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(255,255,255,0.18)",
              }}
            />
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>
                Alerta de Licitação
              </div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                Encontre licitações do seu nicho e receba alertas no e-mail.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Badge tone="ok">⚡ Rápido e simples</Badge>
            <Badge>🔎 Por nicho e palavras-chave</Badge>
            <Badge>🧾 Histórico e favoritos (em breve)</Badge>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/login" style={{ textDecoration: "none" }}>
              <Button>Entrar / Criar conta</Button>
            </a>
            <a href="/login" style={{ textDecoration: "none" }}>
              <Button variant="secondary">Ver demonstração</Button>
            </a>
          </div>
        </div>

        <div style={{ padding: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            <Panel>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>1) Crie seu alerta</div>
              <div style={{ color: "#566176", fontSize: 14, lineHeight: 1.5 }}>
                Escolha seu nicho, estado e palavras-chave. Você define o que importa.
              </div>
            </Panel>

            <Panel>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>2) Receba por e-mail</div>
              <div style={{ color: "#566176", fontSize: 14, lineHeight: 1.5 }}>
                Assim que aparecer algo com seu perfil, você é avisado.
              </div>
            </Panel>

            <Panel>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>3) Favoritos e filtros</div>
              <div style={{ color: "#566176", fontSize: 14, lineHeight: 1.5 }}>
                Salve oportunidades e organize sua busca (vamos ativar em breve).
              </div>
            </Panel>
          </div>

          <div style={{ marginTop: 16, color: "#566176", fontSize: 13 }}>
            Mobile-first: funciona perfeito no celular.
          </div>
        </div>
      </Card>
    </main>
  );
}
