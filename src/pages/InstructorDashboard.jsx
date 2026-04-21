import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAccessToken } from "../utils/auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function InstructorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      const token = getAccessToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/instructor/dashboard/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            await logout();
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch dashboard");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [navigate, logout]);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="user-info">
        <p>
          <strong>Welcome,</strong> {user?.username}!
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>

      {dashboardData && (
        <div className="dashboard-content">
          <div className="card">
            <h3>My Courses</h3>
            {dashboardData.courses && dashboardData.courses.length > 0 ? (
              <ul>
                {dashboardData.courses.map((course) => (
                  <li key={course.id}>{course.name}</li>
                ))}
              </ul>
            ) : (
              <p>No courses created yet.</p>
            )}
          </div>

          <div className="card">
            <h3>Students</h3>
            <p>Total Students: {dashboardData.total_students || 0}</p>
          </div>

          <div className="card">
            <h3>Assignments</h3>
            {dashboardData.assignments && dashboardData.assignments.length > 0 ? (
              <ul>
                {dashboardData.assignments.map((assignment) => (
                  <li key={assignment.id}>{assignment.title}</li>
                ))}
              </ul>
            ) : (
              <p>No assignments created yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;