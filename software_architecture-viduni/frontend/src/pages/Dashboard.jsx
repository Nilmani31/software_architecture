import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalFines: 0,
    topDistrict: "-",
  });

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => {
      setData(res.data.summary || {});
    });
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      <p style={styles.subtitle}>Overview of traffic violation system</p>

      <div style={styles.cardContainer}>

        {/* Revenue Card */}
        <div style={styles.card}>
          <div style={styles.icon}>💰</div>
          <div>
            <h3 style={styles.value}>
              {data.totalRevenue?.toLocaleString()}
            </h3>
            <p style={styles.label}>Total Revenue</p>
          </div>
        </div>

        {/* Fines Card */}
        <div style={styles.card}>
          <div style={styles.icon}>🚗</div>
          <div>
            <h3 style={styles.value}>{data.totalFines}</h3>
            <p style={styles.label}>Total Fines</p>
          </div>
        </div>

        {/* District Card */}
        <div style={styles.card}>
          <div style={styles.icon}>📍</div>
          <div>
            <h3 style={styles.value}>{data.topDistrict}</h3>
            <p style={styles.label}>Top District</p>
          </div>
        </div>

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

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "5px",
  },

  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "20px",
  },

  cardContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  card: {
    flex: "1",
    minWidth: "220px",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    transition: "0.3s",
  },

  icon: {
    fontSize: "30px",
    background: "#e0e7ff",
    padding: "12px",
    borderRadius: "10px",
  },

  value: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
  },

  label: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },
};

export default Dashboard;