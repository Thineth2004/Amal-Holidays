import api from "../api/axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post("auth/login", { email, password });
            login(res.data);
            navigate("/dashboard");
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError("Invalid Email or Password. Please check again.");
            }
        }
    };

    return (
        <div className="flex h-screen justify-center items-center">
            Hello, I'm Thineth
        </div>
    );
}