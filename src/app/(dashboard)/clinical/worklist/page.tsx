"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/common/StatCard";
import { ValidationStatusBadge, UrgencyBadge } from "@/components/common/StatusBadges";
import { mockValidationSamples } from "@/data/mockData";
import { ValidationSample } from "@/types";

const ITEMS_PER_PAGE = 5;

const headerNavLinks = [
  { label: "Dashboard", href: "/dashboard", active: false },
  { label: "Clinical Authorization", href: "/clinical/worklist", active: true },
  { label: "Patient Records", href: "/patient-records", active: false },
  { label: "Reports", href: "/reports", active: false },
];

// ── Chart Data ─────────────────────────────────────────────
const turnaroundData = [
  { time: "08:00", stat: 18, routine: 42 },
  { time: "09:00", stat: 22, routine: 38 },
  { time: "10:00", stat: 15, routine: 45 },
  { time: "11:00", stat: 28, routine: 52 },
  { time: "12:00", stat: 20, routine: 35 },
  { time: "13:00", stat: 12, routine: 40 },
  { time: "14:00", stat: 25, routine: 48 },
];

const volumeData = [
  { day: "Mon", authorized: 42, pending: 8 },
  { day: "Tue", authorized: 38, pending: 12 },
  { day: "Wed", authorized: 55, pending: 5 },
  { day: "Thu", authorized: 47, pending: 9 },
  { day: "Fri", authorized: 60, pending: 3 },
  { day: "Sat", authorized: 28, pending: 6 },
  { day: "Today", authorized: 35, pending: 5 },
];

export default function ClinicalWorklistPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeChart, setActiveChart] = useState<"turnaround" | "volume">("turnaround");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockValidationSamples.filter((s) => {
      const matchesSearch =
        s.sampleId.toLowerCase().includes(q) ||
        s.patientName.toLowerCase().includes(q) ||
        s.testType.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPending = mockValidationSamples.length;
  const criticalFlags = mockValidationSamples.filter((s) => s.status === "CRITICAL_FLAG").length;

  const handleReview = (sample: ValidationSample) => {
    router.push(`/clinical/review/${sample.sampleId}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", height: "auto" }}>
      <Header
        userName="Dr. Aritha Perera"
        userRole="Pathologist"
        navLinks={headerNavLinks}
      />

      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Page Title */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b", margin: 0 }}>
              Clinical Validation
            </h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
              Authorize verified laboratory results for clinical release.
            </p>
          </div>
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
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <StatCard
            title="Pending Authorization"
            value={totalPending}
            subtitle="Cases"
            icon={ShieldCheck}
            iconBg="#eff6ff"
            iconColor="#1d4ed8"
          />
          <StatCard
            title="Critical Flags"
            value={criticalFlags}
            subtitle="Require immediate review"
            icon={AlertTriangle}
            iconBg="#fff1f2"
            iconColor="#e11d48"
          />
          <StatCard
            title="Avg Turnaround"
            value="38 mins"
            subtitle="Today"
            icon={Clock}
            iconBg="#f0fdf4"
            iconColor="#16a34a"
          />
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* Turnaround Time Chart */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>
                  Turnaround Time (mins)
                </h3>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                  STAT vs Routine — Today
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "3px", backgroundColor: "#1E6FD9", display: "inline-block", borderRadius: "2px" }} />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>STAT</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "3px", backgroundColor: "#e2e8f0", display: "inline-block", borderRadius: "2px" }} />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Routine</span>
                </div>
              </div>
            </div>
            <div style={{ height: "180px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={turnaroundData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "6px", fontSize: "11px", color: "#ffffff" }}
                    formatter={(value, name) => [`${value} mins`, name === "stat" ? "STAT" : "Routine"]}
                  />
                  <Line type="monotone" dataKey="stat" stroke="#1E6FD9" strokeWidth={2} dot={{ fill: "#1E6FD9", r: 3 }} />
                  <Line type="monotone" dataKey="routine" stroke="#cbd5e1" strokeWidth={2} dot={{ fill: "#cbd5e1", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Authorization Volume Chart */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>
                  Authorization Volume
                </h3>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                  Last 7 days
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "10px", backgroundColor: "#1E6FD9", display: "inline-block", borderRadius: "2px" }} />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Authorized</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "10px", backgroundColor: "#fca5a5", display: "inline-block", borderRadius: "2px" }} />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Pending</span>
                </div>
              </div>
            </div>
            <div style={{ height: "180px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "6px", fontSize: "11px", color: "#ffffff" }}
                  />
                  <Bar dataKey="authorized" fill="#1E6FD9" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="pending" fill="#fca5a5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {["All", "CRITICAL_FLAG", "ABNORMAL", "PENDING"].map((status) => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    border: "1px solid",
                    borderColor: statusFilter === status ? "#1E6FD9" : "#e2e8f0",
                    backgroundColor: statusFilter === status ? "#eff6ff" : "#ffffff",
                    color: statusFilter === status ? "#1E6FD9" : "#64748b",
                    cursor: "pointer",
                  }}
                >
                  {status === "CRITICAL_FLAG" ? "Critical Flag" : status === "ABNORMAL" ? "Abnormal" : status}
                  {status !== "All" && (
                    <span style={{
                      marginLeft: "6px",
                      padding: "1px 6px",
                      borderRadius: "999px",
                      fontSize: "10px",
                      fontWeight: 700,
                      backgroundColor: statusFilter === status ? "#1E6FD9" : "#f1f5f9",
                      color: statusFilter === status ? "#ffffff" : "#64748b",
                    }}>
                      {mockValidationSamples.filter((s) => s.status === status).length}
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
                  {["Sample ID", "Patient", "Test Type", "Department", "Status", "Urgency", "Time Elapsed", "Actions"].map((h) => (
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
                      No cases found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginated.map((sample: ValidationSample) => (
                    <tr
                      key={sample.id}
                      style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: sample.status === "CRITICAL_FLAG" ? "#fff8f8" : "#ffffff" }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {sample.status === "CRITICAL_FLAG" && (
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block", flexShrink: 0 }} />
                          )}
                          <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                            {sample.sampleId}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: "10px", fontWeight: 700, color: "#1E6FD9" }}>{sample.patientInitials}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>{sample.patientName}</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>{sample.patientAge} • {sample.patientGender} • {sample.patientIdNo}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: "#475569" }}>{sample.testType}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "2px 8px", backgroundColor: "#f1f5f9", borderRadius: "4px", fontSize: "11px", fontWeight: 600, color: "#475569" }}>
                          {sample.department}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <ValidationStatusBadge status={sample.status} />
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <UrgencyBadge urgency={sample.urgency} />
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={12} color="#94a3b8" />
                          <span style={{ fontSize: "12px", color: "#64748b" }}>{sample.timeElapsed}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => handleReview(sample)}
                          style={{
                            height: "28px",
                            padding: "0 12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: sample.status === "CRITICAL_FLAG" ? "#dc2626" : "#1E6FD9",
                            color: "#ffffff",
                            cursor: "pointer",
                          }}
                        >
                          {sample.status === "CRITICAL_FLAG" ? "Urgent Review" : "Review"}
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
              Showing <strong>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> cases
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