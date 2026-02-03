"use client";

import React from "react";

/**
 * Mini design system (inline) — 1 arquivo para padronizar o sistema inteiro.
 * Mobile-first: bottom nav no celular, topbar sempre.
 */

export const theme = {
  bg: "#f3f5f8",
  card: "#ffffff",
  text: "#0b1020",
  muted: "#667085",
  border: "rgba(15, 23, 42, 0.10)",
  primary: "#0b1020",
  primaryText: "#ffffff",
  okBg: "#e9fbf0",
  okBorder: "#bfead0",
  okText: "#155d33",
  errBg: "#fdecec",
  errBorder: "#f5c2c7",
  errText: "#8a1c24",
  shadow: "0 20px 60px rgba(0,0,0,0.10)",
  radius: 18,
  radiusSm: 14,
};

export function Container({ children, max = 1080 }) {
  return (
    <div style={{ width: "100%", maxWidth: max, margin: "0 auto", padding: 16 }}>
      {children}
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radius,
        boxShadow: theme.shadow,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, style }) {
  return (
    <div style={{ padding: 18, ...style }}>
      {children}
    </div>
  );
}

export function H1({ children, style }) {
  return (
    <div
      style={{
        fontSize: 22,
        fontWeight: 950,
        letterSpacing: -0.3,
        color: theme.text,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function P({ children, style }) {
  return (
    <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.5, ...style }}>
      {children}
    </div>
  );
}

export function Button({ children, variant = "primary", style, ...props }) {
  const base = {
    padding: "12px 14px",
    borderRadius: 14,
    fontWeight: 950,
    cursor: props.disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    lineHeight: 1,
    userSelect: "none",
    opacity: props.disabled ? 0.6 : 1,
  };

  const variants = {
    primary: {
      background: theme.primary,
      color: theme.primaryText,
      borderColor: theme.primary,
    },
    ghost: {
      background: "#fff",
      color: theme.text,
      borderColor: "rgba(15, 23, 42, 0.14)",
    },
    danger: {
      background: "#111827",
      color: "#fff",
      borderColor: "#111827",
    },
  };

  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#f2f4f7", border: "#e4e7ec", color: "#344054" },
    ok: { bg: theme.okBg, border: theme.okBorder, color: theme.okText },
    warn: { bg: "#fff7ed", border: "#fed7aa", color: "#9a3412" },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 999,
        border: `1px solid ${t.border}`,
        background: t.bg,
        color: t.color,
        fontWeight: 900,
        fontSize: 12,
      }}
    >
      {children}
    </span>
  );
}

function NavItem({ href, label, active }) {
  return (
    <a
      href={href}
      style={{
        flex: 1,
        textDecoration: "none",
        padding: "10px 8px",
        borderRadius: 14,
        textAlign: "center",
        fontWeight: 950,
        fontSize: 12,
        color: active ? "#fff" : theme.text,
        background: active ? theme.primary : "transparent",
        border: `1px solid ${active ? theme.primary : "transparent"}`,
      }}
    >
      {label}
    </a>
  );
}

/**
 * AppShell: Topbar + conteúdo + BottomNav (mobile).
 * Passe active="alertas" / "favoritos" / "conta" etc.
 */
export function AppShell({ active = "alertas", children, userEmail }) {
  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      {/* Topbar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "linear-gradient(90deg, #0b1020, #0a0f1d)",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Container max={1080}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "rgba(255,255,255,0.16)",
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 950, lineHeight: 1.1 }}>
                Alerta de Licitação
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {userEmail ? `Logado como ${userEmail}` : "Seu radar de oportunidades"}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Conteúdo */}
      <Container max={1080}>
        {children}
      </Container>

      {/* Bottom nav (mobile) */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "rgba(243,245,248,0.92)",
          backdropFilter: "blur(10px)",
          borderTop: `1px solid ${theme.border}`,
          padding: 10,
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: 10 }}>
          <NavItem href="/alertas" label="Alertas" active={active === "alertas"} />
          <NavItem href="/favoritos" label="Favoritos" active={active === "favoritos"} />
          <NavItem href="/conta" label="Conta" active={active === "conta"} />
        </div>
      </div>
    </div>
  );
}
