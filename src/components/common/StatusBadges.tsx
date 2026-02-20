import { QCStatus, FlagLevel, UrgencyLevel } from "@/types";

export function QCBadge({ status }: { status: QCStatus }) {
  const colors = {
    PASS: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
    FAIL: { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
    PENDING: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  };

  const c = colors[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.color,
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: c.dot,
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
}

export function FlagBadge({ flag }: { flag: FlagLevel | "—" }) {
  if (flag === "—") {
    return (
      <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>
    );
  }

  const colors = {
    NORMAL: { bg: "#f1f5f9", color: "#475569" },
    HIGH: { bg: "#fee2e2", color: "#b91c1c" },
    LOW: { bg: "#fef9c3", color: "#854d0e" },
    CRITICAL: { bg: "#fecaca", color: "#7f1d1d" },
  };

  const c = colors[flag];

  return (
    <span
      style={{
        display: "inline-flex",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.color,
      }}
    >
      {flag}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  const isSTAT = urgency === "STAT";
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: isSTAT ? "#fee2e2" : "#eff6ff",
        color: isSTAT ? "#b91c1c" : "#1d4ed8",
      }}
    >
      {urgency}
    </span>
  );
}

export function DeliveryStatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string; dot: string }> = {
    DELIVERED: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
    FAILED: { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
    PENDING: { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
  };

  const c = colors[status] ?? { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.color,
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: c.dot,
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
}

export function ValidationStatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string; dot: string; label: string }> = {
    CRITICAL_FLAG: { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444", label: "Critical Flag" },
    ABNORMAL: { bg: "#ffedd5", color: "#c2410c", dot: "#f97316", label: "Abnormal" },
    PENDING: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8", label: "Pending" },
  };

  const c = colors[status] ?? { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8", label: status };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.color,
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: c.dot,
          display: "inline-block",
        }}
      />
      {c.label}
    </span>
  );
}