"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Building, Stethoscope, X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const labResults = [
  { parameter: "White Blood Cells (WBC)", result: 14.2, unit: "10³/µL", flag: "H", referenceRange: "4.0 - 11.0", isAbnormal: true },
  { parameter: "Hemoglobin (Hb)", result: 13.8, unit: "g/dL", flag: "—", referenceRange: "13.5 - 17.5", isAbnormal: false },
  { parameter: "Platelet Count", result: 128, unit: "10³/µL", flag: "L", referenceRange: "150 - 450", isAbnormal: true },
  { parameter: "Hematocrit (Hct)", result: 41.2, unit: "%", flag: "—", referenceRange: "41.0 - 50.0", isAbnormal: false },
  { parameter: "Neutrophils", result: 72.4, unit: "%", flag: "—", referenceRange: "40.0 - 75.0", isAbnormal: false },
  { parameter: "Lymphocytes", result: 18.1, unit: "%", flag: "—", referenceRange: "20.0 - 45.0", isAbnormal: false },
];

const historicalData = [
  { parameter: "WBC", current: 14.2, oct20: 11.8, sep15: 9.4 },
  { parameter: "Hb", current: 13.8, oct20: 14.0, sep15: 14.2 },
  { parameter: "Plt", current: 128, oct20: 145, sep15: 210 },
];

// Chart data for WBC trend
const wbcChartData = [
  { date: "Sep 15", value: 9.4 },
  { date: "Oct 20", value: 11.8 },
  { date: "Today", value: 14.2 },
];

// Chart data for each parameter
const chartDataMap: Record<string, { data: { date: string; value: number }[]; refLow: number; refHigh: number; unit: string }> = {
  WBC: {
    data: [
      { date: "Jul", value: 8.2 },
      { date: "Aug", value: 9.0 },
      { date: "Sep 15", value: 9.4 },
      { date: "Oct 20", value: 11.8 },
      { date: "Today", value: 14.2 },
    ],
    refLow: 4.0,
    refHigh: 11.0,
    unit: "10³/µL",
  },
  Hb: {
    data: [
      { date: "Jul", value: 14.8 },
      { date: "Aug", value: 14.5 },
      { date: "Sep 15", value: 14.2 },
      { date: "Oct 20", value: 14.0 },
      { date: "Today", value: 13.8 },
    ],
    refLow: 13.5,
    refHigh: 17.5,
    unit: "g/dL",
  },
  Plt: {
    data: [
      { date: "Jul", value: 230 },
      { date: "Aug", value: 210 },
      { date: "Sep 15", value: 210 },
      { date: "Oct 20", value: 145 },
      { date: "Today", value: 128 },
    ],
    refLow: 150,
    refHigh: 450,
    unit: "10³/µL",
  },
};

export default function ReviewCasePage({
  params,
}: {
  params: { sampleId: string };
}) {
  const router = useRouter();
  const sampleId = params.sampleId;
  const [showChart, setShowChart] = useState(false);
  const [selectedParam, setSelectedParam] = useState("WBC");

  const handleApprove = () => {
    alert(`Sample ${sampleId} approved successfully.`);
    router.push("/verification/pending");
  };

  const handleReturn = () => {
    alert(`Sample ${sampleId} returned for verification.`);
    router.push("/verification/pending");
  };

  const openChart = (param: string) => {
    setSelectedParam(param);
    setShowChart(true);
  };

  const chartInfo = chartDataMap[selectedParam];

  return (
    <div style={{ minHeight: "100%", backgroundColor: "#f8fafc" }}>

      {/* ── Chart Modal ── */}
      {showChart && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowChart(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              width: "600px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                  {selectedParam} — Historical Trend
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
                  James D. Wickramasinghe • Last 5 readings
                </p>
              </div>
              <button
                onClick={() => setShowChart(false)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            {/* Parameter Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {Object.keys(chartDataMap).map((param) => (
                <button
                  key={param}
                  onClick={() => setSelectedParam(param)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: selectedParam === param ? "#1E6FD9" : "#e2e8f0",
                    backgroundColor: selectedParam === param ? "#eff6ff" : "#ffffff",
                    color: selectedParam === param ? "#1E6FD9" : "#64748b",
                    cursor: "pointer",
                  }}
                >
                  {param}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div style={{ height: "240px", marginBottom: "16px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartInfo.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#ffffff",
                    }}
                    formatter={(value) => [`${value} ${chartInfo.unit}`, selectedParam]}
                  />
                  {/* Reference range lines */}
                  <ReferenceLine
                    y={chartInfo.refHigh}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{ value: `High: ${chartInfo.refHigh}`, fill: "#ef4444", fontSize: 10, position: "right" }}
                  />
                  <ReferenceLine
                    y={chartInfo.refLow}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{ value: `Low: ${chartInfo.refLow}`, fill: "#f59e0b", fontSize: 10, position: "right" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1E6FD9"
                    strokeWidth={2.5}
                    dot={{ fill: "#1E6FD9", r: 5, strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 7, fill: "#1E6FD9" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Reference Range Info */}
            <div style={{
              padding: "10px 14px",
              backgroundColor: "#f8fafc",
              borderRadius: "6px",
              display: "flex",
              gap: "24px",
            }}>
              <div>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Reference Range</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", marginLeft: "8px" }}>
                  {chartInfo.refLow} – {chartInfo.refHigh} {chartInfo.unit}
                </span>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Current Value</span>
                <span style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  marginLeft: "8px",
                  color: chartInfo.data[chartInfo.data.length - 1].value > chartInfo.refHigh ||
                    chartInfo.data[chartInfo.data.length - 1].value < chartInfo.refLow
                    ? "#dc2626" : "#16a34a",
                }}>
                  {chartInfo.data[chartInfo.data.length - 1].value} {chartInfo.unit}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Bar ── */}
      <div style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.push("/verification/pending")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#475569",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div style={{ width: "1px", height: "20px", backgroundColor: "#e2e8f0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Reviewing Case
            </span>
            <span style={{ padding: "2px 8px", backgroundColor: "#f1f5f9", borderRadius: "4px", fontSize: "11px", fontWeight: 600, color: "#475569", fontFamily: "monospace" }}>
              {sampleId}
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
              James D. Wickramasinghe
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <User size={13} color="#94a3b8" />
            <span style={{ fontSize: "12px", color: "#64748b" }}>42Y / Male</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Building size={13} color="#94a3b8" />
            <span style={{ fontSize: "12px", color: "#64748b" }}>Cardiology - 402B</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Stethoscope size={13} color="#94a3b8" />
            <span style={{ fontSize: "12px", color: "#64748b" }}>Dr. A. Perera</span>
          </div>
          <span style={{
            padding: "3px 10px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            fontSize: "11px",
            fontWeight: 700,
            borderRadius: "4px",
          }}>
            STAT Priority
          </span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", padding: "20px 24px" }}>

        {/* LEFT — Lab Results */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              Current Lab Results: Full Blood Count
            </span>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>Last updated: 10 mins ago</span>
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
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    {row.parameter}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: row.isAbnormal ? "#dc2626" : "#1e293b" }}>
                    {row.result}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b" }}>
                    {row.unit}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {row.flag === "—" ? (
                      <span style={{ color: "#94a3b8", fontSize: "13px" }}>—</span>
                    ) : (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: row.flag === "H" ? "#fee2e2" : "#fef9c3",
                        color: row.flag === "H" ? "#b91c1c" : "#854d0e",
                      }}>
                        {row.flag}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b" }}>
                    {row.referenceRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Actions */}
          <div style={{ padding: "16px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
            <button
              onClick={handleReturn}
              style={{ height: "36px", padding: "0 16px", fontSize: "13px", fontWeight: 600, border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}
            >
              ← Return for Verification
            </button>
            <button
              onClick={handleApprove}
              style={{ height: "36px", padding: "0 20px", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: "#1E6FD9", color: "#ffffff", cursor: "pointer" }}
            >
              ✓ Approve & Release
            </button>
          </div>
        </div>

        {/* RIGHT — Side Panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Instrument QC */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Instrument QC
              </span>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Sysmex XN-10S</span>
            </div>
            <div style={{ padding: "10px 12px", backgroundColor: "#f0fdf4", borderRadius: "6px", border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>Run #882</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#15803d" }}>PASSED</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>Last Calibrated: 2h 14m ago</div>
            </div>
          </div>

          {/* Historical Comparison */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Historical Comparison
              </span>
              <button
                onClick={() => openChart("WBC")}
                style={{ fontSize: "11px", color: "#1E6FD9", cursor: "pointer", fontWeight: 600, background: "none", border: "none", padding: 0 }}
              >
                View Chart →
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Parameter", "Current", "20 Oct", "15 Sep"].map((h) => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: h === "Parameter" ? "left" : "right", fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historicalData.map((row) => (
                  <tr
                    key={row.parameter}
                    style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer" }}
                    onClick={() => openChart(row.parameter)}
                  >
                    <td style={{ padding: "8px", fontSize: "12px", color: "#1E6FD9", fontWeight: 600, textDecoration: "underline" }}>
                      {row.parameter}
                    </td>
                    <td style={{ padding: "8px", fontSize: "12px", fontWeight: 700, color: "#1E6FD9", textAlign: "right" }}>
                      {row.current}
                    </td>
                    <td style={{ padding: "8px", fontSize: "12px", color: "#64748b", textAlign: "right" }}>
                      {row.oct20}
                    </td>
                    <td style={{ padding: "8px", fontSize: "12px", color: "#64748b", textAlign: "right" }}>
                      {row.sep15}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "8px 0 0 0" }}>
              Click any parameter to view its chart
            </p>
          </div>

          {/* MLT Notes */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "12px" }}>
              MLT Notes
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#1E6FD9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700 }}>SR</span>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155" }}>S. Rathnayake</span>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>10:41 AM</span>
                </div>
                <p style={{ fontSize: "12px", color: "#475569", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
                  "Sample was slightly hemolyzed upon receipt. Microscopic review confirmed leukocyte aggregation."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}