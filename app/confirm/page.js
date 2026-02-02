import { Suspense } from "react";
import ConfirmClient from "./ConfirmClient";

export const dynamic = "force-dynamic"; // evita tentativa de prerender estático no build

function Loading() {
  return (
    <div style={{ padding: 24, textAlign: "center", fontFamily: "system-ui" }}>
      Confirmando seu e-mail...
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
