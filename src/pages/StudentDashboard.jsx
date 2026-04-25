import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAccessToken } from "../utils/auth";
import "../assets/css/StudentDashboard.css";  

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function StudentDashboard() {
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
        <div className="minimal-spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="error-svg">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Connection Failed</h3>
        <p className="error-text">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  const coursesCount = dashboardData?.courses?.length || 0;
  const assignmentsCount = dashboardData?.assignments?.length || 0;
  const progressVal = dashboardData?.progress || 0;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-brand">
            <div className="brand-dot"></div>
            LMS Platform
          </div>

          <nav className="sidebar-nav">
            <a href="#" className="nav-item active">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Overview
            </a>
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              My Courses
            </a>
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Assignments
            </a>
          </nav>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="main-topbar">
          <div className="topbar-welcome">
            <h1>Welcome back, {user?.username}</h1>
            <p>Here's what's happening with your learning journey today.</p>
          </div>
        </header>

        {/* Top KPI Metrics */}
        <div className="dashboard-metrics">
          <div className="metric-box">
            <div className="metric-icon-wrap bg-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div className="metric-info">
              <span className="metric-value">{coursesCount}</span>
              <span className="metric-label">Enrolled Courses</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap bg-rose">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="metric-info">
              <span className="metric-value">{assignmentsCount}</span>
              <span className="metric-label">Pending Assignments</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap bg-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="metric-info">
              <span className="metric-value">{progressVal}%</span>
              <span className="metric-label">Overall Progress</span>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="dashboard-grid">
          
          {/* Left Column (Courses + Progress) */}
          <div className="left-column-layout">
            <div className="dash-card">
              <div className="card-top">
                <h3>My Courses</h3>
                <button className="card-action">View All</button>
              </div>
              
              {coursesCount > 0 ? (
                <ul className="minimal-list">
                  {dashboardData.courses.map((course) => (
                    <li key={course.id} className="minimal-list-item">
                      <div className="item-left">
                        <div className="item-icon-box">🎓</div>
                        <span className="item-title">{course.name}</span>
                      </div>
                      <span className="item-status-pill pill-active">Enrolled</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-minimal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  <span>No courses enrolled yet.</span>
                </div>
              )}
            </div>

            <div className="dash-card">
              <div className="card-top">
                <h3>Learning Progress</h3>
              </div>
              <div className="progress-center">
                <div className="progress-circle-wrap">
                  <svg viewBox="0 0 100 100">
                    <circle className="prog-bg" cx="50" cy="50" r="45"></circle>
                    <circle 
                      className="prog-fill" 
                      cx="50" cy="50" r="45" 
                      strokeDasharray={`${progressVal * 2.83} 283`}
                    ></circle>
                  </svg>
                  <div className="prog-text-inner">
                    <span className="prog-pct">{progressVal}%</span>
                    <span className="prog-lbl">Done</span>
                  </div>
                </div>
                <p className="progress-msg">
                  {progressVal >= 80 ? "Stellar work! You're almost through your curriculum. Keep pushing!" 
                  : progressVal >= 50 ? "Solid effort. You've passed the halfway mark!" 
                  : "Every journey begins with a single step. Keep going!"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (Assignments) */}
          <div className="dash-card">
            <div className="card-top">
              <h3>To-Do Assignments</h3>
            </div>
            
            {assignmentsCount > 0 ? (
              <ul className="minimal-list">
                {dashboardData.assignments.map((assignment) => (
                  <li key={assignment.id} className="minimal-list-item compact-list-item">
                    <div className="item-left">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="assignment-icon-svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span className="item-title assignment-title-text">{assignment.title}</span>
                    </div>
                    <span className="item-status-pill pill-pending">Pending</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-minimal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>You're all caught up!</span>
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}