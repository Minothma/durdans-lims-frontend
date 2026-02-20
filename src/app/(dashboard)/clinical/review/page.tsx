"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClinicalReviewRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/clinical/review/S-2024-0982");
  }, [router]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      fontSize: "13px",
      color: "#94a3b8",
    }}>
      Loading review...
    </div>
  );
}