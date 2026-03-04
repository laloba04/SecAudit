import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { User, Mail, Lock, Save, Check } from "lucide-react";

export default function Profile() {
    const { t } = useLanguage();

    // Cargar datos del usuario desde localStorage
    const loadUser = () => {
        const stored = localStorage.getItem("current_user");
        return stored ? JSON.parse(stored) : { name: "Security Admin", email: "admin@secaudit.local" };
    };

    const [user, setUser] = useState(loadUser);
    const [name, setName] = useState(user.name);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saved, setSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [error, setError] = useState("");

    // Guardar cambios de nombre
    const handleSaveProfile = (e) => {
        e.preventDefault();
        const updatedUser = { ...user, name };
        localStorage.setItem("current_user", JSON.stringify(updatedUser));

        // También actualizar en la lista de usuarios registrados
        const usersStr = localStorage.getItem("secaudit_users");
        if (usersStr) {
            const users = JSON.parse(usersStr);
            const idx = users.findIndex(u => u.email === user.email);
            if (idx >= 0) {
                users[idx].name = name;
                localStorage.setItem("secaudit_users", JSON.stringify(users));
            }
        }

        setUser(updatedUser);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Cambiar contraseña
    const handleChangePassword = (e) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 8) {
            setError(t("passwordMinLength") ?? "La contraseña debe tener al menos 8 caracteres");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError(t("passwordsMismatch") ?? "Las contraseñas no coinciden");
            return;
        }

        // Verificar contraseña actual
        if (user.password && currentPassword !== user.password) {
            setError(t("incorrectCurrentPassword") ?? "La contraseña actual es incorrecta");
            return;
        }

        // Actualizar contraseña
        const updatedUser = { ...user, password: newPassword };
        localStorage.setItem("current_user", JSON.stringify(updatedUser));

        const usersStr = localStorage.getItem("secaudit_users");
        if (usersStr) {
            const users = JSON.parse(usersStr);
            const idx = users.findIndex(u => u.email === user.email);
            if (idx >= 0) {
                users[idx].password = newPassword;
                localStorage.setItem("secaudit_users", JSON.stringify(users));
            }
        }

        setUser(updatedUser);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSaved(true);
        setTimeout(() => setPasswordSaved(false), 2000);
    };

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-700">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{t("myProfile") ?? "Mi Perfil"}</h1>
                    <p className="text-gray-400">{t("personalInfo") ?? "Información personal y configuración de cuenta"}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#161b27] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform duration-300">
                                    {name?.charAt(0)?.toUpperCase() || "S"}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0d1117] border border-white/10 rounded-full flex items-center justify-center text-gray-400 shadow-lg cursor-pointer hover:text-cyan-400 transition-colors">
                                    <User size={18} />
                                </div>
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-white">{name}</h3>
                            <p className="text-gray-400 text-sm">{user.email}</p>

                            <div className="mt-8 pt-6 border-t border-white/5 w-full space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">{t("status") || "Status"}</span>
                                    <span className="text-emerald-400 font-medium">Active</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">{t("role") || "Role"}</span>
                                    <span className="text-cyan-400 font-medium font-mono text-xs uppercase px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20">Admin</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Details Form */}
                        <div className="bg-[#161b27] border border-white/5 rounded-2xl p-8 shadow-xl">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                                <User size={20} className="text-cyan-400" />
                                {t("personalInfo") ?? "Información Personal"}
                            </h2>
                            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        {t("fullName") ?? "Nombre completo"}
                                    </label>
                                    <div className="relative group">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-[#0d1117] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                            placeholder={t("namePlaceholder") || "Nombre completo"}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full bg-[#0d1117] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm opacity-50 cursor-not-allowed bg-white/5"
                                        />
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-2 italic flex items-center gap-1">
                                        <Lock size={10} /> {t("emailCannotChange") ?? "El email no se puede modificar"}
                                    </p>
                                </div>
                                <div className="md:col-span-2 pt-2">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/10 active:scale-95"
                                    >
                                        {saved ? <><Check size={18} /> {t("savedOk") ?? "Guardado"}</> : <><Save size={18} /> {t("saveChanges") ?? "Guardar Cambios"}</>}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password Management */}
                        <div className="bg-[#161b27] border border-white/5 rounded-2xl p-8 shadow-xl">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                                <Lock size={20} className="text-cyan-400" />
                                {t("changePassword") ?? "Cambiar Contraseña"}
                            </h2>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 animate-in slide-in-from-top-2 duration-300">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        {t("currentPassword") ?? "Contraseña actual"}
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        {t("newPassword") ?? "Nueva contraseña"}
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        {t("confirmPassword") ?? "Confirmar contraseña"}
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-[11px] text-gray-500 mb-4 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40"></div>
                                        {t("passwordMinLength") ?? "Mínimo 8 caracteres"}
                                    </p>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-[#0d1117] hover:bg-white/[0.05] border border-white/10 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all active:scale-95"
                                    >
                                        {passwordSaved ? <><Check size={18} className="text-emerald-400" /> {t("passwordUpdated") ?? "Contraseña actualizada"}</> : <><Lock size={18} className="text-cyan-400" /> {t("updatePassword") ?? "Actualizar Contraseña"}</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
