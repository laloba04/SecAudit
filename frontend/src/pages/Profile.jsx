import { useLanguage } from "../i18n/LanguageContext";
import { User, Mail, Save, Shield, Key, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function Profile() {
    const { t } = useLanguage();
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const currentUserStr = localStorage.getItem("current_user");
        if (currentUserStr) {
            const parsed = JSON.parse(currentUserStr);
            setUser(parsed);
            setName(parsed.name || "");
        } else {
            const defInfo = { name: "Security Admin", email: "admin@secaudit.local" };
            setUser(defInfo);
            setName("Security Admin");
        }
    }, []);

    const handleSave = () => {
        setError("");
        if (newPassword && !currentPassword) {
            setError("Debes ingresar tu contraseña actual para cambiarla.");
            return;
        }

        const usersStr = localStorage.getItem("secaudit_users");
        let users = usersStr ? JSON.parse(usersStr) : [];
        const userIndex = users.findIndex(u => u.email === user.email);

        let finalPassword = user.password;
        if (newPassword && currentPassword) {
            if (userIndex !== -1 && users[userIndex].password !== currentPassword) {
                setError("Contraseña actual incorrecta.");
                return;
            } else if (newPassword.length < 8) {
                setError("La nueva contraseña debe tener al menos 8 caracteres.");
                return;
            }
            finalPassword = newPassword;
        }

        const updatedUser = { ...user, name, password: finalPassword };
        setUser(updatedUser);

        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem("secaudit_users", JSON.stringify(users));
        }

        localStorage.setItem("current_user", JSON.stringify(updatedUser));
        setSaved(true);
        setCurrentPassword("");
        setNewPassword("");
        // Reload header component (page refresh for simplicity or just visual feedback)
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold mb-6">{t("myProfile") ?? "Mi Perfil"}</h2>

            <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden">
                <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center gap-2">
                    <User size={18} className="text-cyan-400" />
                    <h3 className="font-medium text-gray-200">Información Personal</h3>
                </div>
                <div className="p-6 space-y-5">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-3xl flex items-center justify-center border border-cyan-500/30">
                            {user.name ? user.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div>
                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white font-medium transition-colors border border-white/5">
                                Cambiar Avatar
                            </button>
                            <p className="text-xs text-gray-500 mt-2">JPG, GIF o PNG. Max 1MB.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">{t("fullName") ?? "Nombre Completo"}</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">{t("registeredEmail") ?? "Email Registrado"}</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="email" defaultValue={user.email} className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50" readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#161b27] border border-white/5 rounded-xl overflow-hidden mt-6">
                <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center gap-2">
                    <Shield size={18} className="text-cyan-400" />
                    <h3 className="font-medium text-gray-200">Seguridad de la Cuenta</h3>
                </div>
                {error && <div className="m-6 mb-0 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>}
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Contraseña Actual</label>
                        <div className="relative max-w-md">
                            <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Nueva Contraseña</label>
                        <div className="relative max-w-md">
                            <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
                >
                    {saved ? <><Check size={16} /> ¡Guardado!</> : <><Save size={16} /> {t("saveChanges") ?? "Guardar Cambios"}</>}
                </button>
            </div>
        </div>
    );
}
