"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "min(360px, 100%)",
        borderRadius: "44px",
        border: "10px solid #1c1c1e",
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
          width: "40%",
          height: 22,
          backgroundColor: "#1c1c1e",
          borderBottomLeftRadius: 14,
          borderBottomRightRadius: 14,
          zIndex: 5,
        }}
      />
      <Box
        sx={{
          pt: "22px",
          backgroundColor: "#000",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
