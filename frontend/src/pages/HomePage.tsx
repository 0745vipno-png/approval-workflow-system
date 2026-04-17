export function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#eef2f7",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", color: "#1f2937" }}>
          簽核系統
        </h1>
        <p style={{ marginTop: "8px", color: "#6b7280" }}>系統首頁</p>
      </header>

      <section
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#111827" }}>待簽核項目</h2>
        <ul>
          <li>請假申請單 - 王小明</li>
          <li>採購申請單 - 陳小華</li>
          <li>加班申請單 - 林小美</li>
        </ul>
      </section>
    </div>
  );
}