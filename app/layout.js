export const metadata = { title: "Alerta de Licitação" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0, background: "#f6f7f9" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
