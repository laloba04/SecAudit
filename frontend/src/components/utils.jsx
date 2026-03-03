import { useLanguage } from "../i18n/LanguageContext";

export function UKFlag() {
    return (
        <svg data-no-invert="true" width="20" height="14" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, display: "inline-block" }}>
            <rect width="60" height="30" fill="#012169" />
            <line x1="0" y1="0" x2="60" y2="30" stroke="#fff" strokeWidth="6" />
            <line x1="60" y1="0" x2="0" y2="30" stroke="#fff" strokeWidth="6" />
            <line x1="0" y1="0" x2="60" y2="30" stroke="#C8102E" strokeWidth="2" />
            <line x1="60" y1="0" x2="0" y2="30" stroke="#C8102E" strokeWidth="2" />
            <rect x="25" y="0" width="10" height="30" fill="#fff" />
            <rect x="0" y="10" width="60" height="10" fill="#fff" />
            <rect x="27" y="0" width="6" height="30" fill="#C8102E" />
            <rect x="0" y="12" width="60" height="6" fill="#C8102E" />
        </svg>
    );
}

export function SpainFlag() {
    return (
        <svg data-no-invert="true" width="20" height="14" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, display: "inline-block" }}>
            <rect width="30" height="5" fill="#AA151B" />
            <rect y="5" width="30" height="10" fill="#F1BF00" />
            <rect y="15" width="30" height="5" fill="#AA151B" />
        </svg>
    );
}

export function IkurrinaFlag() {
    return (
        <svg data-no-invert="true" width="20" height="14" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, display: "inline-block" }}>
            <rect width="30" height="20" fill="#D52B1E" />
            <line x1="0" y1="0" x2="30" y2="20" stroke="#007A33" strokeWidth="7" />
            <line x1="30" y1="0" x2="0" y2="20" stroke="#007A33" strokeWidth="7" />
            <rect x="12.5" y="0" width="5" height="20" fill="white" />
            <rect x="0" y="7.5" width="30" height="5" fill="white" />
        </svg>
    );
}

export const severityColor = (severity) => {
    switch (severity?.toLowerCase()) {
        case "critical": return "text-red-400 bg-red-400/10";
        case "high": return "text-orange-400 bg-orange-400/10";
        case "medium": return "text-yellow-400 bg-yellow-400/10";
        case "low": return "text-blue-400 bg-blue-400/10";
        default: return "text-gray-400 bg-gray-400/10";
    }
};

export const scoreColor = (score) => {
    if (score == null) return "text-gray-400";
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
};

export function StatusBadge({ status }) {
    const { t } = useLanguage();
    const map = {
        completed: { label: t("completed"), cls: "text-green-400 bg-green-400/10" },
        processing: { label: t("processing"), cls: "text-yellow-400 bg-yellow-400/10" },
        failed: { label: t("failed"), cls: "text-red-400 bg-red-400/10" },
        pending: { label: t("pending"), cls: "text-blue-400 bg-blue-400/10" },
    };
    const { label, cls } = map[status] ?? { label: status, cls: "text-gray-400 bg-gray-400/10" };
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}
