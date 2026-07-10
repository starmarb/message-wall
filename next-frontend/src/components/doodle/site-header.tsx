"use client";

import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import { withBasePath } from "@/utils/base-path";

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
      }}
    >
      <img
        src={withBasePath("/logo.png")}
        alt="Logo"
        style={{ width: "240px", height: "auto" }}
      />
    </Box>
  );
}
