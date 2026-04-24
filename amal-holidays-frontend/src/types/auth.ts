export interface User {
    id: string;
    email: string;
    role: "Manager" | "Tourist" | "Guide" | "Driver" | "Staff";
    name: String;
}

export interface AuthContextType {
    user: User | null;
    login: (data: { user: User; token: string }) => void;
}