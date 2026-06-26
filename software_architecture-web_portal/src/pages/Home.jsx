import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLookup = async (e) => {
    e.preventDefault();
    setError("");
    if (!referenceNumber) {
      setError("Please enter your Reference Number.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/fines/lookup?ref=${referenceNumber}&categoryCode=${categoryCode}`);
      navigate(`/fine/${res.data.fine.id}`, { state: { fine: res.data.fine } });
    } catch (err) {
      setError(err.response?.data?.message || "Fine not found. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoCircle}>🚔</div>
        <h1 style={styles.title}>Traffic Fine Portal</h1>
        <p style={styles.subtitle}>Pay your Sri Lanka Police traffic fines online securely.</p>

        <form onSubmit={handleLookup} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Reference Number *</label>
            <input
              type="text"
              placeholder="e.g. TF-TEST-001"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category Code (Optional)</label>
            <input
              type="text"
              placeholder="e.g. OVS"
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Searching..." : "Lookup Fine"}
          </button>
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
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "50px 40px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    textAlign: "center"
  },
  logoCircle: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    margin: "0 auto 20px",
    color: "white",
    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)"
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "35px",
    lineHeight: "1.5"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
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
    fontWeight: "500"
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
  button: {
    padding: "16px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.4)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  }
};

export default Home;
