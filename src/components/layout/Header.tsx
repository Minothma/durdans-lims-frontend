"use client";

import { Bell } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface HeaderProps {
  userName?: string;
  userRole?: string;
  navLinks?: NavLink[];
}

export function Header({
  userName = "Dr. Aritha Perera",
  userRole = "Lab Manager",
  navLinks = [],
}: HeaderProps) {
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        height: "48px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px",
        paddingRight: "20px",
        gap: "24px",
        flexShrink: 0,
      }}
    >
      {/* Nav Links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flex: 1,
        }}
      >
        {navLinks.map((link: NavLink) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              padding: "6px 12px",
              fontSize: "14px",
              borderRadius: "4px",
              textDecoration: "none",
              color: link.active ? "#1E6FD9" : "#64748b",
              fontWeight: link.active ? 600 : 400,
              borderBottom: link.active ? "2px solid #1E6FD9" : "2px solid transparent",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Bell Icon */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={16} color="#64748b" />
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "8px",
              height: "8px",
              backgroundColor: "#ef4444",
              borderRadius: "50%",
              display: "block",
            }}
          />
        </div>

        {/* User Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#334155",
                lineHeight: 1.2,
              }}
            >
              {userName}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#94a3b8",
                lineHeight: 1.2,
              }}
            >
              {userRole}
            </div>
          </div>

          {/* Avatar */}
          <div
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "#1E6FD9",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              {initials}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}