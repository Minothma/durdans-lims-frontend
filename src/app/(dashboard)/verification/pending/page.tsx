"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FlaskConical,
  AlertTriangle,
  XCircle,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { QCBadge, FlagBadge } from "@/components/common/StatusBadges";
import { Header } from "@/components/layout/Header";
import { mockPendingSamples } from "@/data/mockData";
import { PendingVerificationSample } from "@/types";

const ITEMS_PER_PAGE = 10;

const headerNavLinks = [
  { label: "Dashboard", href: "/dashboard", active: false },
  { label: "MLT Testing", href: "/mlt-testing", active: true },
  { label: "Patient Records", href: "/patient-records", active: false },
  { label: "Inventory", href: "/inventory", active: false },
];

export default function PendingVerificationPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReason, setExpandedReason] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockPendingSamples.filter((s) => {
      const matchesSearch =
        s.sampleId.toLowerCase().includes(q) ||
        s.patientName.toLowerCase().includes(q) ||
        s.testType.toLowerCase().includes(q) ||
        s.mltName.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "RETURNED" && s.verificationStatus === "RETURNED") ||
        (statusFilter === "PENDING" && s.verificationStatus !== "RETURNED");
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPending = mockPendingSamples.filter((s) => s.verificationStatus !== "RETURNED").length;
  const returnedCount = mockPendingSamples.filter((s) => s.verificationStatus === "RETURNED").length;
  const criticalPending = mockPendingSamples.filter((s) => s.urgency === "STAT").length;

  const allSelected =
    paginated.length > 0 &&
    paginated.every((s) => selectedIds.includes(s.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginated.find((s) => s.id === id))
      );
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...paginated.map((s) => s.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleReview = (sample: PendingVerificationSample) => {
    router.push(`/verification/review/${sample.sampleId}`);
  };

  const handleBulkApprove = () => {
    alert(`Approving ${selectedIds.length} selected samples`);
    setSelectedIds([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", height: "auto" }}>
      <Header
        userName="Dr. Aritha Perera"
        userRole="Lab Manager"
        navLinks={headerNavLinks}
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Page Title Row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b", margin: 0 }}>
              Technical Verification
            </h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
              Review and approve laboratory test results for clinical release.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search Sample ID or Patient..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                style={{ paddingLeft: "32px", paddingRight: "12px", height: "32px", width: "260px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", outline: "none", color: "#1e293b" }}
              />
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 12px", fontSize: "12px", fontWeight: 500, border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}>
              <Download size={14} />
              Export List
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <StatCard
            title="Total Pending"
            value={totalPending}
            subtitle="Samples"
            icon={FlaskConical}
            iconBg="#eff6ff"
            iconColor="#1d4ed8"
          />
          <StatCard
            title="Critical Pending"
            value={criticalPending}
            subtitle="Urgent"
            icon={AlertTriangle}
            iconBg="#fff1f2"
            iconColor="#e11d48"
          />
          <StatCard
            title="Returned Cases"
            value={returnedCount}
            subtitle="Need re-verification"
            icon={RotateCcw}
            iconBg="#fff7ed"
            iconColor="#ea580c"
          />
        </div>

        {/* Table Card */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
            {/* Filter Tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {["All", "PENDING", "RETURNED"].map((status) => (
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
                  {status === "RETURNED" && returnedCount > 0 && (
                    <span style={{ marginLeft: "6px", padding: "1px 6px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, backgroundColor: statusFilter === status ? "#1E6FD9" : "#fee2e2", color: statusFilter === status ? "#ffffff" : "#b91c1c" }}>
                      {returnedCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button style={{ display: "flex", alignItems: "center", gap: "4px", height: "28px", padding: "0 10px", fontSize: "12px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}>
                <Filter size={12} />
                Filter
              </button>
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkApprove}
                  style={{ display: "flex", alignItems: "center", gap: "4px", height: "28px", padding: "0 10px", fontSize: "12px", border: "none", borderRadius: "6px", backgroundColor: "#1E6FD9", color: "#ffffff", cursor: "pointer", fontWeight: 600 }}
                >
                  Bulk Approve ({selectedIds.length})
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
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer", width: "14px", height: "14px" }} />
                  </th>
                  {["Sample ID", "Patient", "Test Type", "MLT Name", "QC Status", "Flag", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "48px", color: "#94a3b8", fontSize: "13px" }}>
                      No samples found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((sample: PendingVerificationSample) => {
                    const isSelected = selectedIds.includes(sample.id);
                    const isReturned = sample.verificationStatus === "RETURNED";
                    return (
                      <>
                        <tr
                          key={sample.id}
                          style={{ backgroundColor: isReturned ? "#fff7ed" : isSelected ? "#f0f7ff" : "#ffffff", borderBottom: expandedReason === sample.id ? "none" : "1px solid #f1f5f9" }}
                        >
                          {/* Checkbox */}
                          <td style={{ padding: "12px 16px" }}>
                            <input type="checkbox" checked={isSelected} onChange={() => toggleOne(sample.id)} style={{ cursor: "pointer", width: "14px", height: "14px" }} />
                          </td>

                          {/* Sample ID */}
                          <td style={{ padding: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              {sample.urgency === "STAT" && (
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block", flexShrink: 0 }} />
                              )}
                              <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                                {sample.sampleId}
                              </span>
                            </div>
                          </td>

                          {/* Patient */}
                          <td style={{ padding: "12px" }}>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>{sample.patientName}</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{sample.patientId}</div>
                          </td>

                          {/* Test Type */}
                          <td style={{ padding: "12px", fontSize: "12px", color: "#475569" }}>{sample.testType}</td>

                          {/* MLT Name */}
                          <td style={{ padding: "12px", fontSize: "12px", color: "#475569" }}>{sample.mltName}</td>

                          {/* QC Status */}
                          <td style={{ padding: "12px" }}>
                            <QCBadge status={sample.qcStatus} />
                          </td>

                          {/* Flag */}
                          <td style={{ padding: "12px" }}>
                            <FlagBadge flag={sample.flag} />
                          </td>

                          {/* Verification Status */}
                          <td style={{ padding: "12px" }}>
                            {isReturned ? (
                              <button
                                onClick={() => setExpandedReason(expandedReason === sample.id ? null : sample.id)}
                                style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer" }}
                              >
                                <RotateCcw size={10} />
                                RETURNED
                              </button>
                            ) : (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, backgroundColor: "#f1f5f9", color: "#475569" }}>
                                PENDING
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td style={{ padding: "12px" }}>
                            <button
                              onClick={() => handleReview(sample)}
                              style={{ height: "28px", padding: "0 12px", fontSize: "12px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: isReturned ? "#ea580c" : "#1E6FD9", color: "#ffffff", cursor: "pointer" }}
                            >
                              {isReturned ? "Re-verify" : "Review"}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Return Reason Row */}
                        {expandedReason === sample.id && isReturned && (
                          <tr key={`${sample.id}-reason`} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td colSpan={9} style={{ padding: "0" }}>
                              <div style={{ backgroundColor: "#fff7ed", borderTop: "1px dashed #fed7aa", padding: "12px 16px 14px 52px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <RotateCcw size={14} color="#ea580c" style={{ marginTop: "2px", flexShrink: 0 }} />
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#c2410c" }}>
                                      Returned by {sample.returnedBy}
                                    </span>
                                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                                      {sample.returnedAt}
                                    </span>
                                  </div>
                                  <p style={{ fontSize: "12px", color: "#9a3412", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
                                    "{sample.returnReason}"
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #f1f5f9", backgroundColor: "#fafafa" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Showing <strong>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> samples
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