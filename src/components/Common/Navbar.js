"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plus } from "lucide-react";
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

  const leftNavLinks = [
    {
      href: "/listings?listingType=SALE",
      label: displayLanguage === "nl" ? "TE KOOP" : displayLanguage === "fr" ? "À VENDRE" : "FOR SALE",
    },
    {
      href: "/listings?listingType=RENT",
      label: displayLanguage === "nl" ? "TE HUUR" : displayLanguage === "fr" ? "À LOUER" : "FOR RENT",
    },
  ];

  const rightNavLinks = [
    {
      href: "/about-us",
      label: displayLanguage === "nl" ? "OVER ONS" : displayLanguage === "fr" ? "À PROPOS" : "ABOUT US",
    },
    {
      href: "/experiences",
      label: displayLanguage === "nl" ? "ERVARING" : displayLanguage === "fr" ? "EXPÉRIENCE" : "EXPERIENCE",
      icon: "https://img.icons8.com/?size=100&id=PhN968WBxlkp&format=png&color=000000",
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
          backgroundColor: isScrolled ? "#FFFFFF" : "rgba(255, 255, 255, 0.95)",
          borderBottom: isScrolled ? "2px solid #F0F0F0" : "1px solid rgba(0,0,0,0.04)",
          boxShadow: isScrolled
            ? "0 12px 40px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)"
            : "0 4px 16px rgba(0,0,0,0.04)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <nav
          style={{
            maxWidth: "1760px",
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
            position: "relative",
          }}
        >
          {/* Left Navigation Links */}
          <div
            className="desktop-nav-left"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "44px",
              flex: "0 0 auto",
              position: "absolute",
              left: "calc(50% - 80px)",
              transform: "translateX(calc(-50% - 300px))",
              zIndex: 9,
            }}
          >
            {leftNavLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: "15px",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#1A1A1A" : "#666666",
                    textDecoration: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    whiteSpace: "nowrap",
                    padding: "10px 20px",
                    borderRadius: "14px",
                    backgroundColor: isActive ? "rgba(255, 56, 92, 0.1)" : "transparent",
                    position: "relative",
                    border: isActive ? "1px solid rgba(255, 56, 92, 0.2)" : "1px solid transparent",
                    boxShadow: isActive ? "0 4px 12px rgba(255, 56, 92, 0.15)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#FF385C";
                      e.currentTarget.style.backgroundColor = "rgba(255, 56, 92, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(255, 56, 92, 0.3)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 56, 92, 0.2)";
                    } else {
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 56, 92, 0.25)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#666666";
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    } else {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.15)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Logo - Center */}
          {/* Left Section - Logo and Language (Mobile) */}
          <div 
            className="navbar-left-mobile"
            style={{ 
              display: "none",
              flex: "0 0 auto",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div 
              className="navbar-logo-container"
              style={{ 
                flex: "0 0 auto",
                position: "relative",
                left: "0",
                transform: "none",
                zIndex: 10,
              }}
            >
              <Link
                href="/"
                className="navbar-logo-link"
                style={{
                  display: "block",
                  textDecoration: "none",
                  padding: "10px 16px",
                  borderRadius: "16px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 250, 250, 0.9) 100%)",
                  border: "1px solid rgba(255, 56, 92, 0.1)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 56, 92, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 56, 92, 0.2)";
                  e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 56, 92, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255, 56, 92, 0.1)";
                  e.currentTarget.style.transform = "scale(1) translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                }}
              >
                <Image
                  src="/images/amberhomes png.png"
                  alt="AmberHomes Logo"
                  width={200}
                  height={52}
                  style={{
                    height: "auto",
                    width: "auto",
                    maxHeight: "52px",
                    maxWidth: "200px",
                    objectFit: "contain",
                    transition: "all 0.4s ease",
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                  }}
                  className="navbar-logo"
                  priority
                  sizes="(max-width: 767px) 85px, (max-width: 991px) 110px, 200px"
                />
              </Link>
            </div>
            
            {/* Language Switcher - Mobile Left */}
            <div className="mobile-language-wrapper-left">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Desktop Logo - Centered */}
          <div 
            className="navbar-logo-container"
            style={{ 
              flex: "0 0 auto",
              position: "absolute",
              left: "calc(50% - 80px)",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <Link
              href="/"
              className="navbar-logo-link"
              style={{
                display: "block",
                textDecoration: "none",
                padding: "10px 16px",
                borderRadius: "16px",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 250, 250, 0.9) 100%)",
                border: "1px solid rgba(255, 56, 92, 0.1)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 56, 92, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 56, 92, 0.2)";
                e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 56, 92, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "rgba(255, 56, 92, 0.1)";
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
              }}
            >
              <Image
                src="/images/amberhomes png.png"
                alt="AmberHomes Logo"
                width={200}
                height={52}
                style={{
                  height: "auto",
                  width: "auto",
                  maxHeight: "52px",
                  maxWidth: "200px",
                  objectFit: "contain",
                  transition: "all 0.4s ease",
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                }}
                className="navbar-logo"
                priority
                sizes="(max-width: 767px) 85px, (max-width: 991px) 110px, 200px"
              />
            </Link>
          </div>

          {/* Right Navigation Links */}
          <div
            className="desktop-nav-right"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "44px",
              flex: "0 0 auto",
              position: "absolute",
              left: "calc(50% - 80px)",
              transform: "translateX(calc(-50% + 300px))",
              zIndex: 9,
            }}
          >
            {rightNavLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: "15px",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#1A1A1A" : "#666666",
                    textDecoration: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    whiteSpace: "nowrap",
                    padding: "10px 20px",
                    borderRadius: "14px",
                    backgroundColor: isActive ? "rgba(255, 56, 92, 0.1)" : "transparent",
                    position: "relative",
                    border: isActive ? "1px solid rgba(255, 56, 92, 0.2)" : "1px solid transparent",
                    boxShadow: isActive ? "0 4px 12px rgba(255, 56, 92, 0.15)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#FF385C";
                      e.currentTarget.style.backgroundColor = "rgba(255, 56, 92, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(255, 56, 92, 0.3)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 56, 92, 0.2)";
                    } else {
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 56, 92, 0.25)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#666666";
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    } else {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.15)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {link.icon && (
                    <Image
                      src={link.icon}
                      alt=""
                      width={28}
                      height={28}
                      style={{
                        width: "28px",
                        height: "28px",
                        objectFit: "contain",
                        filter: isActive ? "none" : "opacity(0.7)",
                      }}
                      unoptimized
                    />
                  )}
                  {link.label}
                </Link>
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
              marginLeft: "auto",
            }}
          >
            {/* Become a Host / Add Listing */}
            <Link
              href="/listings/new"
              className="host-button-desktop"
              style={{
                padding: "14px 24px",
                borderRadius: "16px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#FFFFFF",
                textDecoration: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                whiteSpace: "nowrap",
                background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 6px 20px rgba(255, 56, 92, 0.3), 0 2px 8px rgba(255, 56, 92, 0.2)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #E61E4D 0%, #D91A3D 100%)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 10px 32px rgba(255, 56, 92, 0.4), 0 4px 12px rgba(255, 56, 92, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 56, 92, 0.3), 0 2px 8px rgba(255, 56, 92, 0.2)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
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
              gap: "8px",
              flex: "0 0 auto",
              marginLeft: "auto",
            }}
          >
            {/* Profile/User Menu - Mobile Right */}
            {currentUser && (
              <div className="mobile-user-menu-wrapper-right">
                <UserMenu currentUser={currentUser} />
              </div>
            )}

            {/* Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                border: "none",
                backgroundColor: "#F7F7F7",
                borderRadius: "14px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
              aria-label="Toggle menu"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#EBEBEB";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F7F7F7";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
            >
              <Menu size={22} color="#222222" strokeWidth={2.5} />
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Pills - Completely Hidden, All Navigation in Hamburger Menu */}
        <div
          className="mobile-nav-pills"
          style={{
            display: "none",
          }}
        />
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

              {/* Navigation Links */}
              <div style={{
                marginBottom: "32px",
                paddingBottom: "24px",
                borderBottom: "1px solid #F0F0F0"
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                  {[...leftNavLinks, ...rightNavLinks].map((link) => {
                    const isActive =
                      link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "14px 18px",
                          fontSize: "16px",
                          fontWeight: isActive ? "600" : "500",
                          color: isActive ? "#FF385C" : "#222222",
                          textDecoration: "none",
                          backgroundColor: isActive ? "rgba(255, 56, 92, 0.08)" : "transparent",
                          borderRadius: "12px",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "100%",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = "#F7F7F7";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        {link.icon && (
                          <Image
                            src={link.icon}
                            alt=""
                            width={28}
                            height={28}
                            style={{
                              width: "28px",
                              height: "28px",
                              objectFit: "contain",
                              flexShrink: 0,
                              filter: isActive ? "none" : "opacity(0.7)",
                            }}
                            unoptimized
                          />
                        )}
                        <span style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}>
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* User Actions */}
              {currentUser ? (
                <>
                  <div style={{
                    marginBottom: "24px",
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
                        color: "#FFFFFF",
                        textDecoration: "none",
                        background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
                        borderRadius: "12px",
                        transition: "all 0.2s ease",
                        boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #E61E4D 0%, #D91A3D 100%)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 56, 92, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.3)";
                      }}
                    >
                      <span>{getTranslation(displayLanguage, "nav.addListing")}</span>
                    </Link>
                  </div>
                  
                  {/* User Profile Section */}
                  <div style={{
                    marginBottom: "32px",
                    paddingBottom: "24px",
                    borderBottom: "1px solid #F0F0F0"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      backgroundColor: "#F7F7F7",
                      borderRadius: "12px",
                    }}>
                      <UserMenu currentUser={currentUser} />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#222222",
                        }}>
                          {currentUser.name || "User"}
                        </div>
                        <div style={{
                          fontSize: "14px",
                          color: "#717171",
                        }}>
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
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
            top: 68px !important;
            height: calc(100vh - 68px) !important;
            max-width: 100% !important;
          }

          .mobile-menu-overlay {
            top: 68px !important;
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
        .desktop-nav-left,
        .desktop-nav-right {
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
          .desktop-nav-left,
          .desktop-nav-right {
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
            padding: 0 24px !important;
            height: 70px !important;
          }
          .desktop-nav-left,
          .desktop-nav-right {
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
            display: none !important;
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
            padding: 0 20px !important;
            height: 68px !important;
          }
          
          header {
            backdropFilter: blur(20px) saturate(180%) !important;
            WebkitBackdropFilter: blur(20px) saturate(180%) !important;
          }
          
          .navbar-left-mobile {
            display: flex !important;
          }
          
          .navbar-logo-container:not(.navbar-left-mobile .navbar-logo-container) {
            display: none !important;
          }
          
          .mobile-nav-pills {
            display: none !important;
          }
          
          .mobile-nav-pills > div {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            padding-right: 20px !important;
          }
          
          .mobile-nav-pills > div::-webkit-scrollbar {
            display: none !important;
          }
          
          .mobile-nav-pill {
            font-size: 12px !important;
            padding: 8px 14px !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            min-width: fit-content !important;
          }
          
          .mobile-nav-pills {
            padding: 14px 20px !important;
          }
          
          .navbar-logo-container:not(.navbar-left-mobile *) {
            display: none !important;
          }
          
          .navbar-logo-link {
            padding: 6px 10px !important;
          }
          
          .navbar-logo {
            maxHeight: 32px !important;
            maxWidth: 120px !important;
          }
          
          .mobile-add-listing-btn {
            width: 44px !important;
            height: 44px !important;
          }
          
          .mobile-nav-pills > div {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
          }
          
          .mobile-nav-pills > div::-webkit-scrollbar {
            display: none !important;
          }
          
          .mobile-nav-pill {
            font-size: 12px !important;
            padding: 8px 14px !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            min-width: fit-content !important;
          }
          
          .navbar-left-mobile .navbar-logo-container {
            position: relative !important;
            left: 0 !important;
            transform: none !important;
            width: auto !important;
            flex: 0 0 auto !important;
          }
          
          .navbar-left-mobile .navbar-logo-link {
            padding: 6px 10px !important;
          }
          
          .navbar-left-mobile .navbar-logo {
            maxHeight: 32px !important;
            maxWidth: 120px !important;
          }
          
          .mobile-language-wrapper-left {
            display: flex !important;
            align-items: center !important;
          }
          
          .mobile-language-wrapper {
            display: none !important;
          }
          
          .mobile-nav-pills > div {
            padding-right: 20px !important;
          }
          .desktop-nav-left,
          .desktop-nav-right {
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
            display: none !important;
          }
          .mobile-nav-pills > div {
            justify-content: flex-start !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            padding-right: 20px !important;
          }
          
          .mobile-nav-pills > div::-webkit-scrollbar {
            display: none !important;
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
          
          .navbar-left-mobile .navbar-logo-container {
            position: relative !important;
            left: 0 !important;
            transform: none !important;
            flex: 0 0 auto !important;
          }
          
          .navbar-left-mobile .navbar-logo-link {
            padding: 4px 8px !important;
          }
          
          .navbar-left-mobile .navbar-logo {
            maxHeight: 28px !important;
            maxWidth: 100px !important;
          }
          
          .mobile-language-wrapper-left button {
            width: 40px !important;
            height: 40px !important;
          }
          .mobile-nav-pills {
            display: none !important;
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
            border: none !important;
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