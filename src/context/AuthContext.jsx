import { createContext, useContext, useState, useEffect } from 'react';
import { 
  isAuthenticated as checkAuth, 
  fetchCurrentUser, 
  getCurrentUser,
  clearTokens,
  clearCurrentUser 
} from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const storedUser = getCurrentUser();
      const authed = checkAuth();
      
      if (storedUser && authed) {
        setUser(storedUser);
        setIsAuthenticated(true);
        
        // Verify token is still valid by fetching current user
        const freshUser = await fetchCurrentUser();
        if (freshUser) {
          setUser(freshUser);
        } else {
          // Token is invalid, clear everything
          clearTokens();
          clearCurrentUser();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else if (authed) {
        // Has token but no stored user, try to fetch
        const freshUser = await fetchCurrentUser();
        if (freshUser) {
          setUser(freshUser);
          setIsAuthenticated(true);
        } else {
          clearTokens();
          clearCurrentUser();
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    }

    loadUser();
  }, []);

  const login = async (username, password) => {
    const { login: apiLogin } = await import('../utils/auth');
    const result = await apiLogin(username, password);
    
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    
    return result;
  };

  const signup = async (username, email, password, password2, role) => {
    const { signup: apiSignup } = await import('../utils/auth');
    const result = await apiSignup(username, email, password, password2, role);
    
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    
    return result;
  };

  const logout = async () => {
    const { logout: apiLogout } = await import('../utils/auth');
    await apiLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    const freshUser = await fetchCurrentUser();
    if (freshUser) {
      setUser(freshUser);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      signup, 
      logout,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}