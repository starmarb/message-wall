"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { CanvasEditor } from "@/components/doodle/canvas-editor";
import { SuccessView } from "@/components/doodle/success-view";
import { PhoneFrame } from "@/components/doodle/phone-frame";
import { ScreenDisplay, type ScreenDisplayDrawing } from "@/components/doodle/screen-display";
import { withBasePath } from "@/utils/base-path";

export default function Home() {
  const [saveData, setSaveData] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [wallDrawing, setWallDrawing] = useState<ScreenDisplayDrawing | null>(null);

  const handleSubmit = (data: string) => {
    setSaveData(data);
    setWallDrawing({ id: `${Date.now()}`, saveData: data });
  };

  const handleDrawAnother = () => {
    setSaveData(null);
    setResetSignal((n) => n + 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 4, md: 6 },
        width: "100%",
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 6 },
      }}
    >
      {/* Left: phone mockup — same layout a visitor sees on /canvas: logo, then the editor */}
      <PhoneFrame>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2 }}>
          <img
            src={withBasePath("/logo.png")}
            alt="Logo"
            style={{ width: "55%", height: "auto" }}
          />
        </Box>
        {saveData ? (
          <SuccessView saveData={saveData} onDrawAnother={handleDrawAnother} />
        ) : (
          <CanvasEditor onSubmit={handleSubmit} resetSignal={resetSignal} />
        )}
      </PhoneFrame>

      {/* Right: the /display2 screen — floating drawings message wall */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          aspectRatio: "16 / 9",
          containerType: "inline-size",
        }}
      >
        <ScreenDisplay drawing={wallDrawing} />
      </Box>
    </Box>
  );
}
