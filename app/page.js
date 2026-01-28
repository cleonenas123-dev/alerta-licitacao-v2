export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #f7f7f7 0%, #efefef 100%)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(920px, 100%)",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 18px 60px rgba(0,0,0,.12)",
          padding: 24,
          border: "1px solid rgba(0,0,0,.06)",
        }}
      >
        <h1 style={{ margin: 0 }}>Alerta de Licitação</h1>
        <p style={{ marginTop: 8, color: "#444" }}>
          Faça login para ver seus alertas e favoritos.
        </p>

        <a
          href="/login"
          style={{
            display: "inline-block",
            marginTop: 12,
            background: "#111827",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 12,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Entrar / Criar conta
        </a>
      </div>
    </main>
  );
}
