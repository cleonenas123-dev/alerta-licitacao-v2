// biblioteca/ui.js
import React from "react";

export const brand = {
  name: "Alerta de Licitação",
  colors: {
    bg: "#f3f5f8",
    card: "#ffffff",
    text: "#0b1020",
    muted: "#566176",
    border: "rgba(0,0,0,.08)",
    primary: "#0b1020",
    primaryText: "#ffffff",
    okBg: "#e9fbf0",
    okBorder: "#bfead0",
    okText: "#155d33",
    errBg: "#fdecec",
    errBorder: "#f5c2c7",
    errText: "#8a1c24",
  },
  radius: {
    xl: 22,
    lg: 18,
    md: 14,
    sm: 12,
  },
  shadow: "0 20px 60px rgba(0,0,0,0.12)",
};

export function GlobalStyles() {
  // CSS global simples pra dar “cara de app” + mobile-first
  return (
    <style jsx global>{`
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
      }
      html,
      body {
        height: 100%;
      }
      body {
        background: ${brand.colors.bg};
        color: ${brand.colors.text};
      }
      a {
        color: inherit;
      }

      /* layout interno (app shell) */
      .app-shell {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .app-topbar {
        position: sticky;
        top: 0;
        z-index: 10;
        background: linear-gradient(90deg, #0b1020, #0a0f1d);
        color: #fff;
        padding: 14px 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
      }
      .app-topbar-inner {
        max-width: 1080px;
        margin: 0 auto;
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
      }
      .brand-row {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }
      .brand-logo {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.18);
        flex: 0 0 auto;
      }
      .brand-title {
        font-weight: 900;
        font-size: 18px;
        line-height: 1.1;
      }
      .brand-subtitle {
        font-size: 12px;
        opacity: 0.8;
        margin-top: 2px;
      }

      .app-content {
        width: 100%;
        max-width: 1080px;
        margin: 0 auto;
        padding: 16px;
        padding-bottom: 86px; /* espaço pro bottom nav no mobile */
      }

      /* Bottom nav (mobile-first) */
      .bottom-nav {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 20;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
      }
      .bottom-nav-inner {
        max-width: 1080px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }
      .nav-item {
        display: grid;
        place-items: center;
        gap: 4px;
        padding: 10px 8px;
        border-radius: 14px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: #fff;
        text-decoration: none;
        font-weight: 800;
        font-size: 11px;
        color: #0b1020;
      }
      .nav-item-active {
        background: #0b1020;
        color: #fff;
        border-color: #0b1020;
      }

      /* no desktop, some com o bottom nav e mostra ações no topo */
      @media (min-width: 900px) {
        .app-content {
          padding-bottom: 24px;
        }
        .bottom-nav {
          display: none;
        }
      }
    `}</style>
  );
}

export function Container({ children }) {
  return (
    <div
      style={{
        width: "min(1080px, 100%)",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: brand.colors.card,
        borderRadius: brand.radius.xl,
        border: `1px solid ${brand.colors.border}`,
        boxShadow: brand.shadow,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Panel({ children, style }) {
  // card “leve” sem sombra pesada
  return (
    <div
      style={{
        background: brand.colors.card,
        borderRadius: brand.radius.lg,
        border: `1px solid ${brand.colors.border}`,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary", // primary | secondary | ghost
  full = false,
  disabled = false,
  onClick,
  type = "button",
  style,
}) {
  const base = {
    padding: "12px 16px",
    borderRadius: brand.radius.md,
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    border: "1px solid transparent",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: full ? "100%" : "auto",
    userSelect: "none",
    textDecoration: "none",
  };

  const variants = {
    primary: {
      background: brand.colors.primary,
      color: brand.colors.primaryText,
      borderColor: brand.colors.primary,
    },
    secondary: {
      background: "#fff",
      color: brand.colors.text,
      borderColor: "rgba(0,0,0,.12)",
    },
    ghost: {
      background: "transparent",
      color: brand.colors.text,
      borderColor: "rgba(255,255,255,.35)",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#f2f4f7", border: "rgba(0,0,0,.08)", color: "#223" },
    ok: { bg: brand.colors.okBg, border: brand.colors.okBorder, color: brand.colors.okText },
    err: { bg: brand.colors.errBg, border: brand.colors.errBorder, color: brand.colors.errText },
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
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function AppShell({ title, subtitle, right, children, active = "alertas" }) {
  return (
    <div className="app-shell">
      <GlobalStyles />

      <header className="app-topbar">
        <div className="app-topbar-inner">
          <div className="brand-row">
            <div className="brand-logo" />
            <div style={{ minWidth: 0 }}>
              <div className="brand-title">{title || brand.name}</div>
              <div className="brand-subtitle">{subtitle || "Painel do cliente"}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {right}
          </div>
        </div>
      </header>

      <main className="app-content">{children}</main>

      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          <a className={`nav-item ${active === "alertas" ? "nav-item-active" : ""}`} href="/alertas">
            🔔
            <span>Alertas</span>
          </a>
          <a className={`nav-item ${active === "favoritos" ? "nav-item-active" : ""}`} href="/favoritos">
            ⭐
            <span>Favoritos</span>
          </a>
          <a className={`nav-item ${active === "config" ? "nav-item-active" : ""}`} href="/config">
            ⚙️
            <span>Config</span>
          </a>
          <a className={`nav-item ${active === "conta" ? "nav-item-active" : ""}`} href="/conta">
            👤
            <span>Conta</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
