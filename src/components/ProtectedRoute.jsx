import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole) {
    const userRole = user?.is_instructor ? 'instructor' : 'student';
    if (userRole !== allowedRole) {
      // Redirect to their proper dashboard
      if (user?.is_instructor) {
        return <Navigate to="/instructor/dashboard" replace />;
      } else {
        return <Navigate to="/student/dashboard" replace />;
      }
    }
  }

  return children;
}

export default ProtectedRoute;