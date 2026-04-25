import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CommonSelect from "../components/CommonSelect";
import "../assets/css/Login.css";
export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signup(
        formData.username,
        formData.email,
        formData.password,
        formData.password2,
        formData.role
      );

      if (result.success) {
        // Redirect based on role
        if (result.user.is_instructor) {
          navigate("/instructor/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        // Show backend validation errors
        const errors = result.data;
        if (errors) {
          const errorMessages = [];
          for (const [key, value] of Object.entries(errors)) {
            if (Array.isArray(value)) {
              errorMessages.push(`${key}: ${value.join(", ")}`);
            } else {
              errorMessages.push(`${key}: ${value}`);
            }
          }
          setError(errorMessages.join("\n"));
        } else {
          setError("Signup failed. Please try again.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-edge-split">
      {/* Left Canvas */}
      <div className="login-canvas-panel">
        <div className="canvas-background-pattern"></div>
        <div className="canvas-content">
          <div className="brand-logo">
            <div className="logo-dot"></div>
            LMS Platform
          </div>
          <h1>Join us and empower your future today.</h1>
          <div className="quote-box">
            "This platform changed the way I learn. It's incredibly intuitive and rich with features."
            <div className="quote-author">— Mark T., Student</div>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="login-minimal-form-shell signup-shell">
        <div className="minimal-form-container signup-container">
          <div className="login-header-minimal signup-header">
            <h2>Create Account</h2>
            <p>Start your learning journey with us.</p>
          </div>

          {error && (
            <div className="login-alert-error signup-alert">
               <span style={{marginRight: '0.5rem'}}>⚠️</span> 
               <span style={{ whiteSpace: 'pre-wrap' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="minimal-input-group signup-input">
              <label htmlFor="username" className="minimal-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="minimal-input"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="minimal-input-group signup-input">
              <label htmlFor="email" className="minimal-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="minimal-input"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="minimal-input-group signup-input">
              <label htmlFor="password" className="minimal-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="minimal-input pe-10"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="minimal-input-group signup-input">
              <label htmlFor="password2" className="minimal-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password2"
                  name="password2"
                  className="minimal-input pe-10"
                  placeholder="Confirm password"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-icon-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="minimal-input-group signup-input-last">
              <label htmlFor="role" className="minimal-label">Role</label>
              <CommonSelect
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'instructor', label: 'Instructor' }
                ]}
              />
            </div>

            <button type="submit" disabled={loading} className="minimal-btn">
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="minimal-footer signup-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}