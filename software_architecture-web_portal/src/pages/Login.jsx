import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side */}
      <div style={styles.imageSide}>
        <div style={styles.overlay}>
          <h1 style={styles.systemTitle}>
            Traffic Violation Management System
          </h1>
          <p style={styles.systemText}>
            Secure administration portal for managing traffic violations,
            penalties, and reports.
          </p>
        </div>

        <img
          src="https://image.connexionfrance.com/111525.webp?imageId=111525&width=960&height=642&format=jpg"
          alt="Traffic System"
          style={styles.image}
        />
      </div>

      {/* Right Side */}
      <div style={styles.formSide}>
        <div style={styles.formBox}>
          <div style={styles.logoCircle}>🚦</div>

          <h2 style={styles.title}>Admin Login</h2>

          <p style={styles.subtitle}>
            Sign in to access the administration dashboard
          </p>

          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    overflow: "hidden",
  },

  /* LEFT SECTION */

  imageSide: {
    flex: 1.2,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
  position: "absolute",
  inset: 0,              // replaces top,left,width,height
  background: "rgba(0,0,0,0.55)",
  color: "white",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "60px",
  boxSizing: "border-box",
},

  systemTitle: {
  fontSize: "56px",
  fontWeight: "500",
  lineHeight: "1.1",
  maxWidth: "600px",
  color: "#ffffff",
  textShadow: "2px 2px 10px rgba(0,0,0,0.8)",
  marginBottom: "20px",
},

  systemText: {
    fontSize: "18px",
    lineHeight: "1.6",
    maxWidth: "500px",
    opacity: 0.9,
  },

  /* RIGHT SECTION */

  formSide: {
    flex: 0.8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },

  formBox: {
    width: "380px",
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  logoCircle: {
    width: "70px",
    height: "70px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    color: "#fff",
  },

  title: {
    marginBottom: "8px",
    color: "#1e293b",
    fontSize: "28px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "25px",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Login;