"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, ConciergeBell, Menu, X, Plus } from "lucide-react";
import UserMenu from "./UserMenu";
import NotificationBadge from "./NotificationBadge";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const Navbar = ({ currentUser }) => {
  const pathname = usePathname();
  const { language, isDetecting } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayLanguage = isDetecting ? "en" : language;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  if (pathname?.startsWith("/auth") || pathname?.startsWith("/admin/login")) {
    return null;
  }

  const navLinks = [
    { 
      href: "/homes", 
      label: getTranslation(displayLanguage, "nav.homes"), 
      icon: Home 
    },
    { 
      href: "/experiences", 
      label: getTranslation(displayLanguage, "nav.experiences"), 
      icon: Sparkles 
    },
    { 
      href: "/services", 
      label: getTranslation(displayLanguage, "nav.services"), 
      icon: ConciergeBell 
    },
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#FFFFFF",
          borderBottom: isScrolled ? "1px solid #EBEBEB" : "1px solid #F7F7F7",
          boxShadow: isScrolled
            ? "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)"
            : "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <nav
          style={{
            maxWidth: "1760px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
          }}
        >
          {/* Logo - Left */}
          <div style={{ flex: "0 0 auto" }}>
            <Link
              href="/"
              style={{
                display: "block",
                textDecoration: "none",
              }}
            >
              <Image
                src="/images/amberhomes png.png"
                alt="AmberHomes Logo"
                width={180}
                height={50}
                style={{
                  height: "auto",
                  width: "auto",
                  maxHeight: "50px",
                  maxWidth: "180px",
                  objectFit: "contain",
                }}
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #DDDDDD",
              borderRadius: "40px",
              padding: "6px 8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
              transition: "box-shadow 0.2s ease",
            }}
          >
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <React.Fragment key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      padding: "10px 18px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: isActive ? "#222222" : "#717171",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "32px",
                      backgroundColor: isActive ? "#F7F7F7" : "transparent",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#F7F7F7";
                        e.currentTarget.style.color = "#222222";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#717171";
                      }
                    }}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                    <span>{link.label}</span>
                  </Link>
                  {index < navLinks.length - 1 && (
                    <div
                      style={{
                        width: "1px",
                        height: "24px",
                        backgroundColor: "#EBEBEB",
                        margin: "0 4px",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div
            className="desktop-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: "0 0 auto",
            }}
          >
            {/* Become a Host / Add Listing */}
            <Link
              href="/listings/new"
              className="host-button-desktop"
              style={{
                padding: "10px 16px",
                borderRadius: "22px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#222222",
                textDecoration: "none",
                transition: "background-color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F7F7F7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {currentUser
                ? getTranslation(displayLanguage, "nav.addListing")
                : getTranslation(displayLanguage, "nav.becomeHost")}
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notification Badge */}
            {currentUser && <NotificationBadge currentUser={currentUser} />}

            {/* User Menu */}
            <UserMenu currentUser={currentUser} />
          </div>

          {/* Mobile Right Actions */}
          <div
            className="mobile-actions"
            style={{
              display: "none",
              alignItems: "center",
              gap: "4px",
              flex: "0 0 auto",
              marginLeft: "auto",
            }}
          >
            {/* When logged in: Show Language, Notification, Add Listing, Profile (no menu icon) */}
            {currentUser ? (
              <div 
                className="mobile-logged-in-icons"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginLeft: "auto",
                }}
              >
                {/* Language Switcher - Mobile */}
                <div className="mobile-language-wrapper">
                  <LanguageSwitcher />
                </div>

                {/* Notification Badge - Mobile */}
                <div 
                  className="mobile-notification-wrapper"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NotificationBadge currentUser={currentUser} />
                </div>

                {/* Add Listing Button - Mobile */}
                <Link
                  href="/listings/new"
                  className="mobile-add-listing-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "42px",
                    height: "42px",
                    border: "none",
                    backgroundColor: "#da1249",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#000000";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#222222";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.95)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  aria-label="Add listing"
                >
                  <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
                </Link>

                {/* User Menu - Mobile */}
                <div className="mobile-user-menu-wrapper">
                  <UserMenu currentUser={currentUser} />
                </div>
              </div>
            ) : (
              /* When not logged in: Show language + menu icon */
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Language Switcher */}
                <div className="mobile-language-wrapper">
                  <LanguageSwitcher />
                </div>
                
                {/* Menu Button */}
                <button
                  className="mobile-menu-btn"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "42px",
                    height: "42px",
                    border: "none",
                    backgroundColor: "#F7F7F7",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  aria-label="Toggle menu"
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.95)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Menu size={22} color="#222222" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Navigation Pills - Centered */}
        <div
          className="mobile-nav-pills"
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #F0F0F0",
            backgroundColor: "#FAFAFA",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            display: "none",
          }}
        >
          <div style={{ 
            display: "flex", 
            gap: "6px", 
            minWidth: "min-content", 
            justifyContent: "center",
            alignItems: "center",
          }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mobile-nav-pill ${isActive ? "active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    fontSize: "14px",
                    fontWeight: isActive ? "700" : "600",
                    color: isActive ? "#222222" : "#717171",
                    textDecoration: "none",
                    backgroundColor: isActive ? "#FFFFFF" : "transparent",
                    border: "none",
                    borderRadius: "28px",
                    whiteSpace: "nowrap",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseDown={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = "scale(0.96)";
                    }
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1001,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            className="mobile-menu-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "0",
              right: "0",
              bottom: "0",
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#FFFFFF",
              zIndex: 1002,
              overflowY: "auto",
              animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
              paddingTop: "20px",
            }}
          >
          <div style={{ padding: "0 24px 24px" }}>
            {/* Close Button */}
            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              alignItems: "center",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid #F0F0F0"
            }}>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  border: "none",
                  backgroundColor: "#F7F7F7",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#EBEBEB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F7F7F7";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.95)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                aria-label="Close menu"
              >
                <X size={22} color="#222222" strokeWidth={2.5} />
              </button>
            </div>

            {/* User Actions */}
            {currentUser ? (
              <div style={{ 
                marginBottom: "32px", 
                paddingBottom: "24px", 
                borderBottom: "1px solid #F0F0F0" 
              }}>
                <Link
                  href="/listings/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "14px 18px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#222222",
                    textDecoration: "none",
                    backgroundColor: "#F7F7F7",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#EBEBEB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F7F7F7";
                  }}
                >
                  <span>{getTranslation(displayLanguage, "nav.addListing")}</span>
                </Link>
              </div>
            ) : (
              <div style={{ 
                marginBottom: "32px", 
                paddingBottom: "24px", 
                borderBottom: "1px solid #F0F0F0",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}>
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 18px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    backgroundColor: "#222222",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#000000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#222222";
                  }}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 18px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#222222",
                    textDecoration: "none",
                    backgroundColor: "#F7F7F7",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#EBEBEB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F7F7F7";
                  }}
                >
                  Sign up
                </Link>
                <Link
                  href="/listings/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 18px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#222222",
                    textDecoration: "none",
                    backgroundColor: "transparent",
                    border: "1px solid #DDDDDD",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F7F7F7";
                    e.currentTarget.style.borderColor = "#CCCCCC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#DDDDDD";
                  }}
                >
                  {getTranslation(displayLanguage, "nav.becomeHost")}
                </Link>
              </div>
            )}
          </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

<<<<<<< HEAD
        /* Mobile: < 768px */
        @media (max-width: 767px) {
          .mobile-nav {
            padding: 0 12px !important;
            height: 64px !important;
          }

          .mobile-nav-right {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 8px !important;
          }

          /* Ensure notification badge and user menu are properly aligned on mobile */
          .mobile-nav-right {
            align-items: center !important;
            height: 100% !important;
          }

          .mobile-notification-wrapper,
          .mobile-user-menu-wrapper {
            position: relative !important;
            top: 0 !important;
            right: 0 !important;
            transform: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 40px !important;
            width: 40px !important;
            margin: 0 !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
          }

          /* Ensure both notification badge and user menu buttons are same size */
          .mobile-nav-right button,
          .mobile-nav-right .user-menu-button,
          .mobile-notification-wrapper button,
          .mobile-user-menu-wrapper .user-menu-button {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            min-height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 !important;
            padding: 0 !important;
            position: relative !important;
            top: 0 !important;
            vertical-align: middle !important;
          }

          .mobile-login-link {
            display: none !important;
          }

          .mobile-menu-drawer {
            top: 64px !important;
            height: calc(100vh - 64px) !important;
            max-width: 100% !important;
          }

          .mobile-menu-overlay {
            top: 64px !important;
          }
          
          /* Hide scrollbar */
          .mobile-nav-pills::-webkit-scrollbar {
            display: none;
          }
          .mobile-nav-pills {
            scrollbar-width: none;
          }
        }

        /* Base styles */
        .desktop-nav {
          display: flex;
        }
        .desktop-actions {
          display: flex;
        }
        .mobile-actions {
          display: none;
        }
        .mobile-nav-pills {
          display: none;
        }

        /* Desktop styles (default) */
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-actions {
            display: none !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-nav-pills {
            display: none !important;
          }
          .mobile-language-wrapper {
            display: none !important;
          }
        }

        /* Tablet styles */
        @media (max-width: 991px) and (min-width: 768px) {
          nav {
            padding: 0 20px !important;
            height: 72px !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .desktop-actions {
            display: none !important;
          }
          .mobile-actions {
            display: flex !important;
            gap: 10px !important;
            margin-left: auto !important;
          }
          .mobile-logged-in-icons {
            margin-left: auto !important;
          }
          .host-button-desktop {
            display: none !important;
          }
          .mobile-nav-pills {
            display: block !important;
            padding: 14px 20px !important;
          }
          .mobile-nav-pills > div {
            justify-content: center !important;
          }
          .mobile-menu-overlay {
            z-index: 1001 !important;
          }
          .mobile-menu-drawer {
            top: 0 !important;
            padding-top: 20px !important;
            z-index: 1002 !important;
          }
        }

        /* Mobile styles */
        @media (max-width: 767px) {
          nav {
            padding: 0 16px !important;
            height: 66px !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .desktop-actions {
            display: none !important;
          }
          .mobile-actions {
            display: flex !important;
            gap: 4px !important;
            margin-left: auto !important;
          }
          .mobile-logged-in-icons {
            margin-left: auto !important;
          }
          .host-button-desktop {
            display: none !important;
          }
          .mobile-nav-pills {
            display: block !important;
            padding: 14px 16px !important;
          }
          .mobile-nav-pills > div {
            justify-content: center !important;
          }
          .mobile-menu-overlay {
            z-index: 1001 !important;
          }
          .mobile-menu-drawer {
            top: 0 !important;
            padding-top: 20px !important;
            z-index: 1002 !important;
          }
        }

        /* Extra small mobile */
        @media (max-width: 480px) {
          nav {
            padding: 0 14px !important;
            height: 64px !important;
          }
          .mobile-actions {
            gap: 6px !important;
          }
          .mobile-logged-in-icons {
            margin-left: auto !important;
            gap: 6px !important;
          }
          .mobile-add-listing-btn {
            width: 40px !important;
            height: 40px !important;
          }
          .mobile-nav-pills {
            padding: 12px 14px !important;
          }
          .mobile-menu-overlay {
            z-index: 1001 !important;
          }
          .mobile-menu-drawer {
            top: 0 !important;
            padding-top: 20px !important;
            z-index: 1002 !important;
          }
        }
        
        /* Mobile action button improvements */
        .mobile-menu-btn:hover {
          background-color: #EBEBEB !important;
        }
        
        .mobile-menu-btn:active {
          transform: scale(0.95);
        }
        
        /* Mobile add listing button styles */
        .mobile-add-listing-btn:active {
          transform: scale(0.95);
        }
        
        /* Mobile logged in icons */
        .mobile-logged-in-icons {
          display: flex;
          align-items: center;
        }
        
        /* Mobile language wrapper styles */
        .mobile-language-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 767px) {
          .mobile-add-listing-btn {
            width: 42px !important;
            height: 42px !important;
          }
          
          .mobile-language-wrapper button {
            width: 42px !important;
            height: 42px !important;
            background-color: #F7F7F7 !important;
            border: none !important;
          }
          
          .mobile-language-wrapper button:hover {
            background-color: #EBEBEB !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-language-wrapper button {
            width: 40px !important;
            height: 40px !important;
          }
        }

        /* Large desktop */
        @media (min-width: 1400px) {
          nav {
            padding: 0 40px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;