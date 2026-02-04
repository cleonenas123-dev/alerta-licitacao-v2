// /biblioteca/ui.js
"use client";

import React from "react";

export const brand = {
  name: "Alerta de Licitação",
  tagline: "Encontre oportunidades no seu nicho",
};

export const styles = {
  pageBg: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f7f7f7 0%, #efefef 100%)",
  },
  container: {
    width: "min(980px, 100%)",
    margin: "0 auto",
    padding: 16,
  },
};

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid rgba(0,0,0,.08)",
        boxShadow: "0 18px 60px rgba(0,0,0,.10)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Panel({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,.08)",
        padding: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  style,
  ...props
}) {
  const base = {
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
    border: "1px solid transparent",
    lineHeight: 1,
  };

  const variants = {
    primary: { background: "#111827", color: "#fff" },
    secondary: {
      background: "#fff",
      color: "#111827",
      border: "1px solid rgba(17,24,39,.20)",
    },
    ghost: { background: "transparent", color: "#111827" },
    danger: { background: "#b91c1c", color: "#fff" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral", style }) {
  const tones = {
    neutral: { background: "#f3f4f6", color: "#111827", border: "1px solid rgba(0,0,0,.08)" },
    ok: { background: "#ecfdf5", color: "#065f46", border: "1px solid rgba(6,95,70,.18)" },
    warn: { background: "#fffbeb", color: "#92400e", border: "1px solid rgba(146,64,14,.18)" },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        ...(tones[tone] || tones.neutral),
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function AppShell({
  title,
  subtitle,
  right,
  active,
  children,
}) {
  return (
    <main style={styles.pageBg}>
      <div style={styles.container}>
        <Card>
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid rgba(0,0,0,.08)",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              background: "linear-gradient(180deg, #0b1020 0%, #111827 100%)",
              color: "white",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 1000, fontSize: 22, letterSpacing: -0.4 }}>
                  {title || brand.name}
                </div>
                {subtitle ? (
                  <div style={{ marginTop: 4, opacity: 0.85, fontSize: 13 }}>
                    {subtitle}
                  </div>
                ) : null}
              </div>
              <div>{right}</div>
            </div>
          </div>

          <div style={{ padding: 16 }}>
            {children}
          </div>
        </Card>

        <BottomNav active={active} />
      </div>
    </main>
  );
}

// Navegação inferior (mobile-first). Não quebra desktop: fica “bonita” e discreta.
export function BottomNav({ active }) {
  const items = [
    { key: "alertas", label: "Alertas", href: "/alertas" },
    { key: "favoritos", label: "Favoritos", href: "/favoritos" },
    { key: "config", label: "Config", href: "/config" },
    { key: "conta", label: "Conta", href: "/conta" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        bottom: 12,
        marginTop: 14,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          width: "min(980px, 100%)",
          background: "rgba(255,255,255,.92)",
          border: "1px solid rgba(0,0,0,.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,.12)",
          backdropFilter: "blur(10px)",
          borderRadius: 18,
          padding: 8,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        {items.map((it) => {
          const isActive = it.key === active;
          return (
            <a
              key={it.key}
              href={it.href}
              style={{
                textDecoration: "none",
                textAlign: "center",
                padding: "10px 8px",
                borderRadius: 14,
                fontWeight: 900,
                fontSize: 13,
                color: isActive ? "#fff" : "#111827",
                background: isActive ? "#111827" : "transparent",
                border: isActive ? "1px solid rgba(0,0,0,.0)" : "1px solid rgba(0,0,0,.08)",
              }}
            >
              {it.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
