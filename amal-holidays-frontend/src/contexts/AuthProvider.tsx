import React, { useState, useEffect, useMemo, useCallback, type ReactNode } from "react";
import api from "../api/axiosInstance";
import type { User, LoginResponse } from "../types/auth";
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
            const response = await api.post<LoginResponse>("/api/auth/login", { email, password });
            const { token: newToken, safeUser } = response.data;

            localStorage.setItem("token", newToken);
            localStorage.setItem("user", JSON.stringify(safeUser));

            setToken(newToken);
            setUser(safeUser);
        } catch (error: any) {
            const message = error.response?.data?.message || "Login failed. Please try again.";
            throw new Error(message, { cause: error });
        }
    }, []);

    const contextValue = useMemo(() => ({
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token
    }), [user, token, loading, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
