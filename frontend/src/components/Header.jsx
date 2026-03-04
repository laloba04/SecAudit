import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Search, Bell, Globe, ChevronDown, User, LogOut, Settings as SettingsIcon } from "lucide-react";
import { UKFlag, SpainFlag, IkurrinaFlag } from "./utils";

export default function Header() {
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Notificaciones reales desde la API
    const [notifications, setNotifications] = useState([]);
    const [readIds, setReadIds] = useState(() => {
        const stored = localStorage.getItem("read_notif_ids");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        const fetchNotifs = () => {
            fetch("/api/notifications")
                .then(r => r.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setNotifications(data.map(n => ({
                            ...n,
                            read: readIds.includes(n.id)
                        })));
                    }
                })
                .catch(() => { });
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

    const markAllAsRead = () => {
        const allIds = notifications.map(n => n.id);
        setReadIds(allIds);
        localStorage.setItem("read_notif_ids", JSON.stringify(allIds));
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    // Get current user from localStorage
    const currentUserStr = localStorage.getItem("current_user");
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : { name: "Security Admin", email: "admin@secaudit.local" };
    // Get first letter of the name or 'S'
    const userInitial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "S";

    const langMenuRef = useRef(null);
    const notifMenuRef = useRef(null);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (langMenuRef.current && !langMenuRef.current.contains(e.target)) setShowLanguageMenu(false);
            if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) setShowNotifMenu(false);
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setShowProfileMenu(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/history?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    const langLabel = { en: "EN", es: "ES", eu: "EU" };

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0d1117]">
            <h1 className="text-xl font-semibold">{t("vulnerabilityDashboard") ?? "Panel de Vulnerabilidades"}</h1>
            <div className="flex items-center gap-3">
                <form onSubmit={handleSearch} className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder={t("searchPlaceholder") ?? "Buscar..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#1e2433] border border-white/5 rounded-lg pl-8 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 w-52 focus:outline-none focus:border-cyan-500/50"
                    />
                </form>

                {/* Idioma */}
                <div className="relative" ref={langMenuRef}>
                    <button
                        onClick={() => setShowLanguageMenu((v) => !v)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e2433] border border-white/5 text-sm text-gray-300 hover:border-cyan-500/30 transition-colors"
                    >
                        <Globe size={14} className="text-cyan-400" />
                        <span>{langLabel[language]}</span>
                        <ChevronDown size={12} className="text-gray-500" />
                    </button>
                    {showLanguageMenu && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-[#1e2433] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                            {[
                                { code: "en", label: "English", Flag: UKFlag },
                                { code: "es", label: "Español", Flag: SpainFlag },
                                { code: "eu", label: "Euskara", Flag: IkurrinaFlag },
                            ].map(({ code, label, Flag }) => (
                                <button
                                    key={code}
                                    onClick={() => { setLanguage(code); setShowLanguageMenu(false); }}
                                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors ${language === code ? "text-cyan-400" : "text-gray-300"}`}
                                >
                                    <Flag />
                                    <span>{label}</span>
                                    {language === code && <span className="ml-auto">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notificaciones */}
                <div className="relative" ref={notifMenuRef}>
                    <button
                        onClick={() => setShowNotifMenu(v => !v)}
                        className="relative w-9 h-9 rounded-lg bg-[#1e2433] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <Bell size={16} />
                        {unreadCount > 0 && <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                    </button>
                    {showNotifMenu && (
                        <div className="absolute right-0 top-full mt-1 w-64 bg-[#1e2433] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                            <div className="p-3 border-b border-white/5 flex items-center justify-between">
                                <span className="font-medium text-sm text-white">{t("notificationsLabel")}</span>
                                {unreadCount > 0 && (
                                    <span onClick={markAllAsRead} className="text-[10px] text-cyan-400 cursor-pointer hover:underline">{t("markAllRead")}</span>
                                )}
                            </div>
                            <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(n => {
                                    // Translate title if it matches a key
                                    const titleStr = n.title.startsWith("⚠️")
                                        ? `⚠️ ${t(n.title.replace("⚠️ ", ""))} `
                                        : (t(n.title) || n.title);

                                    // Localize description (parse parts like "score — pts, findings")
                                    let descStr = n.desc;
                                    if (n.desc.includes("pts, findings")) {
                                        const [url, rest] = n.desc.split(" — ");
                                        const parts = rest.split(",");
                                        const pts = parts[0].replace("pts", "").trim();
                                        const finds = parts[1].replace("findings", "").trim();
                                        descStr = `${url} — ${pts} ${t("notifFindingsDesc").split(",")[0].trim()}, ${finds} ${t("notifFindingsDesc").split(",")[1].trim()}`;
                                    } else if (n.desc.includes("connectionError")) {
                                        descStr = n.desc.replace("connectionError", t("connectionError"));
                                    }

                                    return (
                                        <div key={n.id} className={`p-2 rounded-lg cursor-pointer ${n.read ? 'opacity-60' : 'hover:bg-white/5 bg-white/[0.02]'}`}>
                                            <p className={`text-xs font-medium ${n.type === 'error' ? 'text-red-400' : 'text-white'}`}>{titleStr}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{descStr}</p>
                                        </div>
                                    );
                                }) : (
                                    <div className="p-4 text-center text-xs text-gray-500">{t("noNotifications")}</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Perfil */}
                <div className="relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setShowProfileMenu(v => !v)}
                        className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-sm select-none hover:bg-cyan-400 transition-colors"
                    >
                        {userInitial}
                    </button>
                    {showProfileMenu && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-[#1e2433] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                            <div className="px-4 py-2 border-b border-white/5 mb-1 text-left">
                                <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                                <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                            </div>
                            <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                                <User size={14} /> {t("myProfile") ?? "Mi Perfil"}
                            </Link>
                            <div className="border-t border-white/5 my-1"></div>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    navigate("/login");
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                            >
                                <LogOut size={14} /> {t("logout") ?? "Cerrar Sesión"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
