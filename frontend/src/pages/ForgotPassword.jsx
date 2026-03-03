import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, ArrowLeft } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function ForgotPassword() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simular envío de correo
        setTimeout(() => {
            setSuccess(true);
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-md bg-[#161b27] border border-white/5 rounded-2xl p-8 shadow-2xl relative">
                <button
                    onClick={() => navigate("/login")}
                    className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="flex justify-center mb-6 mt-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <Shield size={28} className="text-cyan-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2">{t("recoverPassword")}</h2>
                <p className="text-sm text-gray-400 text-center mb-8">{t("recoverDesc")}</p>

                {success ? (
                    <div className="text-center">
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-4 rounded-lg mb-6">
                            {t("linkSent")} <b>{email}</b>{t("checkInbox")}
                        </div>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2"
                        >
                            {t("backToLogin")}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("registeredEmail")}</label>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors mt-6"
                        >
                            {loading ? t("sending") : t("sendLink")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
