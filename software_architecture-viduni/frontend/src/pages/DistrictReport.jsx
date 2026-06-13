import { useEffect, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DistrictReport() {
  const [districts, setDistricts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/analytics/district").then((res) => {
      const mapped = (res.data?.districtAnalytics || []).map((d) => ({
        name: d.district || "Unknown",
        count: d.totalIssued || 0,
        amount: d.totalCollected || 0,
      }));
      setDistricts(mapped);
    });
  }, []);

  // Filter search
  const filtered = districts.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  // PDF DOWNLOAD FUNCTION
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("District Wise Report", 14, 10);

    const tableData = filtered.map((d) => [
      d.name,
      d.count,
      d.amount,
    ]);

    autoTable(doc, {
      head: [["District", "Fines Count", "Total Amount"]],
      body: tableData,
    });

    doc.save("district-report.pdf");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>District Report</h2>
            <p style={styles.subtitle}>Summary of fines by district</p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              style={styles.search}
              placeholder="Search district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={downloadPDF} style={styles.button}>
              Download PDF
            </button>
          </div>
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
                  <td style={styles.td}>{d.count}</td>
                  <td style={styles.td}>
                    {Number(d.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={styles.empty}>No district records found</div>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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

  search: {
    width: "220px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    outline: "none",
  },

  button: {
    padding: "10px 15px",
    background: "#1e293b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
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
  background: "#cbd5e1",  // SAME AS PAYMENT LOGS
},

  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
  },

  row: {
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b",
  },
};

export default DistrictReport;