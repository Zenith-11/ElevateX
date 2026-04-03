import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Dashboard  from "./pages/Dashboard";
import Events from "./pages/Events";
import Progress   from "./pages/Progress";
import Submit     from "./pages/Submit";
import Wallet     from "./pages/Wallet";
import Leaderboard from "./pages/Leaderboard";
import Admin      from "./pages/Admin";
import Analytics  from "./pages/Analytics";
import Manager    from "./pages/Manager";
import Profile    from "./pages/Profile";

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /><p className="text-muted">Loading...</p></div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function EmployeeRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /><p className="text-muted">Loading...</p></div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (user.role === "admin")   return <Navigate to="/admin" replace />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /><p className="text-muted">Loading...</p></div>;

  const defaultHome = user?.role === "admin" ? "/admin" : user?.role === "manager" ? "/manager" : "/dashboard";

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={defaultHome} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={defaultHome} replace /> : <Register />} />

      {/* Employee-only routes */}
      <Route path="/dashboard"   element={<EmployeeRoute><Dashboard /></EmployeeRoute>} />
      <Route path="/progress"    element={<EmployeeRoute><Progress /></EmployeeRoute>} />
      <Route path="/submit"      element={<EmployeeRoute><Submit /></EmployeeRoute>} />
      <Route path="/wallet"      element={<EmployeeRoute><Wallet /></EmployeeRoute>} />

      {/* Shared (all authenticated) */}
      <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Manager + Admin */}
      <Route path="/analytics" element={<ProtectedRoute roles={["admin","manager"]}><Analytics /></ProtectedRoute>} />
      <Route path="/manager"   element={<ProtectedRoute roles={["admin","manager"]}><Manager /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={user ? defaultHome : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
