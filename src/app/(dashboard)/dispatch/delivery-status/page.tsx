"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle, Clock, XCircle, Send,
  Download, Search, Filter,
  ChevronLeft, ChevronRight,
  Mail, Printer, Smartphone, Globe,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/common/StatCard";
import { DeliveryStatusBadge } from "@/components/common/StatusBadges";
import { mockDeliveryRecords } from "@/data/mockData";
import { DeliveryMethod } from "@/types";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const ITEMS_PER_PAGE = 10;

const headerNavLinks = [
  { label: "Verification", href: "/verification/pending", active: false },
  { label: "Clinical Authorization", href: "/clinical/worklist", active: false },
  { label: "Dispatch", href: "/dispatch/dashboard", active: true },
];

const deliveryTrendData = [
  { time: "08:00", delivered: 4, failed: 1 },
  { time: "09:00", delivered: 8, failed: 0 },
  { time: "10:00", delivered: 6, failed: 2 },
  { time: "11:00", delivered: 12, failed: 1 },
  { time: "12:00", delivered: 9, failed: 0 },
  { time: "13:00", delivered: 15, failed: 1 },
  { time: "14:00", delivered: 7, failed: 3 },
];

const methodIcons: Record<DeliveryMethod, { icon: React.ElementType; color: string; bg: string }> = {
  EMAIL: { icon: Mail, color: "#1d4ed8", bg: "#eff6ff" },
  PRINT: { icon: Printer, color: "#15803d", bg: "#f0fdf4" },
  SMS: { icon: Smartphone, color: "#b45309", bg: "#fffbeb" },
  PORTAL: { icon: Globe, color: "#6d28d9", bg: "#f5f3ff" },
};

export default function DeliveryStatusPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockDeliveryRecords.filter((r) => {
      const matchesSearch =
        r.reportId.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.testName.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const deliveredCount = mockDeliveryRecords.filter((r) => r.status === "DELIVERED").length;
  const pendingCount = mockDeliveryRecords.filter((r) => r.status === "PENDING").length;
  const failedCount = mockDeliveryRecords.filter((r) => r.status === "FAILED").length;

  const handleExportAuditLog = () => {
    const rows = [
      ["Report ID", "Patient", "Test", "Methods", "Status", "Dispatched", "Delivered"],
      ...mockDeliveryRecords.map((r) => [
        r.reportId,
        r.patientName,
        r.testName,
        r.methods.join(", "),
        r.status,
        r.dispatchedTime,
        r.deliveredTime ?? "—",
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "delivery_audit_log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", height: "auto" }}>
      <Header
        userName="Dr. Aritha Perera"
        userRole="Dispatch Officer"
        navLinks={headerNavLinks}
      />

      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Page Title */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b", margin: 0 }}>
              Delivery Status
            </h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
              Track and monitor report delivery across all channels.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search Report ID or Patient..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                style={{ paddingLeft: "32px", paddingRight: "12px", height: "32px", width: "240px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", outline: "none", color: "#1e293b" }}
              />
            </div>
            <button
              onClick={handleExportAuditLog}
              style={{ display: "flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 14px", fontSize: "12px", fontWeight: 500, border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}
            >
              <Download size={14} />
              Export Audit Log
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <StatCard
            title="Delivered"
            value={deliveredCount}
            subtitle="Successfully sent"
            icon={CheckCircle}
            iconBg="#f0fdf4"
            iconColor="#16a34a"
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            subtitle="Awaiting delivery"
            icon={Clock}
            iconBg="#fffbeb"
            iconColor="#d97706"
          />
          <StatCard
            title="Failed"
            value={failedCount}
            subtitle="Require attention"
            icon={XCircle}
            iconBg="#fff1f2"
            iconColor="#e11d48"
          />
        </div>

        {/* Delivery Trend Chart */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>
                Delivery Trend Today
              </h3>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                Delivered vs Failed per hour
              </p>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "10px", height: "3px", backgroundColor: "#22c55e", display: "inline-block", borderRadius: "2px" }} />
                <span style={{ fontSize: "11px", color: "#64748b" }}>Delivered</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "10px", height: "3px", backgroundColor: "#ef4444", display: "inline-block", borderRadius: "2px" }} />
                <span style={{ fontSize: "11px", color: "#64748b" }}>Failed</span>
              </div>
            </div>
          </div>
          <div style={{ height: "180px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deliveryTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "6px", fontSize: "11px", color: "#ffffff" }}
                />
                <Line type="monotone" dataKey="delivered" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: "#22c55e", r: 4, stroke: "#ffffff", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: "#ef4444", r: 4, stroke: "#ffffff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Records Table */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {["All", "DELIVERED", "PENDING", "FAILED"].map((status) => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                  style={{
                    padding: "5px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 500,
                    border: "1px solid", borderColor: statusFilter === status ? "#1E6FD9" : "#e2e8f0",
                    backgroundColor: statusFilter === status ? "#eff6ff" : "#ffffff",
                    color: statusFilter === status ? "#1E6FD9" : "#64748b", cursor: "pointer",
                  }}
                >
                  {status}
                  {status !== "All" && (
                    <span style={{ marginLeft: "6px", padding: "1px 6px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, backgroundColor: statusFilter === status ? "#1E6FD9" : "#f1f5f9", color: statusFilter === status ? "#ffffff" : "#64748b" }}>
                      {mockDeliveryRecords.filter((r) => r.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "4px", height: "28px", padding: "0 10px", fontSize: "12px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}>
              <Filter size={12} />
              Filter
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  {["Report ID", "Patient", "Test", "Methods", "Status", "Dispatched", "Delivered", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "48px", color: "#94a3b8", fontSize: "13px" }}>
                      No delivery records found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: record.status === "FAILED" ? "#fff8f8" : "#ffffff" }}>

                      {/* Report ID */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                          {record.reportId}
                        </span>
                      </td>

                      {/* Patient */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>{record.patientName}</div>
                      </td>

                      {/* Test */}
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: "#475569" }}>
                        {record.testName}
                      </td>

                      {/* Methods */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {record.methods.map((method) => {
                            const m = methodIcons[method];
                            if (!m) return null;
                            const IconComp = m.icon;
                            return (
                              <div key={method} title={method} style={{ width: "24px", height: "24px", borderRadius: "4px", backgroundColor: m.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <IconComp size={12} color={m.color} />
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "12px 16px" }}>
                        <DeliveryStatusBadge status={record.status} />
                      </td>

                      {/* Dispatched */}
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: "#475569" }}>
                        {record.dispatchedTime}
                      </td>

                      {/* Delivered */}
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: record.deliveredTime ? "#16a34a" : "#94a3b8" }}>
                        {record.deliveredTime ?? "—"}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px" }}>
                        {record.status === "FAILED" ? (
                          <button
                            onClick={() => router.push("/dispatch/failed-deliveries")}
                            style={{ height: "28px", padding: "0 12px", fontSize: "12px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: "#dc2626", color: "#ffffff", cursor: "pointer" }}
                          >
                            Retry
                          </button>
                        ) : (
                          <button
                            onClick={() => router.push(`/dispatch/authorized-reports/${record.reportId}`)}
                            style={{ height: "28px", padding: "0 12px", fontSize: "12px", fontWeight: 500, border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #f1f5f9", backgroundColor: "#fafafa" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Showing <strong>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> records
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", fontWeight: page === currentPage ? 700 : 400, backgroundColor: page === currentPage ? "#1E6FD9" : "#ffffff", color: page === currentPage ? "#ffffff" : "#475569", cursor: "pointer" }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1 }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}