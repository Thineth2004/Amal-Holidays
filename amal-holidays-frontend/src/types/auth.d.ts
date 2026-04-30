export interface User {
    user_id: number;
    name: string;
    email: string;
    role: "Manager" | "Staff" | "Guide" | "Tourist" | "Driver";
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export interface LoginResponse {
    message: string;
    token: string;
    safeUser: User;
}
