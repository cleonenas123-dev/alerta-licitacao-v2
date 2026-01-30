import { Suspense } from "react";
import ResetSenhaClient from "./ResetSenhaClient";

// (opcional, mas recomendo) evita o Next tentar gerar estático essa rota
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Carregando...</div>}>
      <ResetSenhaClient />
    </Suspense>
  );
}
