import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function PaymentGateway() {
  const location = useLocation();
  const navigate = useNavigate();
  const fine = location.state?.fine;

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!fine) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.errorTitle}>Invalid Session</h2>
          <button style={styles.secondaryButton} onClick={() => navigate("/")}>Return Home</button>
        </div>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/payments/pay", {
        referenceNumber: fine.referenceNumber,
        categoryCode: fine.category.categoryCode,
        paymentMethod: "CARD",
        cardNumber: cardNumber,
        paymentChannel: "WEB_PORTAL"
      });

      navigate("/success", { state: { result: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoCircle}>💳</div>
          <h1 style={styles.title}>Secure Payment</h1>
          <p style={styles.subtitle}>Total Amount: <span style={styles.amountValue}>Rs. {fine.category.amount.toLocaleString()}</span></p>
        </div>

        <form onSubmit={handlePayment} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Card Number</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              style={styles.input}
              required
              maxLength={19}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                style={styles.input}
                required
                maxLength={5}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>CVV</label>
              <input
                type="password"
                placeholder="***"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                style={styles.input}
                required
                maxLength={4}
              />
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.actionSection}>
            <button type="submit" style={styles.payButton} disabled={loading}>
              {loading ? "Processing..." : `Pay Rs. ${fine.category.amount.toLocaleString()}`}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={() => navigate(-1)} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
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
    maxWidth: "450px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logoCircle: {
    width: "70px",
    height: "70px",
    background: "#f1f5f9",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    margin: "0 auto 15px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 5px 0"
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0
  },
  amountValue: {
    color: "#0f172a",
    fontWeight: "800",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  input: {
    padding: "16px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
    background: "#f8fafc",
    color: "#0f172a",
    fontWeight: "600",
    letterSpacing: "1px"
  },
  error: {
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
    padding: "10px",
    background: "#fef2f2",
    borderRadius: "8px",
    border: "1px solid #fee2e2"
  },
  actionSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px"
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
  errorTitle: {
    textAlign: "center",
    color: "#b91c1c",
    marginBottom: "20px"
  }
};

export default PaymentGateway;
