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
            padding: "0 80px 0 80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
            minHeight: "80px",
            position: "relative",
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
              justifyContent: "flex-end",
              gap: "12px",
              flexShrink: 0,
              height: "100%",
              marginLeft: "auto",
              marginRight: "0",
              paddingRight: "0",
            }}
          >
            {/* Become a Host / Add a listing */}
            {currentUser ? (
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
                  marginTop: "3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F7F7F7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Add a listing
              </Link>
            ) : (
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
            )}


            {/* UserMenu Component - Top Right */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "flex-end",
              height: "100%",
              position: "relative",
            }}>
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
            padding: "0 8px 0 16px",
            height: "70px",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            width: "100%",
            boxSizing: "border-box",
            position: "relative",
          }}
          data-mobile-nav="true"
        >
          {/* Logo */}
          <Link 
            href="/" 
            style={{ 
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              height: "100%",
              flexShrink: 0,
              minWidth: 0,
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
                maxWidth: "150px",
                objectFit: "contain",
              }}
              priority
            />
          </Link>
          
          {/* Right Side: Profile Button or Login */}
          <div 
            className="mobile-nav-right"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "flex-end",
              gap: "8px", 
              height: "100%", 
              flexShrink: 0,
              minWidth: 0,
              marginLeft: "auto",
            marginRight: "0",
            paddingRight: "0",
          }}
        >
            {currentUser ? (
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  height: "100%",
                  position: "relative",
                  flexShrink: 0,
                  alignSelf: "flex-start",
              marginRight: "-65px",
              marginTop: "-4px",
              paddingRight: "0",
              }}
            >
              <UserMenu currentUser={currentUser} />
            </div>
            ) : (
              <Link
                href="/auth/signin"
                className="mobile-login-link"
                style={{
                  padding: "10px 16px",
                  borderRadius: "22px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222222",
                  textDecoration: "none",
                  backgroundColor: "#F7F7F7",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  height: "40px",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E8E8E8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F7F7F7";
                }}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
        )}

      </div>

      {/* Mobile Menu Overlay - Hidden since navbar is removed */}
      {false && isMobileMenuOpen && (
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
            display: "none", // Hidden - navbar removed
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer - Hidden since navbar is removed */}
      <div
        id="mobile-menu"
        className="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          display: "none", // Hidden - navbar removed
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
        {/* Navbar content removed */}
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
