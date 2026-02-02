import { Suspense } from "react";
import ConfirmClient from "./ConfirmClient";

export const dynamic = "force-dynamic";

function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f3f5f8",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          width: "min(680px, 100%)",
          borderRadius: 22,
          background: "#fff",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #0b1020, #0a0f1d)",
            padding: "22px 22px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1 }}>
            Alerta de Licitação
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
            Confirmação de e-mail
          </div>
        </div>

        <div style={{ padding: 22 }}>
          <div
            style={{
              borderRadius: 18,
              padding: 18,
              border: "1px solid #bfead0",
              background: "#e9fbf0",
              color: "#155d33",
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            Confirmando seu e-mail...
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ConfirmClient />
    </Suspense>
  );
}
