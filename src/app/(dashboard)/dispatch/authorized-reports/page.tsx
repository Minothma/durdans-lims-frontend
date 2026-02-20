"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthorizedReportsRoot() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dispatch/authorized-reports/REP-2023-9901");
  }, [router]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "13px", color: "#94a3b8" }}>
      Loading report...
    </div>
  );
}