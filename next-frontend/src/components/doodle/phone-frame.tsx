"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "min(380px, 100%)",
        // Taller phone body so the content sits with black space above and
        // below rather than being crammed edge to edge.
        minHeight: "760px",
        borderRadius: "48px",
        border: "12px solid #1c1c1e",
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
          width: "38%",
          height: 24,
          backgroundColor: "#1c1c1e",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          zIndex: 5,
        }}
      />
      {/* Content area: fills the tall body and centers the UI vertically so
          there's comfortable black margin around it. */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 1.5,
          py: 4,
          pt: "44px",
          backgroundColor: "#000",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
