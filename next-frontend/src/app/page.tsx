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
  const [wallDrawing, setWallDrawing] = useState<ScreenDisplayDrawing | null>(null);

  const handleSubmit = (data: string) => {
    setSaveData(data);
    setWallDrawing({ id: `${Date.now()}`, saveData: data });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        // No wrap on desktop: the two panels stay side by side instead of the
        // wall dropping below the fold at in-between widths. It only stacks
        // when we've explicitly switched to column layout on small screens.
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 4, md: 4 },
        width: "100%",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        boxSizing: "border-box",
      }}
    >
      {/* Left: phone mockup — same layout a visitor sees on /canvas: logo, then the editor.
          flexShrink 0 so the flex row can never squish it (which would collapse the canvas). */}
      <Box sx={{ flex: "0 0 auto" }}>
        <PhoneFrame>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2 }}>
            <img
              src={withBasePath("/logo.png")}
              alt="Logo"
              style={{ width: "55%", height: "auto" }}
            />
          </Box>
          {saveData ? (
            <SuccessView saveData={saveData} />
          ) : (
            <CanvasEditor onSubmit={handleSubmit} />
          )}
        </PhoneFrame>
      </Box>

      {/* Right: the /display2 screen — floating drawings message wall.
          Takes the remaining width beside the phone. */}
      <Box
        sx={{
          flex: "1 1 0",
          minWidth: 0,
          width: "100%",
          maxWidth: 1400,
          aspectRatio: "16 / 9",
          alignSelf: "center",
          containerType: "inline-size",
        }}
      >
        <ScreenDisplay drawing={wallDrawing} />
      </Box>
    </Box>
  );
}
