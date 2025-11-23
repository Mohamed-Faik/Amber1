"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { detectUserLanguage } from "@/utils/detectLanguage";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children, defaultLanguage = "en" }) => {
  // Start with default to avoid hydration mismatch
  const [language, setLanguage] = useState(defaultLanguage);
  const [isDetecting, setIsDetecting] = useState(true);

  // Detect language from IP address on client-side only
  useEffect(() => {
    let isMounted = true;

    const initializeLanguage = async () => {
      if (typeof window === "undefined" || !isMounted) {
        setIsDetecting(false);
        return;
      }

      // Wrap in Promise to catch all errors
      const detectedLang = await new Promise((resolve) => {
        // Use a separate async function to catch all possible errors
        (async () => {
          try {
            const result = await detectUserLanguage();
            console.log("[Language Context] Detected language:", result);
            resolve(result || defaultLanguage);
          } catch (error) {
            console.error("[Language Context] Detection error:", error);
            resolve(defaultLanguage);
          }
        })().catch((err) => {
          // Extra safety catch
          console.error("[Language Context] Promise catch error:", err);
          resolve(defaultLanguage);
        });
      });

      if (isMounted) {
        console.log("[Language Context] Setting language to:", detectedLang);
        setLanguage(detectedLang);
        setIsDetecting(false);
      }
    };

    // Use setTimeout to ensure this runs after initial render
    const timer = setTimeout(() => {
      initializeLanguage();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [defaultLanguage]);

  const changeLanguage = (lang) => {
    if (["en", "fr", "nl"].includes(lang)) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isDetecting }}>
      {children}
    </LanguageContext.Provider>
  );
};

