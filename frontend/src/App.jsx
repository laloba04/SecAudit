import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ScanDetail from "./pages/ScanDetail";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Vulnerabilities from "./pages/Vulnerabilities";
import SSLMonitor from "./pages/SSLMonitor";
import Infrastructure from "./pages/Infrastructure";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import DatabaseView from "./pages/DatabaseView";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token");
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
    useEffect(() => {
        const prefs = JSON.parse(localStorage.getItem("secaudit_prefs") || "{}");
        let isLight = false;

        if (prefs.theme === "light") {
            isLight = true;
        } else if (prefs.theme === "system" || !prefs.theme) {
            isLight = !window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        if (isLight) {
            document.body.classList.add("theme-light");
        } else {
            document.body.classList.remove("theme-light");
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Rutas Protegidas */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="scan/:id" element={<ScanDetail />} />
                    <Route path="history" element={<History />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="vulnerabilities" element={<Vulnerabilities />} />
                    <Route path="ssl" element={<SSLMonitor />} />
                    <Route path="infra" element={<Infrastructure />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="db" element={<DatabaseView />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="preferences" element={<Preferences />} />
                    <Route path="*" element={<div className="p-10 text-center text-gray-400 flex flex-col items-center justify-center h-full"><span className="text-2xl font-bold mb-2">404</span>Página no encontrada o en construcción</div>} />
                </Route>
            </Routes>
        </Router>
    );
}
