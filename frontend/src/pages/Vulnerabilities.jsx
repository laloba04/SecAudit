import { useLanguage } from "../i18n/LanguageContext";
import { AlertTriangle, Server, Shield, Lock } from "lucide-react";

export default function Vulnerabilities() {
    const { t } = useLanguage();

    const categories = [
        { name: "Cabeceras HTTP", count: 42, icon: Server, color: "text-blue-400", bg: "bg-blue-400/10" },
        { name: "Criptografía / SSL", count: 18, icon: Lock, color: "text-purple-400", bg: "bg-purple-400/10" },
        { name: "Detección de Configs", count: 7, icon: Shield, color: "text-green-400", bg: "bg-green-400/10" },
        { name: "CVEs / Dependencias", count: 0, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-[#161b27] border border-white/5 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-2">{t("vulnerabilities") ?? "Base de Vulnerabilidades"}</h2>
                <p className="text-sm text-gray-400 mb-6">Un resumen global de los tipos de vulnerabilidades encontradas en todos tus escaneos.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-5 flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-medium mb-1">{cat.name}</p>
                                <p className="text-3xl font-bold">{cat.count}</p>
                            </div>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.bg}`}>
                                <cat.icon size={16} className={cat.color} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#161b27] border border-white/5 rounded-xl p-6 h-64 flex flex-col items-center justify-center text-center">
                <AlertTriangle size={48} className="text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-300">Catálogo de Firmas</h3>
                <p className="text-sm text-gray-500 max-w-sm mt-2">Aquí se mostrará el catálogo de todas las vulnerabilidades (CVEs y configuraciones inseguras) que el motor de Python es capaz de detectar.</p>
            </div>
        </div>
    );
}
