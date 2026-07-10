"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { SuccessView } from "@/components/doodle/success-view";

export default function SuccessPage() {
  const router = useRouter();
  const [saveData, setSaveData] = useState<string | null>(null);

  useEffect(() => {
    const sd = sessionStorage.getItem("lastCanvas");
    if (sd) setSaveData(sd);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        bgcolor: "black",
        color: "white",
      }}
    >
      {saveData && (
        <SuccessView
          saveData={saveData}
          onDrawAnother={() => router.push("/canvas")}
        />
      )}
    </Box>
  );
}
