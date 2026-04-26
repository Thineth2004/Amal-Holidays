import { createContext, useState, useContext, type ReactNode } from "react";
import type { User, AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(() => {
        console.log("Checking localStorage...");
        const saved = localStorage.getItem("user");
        if (!saved || saved === "undefined") return null;
        try {
            return JSON.parse(saved);
        } catch {
            return null;
        }
    });

    const login = (data: { user: User; token:string }) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider  value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider!");
    return context;
}