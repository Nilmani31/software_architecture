import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{ width: "200px", height: "100vh", background: "#222", color: "white", padding: "20px" }}>
      <h3>Admin Panel</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/admin/dashboard" style={{ color: "white" }}>Dashboard</Link></li>
        <li><Link to="/admin/districts" style={{ color: "white" }}>District Report</Link></li>
        <li><Link to="/admin/categories" style={{ color: "white" }}>Category Report</Link></li>
        <li><Link to="/admin/payments" style={{ color: "white" }}>Payments</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;