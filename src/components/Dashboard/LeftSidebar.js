"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";

const LeftSidebar = ({ pendingListingsCount: initialPendingCount = null }) => {
  const currentRoute = usePathname();
  const [pendingListingsCount, setPendingListingsCount] = useState(initialPendingCount !== null ? initialPendingCount : 0);
  const [isLoading, setIsLoading] = useState(initialPendingCount === null);

  // Fetch pending count client-side if not provided as prop
  useEffect(() => {
    if (initialPendingCount !== null) {
      return; // Don't fetch if count was passed as prop
    }

    const fetchPendingCount = async () => {
      try {
        const response = await fetch("/api/notifications/pending-count");
        if (response.ok) {
          const data = await response.json();
          setPendingListingsCount(data.count || 0);
        }
      } catch (error) {
        console.error("Error fetching pending count:", error);
        setPendingListingsCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingCount();

    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);

    return () => clearInterval(interval);
  }, [initialPendingCount]);

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: "👥",
    },
    {
      href: "/dashboard/listings",
      label: "Listings",
      icon: "📋",
      showBadge: true,
      badgeCount: pendingListingsCount,
    },
    {
      href: "/dashboard/reviews",
      label: "Reviews",
      icon: "⭐",
    },
    {
      href: "/dashboard/blog",
      label: "Blog Posts",
      icon: "📝",
    },
    {
      href: "/dashboard/blog/new",
      label: "Create Blog",
      icon: "➕",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e5e7eb",
        height: "fit-content",
        position: "sticky",
        top: "24px",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
            }}
          >
            Admin Panel
          </h3>
          {pendingListingsCount > 0 && (
            <Link
              href="/dashboard/listings?status=Pending"
              style={{
                position: "relative",
                textDecoration: "none",
              }}
              title={`${pendingListingsCount} pending listing${pendingListingsCount !== 1 ? 's' : ''} awaiting approval`}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "24px",
                  height: "24px",
                  padding: "0 8px",
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "700",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                  animation: pendingListingsCount > 0 ? "pulse 2s infinite" : "none",
                }}
              >
                {pendingListingsCount > 99 ? "99+" : pendingListingsCount}
              </span>
              <style jsx>{`
                @keyframes pulse {
                  0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                  }
                  50% {
                    opacity: 0.8;
                    transform: scale(1.05);
                  }
                }
              `}</style>
            </Link>
          )}
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "#6B7280",
            margin: 0,
          }}
        >
          Navigation Menu
        </p>
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {menuItems.map((item, index) => {
          const isActive = currentRoute === item.href;
          return (
            <li key={index} style={{ marginBottom: "8px" }}>
              <Link
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: isActive ? "#667eea" : "#6B7280",
                  backgroundColor: isActive ? "#F5F3FF" : "transparent",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  border: isActive ? "1px solid #E9D5FF" : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                    e.currentTarget.style.color = "#111827";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#6B7280";
                  }
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.showBadge && item.badgeCount > 0 && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "20px",
                      height: "20px",
                      padding: "0 6px",
                      backgroundColor: "#EF4444",
                      color: "#FFFFFF",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "700",
                      marginLeft: "auto",
                    }}
                  >
                    {item.badgeCount > 99 ? "99+" : item.badgeCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "12px",
            textDecoration: "none",
            color: "#6B7280",
            fontWeight: "500",
            fontSize: "14px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F9FAFB";
            e.currentTarget.style.color = "#111827";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#6B7280";
          }}
        >
          <span style={{ fontSize: "20px" }}>🏠</span>
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  );
}

export default LeftSidebar;