import { createContext, useState, useEffect, useCallback } from 'react';
import { registerApi, loginApi, getMeApi } from '../services/authApi';
import { saveAuth, clearAuth, getStoredToken, getStoredUser } from '../services/authService';
import { connectSocket, disconnectSocket } from '../services/socketService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(!!getStoredToken());

  useEffect(() => {
    if (token) {
      getMeApi()
        .then((res) => setUser(res.data.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    }
    return () => disconnectSocket();
  }, [user?._id]);

  const register = useCallback(async (formData) => {
    const res = await registerApi(formData);
    const { token: t, user: u } = res.data.data;
    saveAuth(t, u);
    setToken(t);
    setUser(u);
    toast.success('Welcome to CricConnect!');
    return u;
  }, []);

  const login = useCallback(async (formData) => {
    const res = await loginApi(formData);
    const { token: t, user: u } = res.data.data;
    saveAuth(t, u);
    setToken(t);
    setUser(u);
    toast.success(`Welcome back, ${u.name}!`);
    return u;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    disconnectSocket();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
