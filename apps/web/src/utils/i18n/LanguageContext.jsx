"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("preferredLanguage");
      if (
        savedLang &&
        (savedLang === "en" || savedLang === "es" || savedLang === "eu")
      ) {
        setLanguageState(savedLang);
      } else {
        const browserLang = navigator.language.split("-")[0];
        if (browserLang === "es") {
          setLanguageState("es");
        } else if (browserLang === "eu") {
          setLanguageState("eu");
        }
      }
    } catch (e) {
      // localStorage not available during SSR
    }
  }, []);

  const setLanguage = (newLang) => {
    if (newLang === "en" || newLang === "es" || newLang === "eu") {
      setLanguageState(newLang);
      try {
        localStorage.setItem("preferredLanguage", newLang);
      } catch (e) {
        // localStorage not available
      }
    }
  };

  const toggleLanguage = () => {
    const languages = ["en", "es", "eu"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
