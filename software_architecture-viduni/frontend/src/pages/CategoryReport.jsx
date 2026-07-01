import { useEffect, useState } from "react";
import api from "../services/api";

function CategoryReport() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/admin/analytics/category").then((res) => {
      setCategories(res.data.categoryAnalytics || []);
    });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Category Report</h2>
            <p style={styles.subtitle}>
              Traffic fine breakdown by violation category
            </p>
          </div>
        </div>

        {/* TABLE STYLE LAYOUT */}
        <div style={styles.grid}>
          {categories.map((c, i) => (
            <div key={i} style={styles.cardItem}>
              <div style={styles.icon}>🚦</div>

              <div>
                <h3 style={styles.category}>{c.categoryName} ({c.categoryCode})</h3>
                <p style={styles.text}>
                  {c.fineCount || c.paymentCount || c.count} fines
                </p>
                <p style={styles.amount}>
                  Rs. {Number(c.totalCollected || c.amount).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div style={styles.empty}>No category records found</div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "25px",
    background: "#f4f6fb",
    minHeight: "100vh",
    fontFamily: "Segoe UI",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },

  header: {
    marginBottom: "15px",
  },

  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },

  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "4px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "10px",
  },

  cardItem: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },

  icon: {
    fontSize: "26px",
    background: "#e0f2fe",
    padding: "10px",
    borderRadius: "10px",
  },

  category: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
  },

  text: {
    margin: "3px 0",
    fontSize: "13px",
    color: "#64748b",
  },

  amount: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    color: "#2563eb",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b",
  },
};

export default CategoryReport;