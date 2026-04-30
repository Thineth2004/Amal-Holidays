import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "../api/axiosInstance";
import { User, AuthContextType, LoginResponse } from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post<LoginResponse>("/api/auth/login", { email, password });
            const { token, safeUser } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(safeUser));

            setToken(token);
            setUser(safeUser);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Login failed");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
