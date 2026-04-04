import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../lib/authApi';
import { setAccessToken, clearAccessToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // On mount: try to restore session via silent refresh (cookie is sent automatically)
  const initializeAuth = useCallback(async () => {
    try {
      // Try to get a new access token using the refresh cookie
      const { data: tokenData } = await authApi.refreshToken();
      setAccessToken(tokenData.access_token);

      // Now fetch user profile with the fresh access token
      const { data: userData } = await authApi.getMe();
      setUser(userData);
    } catch {
      // No valid refresh cookie → user is not logged in
      clearAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email, password) => {
    const { data } = await authApi.login(email, password);
    // Backend set the refresh cookie; store access token in memory
    setAccessToken(data.access_token);
    // Fetch user profile
    const { data: userData } = await authApi.getMe();
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const { data } = await authApi.register(formData);
    // Backend set the refresh cookie; store access token in memory
    setAccessToken(data.access_token);
    const { data: userData } = await authApi.getMe();
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if logout API fails, clear local state
    }
    clearAccessToken();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await authApi.getMe();
      setUser(data);
    } catch {
      // Silently fail
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
