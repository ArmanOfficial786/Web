"use client";

import React from "react";
import type { Control } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import DropDown from "@/components/form/DropDown";
import { useReportForm } from "@/contexts/ReportFormContext";
import type { FormInputs } from "@/components/reports/memberReport/MemberIdCard";

// ── FieldRow (local component create label in left and input in right) ─────────────────────────────────
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
interface BranchNameFieldProps {
  control: Control<FormInputs>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BranchNameField({ control }: BranchNameFieldProps) {
  const { branchOptions } = useReportForm();

  return (
    <FieldRow label="Branch Name">
      <DropDown
        name="branchId"
        control={control}
        label="Branch Name"
        options={branchOptions}
        fullWidth
      />
    </FieldRow>
  );
}
