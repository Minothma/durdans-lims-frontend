interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconBg: string;
  iconColor: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  iconBg,
  iconColor,
  icon: Icon,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
      }}
    >
      {/* Icon Box */}
      <div
        style={{
          backgroundColor: iconBg,
          borderRadius: "8px",
          padding: "10px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} color={iconColor} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "#1e293b",
            margin: "4px 0 0 0",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        {subtitle && (
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              margin: "4px 0 0 0",
            }}
          >
            {subtitle}
          </p>
        )}
        {trend && (
          <p
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: trendUp ? "#16a34a" : "#dc2626",
              margin: "4px 0 0 0",
            }}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}