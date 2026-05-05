import { useEffect, useState } from 'react';
import {
  loginUser,
  registerUser,
  setAuthToken,
} from '../services/api';
import { AuthContext } from './authContext';

const STORAGE_KEY = 'quickserve_user';

function getStoredUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    if (user?.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setAuthToken(user.token);
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
  }, [user]);

  const login = async (credentials) => {
    const loggedInUser = await loginUser(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (details) => {
    const createdUser = await registerUser(details);
    setUser(createdUser);
    return createdUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        register,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
