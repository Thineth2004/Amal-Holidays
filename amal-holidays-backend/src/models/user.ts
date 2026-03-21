export interface User {
    user_id: number;
    name: string;
    email: string;
    password: string;
    role: "Manager" | "Staff" | "Guide" | "Tourist" | "Driver";
    created_at?: Date;
}