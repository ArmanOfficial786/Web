"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
}

export default function FieldRow({ label, children }: FieldRowProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 40 }}>
      <Typography
        sx={{
          width: 110,
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 500,
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}
