"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: "relative",
        flexShrink: 0,
        // Bigger and longer phone body.
        width: "min(440px, 100%)",
        minHeight: "780px",
        borderRadius: "56px",
        border: "14px solid #1c1c1e",
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
          height: 28,
          backgroundColor: "#1c1c1e",
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
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
          px: 2,
          py: 5,
          pt: "52px",
          backgroundColor: "#000",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
