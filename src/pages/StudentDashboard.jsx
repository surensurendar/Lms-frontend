import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAccessToken } from "../utils/auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function StudentDashboard() {
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
        const response = await fetch(`${API_BASE_URL}/student/dashboard/`, {
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
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Student Dashboard</h1>
          <span className="welcome-text">Welcome back, {user?.username}!</span>
        </div>
        <div className="header-right">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <span className="logout-icon">↪</span>
            Logout
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-courses">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-number">
              {dashboardData?.courses?.length || 0}
            </span>
            <span className="stat-label">Enrolled Courses</span>
          </div>
        </div>
        <div className="stat-card stat-assignments">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-number">
              {dashboardData?.assignments?.length || 0}
            </span>
            <span className="stat-label">Pending Assignments</span>
          </div>
        </div>
        <div className="stat-card stat-progress">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-number">
              {dashboardData?.progress || 0}%
            </span>
            <span className="stat-label">Overall Progress</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Courses Card */}
        <div className="content-card">
          <div className="card-header">
            <h3>📚 My Courses</h3>
            <span className="card-badge">{dashboardData?.courses?.length || 0}</span>
          </div>
          <div className="card-body">
            {dashboardData?.courses && dashboardData.courses.length > 0 ? (
              <ul className="item-list">
                {dashboardData.courses.map((course) => (
                  <li key={course.id} className="item-row">
                    <span className="item-icon">🎓</span>
                    <span className="item-name">{course.name}</span>
                    <span className="item-status">Enrolled</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📖</span>
                <p>No courses enrolled yet</p>
                <button className="btn-browse">Browse Courses</button>
              </div>
            )}
          </div>
        </div>

        {/* Assignments Card */}
        <div className="content-card">
          <div className="card-header">
            <h3>📝 Assignments</h3>
            <span className="card-badge warning">
              {dashboardData?.assignments?.length || 0}
            </span>
          </div>
          <div className="card-body">
            {dashboardData?.assignments && dashboardData.assignments.length > 0 ? (
              <ul className="item-list">
                {dashboardData.assignments.map((assignment) => (
                  <li key={assignment.id} className="item-row">
                    <span className="item-icon">📋</span>
                    <span className="item-name">{assignment.title}</span>
                    <span className="item-status pending">Pending</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">✅</span>
                <p>No pending assignments</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Card */}
        <div className="content-card progress-card">
          <div className="card-header">
            <h3>🎯 Learning Progress</h3>
          </div>
          <div className="card-body">
            <div className="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle
                  className="progress-bg"
                  cx="50"
                  cy="50"
                  r="45"
                />
                <circle
                  className="progress-fill"
                  cx="50"
                  cy="50"
                  r="45"
                  strokeDasharray={`${(dashboardData?.progress || 0) * 2.83} 283`}
                />
              </svg>
              <div className="progress-text">
                <span className="progress-value">
                  {dashboardData?.progress || 0}%
                </span>
                <span className="progress-label">Complete</span>
              </div>
            </div>
            <p className="progress-message">
              {dashboardData?.progress >= 80
                ? "Excellent progress! Keep it up! 🌟"
                : dashboardData?.progress >= 50
                ? "Good progress! You're on track! 💪"
                : "Keep going! You're making progress! 🚀"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;