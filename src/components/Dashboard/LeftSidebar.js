"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";

const LeftSidebar = () => {
  const currentRoute = usePathname();

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
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "4px",
          }}
        >
          Admin Panel
        </h3>
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
                <span>{item.label}</span>
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