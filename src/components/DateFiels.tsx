"use client";

import React from "react";
import type { Control } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import DateInput from "@/components/form/DateInput";
import type { FormInputs } from "@/components/MemberIdCard";

// ── FieldRow (local, keeps label-left design) ─────────────────────────────────
function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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

// ── Props ─────────────────────────────────────────────────────────────────────
interface DateFieldsProps {
  control: Control<FormInputs>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function DateFields({ control }: DateFieldsProps) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldRow label="From Date">
          <DateInput name="fromDate" control={control} dateType="BS" />
        </FieldRow>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldRow label="Till Date">
          <DateInput name="tillDate" control={control} dateType="BS" />
        </FieldRow>
      </Grid>
    </Grid>
  );
}
