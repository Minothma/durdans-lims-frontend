"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, Wifi } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { mockInstrumentBatches } from "@/data/mockData";
import { InstrumentBatch } from "@/types";

const headerNavLinks = [
  { label: "Dashboard", href: "/dashboard", active: false },
  { label: "MLT Testing", href: "/mlt-testing", active: true },
  { label: "Patient Records", href: "/patient-records", active: false },
  { label: "Inventory", href: "/inventory", active: false },
];

const connectivityStatus = [
  { name: "Main Lab A", online: true },
  { name: "Hematology Hub", online: true },
  { name: "STAT Station", online: true },
];

export default function BulkApprovalPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<InstrumentBatch[]>(mockInstrumentBatches);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");

  // ── Filter logic ──────────────────────────────────────────
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchesSearch =
        search.trim() === "" ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.instrumentId.toLowerCase().includes(search.toLowerCase());

      const matchesDept =
        department === "All Departments" ||
        b.department.toLowerCase() === department.toLowerCase();

      return matchesSearch && matchesDept;
    });
  }, [batches, search, department]);

  const selectedBatches = batches.filter((b) => b.isSelected);
  const totalSafeForApproval = selectedBatches.reduce(
    (sum, b) => sum + b.normalResults, 0
  );
  const totalExceptions = selectedBatches.reduce(
    (sum, b) => sum + b.exceptions, 0
  );

  const toggleBatch = (id: string) => {
    setBatches((prev) =>
      prev.map((b) => b.id === id ? { ...b, isSelected: !b.isSelected } : b)
    );
  };

  const selectAll = () => {
    setBatches((prev) => prev.map((b) => ({
      ...b,
      isSelected: b.qcStatus === "PASSED" ? true : b.isSelected,
    })));
  };

  const handleApprove = () => {
    alert(`Approved ${selectedBatches.length} batches with ${totalSafeForApproval} samples.`);
    router.push("/verification/pending");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", height: "auto" }}>
      <Header
        userName="Dr. Aritha Perera"
        userRole="Lab Manager"
        navLinks={headerNavLinks}
      />

      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Page Title Row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#1e293b", margin: 0 }}>
              Bulk Verification & Batch Approval
            </h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
              Lab Management Module
            </p>
          </div>

          {/* Shift Info */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Shift: 08:00 - 16:00 &nbsp;|&nbsp; Manager: Dr. Perera
            </div>
            <div style={{ marginTop: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Shift Progress: 75%</span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>455/600 Samples</span>
              </div>
              <div style={{ width: "200px", height: "6px", backgroundColor: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: "75%", height: "100%", backgroundColor: "#1E6FD9", borderRadius: "999px" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search instrument..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              height: "32px",
              padding: "0 12px",
              fontSize: "13px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              outline: "none",
              width: "200px",
              color: "#1e293b",
            }}
          />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{
              height: "32px",
              padding: "0 12px",
              fontSize: "13px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              outline: "none",
              color: "#475569",
            }}
          >
            <option>All Departments</option>
            <option>Biochemistry</option>
            <option>Hematology</option>
            <option>Immunology</option>
            <option>Clinical Chem</option>
          </select>

          <div style={{ flex: 1 }} />

          <button
            onClick={selectAll}
            style={{
              height: "32px",
              padding: "0 14px",
              fontSize: "12px",
              fontWeight: 500,
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              color: "#475569",
              cursor: "pointer",
            }}
          >
            Select All Batches
          </button>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Showing {filteredBatches.length} active instrument runs
          </span>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "20px", alignItems: "start" }}>

          {/* Instrument Cards Grid */}
          <div>
            {filteredBatches.length === 0 ? (
              <div style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                padding: "48px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "13px",
              }}>
                No instruments found matching your search.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                {filteredBatches.map((batch: InstrumentBatch) => (
                  <div
                    key={batch.id}
                    onClick={() => batch.qcStatus === "PASSED" && toggleBatch(batch.id)}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: batch.isSelected
                        ? "2px solid #1E6FD9"
                        : "1px solid #e2e8f0",
                      padding: "16px",
                      cursor: batch.qcStatus === "PASSED" ? "pointer" : "not-allowed",
                      opacity: batch.qcStatus === "PENDING" ? 0.6 : 1,
                      position: "relative",
                      transition: "border 0.15s",
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                      <input
                        type="checkbox"
                        checked={batch.isSelected}
                        onChange={() => toggleBatch(batch.id)}
                        disabled={batch.qcStatus === "PENDING"}
                        style={{ width: "14px", height: "14px", cursor: "pointer" }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Name + QC Badge */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingLeft: "22px", marginBottom: "4px" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
                          {batch.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                          ID: {batch.instrumentId} • {batch.department}
                        </div>
                      </div>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: 700,
                        backgroundColor: batch.qcStatus === "PASSED" ? "#dcfce7" : "#fef9c3",
                        color: batch.qcStatus === "PASSED" ? "#15803d" : "#854d0e",
                        flexShrink: 0,
                      }}>
                        {batch.qcStatus === "PASSED" ? "● QC PASSED" : "○ QC PENDING"}
                      </span>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px", paddingLeft: "22px" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Total Samples
                        </div>
                        <div style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", marginTop: "2px" }}>
                          {batch.totalSamples}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Normal Results
                        </div>
                        <div style={{ fontSize: "22px", fontWeight: 700, color: "#1E6FD9", marginTop: "2px" }}>
                          {batch.normalResults}
                        </div>
                      </div>
                    </div>

                    {/* Exceptions */}
                    <div style={{ marginTop: "12px", paddingLeft: "22px" }}>
                      {batch.qcStatus === "PENDING" ? (
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                          Complete QC Run to enable verification
                        </span>
                      ) : batch.exceptions === 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle size={13} color="#22c55e" />
                          <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 500 }}>All Clear</span>
                          <span style={{ fontSize: "11px", color: "#94a3b8" }}>No exceptions</span>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <AlertTriangle size={13} color="#f59e0b" />
                          <span style={{ fontSize: "12px", color: "#d97706", fontWeight: 500 }}>
                            {batch.exceptions} Exception{batch.exceptions > 1 ? "s" : ""}
                          </span>
                          <button
                            style={{
                              fontSize: "11px",
                              color: "#1E6FD9",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: 500,
                              padding: 0,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Reviewing exceptions for ${batch.name}`);
                            }}
                          >
                            Review Exceptions →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connectivity Panel */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            padding: "16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
              <Wifi size={14} color="#1E6FD9" />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Instrument Connectivity
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {connectivityStatus.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#475569" }}>{item.name}</span>
                  <span style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: item.online ? "#22c55e" : "#ef4444",
                    display: "inline-block",
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Approval Bar */}
        {selectedBatches.length > 0 && (
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
          }}>
            <div>
              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Selected Batches
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginTop: "2px" }}>
                {selectedBatches.length} Batches Selected
              </div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Safe for Approval
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#16a34a", marginTop: "2px" }}>
                {totalSafeForApproval} Samples
              </div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Held for Review
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#dc2626", marginTop: "2px" }}>
                {totalExceptions} Exceptions
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <button
              onClick={() => setBatches((prev) => prev.map((b) => ({ ...b, isSelected: false })))}
              style={{
                height: "36px",
                padding: "0 16px",
                fontSize: "13px",
                fontWeight: 500,
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                color: "#475569",
                cursor: "pointer",
              }}
            >
              Cancel Selection
            </button>

            <button
              onClick={handleApprove}
              style={{
                height: "36px",
                padding: "0 20px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#1E6FD9",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle size={15} />
              Approve Selected Batches
            </button>
          </div>
        )}
      </div>
    </div>
  );
}