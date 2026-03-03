import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function Login() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simular llamada a API para Login usando LocalStorage
        setTimeout(() => {
            const usersStr = localStorage.getItem("secaudit_users");
            const users = usersStr ? JSON.parse(usersStr) : [];

            // Check hardcoded admin or registered user
            const registeredUser = users.find(u => u.email === email && u.password === password);
            if ((email === "admin@secaudit.local" && password === "admin") || registeredUser) {
                // Éxito
                localStorage.setItem("token", "fake-jwt-token-123");
                localStorage.setItem("current_user", JSON.stringify(registeredUser || { name: "Security Admin", email: "admin@secaudit.local" }));
                navigate("/");
            } else {
                setError("Credenciales incorrectas.");
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-md bg-[#161b27] border border-white/5 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <Shield size={28} className="text-cyan-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2">Iniciar Sesión</h2>
                <p className="text-sm text-gray-400 text-center mb-8">Accede al panel de SecAudit</p>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="admin@secaudit.local"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs my-2">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
                            <input type="checkbox" className="rounded border-white/20 bg-transparent text-cyan-500 focus:ring-0 focus:ring-offset-0" />
                            Recordarme
                        </label>
                        <Link to="/forgot-password" className="text-cyan-400 hover:text-cyan-300 transition-colors">¿Olvidaste tu contraseña?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors mt-6"
                    >
                        {loading ? "Autenticando..." : "Ingresar"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    ¿No tienes cuenta? <Link to="/register" className="text-cyan-400 hover:underline">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}
