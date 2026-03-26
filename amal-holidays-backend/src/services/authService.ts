import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../repositories/userRepository";

export const registerUser = async (
    name: string,
    email: string,
    password: string,
    role: string
) => {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("User already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(name, email, hashedPassword, role);

    const { password: _, ...safeUser } = user;

    return safeUser;
};

export const loginUser =  async (email: string, password: string) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    const { password: _, ...safeUser } = user;

    return { safeUser, token };
};
