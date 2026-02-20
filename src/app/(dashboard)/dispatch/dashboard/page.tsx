"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Send, CheckCircle, XCircle, Clock,
  Mail, Printer, Smartphone, Globe,
  Search, Filter, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/common/StatCard";
import { DeliveryStatusBadge } from "@/components/common/StatusBadges";
import { mockDispatchReports } from "@/data/mockData";
import { DispatchReport, DeliveryMethod } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const ITEMS_PER_PAGE = 10;

const headerNavLinks = [
  { label: "Verification", href: "/verification/pending", active: false },
  { label: "Clinical Authorization", href: "/clinical/worklist", active: false },
  { label: "Dispatch", href: "/dispatch/dashboard", active: true },
];

const dispatchVolumeData = [
  { time: "08:00", dispatched: 5 },
  { time: "09:00", dispatched: 12 },
  { time: "10:00", dispatched: 8 },
  { time: "11:00", dispatched: 15 },
  { time: "12:00", dispatched: 10 },
  { time: "13:00", dispatched: 18 },
  { time: "14:00", dispatched: 7 },
];

const methodIcons: Record<DeliveryMethod, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  EMAIL: { icon: Mail, color: "#1d4ed8", bg: "#eff6ff", label: "Email" },
  PRINT: { icon: Printer, color: "#15803d", bg: "#f0fdf4", label: "Print" },
  SMS: { icon: Smartphone, color: "#b45309", bg: "#fffbeb", label: "SMS" },
  PORTAL: { icon: Globe, color: "#6d28d9", bg: "#f5f3ff", label: "Portal" },
};

export default function DispatchDashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockDispatchReports.filter((r) => {
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

  const totalReports = mockDispatchReports.length;
  const deliveredCount = mockDispatchReports.filter((r) => r.status === "DELIVERED").length;
  const failedCount = mockDispatchReports.filter((r) => r.status === "FAILED").length;
  const pendingCount = mockDispatchReports.filter((r) => r.status === "PENDING").length;

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
              Report Dispatch Dashboard
            </h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
              Manage and track authorized laboratory report deliveries.
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <Search size={14} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search Report ID or Patient..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: "32px", paddingRight: "12px", height: "32px", width: "260px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", outline: "none", color: "#1e293b" }}
            />
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          <StatCard
            title="Total Reports"
            value={totalReports}
            subtitle="Today"
            icon={Send}
            iconBg="#eff6ff"
            iconColor="#1d4ed8"
          />
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
            subtitle="Awaiting dispatch"
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

        {/* Charts + Delivery Methods Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "16px" }}>

          {/* Dispatch Volume Chart */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>
                Dispatch Volume Today
              </h3>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                Reports dispatched per hour
              </p>
            </div>
            <div style={{ height: "160px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dispatchVolumeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "6px", fontSize: "11px", color: "#ffffff" }}
                    formatter={(value) => [`${value} reports`, "Dispatched"]}
                  />
                  <Bar dataKey="dispatched" fill="#1E6FD9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Delivery Methods Panel */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: "0 0 16px 0" }}>
              Delivery Methods
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {(Object.keys(methodIcons) as DeliveryMethod[]).map((method) => {
                const m = methodIcons[method];
                const IconComp = m.icon;
                const count = mockDispatchReports.filter((r) =>
                  r.deliveryMethods.includes(method)
                ).length;
                return (
                  <div
                    key={method}
                    style={{ padding: "12px", backgroundColor: m.bg, borderRadius: "8px", display: "flex", flexDirection: "column", gap: "6px" }}
                  >
                    <div style={{ width: "28px", height: "28px", borderRadius: "6px", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComp size={14} color={m.color} />
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>{count}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {["All", "PENDING", "DELIVERED", "FAILED"].map((status) => (
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
                      {mockDispatchReports.filter((r) => r.status === status).length}
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
                  {["Report ID", "Patient", "Test Name", "Authorized", "Delivery Methods", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "#94a3b8", fontSize: "13px" }}>
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((report: DispatchReport) => (
                    <tr key={report.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}>

                      {/* Report ID */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                          {report.reportId}
                        </span>
                      </td>

                      {/* Patient */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>{report.patientName}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{report.patientId}</div>
                      </td>

                      {/* Test Name */}
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: "#475569" }}>
                        {report.testName}
                      </td>

                      {/* Authorized */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "12px", color: "#334155" }}>{report.authorizedDate}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{report.authorizedTime}</div>
                      </td>

                      {/* Delivery Methods */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {report.deliveryMethods.map((method) => {
                            const m = methodIcons[method];
                            if (!m) return null;
                            const IconComp = m.icon;
                            return (
                              <div
                                key={method}
                                title={m.label}
                                style={{ width: "24px", height: "24px", borderRadius: "4px", backgroundColor: m.bg, display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                <IconComp size={12} color={m.color} />
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "12px 16px" }}>
                        <DeliveryStatusBadge status={report.status} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => router.push(`/dispatch/authorized-reports/${report.reportId}`)}
                          style={{ height: "28px", padding: "0 12px", fontSize: "12px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: "#1E6FD9", color: "#ffffff", cursor: "pointer" }}
                        >
                          View Report
                        </button>
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
              Showing <strong>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> reports
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