"use client";

import { useEffect, useState } from "react";

export const brand = {
  name: "Alerta de Licitação",
  tagline: "Encontre licitações do seu nicho sem perder tempo.",
};

// Hook simples pra detectar mobile (sem libs)
function useIsMobile(breakpoint = 860) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calc = () => setIsMobile(window.innerWidth <= breakpoint);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [breakpoint]);

  return isMobile;
}

export function BottomNav({ active = "alertas" }) {
  const isMobile = useIsMobile();

  if (!isMobile) return null; // só aparece no celular

  const items = [
    { key: "alertas", href: "/alertas", label: "Alertas", icon: "📌" },
    { key: "favoritos", href: "/favoritos", label: "Favoritos", icon: "⭐" },
    { key: "config", href: "/config", label: "Config", icon: "⚙️" },
    { key: "conta", href: "/conta", label: "Conta", icon: "👤" },
  ];

  return (
    <>
      {/* Espaçador para não cobrir conteúdo */}
      <div style={{ height: 78 }} />

      <nav
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          padding: "10px 10px calc(10px + env(safe-area-inset-bottom))",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          {items.map((it) => {
            const on = it.key === active;
            return (
              <a
                key={it.key}
                href={it.href}
                style={{
                  textDecoration: "none",
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: "10px 10px",
                  display: "grid",
                  placeItems: "center",
                  gap: 4,
                  background: on ? "#0b1020" : "#fff",
                  color: on ? "#fff" : "#0b1020",
                  fontWeight: 900,
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1 }}>{it.icon}</div>
                <div style={{ fontSize: 12, lineHeight: 1 }}>{it.label}</div>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export const styles = {
  page: {
    minHeight: "100vh",
    padding: 16,
    background: "linear-gradient(180deg, #f7f7f7 0%, #efefef 100%)",
  },

  shell: {
    maxWidth: 980,
    margin: "0 auto",
  },

  topbar: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,.06)",
    boxShadow: "0 18px 60px rgba(0,0,0,.10)",
    padding: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, #0b1020, #111827)",
    boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
  },

  title: { margin: 0, fontSize: 18, fontWeight: 900, lineHeight: 1.1 },
  subtitle: { fontSize: 12, opacity: 0.75, marginTop: 2 },

  // Pills (desktop)
  pills: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  pill: (active) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 900,
    border: "1px solid rgba(0,0,0,.08)",
    background: active ? "#0b1020" : "#fff",
    color: active ? "#fff" : "#0b1020",
  }),

  card: {
    width: "100%",
    background: "#fff",
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,.06)",
    boxShadow: "0 18px 60px rgba(0,0,0,.10)",
    overflow: "hidden",
  },
  cardPad: { padding: 16 },

  h2: { margin: 0, fontSize: 18, fontWeight: 900 },
  p: { marginTop: 10, marginBottom: 0, color: "#374151", lineHeight: 1.5 },
  note: { marginTop: 10, color: "#6b7280", fontSize: 13, lineHeight: 1.45 },

  label: { fontWeight: 900, marginBottom: 6, marginTop: 10 },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid #d7ddea",
    outline: "none",
    fontSize: 16,
  },

  row: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },

  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    background: "#0b1020",
    color: "#fff",
    border: "1px solid #0b1020",
    padding: "12px 14px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 140,
  },
  btnGhost: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    background: "#fff",
    color: "#0b1020",
    border: "1px solid rgba(0,0,0,.12)",
    padding: "12px 14px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 140,
  },

  badge: (type = "info") => {
    const map = {
      ok: { bg: "#e9fbf0", bd: "#bfead0", tx: "#155d33" },
      warn: { bg: "#fff7ed", bd: "#fed7aa", tx: "#9a3412" },
      info: { bg: "#eef2ff", bd: "#c7d2fe", tx: "#3730a3" },
    };
    const c = map[type] || map.info;
    return {
      background: c.bg,
      border: `1px solid ${c.bd}`,
      color: c.tx,
      borderRadius: 14,
      padding: "10px 12px",
      fontWeight: 900,
      fontSize: 13,
    };
  },
};
