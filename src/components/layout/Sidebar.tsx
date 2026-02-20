"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  CheckCircle,
  ClipboardList,
  Send,
  Settings,
  HelpCircle,
  FileCheck,
  Truck,
  AlertOctagon,
  ShieldCheck,
  FileText,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  section: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    section: "TECHNICAL VERIFICATION",
    items: [
      { label: "Pending Verification", href: "/verification/pending", icon: ClipboardList },
      { label: "Bulk Approval", href: "/verification/bulk-approval", icon: CheckCircle },
    ],
  },
  {
    section: "CLINICAL AUTHORIZATION",
    items: [
      { label: "Validation Worklist", href: "/clinical/worklist", icon: ShieldCheck },
      { label: "Review Case", href: "/clinical/review", icon: FileCheck },
    ],
  },
  {
    section: "REPORT DISPATCH",
    items: [
      { label: "Dispatch Dashboard", href: "/dispatch/dashboard", icon: Send },
      { label: "Authorized Reports", href: "/dispatch/authorized-reports", icon: FileText },
      { label: "Delivery Status", href: "/dispatch/delivery-status", icon: Truck },
      { label: "Failed Deliveries", href: "/dispatch/failed-deliveries", icon: AlertOctagon },
    ],
  },
  {
    section: "SUPPORT & SETTINGS",
    items: [
      { label: "Configurations", href: "/settings", icon: Settings },
      { label: "Help Center", href: "/help", icon: HelpCircle },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "224px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
        }}
      >
        <Link
          href="/verification/pending"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "#1E6FD9",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FlaskConical size={16} color="#ffffff" />
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            <span style={{ color: "#1E6FD9" }}>DURDANS</span>
            {" ERP"}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {navGroups.map((group: NavGroup) => (
          <div key={group.section}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "0 8px",
                marginBottom: "6px",
                margin: 0,
                paddingBottom: "6px",
              }}
            >
              {group.section}
            </p>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {group.items.map((item: NavItem) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const IconComponent = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        backgroundColor: isActive ? "#EFF6FF" : "transparent",
                        color: isActive ? "#1E6FD9" : "#475569",
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "13px",
                      }}
                    >
                      <IconComponent
                        size={16}
                        color={isActive ? "#1E6FD9" : "#94a3b8"}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {isActive && (
                        <ChevronRight size={12} color="#1E6FD9" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}