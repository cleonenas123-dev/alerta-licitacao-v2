// biblioteca/ui.js
"use client";

export const brand = {
  name: "Alerta de Licitação",
  tagline: "Encontre licitações do seu nicho e receba alertas no e-mail.",
  // Tema inspirado em app moderno (roxo/azul + verde)
  theme: {
    bg: "radial-gradient(1200px 600px at 20% 10%, rgba(124,58,237,.55), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(59,130,246,.45), transparent 55%), linear-gradient(180deg, #0b1220 0%, #070a12 100%)",
    card: "rgba(255,255,255,.08)",
    cardSolid: "rgba(255,255,255,.92)",
    border: "rgba(255,255,255,.14)",
    text: "#ffffff",
    muted: "rgba(255,255,255,.72)",
    darkText: "#0b1220",
    accent: "#b7ff4a", // verde-limão
    accent2: "#60a5fa", // azul
  },
};

// Container padrão (pra todas as telas internas)
export function AppShell({ title, subtitle, active, right, children }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 16,
        background: brand.theme.bg,
        color: brand.theme.text,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: 14,
            borderRadius: 18,
            border: `1px solid ${brand.theme.border}`,
            background: brand.theme.card,
            boxShadow: "0 18px 60px rgba(0,0,0,.35)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, rgba(183,255,74,.9), rgba(96,165,250,.9))",
                boxShadow: "0 12px 30px rgba(0,0,0,.35)",
              }}
              aria-hidden
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 950, lineHeight: 1.1 }}>
                {title || brand.name}
              </div>
              <div style={{ fontSize: 13, color: brand.theme.muted }}>
                {subtitle || brand.tagline}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {right}
          </div>
        </header>

        <section style={{ marginTop: 14 }}>{children}</section>

        {/* Bottom nav mobile */}
        <BottomNav active={active} />
      </div>
    </main>
  );
}

export function Panel({ children }) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${brand.theme.border}`,
        background: brand.theme.card,
        boxShadow: "0 14px 40px rgba(0,0,0,.28)",
        padding: 14,
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </div>
  );
}

export function Card({ title, value, hint, icon }) {
  return (
    <div
      style={{
        borderRadius: 18,
        background: brand.theme.cardSolid,
        color: brand.theme.darkText,
        border: "1px solid rgba(0,0,0,.06)",
        padding: 14,
        boxShadow: "0 14px 40px rgba(0,0,0,.18)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 14,
            background: "rgba(0,0,0,.06)",
            display: "grid",
            placeItems: "center",
            fontSize: 18,
          }}
          aria-hidden
        >
          {icon || "✨"}
        </div>
        <div style={{ fontWeight: 900 }}>{title}</div>
      </div>

      <div style={{ marginTop: 10, fontSize: 28, fontWeight: 1000 }}>
        {value}
      </div>

      {hint ? (
        <div style={{ marginTop: 6, fontSize: 13, color: "rgba(0,0,0,.55)" }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export function Button({ children, variant = "primary", ...props }) {
  const base = {
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 950,
    border: "none",
    cursor: "pointer",
    transition: "transform .06s ease",
  };

  const styles =
    variant === "secondary"
      ? {
          ...base,
          background: "rgba(255,255,255,.92)",
          color: "#0b1220",
          border: "1px solid rgba(0,0,0,.08)",
        }
      : variant === "ghost"
      ? {
          ...base,
          background: "transparent",
          color: brand.theme.text,
          border: `1px solid ${brand.theme.border}`,
        }
      : {
          ...base,
          background: `linear-gradient(135deg, ${brand.theme.accent}, ${brand.theme.accent2})`,
          color: "#07101d",
          boxShadow: "0 14px 40px rgba(0,0,0,.35)",
        };

  return (
    <button
      {...props}
      style={styles}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "default" }) {
  const bg =
    tone === "ok"
      ? "rgba(183,255,74,.22)"
      : tone === "warn"
      ? "rgba(250,204,21,.22)"
      : "rgba(96,165,250,.20)";

  const border =
    tone === "ok"
      ? "rgba(183,255,74,.40)"
      : tone === "warn"
      ? "rgba(250,204,21,.38)"
      : "rgba(96,165,250,.35)";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        background: bg,
        border: `1px solid ${border}`,
        color: brand.theme.text,
        fontSize: 12,
        fontWeight: 900,
      }}
    >
      {children}
    </span>
  );
}

export function BottomNav({ active }) {
  const items = [
    { key: "alertas", label: "Alertas", href: "/alertas", icon: "🔔" },
    { key: "favoritos", label: "Favoritos", href: "/favoritos", icon: "⭐" },
    { key: "config", label: "Config", href: "/config", icon: "⚙️" },
    { key: "conta", label: "Conta", href: "/conta", icon: "👤" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        bottom: 12,
        marginTop: 18,
        display: "flex",
        gap: 10,
        justifyContent: "space-between",
        padding: 10,
        borderRadius: 18,
        border: `1px solid ${brand.theme.border}`,
        background: brand.theme.card,
        backdropFilter: "blur(10px)",
      }}
    >
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <a
            key={it.key}
            href={it.href}
            style={{
              flex: 1,
              textDecoration: "none",
              color: brand.theme.text,
              display: "grid",
              placeItems: "center",
              padding: "10px 8px",
              borderRadius: 14,
              border: isActive ? "1px solid rgba(183,255,74,.55)" : "1px solid transparent",
              background: isActive ? "rgba(183,255,74,.12)" : "transparent",
              fontWeight: 950,
              fontSize: 12,
            }}
          >
            <div style={{ fontSize: 16, lineHeight: 1 }}>{it.icon}</div>
            <div>{it.label}</div>
          </a>
        );
      })}
    </nav>
  );
}
