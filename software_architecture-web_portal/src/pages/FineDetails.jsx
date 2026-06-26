import { useLocation, useNavigate } from "react-router-dom";

function FineDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const fine = location.state?.fine;

  if (!fine) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.errorTitle}>Fine Not Found</h2>
          <button style={styles.secondaryButton} onClick={() => navigate("/")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handlePay = () => {
    navigate(`/pay/${fine.id}`, { state: { fine } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.statusBadge(fine.isPaid)}>
            {fine.isPaid ? "PAID" : "UNPAID"}
          </div>
          <h1 style={styles.title}>Fine Details</h1>
          <p style={styles.refNumber}>{fine.referenceNumber}</p>
        </div>

        <div style={styles.detailsGrid}>
          <div style={styles.detailItem}>
            <span style={styles.label}>Category</span>
            <span style={styles.value}>{fine.category.name} ({fine.category.categoryCode})</span>
          </div>
          
          <div style={styles.detailItem}>
            <span style={styles.label}>Amount Due</span>
            <span style={styles.amountValue}>Rs. {fine.category.amount.toLocaleString()}</span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.label}>Vehicle</span>
            <span style={styles.value}>{fine.vehicle.plateNumber}</span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.label}>Driver</span>
            <span style={styles.value}>{fine.driver.name}</span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.label}>Location</span>
            <span style={styles.value}>{fine.location}, {fine.district}</span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.label}>Date Issued</span>
            <span style={styles.value}>{new Date(fine.issuedDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div style={styles.actionSection}>
          {!fine.isPaid ? (
            <button style={styles.payButton} onClick={handlePay}>
              Proceed to Payment
            </button>
          ) : (
            <div style={styles.successMessage}>
              ✅ This fine has already been settled.
            </div>
          )}
          <button style={styles.secondaryButton} onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "20px"
  },
  card: {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    borderBottom: "2px dashed #e2e8f0",
    paddingBottom: "20px"
  },
  statusBadge: (isPaid) => ({
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "15px",
    color: isPaid ? "#15803d" : "#b91c1c",
    background: isPaid ? "#dcfce7" : "#fee2e2",
  }),
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 5px 0"
  },
  refNumber: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#64748b",
    margin: 0
  },
  detailsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "35px"
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    background: "#f8fafc",
    borderRadius: "12px"
  },
  label: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "600"
  },
  value: {
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: "600",
    textAlign: "right"
  },
  amountValue: {
    fontSize: "18px",
    color: "#e11d48",
    fontWeight: "800",
    textAlign: "right"
  },
  actionSection: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  payButton: {
    padding: "16px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.4)",
    transition: "transform 0.2s ease"
  },
  secondaryButton: {
    padding: "16px",
    borderRadius: "12px",
    background: "transparent",
    color: "#64748b",
    fontSize: "16px",
    fontWeight: "600",
    border: "2px solid #e2e8f0",
    cursor: "pointer",
    transition: "background 0.2s ease"
  },
  successMessage: {
    textAlign: "center",
    color: "#15803d",
    fontWeight: "600",
    padding: "15px",
    background: "#dcfce7",
    borderRadius: "12px"
  },
  errorTitle: {
    textAlign: "center",
    color: "#b91c1c",
    marginBottom: "20px"
  }
};

export default FineDetails;
