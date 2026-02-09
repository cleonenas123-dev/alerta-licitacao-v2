"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type: "ok"|"err", text: string }

  async function onLogin(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg({ type: "err", text: "E-mail ou senha inválidos." });
      return;
    }

    // ✅ depois do login, manda pro dashboard (vamos montar depois)
    router.push("/alertas");
  }

  async function onSignup(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
      },
    });

    setLoading(false);

    if (error) {
      setMsg({ type: "err", text: error.message || "Não foi possível criar a conta." });
      return;
    }

    setMsg({
      type: "ok",
      text: "Conta criada! Verifique seu e-mail para confirmar (se estiver habilitado no Supabase).",
    });
    setMode("login");
  }

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-[420px]">
        {/* “moldura” tipo telefone (opcional) */}
        <div className="rounded-[28px] bg-white shadow-xl border border-slate-200 overflow-hidden">
          {/* Topo com gradiente + “onda” */}
          <div className="relative px-7 pt-10 pb-16 bg-gradient-to-br from-fuchsia-600 via-violet-600 to-sky-500">
            <div className="flex flex-col items-center text-white">
              <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur grid place-items-center mb-3">
                <div className="h-8 w-8 rounded-xl bg-white/80" />
              </div>
              <h1 className="text-2xl font-extrabold leading-tight">
                Alerta de Licitação
              </h1>
              <p className="text-white/85 text-sm mt-1">
                Acesse sua conta para receber alertas
              </p>
            </div>

            {/* onda */}
            <div className="absolute left-0 right-0 -bottom-1">
              <svg viewBox="0 0 1440 140" className="w-full h-[88px]">
                <path
                  fill="white"
                  d="M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,140L1360,140C1280,140,1120,140,960,140C800,140,640,140,480,140C320,140,160,140,80,140L0,140Z"
                />
              </svg>
            </div>
          </div>

          {/* Corpo */}
          <div className="px-7 pt-6 pb-7">
            {/* Tabs simples */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-full w-full mb-5">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Criar conta
              </button>
            </div>

            {msg?.text ? (
              <div
                className={`mb-4 rounded-xl px-4 py-3 text-sm border ${
                  msg.type === "ok"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {msg.text}
              </div>
            ) : null}

            <form onSubmit={mode === "login" ? onLogin : onSignup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  E-mail
                </label>
                <input
                  className="mt-2 w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Senha
                </label>
                <input
                  className="mt-2 w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>

              {mode === "login" ? (
                <div className="flex items-center justify-end">
                  <a
                    href="/reset-senha"
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Esqueci a senha
                  </a>
                </div>
              ) : null}

              <button
                disabled={loading}
                className={`w-full rounded-2xl py-3 font-extrabold text-white shadow-md transition ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-sky-500 hover:opacity-95"
                }`}
              >
                {loading
                  ? "Aguarde..."
                  : mode === "login"
                  ? "Entrar"
                  : "Criar conta"}
              </button>

              {mode === "login" ? (
                <p className="text-center text-sm text-slate-600">
                  Não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-extrabold text-slate-900"
                  >
                    Criar agora
                  </button>
                </p>
              ) : (
                <p className="text-center text-sm text-slate-600">
                  Já tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-extrabold text-slate-900"
                  >
                    Entrar
                  </button>
                </p>
              )}
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          Ao continuar, você concorda com os termos de uso.
        </p>
      </div>
    </main>
  );
}
