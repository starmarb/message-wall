"use client";

import { useRef, useState } from "react";
import { Box } from "@mui/material";
import { CanvasEditor } from "@/components/doodle/canvas-editor";
import { SuccessView } from "@/components/doodle/success-view";
import { PhoneFrame } from "@/components/doodle/phone-frame";
import { ScreenDisplay, type ScreenDisplayDrawing } from "@/components/doodle/screen-display";
import { withBasePath } from "@/utils/base-path";

// How long the wall takes to expand in on the first submit. Keep this in sync
// with the CSS transition on the wall panel below.
const REVEAL_MS = 700;

export default function Home() {
  const [saveData, setSaveData] = useState<string | null>(null);
  const [wallDrawing, setWallDrawing] = useState<ScreenDisplayDrawing | null>(null);
  // Once the first doodle is submitted, the wall is revealed (and the phone
  // has slid to the left). It stays revealed for the rest of the session, so
  // later submits don't move the phone again.
  const [revealed, setRevealed] = useState(false);
  // Bumped to clear the canvas when the person comes back to draw another.
  const [resetSignal, setResetSignal] = useState(0);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = (data: string) => {
    setSaveData(data);

    const firstReveal = !revealed;
    setRevealed(true);

    const addToWall = () =>
      setWallDrawing({ id: `${Date.now()}`, saveData: data });

    if (firstReveal) {
      // On the very first submit the wall is still animating open from zero
      // width. Wait for it to finish expanding so the doodle is positioned
      // within the wall's full bounds instead of a collapsed box.
      if (revealTimer.current) clearTimeout(revealTimer.current);
      revealTimer.current = setTimeout(addToWall, REVEAL_MS + 40);
    } else {
      addToWall();
    }
  };

  // Back arrow on the phone: return to the drawing canvas to add another
  // doodle. The wall stays put and keeps every doodle from this session.
  const handleBack = () => {
    setSaveData(null);
    setResetSignal((n) => n + 1);
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
        width: "100%",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        boxSizing: "border-box",
      }}
    >
      {/* Left: phone mockup — same layout a visitor sees on /canvas: logo, then the editor.
          flexShrink 0 so the flex row can never squish it (which would collapse the canvas).
          Before the first submit this is the only thing on screen, so the centered
          flex row keeps it in the middle; when the wall reveals it slides to the left. */}
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
            <SuccessView saveData={saveData} onBack={handleBack} />
          ) : (
            <CanvasEditor onSubmit={handleSubmit} resetSignal={resetSignal} />
          )}
        </PhoneFrame>
      </Box>

      {/* Right: the /display2 screen — floating drawings message wall.
          Hidden (collapsed to zero width) until the first doodle is submitted.
          Expanding its max-width pushes the centered phone to the left, so the
          phone "slides" over as the wall grows in. */}
      <Box
        aria-hidden={!revealed}
        sx={{
          flex: { xs: "0 0 auto", md: "1 1 0" },
          minWidth: 0,
          width: "100%",
          // Desktop: expand from 0 -> full width to slide the phone left.
          maxWidth: { xs: 1400, md: revealed ? 1400 : 0 },
          // Mobile (stacked): collapse height instead of width.
          maxHeight: { xs: revealed ? "85vh" : 0, md: "none" },
          opacity: revealed ? 1 : 0,
          // Gap between phone and wall only once the wall is showing.
          ml: { xs: 0, md: revealed ? 4 : 0 },
          mt: { xs: revealed ? 4 : 0, md: 0 },
          aspectRatio: "16 / 9",
          alignSelf: "center",
          containerType: "inline-size",
          overflow: "hidden",
          pointerEvents: revealed ? "auto" : "none",
          transition:
            "max-width 0.7s ease, max-height 0.7s ease, opacity 0.6s ease, margin 0.7s ease",
        }}
      >
        <ScreenDisplay drawing={wallDrawing} />
      </Box>
    </Box>
  );
}
