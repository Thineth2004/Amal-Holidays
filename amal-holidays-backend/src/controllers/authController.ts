import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await registerUser(name, email, password, role);

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

        const { safeUser, token } = await loginUser(email, password);

        res.json({
            message: "Login successful",
            token,
            safeUser,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};