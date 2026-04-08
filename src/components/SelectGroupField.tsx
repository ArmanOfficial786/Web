"use client";

import React from "react";
import type { Control } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import DropDown from "@/components/form/DropDown";
import type { FormInputs, SelectOption } from "@/components/MemberIdCard";

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

const DEFAULT_OPTIONS: SelectOption[] = [{ id: 0, name: "-- Select --" }];

// ── Props ─────────────────────────────────────────────────────────────────────
interface SelectGroupFieldProps {
  control: Control<FormInputs>;
  groupOptions?: SelectOption[];
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SelectGroupField({
  control,
  groupOptions = DEFAULT_OPTIONS,
}: SelectGroupFieldProps) {
  return (
    <FieldRow label="Select Group">
      <DropDown
        name="groupId"
        control={control}
        label="Select Group"
        options={groupOptions}
        fullWidth
      />
    </FieldRow>
  );
}
