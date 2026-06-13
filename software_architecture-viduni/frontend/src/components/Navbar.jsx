import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.logo}>
        🚦 Traffic System
      </div>

      <div style={styles.links}>
        <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/admin/payments" style={styles.link}>Payments</Link>
        <Link to="/admin/districts" style={styles.link}>District Report</Link>
        <Link to="/admin/categories" style={styles.link}>Categories</Link>
        <Link to="/admin/officers" style={styles.link}>Officers</Link>
      </div>

      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 25px",
    background: "#1e293b",
    color: "white",
    fontFamily: "Segoe UI",
  },

  logo: {
    fontSize: "18px",
    fontWeight: "700",
  },

  links: {
    display: "flex",
    gap: "20px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
  },

  logout: {
    background: "#ef4444",
    border: "none",
    padding: "8px 12px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Navbar;