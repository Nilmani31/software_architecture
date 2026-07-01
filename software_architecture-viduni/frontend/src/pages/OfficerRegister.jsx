import { useState } from "react";
import api from "../services/api";

/* ================= INITIAL FORM ================= */
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

/* ================= FIXED FIELD (OUTSIDE COMPONENT) ================= */
function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete = "off",
  value,
  onChange,
  error,
  children,
}) {
  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>{label}</label>

      {children ?? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            ...styles.input,
            ...(error ? styles.inputError : {}),
          }}
        />
      )}

      {error && <span style={styles.errorMsg}>{error}</span>}
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
function OfficerRegister() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  /* ================= VALIDATION ================= */
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

  /* ================= FIXED HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("error", "Please fix errors.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/officer/register", form);
      showToast("success", "Officer registered successfully.");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed.";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {toast && (
        <div
          style={{
            ...styles.toast,
            ...(toast.type === "success"
              ? styles.toastSuccess
              : styles.toastError),
          }}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>👮</span>
          <h2 style={styles.title}>Police Officer Registration</h2>
          <p style={styles.subtitle}>
            Fill in all required fields to register a new officer.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* PERSONAL */}
          <Section title="Personal Information" icon="🪪">
            <div style={styles.grid}>
              <Field
                label="Full Name"
                name="fullName"
                placeholder="e.g. Kamal Perera"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />

              <Field
                label="NIC Number"
                name="nic"
                placeholder="e.g. 199012345678"
                value={form.nic}
                onChange={handleChange}
                error={errors.nic}
              />

              <Field
                label="Date of Birth"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                error={errors.dob}
              />

              <Field label="Gender" name="gender" error={errors.gender}>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Field>

              <Field
                label="Address"
                name="address"
                placeholder="No. 12, Main St, Colombo"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
              />

              <Field
                label="Phone Number"
                name="phone"
                placeholder="0771234567"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </div>
          </Section>

          {/* OFFICIAL */}
          <Section title="Official Information" icon="🏅">
            <div style={styles.grid}>
              <Field
                label="Badge ID"
                name="badgeId"
                value={form.badgeId}
                onChange={handleChange}
                error={errors.badgeId}
              />

              <Field label="Rank" name="rank" error={errors.rank}>
                <select
                  name="rank"
                  value={form.rank}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select Rank</option>
                  <option value="Inspector">Inspector</option>
                  <option value="Sergeant">Sergeant</option>
                  <option value="Constable">Constable</option>
                </select>
              </Field>

              <Field
                label="Station"
                name="station"
                value={form.station}
                onChange={handleChange}
                error={errors.station}
              />

              <Field
                label="Division"
                name="division"
                value={form.division}
                onChange={handleChange}
                error={errors.division}
              />
            </div>
          </Section>

          {/* SYSTEM */}
          <Section title="System Credentials" icon="🔐">
            <div style={styles.grid}>
              <Field
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                error={errors.username}
              />

              <Field
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
          </Section>

          {/* OTHER */}
          <Section title="Other Information" icon="📋">
            <div style={styles.grid}>
              <Field label="District" name="district" error={errors.district}>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select District</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                </select>
              </Field>

              <Field label="Status" name="status" error={errors.status}>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>
            </div>
          </Section>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? "⏳ Registering..." : "✅ Register Officer"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= SECTION ================= */
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

/* ================= STYLES (UNCHANGED) ================= */
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
  },
  toastSuccess: { background: "#f0fdf4", color: "#166534" },
  toastError: { background: "#fef2f2", color: "#991b1b" },

  card: {
    width: "100%",
    maxWidth: "900px",
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
  },

  header: { textAlign: "center", marginBottom: "28px" },
  badge: { fontSize: "40px" },
  title: { fontSize: "22px", fontWeight: "700" },
  subtitle: { fontSize: "13px", color: "#64748b" },

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
    textTransform: "uppercase",
    marginBottom: "14px",
    display: "flex",
    gap: "6px",
  },

  sectionIcon: { fontSize: "14px" },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  fieldWrapper: { display: "flex", flexDirection: "column", gap: "4px" },

  label: { fontSize: "12px", fontWeight: "600" },

  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "13px",
    width: "100%",
  },

  inputError: { border: "1px solid #f87171" },

  errorMsg: { fontSize: "11px", color: "#dc2626" },

  button: {
    width: "100%",
    padding: "14px",
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
  },

  buttonDisabled: { background: "#93c5fd" },
};

export default OfficerRegister;