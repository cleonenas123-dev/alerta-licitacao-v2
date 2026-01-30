"use client";

import { useRouter } from "next/navigation";

export default function SucessoResetSenha() {
  const router = useRouter();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.title}>Alerta de Licitação</div>
          <div style={styles.subtitle}>Senha redefinida</div>
        </div>

        <div style={styles.body}>
          <div style={styles.icon}>👍</div>
          <h2 style={styles.h2}>Senha criada com sucesso!</h2>
          <p style={styles.p}>Agora você já pode entrar com sua nova senha.</p>

          <button style={styles.btn} onClick={() => router.push("/login")}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "min(560px, 96vw)",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 18px 50px rgba(0,0,0,.12)",
    overflow: "hidden",
  },
  header: { background: "#0b1220", color: "#fff", padding: "18px 22px" },
  title: { fontSize: 22, fontWeight: 800 },
  subtitle: { fontSize: 13, opacity: 0.85, marginTop: 4 },
  body: { padding: 26, textAlign: "center" },
  icon: { fontSize: 54, marginBottom: 10 },
  h2: { margin: "0 0 6px", fontSize: 22 },
  p: { margin: "0 0 16px", color: "#334155" },
  btn: {
    background: "#0b1220",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  },
};
