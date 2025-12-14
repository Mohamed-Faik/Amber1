"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/utils/translations";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside - works on both mobile and desktop
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Use both click and touchstart for mobile compatibility
    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("touchstart", handleClickOutside, true);
    
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
    // Language change will trigger re-render automatically via context
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
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
        ref={buttonRef}
        onClick={handleToggle}
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
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
        }}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.backgroundColor = "#EBEBEB";
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
          }
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
            left: isMobile ? "auto" : 0,
            right: isMobile ? 0 : "auto",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            border: "1px solid #E0E0E0",
            minWidth: "180px",
            zIndex: 10001,
            overflow: "hidden",
            touchAction: "manipulation",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleLanguageChange(lang.code);
              }}
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
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
              onMouseEnter={(e) => {
                if (!isMobile && language !== lang.code) {
                  e.currentTarget.style.backgroundColor = "#F7F7F7";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile && language !== lang.code) {
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

