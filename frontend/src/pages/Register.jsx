import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api";
import { useTheme } from "../context/ThemeContext";
import "./Login.css"; // Reuse login styles

export default function Register() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "Engineering", role: "employee" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authAPI.register(form);
      // Registration successful, redirect to login
      navigate("/login", { state: { message: "Account created successfully. Please sign in." } });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />

      {/* Theme toggle — top right */}
      <button className="login-theme-toggle" onClick={toggleTheme} title="Toggle theme">
        <span className="material-icons-round">
          {theme === "dark" ? "light_mode" : "dark_mode"}
        </span>
      </button>

      <div className="login-container animate-scale-in">
        {/* Brand */}
        <div className="login-brand">
          <span className="material-icons-round login-brand-icon">bolt</span>
          <h1 className="login-brand-name">ElevateX</h1>
        </div>
        <p className="login-tagline">Create your employee account.</p>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              <span className="material-icons-round">error_outline</span>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="login-input-wrap">
              <span className="material-icons-round login-input-icon">person</span>
              <input
                type="text"
                className="form-input login-input"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="login-input-wrap">
              <span className="material-icons-round login-input-icon">mail</span>
              <input
                type="email"
                className="form-input login-input"
                placeholder="you@elevatex.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="login-input-wrap">
              <span className="material-icons-round login-input-icon">lock</span>
              <input
                type="password"
                className="form-input login-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
          </div>
          
          <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)"}}>
            <div>
              <label className="form-label">Department</label>
              <select className="form-select login-input" style={{paddingLeft: "var(--space-md)"}} value={form.department} onChange={(e) => setForm({...form, department: e.target.value})}>
                 {["Engineering","Design","Marketing","HR","Finance","Operations"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Role</label>
              <select className="form-select login-input" style={{paddingLeft: "var(--space-md)"}} value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                 <option value="employee">Employee</option>
                 <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading} style={{ marginTop: "var(--space-md)"}}>
            {loading ? <span className="spinner spinner-sm" /> : <span className="material-icons-round">person_add</span>}
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          
          <div style={{ textAlign: "center", marginTop: "var(--space-md)" }}>
             <p className="text-sm text-muted">
               Already have an account? <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Sign in</Link>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
}
