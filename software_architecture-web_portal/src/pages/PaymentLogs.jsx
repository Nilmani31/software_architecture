import { useEffect, useState } from "react";
import api from "../services/api";

function DistrictReport() {
  const [districts, setDistricts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/district-report").then((res) => {
      setDistricts(res.data || []);
    });
  }, []);

  // filter
  const filtered = districts.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.topBar}>
          <div>
            <h2 style={styles.title}>District Report</h2>
            <p style={styles.subtitle}>Manage district-wise fines summary</p>
          </div>
        </div>

        {/* FILTER BAR (SAME AS PAYMENT LOGS STYLE) */}
        <div style={styles.filterBar}>
          <input
            style={styles.search}
            placeholder="Search district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select style={styles.select}>
            <option>Filter by Range</option>
            <option>High Amount</option>
            <option>Low Amount</option>
          </select>

          <select style={styles.select}>
            <option>Sort By</option>
            <option>Fines Count</option>
            <option>Amount</option>
          </select>
        </div>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>District</th>
                <th style={styles.th}>Fines Count</th>
                <th style={styles.th}>Total Amount (Rs.)</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((d, i) => (
                <tr key={i} style={styles.row}>
                  <td style={styles.td}>{d.name}</td>

                  <td style={styles.td}>
                    <span style={styles.badge}>
                      {d.count}
                    </span>
                  </td>

                  <td style={styles.td}>
                    {Number(d.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={styles.empty}>No records found</div>
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

  topBar: {
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

  filterBar: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "15px",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "10px",
  },

  search: {
    width: "250px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    outline: "none",
    color: "#1e293b",
  },

  select: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    cursor: "pointer",
    fontSize: "13px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    fontSize: "13px",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
    background: "#cbd5e1",   // SAME AS PAYMENT LOGS HEADER STYLE
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
  },

  row: {
    transition: "0.2s",
    cursor: "pointer",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    background: "#e2e8f0",
    color: "#1e293b",
    display: "inline-block",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b",
  },
};

export default DistrictReport;