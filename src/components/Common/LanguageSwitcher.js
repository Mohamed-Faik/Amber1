"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/utils/translations";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
    // Language change will trigger re-render automatically via context
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#FFFFFF",
          cursor: "pointer",
          transition: "all 0.2s ease",
          width: "42px",
          height: "42px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#EBEBEB";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#FFFFFF";
        }}
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe size={20} color="#222222" />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            border: "1px solid #E0E0E0",
            minWidth: "180px",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              style={{
                width: "100%",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: "none",
                backgroundColor: language === lang.code ? "#F7F7F7" : "transparent",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: language === lang.code ? "600" : "400",
                color: "#222222",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = "#F7F7F7";
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "20px" }}>{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <span style={{ marginLeft: "auto", color: "#FF385C" }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

