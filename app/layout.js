export const metadata = {
  title: "Alerta de Licitação",
  description: "Alertas de licitações por nicho",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
 <style>{`
    .grid-responsive {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    @media (max-width: 900px) {
      .grid-responsive {
        grid-template-columns: 1fr;
      }
    }
  `}</style>
        {children}
      </body>
    </html>
  );
}
