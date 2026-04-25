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

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
        <div className="flex h-screen w-full font-sans">
            {/* LEFT SIDE */}
            <div
                className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage:
                    "url('https://images.unsplash.com/photo-1720945489949-2323f3f2f8bc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
                }}
            >
                <div className="absolute inset-0 bg-sky-900/30 backdrop-blur-[1px]"></div>
                <div className="relative z-10 p-12 self-end text-white">
                    <h1 className="text-5xl font-bold mb-4">Amal Holidays</h1>
                    <p className="text-xl text-sky-50 font-light italic">
                        "Your journey to the heart of Sri Lanka begins here."
                    </p>
                </div>
            </div>

            {/* LEFT SIDE */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">Log in to manage your adventures</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg text-sm border border-orange-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        </div>
                        <input
                            type="email"
                            placeholder="youremail@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}