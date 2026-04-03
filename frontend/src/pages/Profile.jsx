import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usersAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./Profile.css";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  
  const [form, setForm] = useState({
    name: user?.name || "",
    department: user?.department || "",
  });
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await usersAPI.uploadProfileImage(formData);
      await refreshUser();
      showToast("Profile image updated successfully!");
    } catch (err) {
      showToast("Failed to upload image. Please try again.", "error");
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersAPI.updateProfile(form);
      await refreshUser();
      showToast("Profile details updated successfully!");
    } catch (err) {
      showToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="My Profile" />
        <div className="page-container">
          
          <div className="page-header">
            <h2 className="page-title">Profile Settings</h2>
            <p className="page-subtitle">Manage your account details and profile picture.</p>
          </div>

          {toast.msg && (
            <div className={`alert alert-${toast.type} mb-md animate-fade-in`}>
              <span className="material-icons-round">
                {toast.type === "error" ? "error_outline" : "check_circle"}
              </span>
              {toast.msg}
            </div>
          )}

          <div className="card profile-card animate-scale-in">
            <div className="profile-image-section">
              <div className="profile-avatar-wrapper">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="profile-avatar-img" />
                ) : (
                  <div className="avatar avatar-xxl">{initials}</div>
                )}
                
                <label className="profile-upload-btn" title="Upload new photo">
                  {uploading ? (
                    <span className="spinner spinner-sm light" />
                  ) : (
                    <span className="material-icons-round">photo_camera</span>
                  )}
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleImageUpload} 
                    disabled={uploading} 
                    style={{ display: "none" }} 
                  />
                </label>
              </div>
              <div className="profile-meta">
                <h3 className="profile-name">{user?.name}</h3>
                <p className="profile-role text-muted">{user?.role} · {user?.department}</p>
                <div className="badges-inline mt-sm">
                  <span className="badge badge-gold"><span className="material-icons-round" style={{fontSize: '14px', marginRight: '4px'}}>stars</span>{user?.points} pts</span>
                  <span className="badge badge-secondary">{user?.badges?.length || 0} Badges</span>
                </div>
              </div>
            </div>

            <hr className="divider" />

            <form className="admin-form" onSubmit={handleSaveDetails}>
              <h3 className="section-title mb-md">Personal Information</h3>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  className="form-input" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Locked)</label>
                <input 
                  className="form-input" 
                  value={user?.email} 
                  disabled 
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select 
                  className="form-select" 
                  value={form.department} 
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  {["Engineering", "Design", "Marketing", "HR", "Finance", "Operations", "All"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">System Role (Locked)</label>
                <input className="form-input" value={user?.role} disabled style={{ opacity: 0.7 }} />
              </div>

              <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner spinner-sm" /> : <span className="material-icons-round">save</span>}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
