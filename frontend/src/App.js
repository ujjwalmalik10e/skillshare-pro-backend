// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AllCourses from "./pages/AllCourses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCourses from "./pages/admin/ManageCourses";

function App() {
  const [user, setUser] = useState(null);

  // Load user from token on initial render
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    alert("Logged out");
  };

  return (
    <Router>
      {/* Navbar */}
      <nav
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#0a2752ff",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              style={{ marginRight: 15, color: "white", textDecoration: "none" }}
            >
              Admin Dashboard
            </Link>
          )}

          <Link to="/" style={{ marginRight: 15, color: "white", textDecoration: "none" }}>
            All Courses
          </Link>

          {user?.role === "instructor" && (
            <Link to="/instructor" style={{ marginRight: 15, color: "white", textDecoration: "none" }}>
              Instructor
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" style={{ marginRight: 15, color: "white", textDecoration: "none" }}>
                Login
              </Link>
              <Link to="/register" style={{ marginRight: 15, color: "white", textDecoration: "none" }}>
                Register
              </Link>
            </>
          )}
        </div>

        <div>
          {user && (
            <span style={{ marginRight: 15 }}>
              Role: <strong>{user.role}</strong>
            </span>
          )}
          {user && (
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "white",
                color: "#0d6efd",
                border: "none",
                borderRadius: "4px",
                padding: "6px 10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Page content */}
      <div style={{ padding: 20 }}>
        {user && (
          <h2 style={{ color: "#333", marginBottom: "20px" }}>
            Hello, {user.name || user.email}
          </h2>
        )}

        <Routes>
          <Route path="/" element={<AllCourses />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-courses" element={<ManageCourses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
