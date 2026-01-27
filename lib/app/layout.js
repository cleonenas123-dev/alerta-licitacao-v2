export const metadata = { title: "Alerta de Licitação" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0, background: "#f6f7f9" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
          <Topbar />
          <div style={{ height: 12 }} />
          {children}
          <div style={{ height: 18 }} />
        </div>
      </body>
    </html>
  );
}

function Topbar() {
  return (
    <div style={{
      background:"#111827", color:"#fff", padding:"12px 14px",
      borderRadius:14, display:"flex", justifyContent:"space-between", alignItems:"center"
    }}>
      <div style={{ fontWeight: 900 }}>Alerta de Licitação</div>
      <div style={{ fontSize: 12, opacity: 0.9 }}>app</div>
    </div>
  );
}
