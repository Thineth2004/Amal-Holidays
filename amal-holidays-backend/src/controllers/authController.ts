import { Request, Response } from "express";
import { registerUser, loginUser, staffManagerLoginUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const lowercaseEmail = email.toLowerCase();

        const user = await registerUser(name, lowercaseEmail, password, role);

        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const lowercaseEmail = email.toLowerCase();

        const { safeUser, token } = await loginUser(lowercaseEmail, password);

        res.json({
            message: "Login successful",
            token,
            user: safeUser,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const staffManagerLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const lowercaseEmail = email.toLowerCase();

        const { safeUser, token } = await staffManagerLoginUser(lowercaseEmail, password);

        res.json({
            message: "Login successful",
            token,
            user: safeUser, 
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};