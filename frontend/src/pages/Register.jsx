import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function Register() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simular carga de registro y persistencia local para validarlo en Login
        setTimeout(() => {
            const usersStr = localStorage.getItem("secaudit_users");
            const users = usersStr ? JSON.parse(usersStr) : [];
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem("secaudit_users", JSON.stringify(users));

            localStorage.setItem("token", "fake-jwt-token-registered");
            // Set as current fake user (for testing)
            localStorage.setItem("current_user", JSON.stringify(newUser));
            navigate("/login");
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

                <h2 className="text-2xl font-bold text-center mb-2">Crear Cuenta</h2>
                <p className="text-sm text-gray-400 text-center mb-8">Únete a SecAudit</p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre Completo</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="Tu nombre"
                            />
                        </div>
                    </div>
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
                                placeholder="email@ejemplo.com"
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
                                minLength={8}
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
                        <p className="text-[10px] text-gray-500 mt-2">La contraseña debe tener al menos 8 caracteres</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors mt-6"
                    >
                        {loading ? "Creando..." : "Registrarse"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-cyan-400 hover:underline">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}
