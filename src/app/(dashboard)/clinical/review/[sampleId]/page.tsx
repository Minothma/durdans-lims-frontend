"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Building, Stethoscope, X, AlertTriangle, CheckCircle } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const labResults = [
  { parameter: "White Blood Cells (WBC)", result: 14.2, unit: "10³/µL", flag: "H", referenceRange: "4.0 - 11.0", isAbnormal: true },
  { parameter: "Hemoglobin (Hb)", result: 13.8, unit: "g/dL", flag: "—", referenceRange: "13.5 - 17.5", isAbnormal: false },
  { parameter: "Platelet Count", result: 128, unit: "10³/µL", flag: "L", referenceRange: "150 - 450", isAbnormal: true },
  { parameter: "Hematocrit (Hct)", result: 41.2, unit: "%", flag: "—", referenceRange: "41.0 - 50.0", isAbnormal: false },
  { parameter: "Neutrophils", result: 72.4, unit: "%", flag: "—", referenceRange: "40.0 - 75.0", isAbnormal: false },
  { parameter: "Lymphocytes", result: 18.1, unit: "%", flag: "—", referenceRange: "20.0 - 45.0", isAbnormal: false },
];

const trendData = [
  { date: "Jul", wbc: 8.2, plt: 230 },
  { date: "Aug", wbc: 9.0, plt: 210 },
  { date: "Sep", wbc: 9.4, plt: 210 },
  { date: "Oct", wbc: 11.8, plt: 145 },
  { date: "Today", wbc: 14.2, plt: 128 },
];

export default function ClinicalReviewPage({
  params,
}: {
  params: { sampleId: string };
}) {
  const router = useRouter();
  const sampleId = params.sampleId;
  const [interpretation, setInterpretation] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleAuthorize = () => {
    if (!interpretation.trim()) {
      alert("Please enter a clinical interpretation before authorizing.");
      return;
    }
    setShowSignModal(true);
  };

  const handleConfirmSign = () => {
    setSigned(true);
    setShowSignModal(false);
    setTimeout(() => {
      alert(`Case ${sampleId} authorized and released successfully.`);
      router.push("/clinical/worklist");
    }, 800);
  };

  const handleReturn = () => {
    if (!returnReason.trim()) {
      alert("Please enter a reason for returning.");
      return;
    }
    alert(`Case returned for verification. Reason: ${returnReason}`);
    setShowReturnModal(false);
    router.push("/clinical/worklist");
  };

  return (
    <div style={{ minHeight: "100%", backgroundColor: "#f8fafc" }}>

      {/* ── Return Modal ── */}
      {showReturnModal && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowReturnModal(false)}
        >
          <div
            style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", width: "480px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Return for Verification</h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>Case {sampleId} will be returned to the MLT queue</p>
              </div>
              <button onClick={() => setShowReturnModal(false)} style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={16} color="#64748b" />
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>
                Reason for Return <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Describe why this case needs re-verification..."
                rows={4}
                style={{ width: "100%", padding: "10px 12px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", outline: "none", resize: "vertical", color: "#1e293b", boxSizing: "border-box", fontFamily: "inherit" }}
              />
            </div>

            {/* Urgent Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: "6px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Mark as Urgent</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Prioritize in MLT verification queue</div>
              </div>
              <div
                onClick={() => setIsUrgent(!isUrgent)}
                style={{
                  width: "40px", height: "22px", borderRadius: "999px", cursor: "pointer",
                  backgroundColor: isUrgent ? "#1E6FD9" : "#e2e8f0",
                  position: "relative", transition: "background-color 0.2s",
                }}
              >
                <div style={{
                  width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#ffffff",
                  position: "absolute", top: "3px",
                  left: isUrgent ? "21px" : "3px",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowReturnModal(false)}
                style={{ height: "36px", padding: "0 16px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleReturn}
                style={{ height: "36px", padding: "0 16px", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: "#dc2626", color: "#ffffff", cursor: "pointer" }}
              >
                Return for Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Digital Signature Modal ── */}
      {showSignModal && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowSignModal(false)}
        >
          <div
            style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", width: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <CheckCircle size={24} color="#1E6FD9" />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Confirm Authorization</h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "8px 0 0 0" }}>
                You are about to digitally authorize and release this report.
              </p>
            </div>

            {/* Pathologist Info */}
            <div style={{ padding: "14px", backgroundColor: "#f8fafc", borderRadius: "8px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#1E6FD9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>AP</span>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>Dr. Aritha Perera</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Pathologist • SLMC Reg: 12345</div>
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "8px 12px", backgroundColor: "#ffffff", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>Digital Signature</div>
                <div style={{ fontSize: "13px", color: "#1E6FD9", fontStyle: "italic", fontFamily: "Georgia, serif" }}>Dr. Aritha Perera</div>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "8px", textAlign: "center" }}>
                Authorized on: {new Date().toLocaleString()}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowSignModal(false)}
                style={{ flex: 1, height: "38px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSign}
                style={{ flex: 1, height: "38px", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: "#1E6FD9", color: "#ffffff", cursor: "pointer" }}
              >
                ✓ Confirm & Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Bar ── */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.push("/clinical/worklist")}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#475569", background: "none", border: "none", cursor: "pointer" }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div style={{ width: "1px", height: "20px", backgroundColor: "#e2e8f0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Clinical Validation Review
            </span>
            <span style={{ padding: "2px 8px", backgroundColor: "#f1f5f9", borderRadius: "4px", fontSize: "11px", fontWeight: 600, color: "#475569", fontFamily: "monospace" }}>
              {sampleId}
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
              John Doe
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <User size={13} color="#94a3b8" />
            <span style={{ fontSize: "12px", color: "#64748b" }}>45Y / Male</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Building size={13} color="#94a3b8" />
            <span style={{ fontSize: "12px", color: "#64748b" }}>Cardiology - 402B</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Stethoscope size={13} color="#94a3b8" />
            <span style={{ fontSize: "12px", color: "#64748b" }}>Dr. A. Perera</span>
          </div>
          <span style={{ padding: "3px 10px", backgroundColor: "#fee2e2", color: "#b91c1c", fontSize: "11px", fontWeight: 700, borderRadius: "4px" }}>
            STAT Priority
          </span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", padding: "20px 24px" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Critical Alert Banner */}
          <div style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertTriangle size={16} color="#e11d48" />
            <div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#be123c" }}>Critical Values Detected — </span>
              <span style={{ fontSize: "13px", color: "#be123c" }}>WBC significantly elevated (14.2 × 10³/µL). Platelet count below normal range.</span>
            </div>
          </div>

          {/* Lab Results Table */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Lab Results: Full Blood Count</span>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Verified by: S. Rathnayake MLT</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  {["Parameter", "Result", "Unit", "Flag", "Reference Range"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {labResults.map((row) => (
                  <tr key={row.parameter} style={{ borderBottom: "1px solid #f8fafc", backgroundColor: row.isAbnormal ? "#fff8f8" : "#ffffff" }}>
                    <td style={{ padding: "11px 16px", fontSize: "13px", color: "#334155", fontWeight: 500 }}>{row.parameter}</td>
                    <td style={{ padding: "11px 16px", fontSize: "14px", fontWeight: 700, color: row.isAbnormal ? "#dc2626" : "#1e293b" }}>{row.result}</td>
                    <td style={{ padding: "11px 16px", fontSize: "12px", color: "#64748b" }}>{row.unit}</td>
                    <td style={{ padding: "11px 16px" }}>
                      {row.flag === "—" ? (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, backgroundColor: row.flag === "H" ? "#fee2e2" : "#fef9c3", color: row.flag === "H" ? "#b91c1c" : "#854d0e" }}>
                          {row.flag}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: "12px", color: "#64748b" }}>{row.referenceRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trend Chart */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>Parameter Trends</h3>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0 0" }}>WBC & Platelet over last 5 visits</p>
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "3px", backgroundColor: "#1E6FD9", display: "inline-block", borderRadius: "2px" }} />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>WBC (10³/µL)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "3px", backgroundColor: "#f97316", display: "inline-block", borderRadius: "2px" }} />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Plt (×10)</span>
                </div>
              </div>
            </div>
            <div style={{ height: "180px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "6px", fontSize: "11px", color: "#ffffff" }} />
                  <ReferenceLine y={11} stroke="#ef4444" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="wbc" stroke="#1E6FD9" strokeWidth={2.5} dot={{ fill: "#1E6FD9", r: 4, stroke: "#ffffff", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="plt" stroke="#f97316" strokeWidth={2.5} dot={{ fill: "#f97316", r: 4, stroke: "#ffffff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clinical Interpretation */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "8px" }}>
              Clinical Interpretation <span style={{ color: "#ef4444" }}>*</span>
              <span style={{ fontSize: "11px", fontWeight: 400, color: "#94a3b8", marginLeft: "8px" }}>Required before authorization</span>
            </label>
            <textarea
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
              placeholder="Enter your clinical interpretation of these results..."
              rows={4}
              style={{ width: "100%", padding: "10px 12px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", outline: "none", resize: "vertical", color: "#1e293b", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.5 }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                {interpretation.length} characters
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowReturnModal(true)}
                  style={{ height: "36px", padding: "0 16px", fontSize: "13px", fontWeight: 600, border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}
                >
                  ← Return for Verification
                </button>
                <button
                  onClick={handleAuthorize}
                  style={{ height: "36px", padding: "0 20px", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: signed ? "#16a34a" : "#1E6FD9", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {signed ? "✓ Authorized" : "✓ Authorize & Release"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Pathologist Info */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "12px" }}>
              Authorizing Pathologist
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#1E6FD9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700 }}>AP</span>
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>Dr. Aritha Perera</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Consultant Pathologist</div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>SLMC Reg: 12345</div>
              </div>
            </div>
            <div style={{ padding: "10px 12px", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                Digital Signature Preview
              </div>
              <div style={{ fontSize: "16px", color: "#1E6FD9", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                Dr. Aritha Perera
              </div>
            </div>
          </div>

          {/* Previous Reports */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "12px" }}>
              Previous Reports
            </span>
            {[
              { date: "20 Oct 2023", test: "Full Blood Count", status: "Authorized" },
              { date: "15 Sep 2023", test: "Full Blood Count", status: "Authorized" },
              { date: "02 Aug 2023", test: "Lipid Profile", status: "Authorized" },
            ].map((report, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "#334155" }}>{report.test}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>{report.date}</div>
                </div>
                <span style={{ padding: "2px 8px", backgroundColor: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: 600, borderRadius: "4px" }}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>

          {/* Verification Notes */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "12px" }}>
              Verification Notes
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#1E6FD9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700 }}>SR</span>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155" }}>S. Rathnayake</span>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>10:41 AM</span>
                </div>
                <p style={{ fontSize: "12px", color: "#475569", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
                  "Sample was slightly hemolyzed. Microscopic review confirmed leukocyte aggregation."
                </p>
              </div>
            </div>
          </div>

          {/* QC Summary */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "12px" }}>
              QC Summary
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Instrument", value: "Sysmex XN-10S" },
                { label: "QC Run", value: "Run #882 — PASSED" },
                { label: "Calibrated", value: "2h 14m ago" },
                { label: "Verified by", value: "S. Rathnayake MLT" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#334155" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}