import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.errorTitle}>Invalid Session</h2>
          <button style={styles.button} onClick={() => navigate("/")}>Return Home</button>
        </div>
      </div>
    );
  }

  const { payment, fine, smsNotificationSent } = result;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <div style={styles.successIcon}>✓</div>
        </div>
        
        <h1 style={styles.title}>Payment Successful!</h1>
        <p style={styles.subtitle}>Your traffic fine has been settled.</p>

        <div style={styles.receipt}>
          <div style={styles.receiptRow}>
            <span style={styles.label}>Transaction ID</span>
            <span style={styles.value}>{payment.transactionId}</span>
          </div>
          <div style={styles.receiptRow}>
            <span style={styles.label}>Reference Number</span>
            <span style={styles.value}>{fine.referenceNumber}</span>
          </div>
          <div style={styles.receiptRow}>
            <span style={styles.label}>Amount Paid</span>
            <span style={styles.amountValue}>Rs. {payment.amount.toLocaleString()}</span>
          </div>
          <div style={styles.receiptRow}>
            <span style={styles.label}>Date</span>
            <span style={styles.value}>{new Date(payment.paymentDate).toLocaleString()}</span>
          </div>
          <div style={styles.receiptRow}>
            <span style={styles.label}>SMS Notification</span>
            <span style={smsNotificationSent ? styles.smsSuccess : styles.smsFailed}>
              {smsNotificationSent ? "Sent to Officer" : "Failed to Send"}
            </span>
          </div>
        </div>

        <button style={styles.button} onClick={() => navigate("/")}>
          Return to Home
        </button>
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
    padding: "50px 40px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    textAlign: "center"
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px"
  },
  successIcon: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    color: "white",
    boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.5)"
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 10px 0"
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "35px"
  },
  receipt: {
    background: "#f8fafc",
    borderRadius: "16px",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "35px",
    border: "1px dashed #cbd5e1"
  },
  receiptRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "10px",
  },
  label: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase"
  },
  value: {
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: "700",
  },
  amountValue: {
    fontSize: "16px",
    color: "#10b981",
    fontWeight: "800",
  },
  smsSuccess: {
    fontSize: "14px",
    color: "#10b981",
    fontWeight: "700",
  },
  smsFailed: {
    fontSize: "14px",
    color: "#e11d48",
    fontWeight: "700",
  },
  button: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.4)",
    transition: "transform 0.2s ease"
  },
  errorTitle: {
    color: "#b91c1c",
    marginBottom: "20px"
  }
};

export default PaymentSuccess;
