"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: "relative",
        flexShrink: 0,
        // Sized to fit the viewport: never wider than 420px, never taller than
        // the screen. Height tracks width to keep a phone-like proportion but
        // is capped at 90vh so the whole thing (incl. submit button) is always
        // visible without scrolling on shorter screens.
        width: "min(420px, 42vh, 100%)",
        maxHeight: "92vh",
        aspectRatio: "420 / 860",
        borderRadius: "clamp(32px, 5vh, 52px)",
        border: "clamp(8px, 1.4vh, 14px) solid #1c1c1e",
        backgroundColor: "#000",
        boxShadow:
          "0 0 0 2px rgba(255,255,255,0.06), 0 30px 60px rgba(0,0,0,0.55)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Notch */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "36%",
          height: "clamp(16px, 2.6vh, 26px)",
          backgroundColor: "#1c1c1e",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          zIndex: 5,
        }}
      />
      {/* Content area: centers the UI with black margin around it. */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          py: 2,
          pt: "clamp(30px, 4vh, 48px)",
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
