import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const successMessage = location.state?.message;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : user.role === "manager" ? "/manager" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Check credentials.");
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
        <p className="login-tagline">Your engagement. Rewarded.</p>


        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {successMessage && !error && (
            <div className="alert alert-success">
              <span className="material-icons-round">check_circle</span>
              {successMessage}
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <span className="material-icons-round">error_outline</span>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="login-input-wrap">
              <span className="material-icons-round login-input-icon">mail</span>
              <input
                type="email"
                className="form-input login-input"
                placeholder="you@company.com"
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
              />
            </div>
          </div>
          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
            {loading ? <span className="spinner spinner-sm" /> : <span className="material-icons-round">login</span>}
            {loading ? "Signing in..." : "Sign In"}
          </button>
          
          <div style={{ textAlign: "center", marginTop: "var(--space-md)" }}>
             <p className="text-sm text-muted">
               Don't have an account? <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Sign up</Link>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
}
