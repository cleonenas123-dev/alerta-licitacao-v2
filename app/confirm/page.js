"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ConfirmPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [msg, setMsg] = useState("Confirmando seu e-mail...");
  const [isErro, setIsErro] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        // 1) Fluxo PKCE (mais comum): vem ?code=...
        const code = sp.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          setIsErro(false);
          setMsg("E-mail confirmado! Entrando...");
          router.replace("/alertas");
          return;
        }

        // 2) Se vier erro no hash (#error=... etc)
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash && hash.includes("error=")) {
          const params = new URLSearchParams(hash.replace("#", ""));
          const errorCode = params.get("error_code") || "";
          const desc = params.get("error_description") || "";

          setIsErro(true);

          if (errorCode === "otp_expired") {
            setMsg("Este link de confirmação expirou. Volte ao login e peça um novo.");
          } else {
            setMsg(
              "Não foi possível confirmar seu e-mail. " +
                (desc ? decodeURIComponent(desc) : "Tente novamente.")
            );
          }

          // manda pra tela de login após mostrar mensagem
          setTimeout(() => router.replace("/login?tab=entrar"), 1800);
          return;
        }

        // 3) Se não veio code nem erro, tenta ver se já tem sessão
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setIsErro(false);
          setMsg("Tudo certo! Entrando...");
          router.replace("/alertas");
          return;
        }

        // nada pra processar
        setIsErro(true);
        setMsg("Não foi possível validar a confirmação. Volte ao login e tente novamente.");
        setTimeout(() => router.replace("/login?tab=entrar"), 1800);
      } catch (e) {
        setIsErro(true);
        setMsg("Erro ao confirmar. Volte ao login e tente novamente.");
        setTimeout(() => router.replace("/login?tab=entrar"), 1800);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f3f5f8",
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
              border: "1px solid",
              borderColor: isErro ? "#f5c2c7" : "#bfead0",
              background: isErro ? "#fdecec" : "#e9fbf0",
              color: isErro ? "#8a1c24" : "#155d33",
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            {msg}
          </div>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <a
              href="/login?tab=entrar"
              style={{
                display: "inline-block",
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid #d7ddea",
                textDecoration: "none",
                fontWeight: 900,
                color: "#0b1020",
                background: "#fff",
              }}
            >
              Ir para o login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
