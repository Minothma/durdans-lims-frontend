import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
      }}
    >
      <Sidebar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100vh",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}