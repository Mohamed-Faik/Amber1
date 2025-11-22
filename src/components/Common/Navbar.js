"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, LayoutGrid, Info, Mail } from "lucide-react";
import UserMenu from "./UserMenu";

const Navbar = ({ currentUser }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size - only show mobile nav on actual phones/tablets
  useEffect(() => {
    const checkMobile = () => {
      // Use 992px breakpoint - laptops will show desktop nav
      setIsMobile(window.innerWidth < 992);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <nav role="navigation" aria-label="Main navigation">
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
        {!isMobile && (
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
            minHeight: "80px",
          }}
          data-desktop-nav="true"
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
              <Image
                src="/images/amberhomes png.png"
                alt="AmberHomes Logo"
                width={180}
                height={50}
                style={{
                  height: "auto",
                  width: "auto",
                  maxHeight: "50px",
                  objectFit: "contain",
                }}
                priority
              />
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
                    padding: "12px 20px",
                    borderRadius: "22px",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: isActive ? "#000000" : "#000000",
                    textDecoration: "none",
                    backgroundColor: isActive ? "#F7F7F7" : "transparent",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
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
                padding: "14px 24px",
                borderRadius: "22px",
                fontSize: "15px",
                fontWeight: "600",
                color: "#222222",
                textDecoration: "none",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F7F7F7";
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
        )}

        {/* Mobile/Tablet Navbar */}
        {isMobile && (
        <div
          className="mobile-nav"
          style={{
            display: "flex",
            padding: "0 16px",
            height: "70px",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            width: "100%",
          }}
          data-mobile-nav="true"
        >
          <Link 
            href="/" 
            style={{ 
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              height: "100%",
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/amberhomes png.png"
              alt="AmberHomes Logo"
              width={150}
              height={40}
              style={{
                height: "auto",
                width: "auto",
                maxHeight: "40px",
                objectFit: "contain",
              }}
              priority
            />
          </Link>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "100%", flexShrink: 0 }}>
            {/* Host button - show for all users */}
            <Link
              href="/listings/new"
              className="mobile-host-link"
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#222222",
                textDecoration: "none",
                backgroundColor: "#F7F7F7",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              Host
            </Link>
            
            {/* UserMenu or Log in button */}
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <UserMenu currentUser={currentUser} />
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="mobile-login-link"
                style={{
                  padding: "8px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#222222",
                  textDecoration: "none",
                  backgroundColor: "#F7F7F7",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Log in
              </Link>
            )}
            
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button"
              style={{
                padding: "8px",
                border: "1px solid #E0E0E0",
                borderRadius: "20px",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                height: "40px",
                width: "40px",
                flexShrink: 0,
              }}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X size={18} color="#222222" strokeWidth={2} aria-hidden="true" />
              ) : (
                <Menu size={18} color="#222222" strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        )}

      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: "fixed",
            top: "70px",
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
        id="mobile-menu"
        className="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: "fixed",
          top: "70px",
          right: isMobileMenuOpen ? 0 : "-100%",
          width: "100%",
          maxWidth: "400px",
          height: "calc(100vh - 70px)",
          backgroundColor: "#FFFFFF",
          zIndex: 1000,
          boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
          transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ padding: "20px 16px" }}>
          {/* Mobile Navigation Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-nav-link"
                  style={{
                    padding: "14px 16px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: isActive ? "#222222" : "#717171",
                    textDecoration: "none",
                    backgroundColor: isActive ? "#F7F7F7" : "transparent",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    border: isActive ? "1px solid #E0E0E0" : "1px solid transparent",
                    minHeight: "48px",
                    WebkitTapHighlightColor: "transparent",
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
              margin: "20px 0",
            }}
          />

          {/* Additional Mobile Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Show auth buttons if user is NOT logged in */}
            {!currentUser && (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-login-button"
                  style={{
                    padding: "14px 20px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#222222",
                    textDecoration: "none",
                    backgroundColor: "#F7F7F7",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    border: "1px solid #E0E0E0",
                    minHeight: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-signup-button"
                  style={{
                    padding: "14px 20px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
                    minHeight: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Sign up
                </Link>
              </>
            )}

            {/* Show Become a Host button if user IS logged in */}
            {currentUser && (
              <Link
                href="/listings/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-host-button"
                style={{
                  padding: "14px 20px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Become a Host
              </Link>
            )}
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

        /* Tablet and Mobile: < 992px */
        @media (max-width: 991px) {
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
            padding: 0 12px !important;
            height: 64px !important;
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
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .mobile-nav {
            padding: 0 12px !important;
            height: 60px !important;
          }

          .mobile-menu-drawer {
            top: 60px !important;
            height: calc(100vh - 60px) !important;
          }

          .mobile-menu-overlay {
            top: 60px !important;
          }
        }

        /* Tablet: 768px - 991px */
        @media (min-width: 768px) and (max-width: 991px) {
          .desktop-nav {
            padding: 0 40px !important;
          }
        }

        /* Desktop and Laptop: >= 992px */
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav {
            display: none !important;
          }
        }

        /* Large Desktop: >= 1400px */
        @media (min-width: 1400px) {
          .desktop-nav {
            padding: 0 80px !important;
          }
        }

        /* Touch improvements */
        .mobile-nav-link:active,
        .mobile-host-button:active {
          opacity: 0.8;
          transform: scale(0.98);
        }

        .mobile-menu-button:active {
          transform: scale(0.95);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
