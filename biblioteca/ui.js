// biblioteca/ui.js
import React from "react";

export const brand = {
  name: "Alerta de Licitação",
  primary: "#6D28D9", // roxo vivo (base do visual)
  accent: "#22C55E",  // verde “ok”
};

export const styles = {
  page: {
    minHeight: "100vh",
    background:
  "radial-gradient(800px 400px at 20% 0%, rgba(99,102,241,.25), transparent 55%), radial-gradient(700px 380px at 90% 10%, rgba(168,85,247,.25), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.85) 0%, rgba(238,242,255,.85) 100%)",
    padding: 16,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

  },
  shell: {
    maxWidth: 980,
    margin: "0 auto",
  },
  topbar: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "14px 16px",
  borderRadius: 18,
  background:
    "linear-gradient(180deg, rgba(255,255,255,.78) 0%, rgba(255,255,255,.58) 100%)",
  border: "1px solid rgba(17,24,39,.08)",
  boxShadow: "0 14px 40px rgba(17,24,39,.10)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
},
  title: { fontSize: 18, fontWeight: 950, margin: 0, color: "#0f172a" },
  subtitle: { fontSize: 13, margin: "4px 0 0", color: "#475569" },
  grid: {
    marginTop: 14,
    display: "grid",
   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
   gap: 12,
  },
};

export function Badge({ children, tone = "default" }) {
  const bg =
    tone === "ok"
      ? "rgba(34,197,94,.14)"
      : tone === "warn"
      ? "rgba(245,158,11,.16)"
      : "rgba(15,23,42,.06)";
  const color =
    tone === "ok" ? "#166534" : tone === "warn" ? "#92400e" : "#0f172a";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 999,
        background: bg,
        color,
        fontWeight: 800,
        fontSize: 12,
        border: "1px solid rgba(15,23,42,.08)",
      }}
    >
      {children}
    </span>
  );
}

export function Button({ children, onClick, href, variant = "primary" }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 14,
    fontWeight: 900,
    fontSize: 13,
    border: "1px solid rgba(15,23,42,.10)",
    cursor: "pointer",
    textDecoration: "none",
    userSelect: "none",
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${brand.primary} 0%, #2563EB 100%)`,
      color: "#fff",
      boxShadow: "0 18px 45px rgba(109,40,217,.22)",
      border: "1px solid rgba(109,40,217,.25)",
    },
    secondary: {
      background: "rgba(255,255,255,.85)",
      color: "#0f172a",
    },
    ghost: {
      background: "transparent",
      color: "#0f172a",
    },
  };

  const Comp = href ? "a" : "button";
  return (
    <Comp
      href={href}
      onClick={onClick}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </Comp>
  );
}

export function Panel({ children }) {
  return (
    <section
      style={{
        background: "rgba(255,255,255,.85)",
        border: "1px solid rgba(15,23,42,.08)",
        borderRadius: 18,
        padding: 14,
        boxShadow: "0 18px 60px rgba(2,6,23,.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </section>
  );
}

export function Card({ title, subtitle, children, icon = "✨" }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 14,
        background:
          "radial-gradient(600px 240px at 10% 0%, rgba(109,40,217,.18), transparent 60%), rgba(255,255,255,.85)",
        border: "1px solid rgba(15,23,42,.08)",
        boxShadow: "0 18px 60px rgba(2,6,23,.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: "rgba(109,40,217,.14)",
            border: "1px solid rgba(109,40,217,.25)",
            fontSize: 16,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontWeight: 950, color: "#0f172a" }}>{title}</div>
          {subtitle ? (
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      {children ? <div style={{ marginTop: 12 }}>{children}</div> : null}
    </div>
  );
}

export function AppShell({ title, subtitle, right, children }) {
  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${brand.primary} 0%, #2563EB 100%)`,
                boxShadow: "0 18px 45px rgba(109,40,217,.22)",
              }}
            />
            <div>
              <h1 style={styles.title}>{title || brand.name}</h1>
              <p style={styles.subtitle}>{subtitle || "Seu painel"}</p>
            </div>
          </div>
          <div>{right}</div>
        </header>

        <div className="grid-responsive">{children}</div>
      </div>
    </main>
  );
}

export function BottomNav() {
  // (deixa pronto, mas opcional — você pode nem usar agora)
  return null;
}
