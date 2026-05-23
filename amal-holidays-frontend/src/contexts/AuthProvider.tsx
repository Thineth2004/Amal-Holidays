import React, { useState, useEffect, useMemo, useCallback, type ReactNode } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";
import type { User } from "../types/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  // Initialize auth from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        toast.error("Session data is corrupted. Please log in again.");
        // Clear corrupted data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          setToken(null);
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
      try {
          // Destructuring updated to accept 'user' from backend payload
          const response = await api.post("/auth/login", { email, password });
          const { token: newToken, user: loggedInUser } = response.data;

          if (!newToken || !loggedInUser) {
              throw new Error("Invalid response format from server.");
          }

          localStorage.setItem("token", newToken);
          localStorage.setItem("user", JSON.stringify(loggedInUser));

          setToken(newToken);
          setUser(loggedInUser);
      } catch (error: unknown) {
          const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Login failed. Please try again.";
          throw new Error(message, { cause: error });
      }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: string) => {
      try {
          await api.post("/auth/register", { name, email, password, role });
      } catch (error: unknown) {
          const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Registration failed. Please try again.";
          throw new Error(message, { cause: error });
      }
  }, []);

  const contextValue = useMemo(() => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!token
  }), [user, token, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};