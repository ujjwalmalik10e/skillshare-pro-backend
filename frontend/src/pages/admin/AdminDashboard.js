// src/pages/admin/AdminDashboard.js
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // no token — redirect to login
      console.warn("AdminDashboard: no token found");
      navigate("/login");
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Malformed token");
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));

      if (!decoded || decoded.role !== "admin") {
        console.warn("AdminDashboard: not an admin", decoded);
        navigate("/");
        return;
      }

      setAdmin(decoded);
    } catch (err) {
      console.error("AdminDashboard: token parse error", err);
      navigate("/login");
    }
  }, [navigate]);

  // If still loading / validating, show nothing (or a small loader)
  if (!admin) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ marginBottom: 8 }}>Welcome, {admin.name || "Admin"}</h1>
      <p style={{ color: "#555", marginTop: 0 }}>Role: <strong>{admin.role}</strong></p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "40px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/admin/manage-users"
          style={{
            background: "#004aad",
            color: "white",
            padding: "20px 36px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "600",
            display: "inline-block",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Manage Users
        </Link>

        <Link
          to="/admin/manage-courses"
          style={{
            background: "#1a6ca9",
            color: "white",
            padding: "20px 36px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "600",
            display: "inline-block",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Manage Courses
        </Link>
      </div>
    </div>
  );
}
