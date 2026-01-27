import Link from "next/link";

export default function Page() {
  return (
    <div style={card()}>
      <h1 style={{ marginTop: 0 }}>Bem-vindo 👋</h1>
      <p style={{ color: "#4b5563" }}>
        Configure seus alertas e receba licitações no e-mail. No celular, você pode “instalar” como app.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/login" style={btn("#2563eb")}>Entrar / Criar conta</Link>
        <Link href="/alertas" style={btn("#111827")}>Meus alertas</Link>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, color: "#6b7280" }}>
        Dica: no celular, depois que abrir, use <b>Adicionar à tela inicial</b>.
      </div>
    </div>
  );
}
function card(){return{background:"#fff",borderRadius:14,padding:16,border:"1px solid #e5e7eb"}}
function btn(bg){return{background:bg,color:"#fff",padding:"10px 12px",borderRadius:10,textDecoration:"none",fontWeight:900}}
