"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, LayoutGrid, Info, Mail } from "lucide-react";
import logo from "../../../public/images/logo.png";
import UserMenu from "./UserMenu";

const Navbar = ({ currentUser }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
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

  // Don't show navbar on auth pages or admin login
  if (pathname?.startsWith("/auth") || pathname?.startsWith("/admin/login")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/listings", label: "Listings", icon: LayoutGrid },
    { href: "/about-us", label: "About", icon: Info },
    { href: "/contact-us", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: isScrolled ? "#FFFFFF" : "#FFFFFF",
          borderBottom: isScrolled ? "1px solid #E0E0E0" : "1px solid #E0E0E0",
          boxShadow: isScrolled 
            ? "0 2px 12px rgba(0, 0, 0, 0.08)" 
            : "0 1px 2px rgba(0, 0, 0, 0.04)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Desktop Navbar */}
        <div
          className="desktop-nav"
          style={{
            maxWidth: "1760px",
            margin: "0 auto",
            padding: "0 80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
          }}
        >
          {/* Left: Logo */}
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", height: "100%" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                gap: "8px",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                AmberHomes
              </div>
            </Link>
          </div>

          {/* Center: Navigation Menu */}
          <div
            style={{
              flex: "1 1 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              margin: "0 24px",
            }}
          >
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "22px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: isActive ? "#000000" : "#000000",
                    textDecoration: "none",
                    backgroundColor: isActive ? "#F7F7F7" : "transparent",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#F7F7F7";
                      e.currentTarget.style.color = "#000000";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#000000";
                    }
                  }}
                >
                  <IconComponent size={16} strokeWidth={2} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: User Menu & Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
              height: "100%",
            }}
          >
            {/* Become a Host */}
            <Link
              href="/listings/new"
              style={{
                padding: "12px 20px",
                borderRadius: "22px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#222222",
                textDecoration: "none",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Become a Host
            </Link>


            {/* UserMenu Component */}
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Navbar */}
        <div
          className="mobile-nav"
          style={{
            display: "none",
            padding: "0 24px",
            height: "80px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link 
            href="/" 
            style={{ 
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              AmberHomes
            </div>
          </Link>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "100%" }}>
            <Link
              href="/listings/new"
              style={{
                padding: "10px 16px",
                borderRadius: "22px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#222222",
                textDecoration: "none",
                backgroundColor: "#F7F7F7",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              Host
            </Link>
            
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <UserMenu currentUser={currentUser} />
            </div>
            
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                padding: "10px",
                border: "1px solid #E0E0E0",
                borderRadius: "22px",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                height: "42px",
                width: "42px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F7F7F7";
                e.currentTarget.style.borderColor = "#222222";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.borderColor = "#E0E0E0";
              }}
            >
              {isMobileMenuOpen ? (
                <X size={20} color="#222222" strokeWidth={2} />
              ) : (
                <Menu size={20} color="#222222" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            animation: "fadeIn 0.2s ease",
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          right: isMobileMenuOpen ? 0 : "-100%",
          width: "320px",
          maxWidth: "85vw",
          height: "calc(100vh - 80px)",
          backgroundColor: "#FFFFFF",
          zIndex: 1000,
          boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
          transition: "right 0.3s ease",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "24px" }}>
          {/* Mobile Navigation Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: isActive ? "#222222" : "#717171",
                    textDecoration: "none",
                    backgroundColor: isActive ? "#F7F7F7" : "transparent",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    border: isActive ? "1px solid #E0E0E0" : "1px solid transparent",
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
                  <IconComponent 
                    size={20} 
                    color={isActive ? "#FF385C" : "#717171"}
                    strokeWidth={2} 
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#E0E0E0",
              margin: "24px 0",
            }}
          />

          {/* Additional Mobile Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              href="/listings/new"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: "16px 20px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "600",
                color: "#FFFFFF",
                textDecoration: "none",
                background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
                textAlign: "center",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 56, 92, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.3)";
              }}
            >
              Become a Host
            </Link>

          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Tablet: 768px - 1128px */
        @media (max-width: 1128px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: flex !important;
          }
        }

        /* Mobile: < 768px */
        @media (max-width: 767px) {
          .mobile-nav {
            padding: 0 16px !important;
          }
        }

        /* Desktop: > 1128px */
        @media (min-width: 1129px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
