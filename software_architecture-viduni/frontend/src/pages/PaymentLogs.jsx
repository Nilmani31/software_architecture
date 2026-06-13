import { useEffect, useState } from "react";
import api from "../services/api";

function PaymentLogs() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/payments")
      .then((res) => {
        setPayments(res.data?.payments || []);
      })
      .catch((err) => {
        console.error("Failed to fetch payments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter payments by fine reference number or driver license
  const filtered = payments.filter((p) => {
    const ref = p.fineId?.referenceNumber || "";
    const license = p.fineId?.driverId?.licenseNumber || "";
    const driver = p.fineId?.driverId?.name || "";
    const searchLower = search.toLowerCase();
    return (
      ref.toLowerCase().includes(searchLower) ||
      license.toLowerCase().includes(searchLower) ||
      driver.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Payment History Logs</h2>
            <p style={styles.subtitle}>All processed traffic fine collections nationwide</p>
          </div>

          <div>
            <input
              style={styles.search}
              placeholder="Search by Ref, License, or Driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.loading}>Loading payment transactions...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Transaction ID</th>
                  <th style={styles.th}>Fine Reference</th>
                  <th style={styles.th}>Driver Details</th>
                  <th style={styles.th}>Officer Badge</th>
                  <th style={styles.th}>District</th>
                  <th style={styles.th}>Method / Channel</th>
                  <th style={styles.th}>SMS Status</th>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Amount</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p, i) => (
                  <tr key={i} style={styles.row}>
                    <td style={styles.td}>
                      <span style={styles.txnId}>{p.transactionId}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.refBadge}>{p.fineId?.referenceNumber || "N/A"}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.driverName}>{p.fineId?.driverId?.name || "Unknown"}</div>
                      <div style={styles.driverLicense}>{p.fineId?.driverId?.licenseNumber || "N/A"}</div>
                    </td>
                    <td style={styles.td}>{p.fineId?.officerId?.badgeNumber || "N/A"}</td>
                    <td style={styles.td}>{p.fineId?.district || "N/A"}</td>
                    <td style={styles.td}>
                      <div>{p.paymentMethod}</div>
                      <span style={styles.channelBadge}>{p.paymentChannel}</span>
                    </td>
                    <td style={styles.td}>
                      {p.smsNotificationSent ? (
                        <span style={styles.smsSuccess}>Sent ✅</span>
                      ) : (
                        <span style={styles.smsFailed}>Pending/Failed ❌</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "N/A"}
                    </td>
                    <td style={styles.tdAmount}>
                      Rs. {Number(p.amount).toLocaleString()}.00
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filtered.length === 0 && (
          <div style={styles.empty}>No payment transactions found</div>
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
    marginBottom: "20px",
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
    width: "280px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    outline: "none",
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
    background: "#cbd5e1",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
  },
  tdAmount: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#15803d",
    fontSize: "14px",
    fontWeight: "700",
    textAlign: "right",
  },
  row: {
    transition: "0.2s",
  },
  txnId: {
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#475569",
  },
  refBadge: {
    padding: "4px 8px",
    background: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "12px",
  },
  driverName: {
    fontWeight: "600",
    color: "#1e293b",
  },
  driverLicense: {
    fontSize: "11px",
    color: "#64748b",
  },
  channelBadge: {
    fontSize: "10px",
    padding: "2px 6px",
    background: "#f1f5f9",
    color: "#475569",
    borderRadius: "4px",
    textTransform: "uppercase",
    display: "inline-block",
    marginTop: "4px",
  },
  smsSuccess: {
    fontSize: "12px",
    color: "#16a34a",
    fontWeight: "600",
  },
  smsFailed: {
    fontSize: "12px",
    color: "#dc2626",
    fontWeight: "600",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
  },
  empty: {
    textAlign: "center",
    padding: "30px",
    color: "#64748b",
  },
};

export default PaymentLogs;