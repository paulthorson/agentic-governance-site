export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "36rem",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Agentic Governance
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "1.05rem",
            lineHeight: 1.55,
            color: "var(--muted)",
            maxWidth: "32rem",
          }}
        >
          Marketing site is scaffolding. Look and analytics land later.
        </p>
        <div style={{ marginTop: "0.5rem" }}>
          <a
            href="https://github.com/paulthorson/agentic-governance"
            style={{
              display: "inline-block",
              padding: "0.7rem 1.15rem",
              background: "var(--cta)",
              color: "var(--cta-fg)",
              fontWeight: 500,
              borderRadius: "0.35rem",
              border: "1px solid var(--line)",
            }}
          >
            Get AG
          </a>
        </div>
      </div>
    </main>
  );
}
