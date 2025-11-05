import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function AllCourses({ searchTerm = "" }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // decode token to get user info
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in first");

      // ✅ correct route
      await api.post(`/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Successfully enrolled!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll");
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCardColor = (id) => {
    const colors = [
      "#fee2e2", "#fef3c7", "#dcfce7", "#dbeafe",
      "#ede9fe", "#fce7f3", "#cffafe", "#f3e8ff"
    ];
    const index = id.charCodeAt(id.length - 1) % colors.length;
    return colors[index];
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff, #e0e7ff)",
        padding: "40px 20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>All Courses</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map((c) => (
            <div
              key={c._id}
              style={{
                background: getCardColor(c._id),
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                padding: "20px",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={{ marginBottom: 8, color: "#1e293b" }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>
                {c.description?.slice(0, 80)}...
              </p>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 12 }}>
                Instructor: {c.instructor?.name || c.instructor?.email || "Unknown"}
              </div>

              {user?.role === "user" && (
                <button
                  onClick={() => handleEnroll(c._id)}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Enroll
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No courses found.</p>
        )}
      </div>
    </div>
  );
}
