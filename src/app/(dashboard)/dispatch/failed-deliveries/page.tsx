"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertOctagon, RefreshCw, Mail,
  Printer, Smartphone, Globe,
  Search, Filter, ChevronLeft,
  ChevronRight, CheckSquare, XCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/common/StatCard";
import { mockFailedDeliveries } from "@/data/mockData";
import { DeliveryMethod } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const ITEMS_PER_PAGE = 10;

const headerNavLinks = [
  { label: "Verification", href: "/verification/pending", active: false },
  { label: "Clinical Authorization", href: "/clinical/worklist", active: false },
  { label: "Dispatch", href: "/dispatch/dashboard", active: true },
];

const methodIcons: Record<DeliveryMethod, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  EMAIL: { icon: Mail, color: "#1d4ed8", bg: "#eff6ff", label: "Email" },
  PRINT: { icon: Printer, color: "#15803d", bg: "#f0fdf4", label: "Print" },
  SMS: { icon: Smartphone, color: "#b45309", bg: "#fffbeb", label: "SMS" },
  PORTAL: { icon: Globe, color: "#6d28d9", bg: "#f5f3ff", label: "Portal" },
};

const failureReasonData = [
  { reason: "Gateway Timeout", count: 5 },
  { reason: "Invalid Address", count: 3 },
  { reason: "Connection Refused", count: 2 },
  { reason: "Mailbox Full", count: 4 },
  { reason: "Other", count: 1 },
];

const CHART_COLORS = ["#ef4444", "#f97316", "#eab308", "#dc2626", "#94a3b8"];

export default function FailedDeliveriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [retried, setRetried] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockFailedDeliveries.filter((r) => {
      const matchesSearch =
        r.reportId.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.testName.toLowerCase().includes(q) ||
        r.failureReason.toLowerCase().includes(q);
      const matchesMethod =
        methodFilter === "All" || r.method === methodFilter;
      return matchesSearch && matchesMethod;
    });
  }, [search, methodFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalFailed = mockFailedDeliveries.length;
  const maxRetries = mockFailedDeliveries.filter((r) => r.retryCount >= 5).length;
  const avgRetries = (
    mockFailedDeliveries.reduce((sum, r) => sum + r.retryCount, 0) /
    mockFailedDeliveries.length
  ).toFixed(1);

  const allSelected =
    paginated.length > 0 &&
    paginated.every((r) => selectedIds.includes(r.reportId));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginated.find((r) => r.reportId === id))
      );
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...paginated
          .map((r) => r.reportId)
          .filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRetry = (reportId: string) => {
    setRetried((prev) => [...prev, reportId]);
    setSelectedIds((prev) => prev.filter((id) => id !== reportId));
    setTimeout(() => {
      alert(`Retrying delivery for ${reportId}...`);
    }, 300);
  };

  const handleBulkRetry = () => {
    setRetried((prev) => [...prev, ...selectedIds]);
    alert(`Retrying ${selectedIds.length} failed deliveries...`);
    setSelectedIds([]);
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
              Failed Deliveries
            </h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
              Investigate and retry failed report deliveries.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={14} color="#94a3b8"
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Search Report ID or Patient..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                style={{ paddingLeft: "32px", paddingRight: "12px", height: "32px", width: "240px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", outline: "none", color: "#1e293b" }}
              />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <StatCard
            title="Total Failed"
            value={totalFailed}
            subtitle="Deliveries"
            icon={AlertOctagon}
            iconBg="#fff1f2"
            iconColor="#e11d48"
          />
          <StatCard
            title="Max Retries Reached"
            value={maxRetries}
            subtitle="Need manual action"
            icon={XCircle}
            iconBg="#fef9c3"
            iconColor="#d97706"
          />
          <StatCard
            title="Avg Retry Count"
            value={avgRetries}
            subtitle="Per failed delivery"
            icon={RefreshCw}
            iconBg="#f5f3ff"
            iconColor="#7c3aed"
          />
        </div>

        {/* Chart + Method Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: "16px" }}>

          {/* Failure Reasons Chart */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>
                Failure Reasons Breakdown
              </h3>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                Count by failure type
              </p>
            </div>
            <div style={{ height: "180px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={failureReasonData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  barSize={28}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="reason"
                    tick={{ fontSize: 9, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "6px", fontSize: "11px", color: "#ffffff" }}
                    formatter={(value) => [`${value} failures`, "Count"]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {failureReasonData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Method Breakdown */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: "0 0 14px 0" }}>
              Failed by Method
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(Object.keys(methodIcons) as DeliveryMethod[]).map((method) => {
                const m = methodIcons[method];
                const IconComp = m.icon;
                const count = mockFailedDeliveries.filter((r) => r.method === method).length;
                if (count === 0) return null;
                return (
                  <div
                    key={method}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", backgroundColor: m.bg, borderRadius: "6px", cursor: "pointer" }}
                    onClick={() => { setMethodFilter(method); setCurrentPage(1); }}
                  >
                    <div style={{ width: "28px", height: "28px", borderRadius: "6px", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComp size={14} color={m.color} />
                    </div>
                    <span style={{ flex: 1, fontSize: "12px", fontWeight: 500, color: "#334155" }}>{m.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#ef4444" }}>{count}</span>
                  </div>
                );
              })}
            </div>
            {methodFilter !== "All" && (
              <button
                onClick={() => setMethodFilter("All")}
                style={{ width: "100%", marginTop: "10px", height: "28px", fontSize: "11px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Failed Deliveries Table */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                Failed Deliveries
              </span>
              <span style={{ padding: "2px 8px", backgroundColor: "#fee2e2", color: "#b91c1c", fontSize: "11px", fontWeight: 600, borderRadius: "4px" }}>
                {filtered.length} Records
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button style={{ display: "flex", alignItems: "center", gap: "4px", height: "28px", padding: "0 10px", fontSize: "12px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}>
                <Filter size={12} />
                Filter
              </button>
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkRetry}
                  style={{ display: "flex", alignItems: "center", gap: "4px", height: "28px", padding: "0 12px", fontSize: "12px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: "#dc2626", color: "#ffffff", cursor: "pointer" }}
                >
                  <RefreshCw size={12} />
                  Bulk Retry ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th style={{ width: "40px", padding: "10px 16px", textAlign: "left", borderBottom: "1px solid #f1f5f9" }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      style={{ cursor: "pointer", width: "14px", height: "14px" }}
                    />
                  </th>
                  {["Report ID", "Patient", "Test", "Method", "Failure Reason", "Failed At", "Retries", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "48px", color: "#94a3b8", fontSize: "13px" }}>
                      No failed deliveries found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((record) => {
                    const isSelected = selectedIds.includes(record.reportId);
                    const isRetried = retried.includes(record.reportId);
                    const m = methodIcons[record.method];
                    const IconComp = m?.icon;

                    return (
                      <tr
                        key={record.reportId}
                        style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: isRetried ? "#f0fdf4" : isSelected ? "#fff8f8" : "#ffffff" }}
                      >
                        {/* Checkbox */}
                        <td style={{ padding: "12px 16px" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOne(record.reportId)}
                            disabled={isRetried}
                            style={{ cursor: isRetried ? "not-allowed" : "pointer", width: "14px", height: "14px" }}
                          />
                        </td>

                        {/* Report ID */}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                            {record.reportId}
                          </span>
                        </td>

                        {/* Patient */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>
                            {record.patientName}
                          </div>
                        </td>

                        {/* Test */}
                        <td style={{ padding: "12px 16px", fontSize: "12px", color: "#475569" }}>
                          {record.testName}
                        </td>

                        {/* Method */}
                        <td style={{ padding: "12px 16px" }}>
                          {m && IconComp && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <div style={{ width: "24px", height: "24px", borderRadius: "4px", backgroundColor: m.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <IconComp size={12} color={m.color} />
                              </div>
                              <span style={{ fontSize: "12px", color: "#475569" }}>{m.label}</span>
                            </div>
                          )}
                        </td>

                        {/* Failure Reason */}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px", backgroundColor: "#fee2e2", borderRadius: "4px", fontSize: "11px", fontWeight: 500, color: "#b91c1c" }}>
                            {record.failureReason}
                          </span>
                        </td>

                        {/* Failed At */}
                        <td style={{ padding: "12px 16px", fontSize: "12px", color: "#475569" }}>
                          {record.failedDateTime}
                        </td>

                        {/* Retry Count */}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 700,
                            backgroundColor: record.retryCount >= 5 ? "#fee2e2" : "#f1f5f9",
                            color: record.retryCount >= 5 ? "#b91c1c" : "#475569",
                          }}>
                            {record.retryCount}x
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "12px 16px" }}>
                          {isRetried ? (
                            <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>
                              ✓ Retried
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRetry(record.reportId)}
                              style={{ display: "flex", alignItems: "center", gap: "4px", height: "28px", padding: "0 12px", fontSize: "12px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: "#dc2626", color: "#ffffff", cursor: "pointer" }}
                            >
                              <RefreshCw size={12} />
                              Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #f1f5f9", backgroundColor: "#fafafa" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Showing <strong>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> failed deliveries
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