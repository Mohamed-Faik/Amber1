"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DirectionProvider({ children }) {
    const { language } = useLanguage();

    useEffect(() => {
        const dir = language === "ar" ? "rtl" : "ltr";
        document.documentElement.dir = dir;
        document.documentElement.lang = language;

        // Add RTL-specific class to body for easier CSS targeting if needed
        if (dir === "rtl") {
            document.body.classList.add("rtl");
            document.body.classList.remove("ltr");
            // Specific fix for Swiper in RTL
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.body.classList.add("ltr");
            document.body.classList.remove("rtl");
            document.documentElement.setAttribute('dir', 'ltr');
        }
    }, [language]);

    return children;
}
