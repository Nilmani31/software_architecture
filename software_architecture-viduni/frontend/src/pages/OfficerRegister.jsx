import { useState } from "react";
import api from "../services/api";

const INITIAL_FORM = {
  fullName: "",
  nic: "",
  dob: "",
  gender: "",
  address: "",
  phone: "",
  badgeId: "",
  rank: "",
  station: "",
  division: "",
  username: "",
  password: "",
  email: "",
  district: "",
  status: "",
};

function OfficerRegister() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success"|"error", message }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.nic.trim()) errs.nic = "NIC is required.";
    else if (!/^\d{9}[VvXx]$|^\d{12}$/.test(form.nic.trim()))
      errs.nic = "Invalid NIC format.";
    if (!form.dob) errs.dob = "Date of birth is required.";
    if (!form.gender) errs.gender = "Gender is required.";
    if (!form.phone.trim()) errs.phone = "Phone number is required.";
    else if (!/^\d{9,10}$/.test(form.phone.trim()))
      errs.phone = "Invalid phone number.";
    if (!form.badgeId.trim()) errs.badgeId = "Badge ID is required.";
    if (!form.rank) errs.rank = "Rank is required.";
    if (!form.station.trim()) errs.station = "Station is required.";
    if (!form.division.trim()) errs.division = "Division is required.";
    if (!form.username.trim()) errs.username = "Username is required.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Invalid email address.";
    if (!form.district) errs.district = "District is required.";
    if (!form.status) errs.status = "Status is required.";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name])
      setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("error", "Please fix the errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.fullName,
        badgeNumber: form.badgeId,
        email: form.email,
        password: form.password,
        phone: form.phone,
        district: form.district,
      };
      await api.post("/auth/officer/register", payload);
      showToast("success", "Officer registered successfully.");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = "text", placeholder, autoComplete = "off", children }) => (
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>{label}</label>
      {children ?? (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          style={{
            ...styles.input,
            ...(errors[name] ? styles.inputError : {}),
          }}
        />
      )}
      {errors[name] && <span style={styles.errorMsg}>{errors[name]}</span>}
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Toast */}
      {toast && (
        <div style={{ ...styles.toast, ...(toast.type === "success" ? styles.toastSuccess : styles.toastError) }}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>👮</span>
          <h2 style={styles.title}>Police Officer Registration</h2>
          <p style={styles.subtitle}>Fill in all required fields to register a new officer.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* PERSONAL */}
          <Section title="Personal Information" icon="🪪">
            <div style={styles.grid}>
              <Field label="Full Name" name="fullName" placeholder="e.g. Kamal Perera" />
              <Field label="NIC Number" name="nic" placeholder="e.g. 199012345678" />
              <Field label="Date of Birth" name="dob" type="date" />
              <Field label="Gender" name="gender">
                <select name="gender" value={form.gender} onChange={handleChange} required
                  style={{ ...styles.input, ...(errors.gender ? styles.inputError : {}) }}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <span style={styles.errorMsg}>{errors.gender}</span>}
              </Field>
              <Field label="Address" name="address" placeholder="No. 12, Main St, Colombo" autoComplete="street-address" />
              <Field label="Phone Number" name="phone" placeholder="0771234567" type="tel" />
            </div>
          </Section>

          {/* OFFICIAL */}
          <Section title="Official Information" icon="🏅">
            <div style={styles.grid}>
              <Field label="Badge ID" name="badgeId" placeholder="e.g. SLP-00432" />
              <Field label="Rank" name="rank">
                <select name="rank" value={form.rank} onChange={handleChange} required
                  style={{ ...styles.input, ...(errors.rank ? styles.inputError : {}) }}>
                  <option value="">Select Rank</option>
                  {["Inspector General", "Deputy Inspector General", "Senior Superintendent",
                    "Superintendent", "Chief Inspector", "Inspector",
                    "Sub Inspector", "Sergeant", "Corporal", "Constable"].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.rank && <span style={styles.errorMsg}>{errors.rank}</span>}
              </Field>
              <Field label="Station" name="station" placeholder="e.g. Colombo Fort" />
              <Field label="Division" name="division" placeholder="e.g. Central Division" />
            </div>
          </Section>

          {/* SYSTEM */}
          <Section title="System Credentials" icon="🔐">
            <div style={styles.grid}>
              <Field label="Username" name="username" placeholder="e.g. k.perera" autoComplete="new-password" />
              <Field label="Password" name="password" type="password" placeholder="Min. 8 characters" autoComplete="new-password" />
              <Field label="Email Address" name="email" type="email" placeholder="officer@police.lk" />
            </div>
          </Section>

          {/* OTHER */}
          <Section title="Other Information" icon="📋">
            <div style={styles.grid}>
              <Field label="District" name="district">
                <select name="district" value={form.district} onChange={handleChange} required
                  style={{ ...styles.input, ...(errors.district ? styles.inputError : {}) }}>
                  <option value="">Select District</option>
                  {["Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
                    "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
                    "Mullaitivu", "Vavuniya", "Puttalam", "Kurunegala", "Anuradhapura",
                    "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle",
                    "Ampara", "Batticaloa", "Trincomalee"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <span style={styles.errorMsg}>{errors.district}</span>}
              </Field>
              <Field label="Status" name="status">
                <select name="status" value={form.status} onChange={handleChange} required
                  style={{ ...styles.input, ...(errors.status ? styles.inputError : {}) }}>
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Retired">Retired</option>
                </select>
                {errors.status && <span style={styles.errorMsg}>{errors.status}</span>}
              </Field>
            </div>
          </Section>

          <button type="submit" style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }} disabled={loading}>
            {loading ? (
              <span>⏳ Registering Officer...</span>
            ) : (
              <span>✅ Register Officer</span>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

/* Sub-component: Section wrapper */
function Section({ title, icon, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>
        <span style={styles.sectionIcon}>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "14px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    maxWidth: "360px",
  },
  toastSuccess: {
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
  toastError: {
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    height: "fit-content",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
  },
  badge: {
    fontSize: "40px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "8px 0 4px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  section: {
    marginBottom: "20px",
    padding: "18px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  sectionIcon: {
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  fieldWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "13px",
    background: "#fff",
    color: "#0f172a",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  inputError: {
    border: "1px solid #f87171",
    background: "#fff7f7",
  },
  errorMsg: {
    fontSize: "11px",
    color: "#dc2626",
    marginTop: "2px",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "12px",
    letterSpacing: "0.5px",
    transition: "background 0.2s",
  },
  buttonDisabled: {
    background: "#93c5fd",
    cursor: "not-allowed",
  },
};

export default OfficerRegister;
