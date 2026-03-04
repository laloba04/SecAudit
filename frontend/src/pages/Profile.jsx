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
        <div className="p-6 space-y-6 max-w-2xl">
            <h1 className="text-xl font-bold">{t("myProfile") ?? "Mi Perfil"}</h1>

            {/* Avatar + Info */}
            <div className="bg-[#161b27] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-2xl font-bold text-cyan-400">
                        {name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t("fullName") ?? "Nombre completo"}
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm opacity-50 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{t("emailCannotChange") ?? "El email no se puede modificar"}</p>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                    >
                        {saved ? <><Check size={16} /> {t("saved") ?? "Guardado"}</> : <><Save size={16} /> {t("saveChanges") ?? "Guardar Cambios"}</>}
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-[#161b27] border border-white/5 rounded-xl p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Lock size={16} className="text-cyan-400" />
                    {t("changePassword") ?? "Cambiar Contraseña"}
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t("currentPassword") ?? "Contraseña actual"}
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t("newPassword") ?? "Nueva contraseña"}
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t("confirmPassword") ?? "Confirmar contraseña"}
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="••••••••"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">{t("passwordMinLength") ?? "Mínimo 8 caracteres"}</p>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                    >
                        {passwordSaved ? <><Check size={16} /> {t("passwordUpdated") ?? "Contraseña actualizada"}</> : <><Lock size={16} /> {t("updatePassword") ?? "Actualizar Contraseña"}</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
