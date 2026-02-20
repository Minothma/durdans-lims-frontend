"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Printer, Smartphone,
  Globe, CheckCircle, Download, Send, Phone, MapPin, Globe2,
} from "lucide-react";
import { DeliveryMethod } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const methodConfig: Record<DeliveryMethod, { icon: React.ElementType; color: string; bg: string; label: string; detail: string }> = {
  EMAIL: { icon: Mail, color: "#1d4ed8", bg: "#eff6ff", label: "Email", detail: "patient@email.com" },
  PRINT: { icon: Printer, color: "#15803d", bg: "#f0fdf4", label: "Print", detail: "Lab Printer #2" },
  SMS: { icon: Smartphone, color: "#b45309", bg: "#fffbeb", label: "SMS", detail: "+94 77 123 4567" },
  PORTAL: { icon: Globe, color: "#6d28d9", bg: "#f5f3ff", label: "Patient Portal", detail: "portal.durdans.lk" },
};

const hospitalInfo = {
  name: "Durdans Hospital",
  tagline: "A Centre of Excellence in Healthcare",
  address: "3, Alfred Place, Colombo 03, Sri Lanka",
  phone: "+94 11 2140000",
  hotline: "+94 11 2140700",
  website: "www.durdans.com",
  email: "info@durdans.com",
  labName: "Department of Laboratory Medicine",
  labAccreditation: "ISO 15189 : 2012 Accredited Laboratory",
  regNo: "MOH/PVT/0042",
};

const reportData = {
  reportId: "REP-2023-9901",
  patientName: "Anura Kumara Jayantha",
  patientId: "DH-88897",
  patientAge: "42Y",
  patientGender: "Male",
  patientDOB: "15 Jan 1981",
  referringDoctor: "Dr. A. Perera",
  ward: "Cardiology - 402B",
  testName: "Full Blood Count (FBC)",
  sampleId: "DH-LAB-9921",
  sampleCollected: "25 Oct 2023, 08:15 AM",
  reportGenerated: "25 Oct 2023, 09:42 AM",
  authorizedBy: "Dr. Aritha Perera",
  authorizedTime: "25 Oct 2023, 09:45 AM",
  deliveryMethods: ["EMAIL", "PRINT", "PORTAL"] as DeliveryMethod[],
  results: [
    { parameter: "White Blood Cells (WBC)", result: "14.2", unit: "10³/µL", flag: "H", referenceRange: "4.0 - 11.0", isAbnormal: true },
    { parameter: "Hemoglobin (Hb)", result: "13.8", unit: "g/dL", flag: "—", referenceRange: "13.5 - 17.5", isAbnormal: false },
    { parameter: "Platelet Count", result: "128", unit: "10³/µL", flag: "L", referenceRange: "150 - 450", isAbnormal: true },
    { parameter: "Hematocrit (Hct)", result: "41.2", unit: "%", flag: "—", referenceRange: "41.0 - 50.0", isAbnormal: false },
    { parameter: "Neutrophils", result: "72.4", unit: "%", flag: "—", referenceRange: "40.0 - 75.0", isAbnormal: false },
    { parameter: "Lymphocytes", result: "18.1", unit: "%", flag: "—", referenceRange: "20.0 - 45.0", isAbnormal: false },
  ],
  clinicalNote: "WBC significantly elevated with thrombocytopenia. Clinical correlation recommended. Consider hematology consultation for further evaluation.",
};

export default function AuthorizedReportPage({
  params,
}: {
  params: { reportId: string };
}) {
  const router = useRouter();
  const [selectedMethods, setSelectedMethods] = useState<DeliveryMethod[]>(["EMAIL", "PRINT"]);
  const [dispatched, setDispatched] = useState(false);

  const toggleMethod = (method: DeliveryMethod) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleDispatch = () => {
    if (selectedMethods.length === 0) {
      alert("Please select at least one delivery method.");
      return;
    }
    setDispatched(true);
    setTimeout(() => {
      alert(`Report dispatched via ${selectedMethods.join(", ")} successfully.`);
      router.push("/dispatch/delivery-status");
    }, 800);
  };

  // ── PDF Download ──────────────────────────────────────────
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ── Header Background ──
    doc.setFillColor(30, 111, 217);
    doc.rect(0, 0, pageWidth, 38, "F");

    // ── Hospital Name ──
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(hospitalInfo.name.toUpperCase(), 14, 13);

    // ── Tagline ──
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 220, 255);
    doc.text(hospitalInfo.tagline, 14, 19);

    // ── Lab Name ──
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(hospitalInfo.labName, 14, 26);
    doc.setFontSize(7);
    doc.setTextColor(200, 220, 255);
    doc.text(hospitalInfo.labAccreditation, 14, 31);

    // ── Report ID on right ──
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`Report ID: ${reportData.reportId}`, pageWidth - 14, 13, { align: "right" });
    doc.text(`Reg No: ${hospitalInfo.regNo}`, pageWidth - 14, 19, { align: "right" });

    // ── AUTHORIZED badge ──
    doc.setFillColor(255, 255, 255, 0.3);
    doc.setDrawColor(255, 255, 255);
    doc.roundedRect(pageWidth - 46, 23, 32, 8, 2, 2, "S");
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("✓ AUTHORIZED", pageWidth - 30, 28.5, { align: "center" });

    // ── Contact info row ──
    doc.setFillColor(240, 246, 255);
    doc.rect(0, 38, pageWidth, 10, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 100, 150);
    doc.text(`📍 ${hospitalInfo.address}`, 14, 44);
    doc.text(`📞 ${hospitalInfo.phone}  |  🌐 ${hospitalInfo.website}  |  ✉ ${hospitalInfo.email}`, pageWidth / 2, 44, { align: "center" });

    // ── Divider ──
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(14, 50, pageWidth - 14, 50);

    // ── Test Name Title ──
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(reportData.testName, 14, 58);

    // ── Patient Info Box ──
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 62, (pageWidth - 32) / 2 - 4, 44, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 62, (pageWidth - 32) / 2 - 4, 44, 2, 2, "S");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("PATIENT INFORMATION", 18, 68);

    const patientFields = [
      ["Name", reportData.patientName],
      ["Patient ID", reportData.patientId],
      ["Age / Gender", `${reportData.patientAge} / ${reportData.patientGender}`],
      ["Date of Birth", reportData.patientDOB],
      ["Referring Doctor", reportData.referringDoctor],
      ["Ward", reportData.ward],
    ];

    doc.setFont("helvetica", "normal");
    patientFields.forEach(([label, value], i) => {
      const y = 74 + i * 5.5;
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.text(label, 18, y);
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(7.5);
      doc.text(value, 52, y);
    });

    // ── Report Info Box ──
    const col2X = 14 + (pageWidth - 32) / 2 + 4;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(col2X, 62, (pageWidth - 32) / 2 - 4, 44, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(col2X, 62, (pageWidth - 32) / 2 - 4, 44, 2, 2, "S");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("REPORT INFORMATION", col2X + 4, 68);

    const reportFields = [
      ["Sample ID", reportData.sampleId],
      ["Test", reportData.testName],
      ["Collected", reportData.sampleCollected],
      ["Generated", reportData.reportGenerated],
      ["Authorized By", reportData.authorizedBy],
      ["Auth. Time", reportData.authorizedTime],
    ];

    doc.setFont("helvetica", "normal");
    reportFields.forEach(([label, value], i) => {
      const y = 74 + i * 5.5;
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.text(label, col2X + 4, y);
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(7.5);
      doc.text(value, col2X + 28, y);
    });

    // ── Results Table ──
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("TEST RESULTS", 14, 116);

    autoTable(doc, {
      startY: 119,
      head: [["Parameter", "Result", "Unit", "Flag", "Reference Range"]],
      body: reportData.results.map((r) => [
        r.parameter,
        r.result,
        r.unit,
        r.flag,
        r.referenceRange,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [30, 111, 217],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3.5,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        1: { fontStyle: "bold" },
        3: { halign: "center" },
      },
      didParseCell: (data) => {
        if (data.section === "body") {
          const row = reportData.results[data.row.index];
          if (row?.isAbnormal) {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fillColor = [255, 248, 248];
          }
        }
      },
      margin: { left: 14, right: 14 },
    });

    // ── Clinical Note ──
    const finalY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(253, 230, 138);
    doc.roundedRect(14, finalY, pageWidth - 28, 20, 2, 2, "FD");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(146, 64, 14);
    doc.text("CLINICAL NOTE", 18, finalY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 15);
    const splitNote = doc.splitTextToSize(reportData.clinicalNote, pageWidth - 36);
    doc.text(splitNote, 18, finalY + 12);

    // ── Signature ──
    const sigY = finalY + 30;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, sigY, pageWidth - 14, sigY);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("This report is digitally authorized and is valid without a physical signature.", 14, sigY + 6);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(30, 111, 217);
    doc.text("Dr. Aritha Perera", pageWidth - 14, sigY + 5, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text("Consultant Pathologist  •  SLMC Reg: 12345", pageWidth - 14, sigY + 10, { align: "right" });

    // ── Footer ──
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFillColor(30, 111, 217);
    doc.rect(0, footerY - 4, pageWidth, 14, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(`${hospitalInfo.name}  •  ${hospitalInfo.address}  •  ${hospitalInfo.phone}`, pageWidth / 2, footerY + 3, { align: "center" });

    doc.save(`${reportData.reportId}_${reportData.patientName.replace(/ /g, "_")}.pdf`);
  };

  return (
    <div style={{ minHeight: "100%", backgroundColor: "#f8fafc" }}>

      {/* Top Bar */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.push("/dispatch/dashboard")}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#475569", background: "none", border: "none", cursor: "pointer" }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div style={{ width: "1px", height: "20px", backgroundColor: "#e2e8f0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Authorized Report
            </span>
            <span style={{ padding: "2px 8px", backgroundColor: "#f1f5f9", borderRadius: "4px", fontSize: "11px", fontWeight: 600, color: "#475569", fontFamily: "monospace" }}>
              {params.reportId}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={handleDownloadPDF}
            style={{ display: "flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 14px", fontSize: "12px", fontWeight: 500, border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#ffffff", color: "#475569", cursor: "pointer" }}
          >
            <Download size={14} />
            Download PDF
          </button>
          <button
            onClick={handleDispatch}
            style={{ display: "flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 14px", fontSize: "12px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: dispatched ? "#16a34a" : "#1E6FD9", color: "#ffffff", cursor: "pointer" }}
          >
            <Send size={14} />
            {dispatched ? "Dispatched ✓" : "Dispatch Report"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", padding: "20px 24px" }}>

        {/* LEFT — Report Preview */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>

          {/* Hospital Header */}
          <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, #1E6FD9 0%, #1558B0 100%)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", letterSpacing: "0.05em" }}>
                  {hospitalInfo.name.toUpperCase()}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", marginTop: "2px" }}>
                  {hospitalInfo.tagline}
                </div>
                <div style={{ marginTop: "10px", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                  {hospitalInfo.labName}
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)", marginTop: "2px" }}>
                  {hospitalInfo.labAccreditation}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>Report ID</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", fontFamily: "monospace" }}>
                  {reportData.reportId}
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
                  Reg: {hospitalInfo.regNo}
                </div>
                <div style={{ marginTop: "8px", padding: "4px 10px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.4)", display: "inline-block" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#ffffff" }}>✓ AUTHORIZED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Contact Bar */}
          <div style={{ backgroundColor: "#eff6ff", padding: "8px 24px", display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid #dbeafe" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <MapPin size={11} color="#1d4ed8" />
              <span style={{ fontSize: "11px", color: "#1d4ed8" }}>{hospitalInfo.address}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Phone size={11} color="#1d4ed8" />
              <span style={{ fontSize: "11px", color: "#1d4ed8" }}>{hospitalInfo.phone}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Globe2 size={11} color="#1d4ed8" />
              <span style={{ fontSize: "11px", color: "#1d4ed8" }}>{hospitalInfo.website}</span>
            </div>
          </div>

          {/* Test Name */}
          <div style={{ padding: "14px 24px", borderBottom: "1px solid #f1f5f9", backgroundColor: "#fafafa" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
              {reportData.testName}
            </span>
          </div>

          {/* Patient + Report Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ padding: "16px 24px", borderRight: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                Patient Information
              </div>
              {[
                { label: "Name", value: reportData.patientName },
                { label: "Patient ID", value: reportData.patientId },
                { label: "Age / Gender", value: `${reportData.patientAge} / ${reportData.patientGender}` },
                { label: "Date of Birth", value: reportData.patientDOB },
                { label: "Referring Doctor", value: reportData.referringDoctor },
                { label: "Ward", value: reportData.ward },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8", width: "110px", flexShrink: 0 }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#334155" }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                Report Information
              </div>
              {[
                { label: "Sample ID", value: reportData.sampleId },
                { label: "Test", value: reportData.testName },
                { label: "Collected", value: reportData.sampleCollected },
                { label: "Generated", value: reportData.reportGenerated },
                { label: "Authorized By", value: reportData.authorizedBy },
                { label: "Auth. Time", value: reportData.authorizedTime },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8", width: "110px", flexShrink: 0 }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#334155" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results Table */}
          <div style={{ padding: "14px 24px", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Test Results</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                {["Parameter", "Result", "Unit", "Flag", "Reference Range"].map((h) => (
                  <th key={h} style={{ padding: "10px 24px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.results.map((row) => (
                <tr key={row.parameter} style={{ borderBottom: "1px solid #f8fafc", backgroundColor: row.isAbnormal ? "#fff8f8" : "#ffffff" }}>
                  <td style={{ padding: "11px 24px", fontSize: "13px", color: "#334155", fontWeight: 500 }}>{row.parameter}</td>
                  <td style={{ padding: "11px 24px", fontSize: "14px", fontWeight: 700, color: row.isAbnormal ? "#dc2626" : "#1e293b" }}>{row.result}</td>
                  <td style={{ padding: "11px 24px", fontSize: "12px", color: "#64748b" }}>{row.unit}</td>
                  <td style={{ padding: "11px 24px" }}>
                    {row.flag === "—" ? (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, backgroundColor: row.flag === "H" ? "#fee2e2" : "#fef9c3", color: row.flag === "H" ? "#b91c1c" : "#854d0e" }}>
                        {row.flag}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "11px 24px", fontSize: "12px", color: "#64748b" }}>{row.referenceRange}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Clinical Note */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", backgroundColor: "#fffbeb" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
              Clinical Note
            </div>
            <p style={{ fontSize: "13px", color: "#78350f", margin: 0, lineHeight: 1.6 }}>
              {reportData.clinicalNote}
            </p>
          </div>

          {/* Signature Footer */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", maxWidth: "300px", lineHeight: 1.5 }}>
              This report is digitally authorized and is valid without a physical signature.
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "16px", color: "#1E6FD9", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                Dr. Aritha Perera
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Consultant Pathologist • SLMC: 12345</div>
            </div>
          </div>

          {/* Hospital Footer Bar */}
          <div style={{ backgroundColor: "#1E6FD9", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)" }}>
              {hospitalInfo.name} • {hospitalInfo.address} • {hospitalInfo.phone}
            </span>
          </div>
        </div>

        {/* RIGHT — Delivery Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: "0 0 14px 0" }}>
              Select Delivery Methods
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {(Object.keys(methodConfig) as DeliveryMethod[]).map((method) => {
                const m = methodConfig[method];
                const IconComp = m.icon;
                const isSelected = selectedMethods.includes(method);
                return (
                  <div
                    key={method}
                    onClick={() => toggleMethod(method)}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", border: "1px solid", borderColor: isSelected ? "#1E6FD9" : "#e2e8f0", backgroundColor: isSelected ? "#eff6ff" : "#ffffff", transition: "all 0.15s" }}
                  >
                    <div style={{ width: "32px", height: "32px", borderRadius: "6px", backgroundColor: m.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <IconComp size={15} color={m.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#334155" }}>{m.label}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{m.detail}</div>
                    </div>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid", borderColor: isSelected ? "#1E6FD9" : "#e2e8f0", backgroundColor: isSelected ? "#1E6FD9" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isSelected && <CheckCircle size={12} color="#ffffff" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleDispatch}
              style={{ width: "100%", height: "38px", marginTop: "14px", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", backgroundColor: dispatched ? "#16a34a" : "#1E6FD9", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              <Send size={14} />
              {dispatched ? "Dispatched Successfully ✓" : `Dispatch via ${selectedMethods.length} Method${selectedMethods.length !== 1 ? "s" : ""}`}
            </button>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: "0 0 12px 0" }}>
              Dispatch Summary
            </h3>
            {[
              { label: "Report ID", value: reportData.reportId },
              { label: "Patient", value: reportData.patientName },
              { label: "Test", value: reportData.testName },
              { label: "Authorized", value: "25 Oct 2023, 09:45 AM" },
              { label: "Methods", value: selectedMethods.length > 0 ? selectedMethods.join(", ") : "None" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.label}</span>
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#334155", textAlign: "right", maxWidth: "150px" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}