// components/reportForm/MemberAccount/DuePeriodField.tsx
"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import Box from "@mui/material/Box";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";

// ── Static Due Transaction Period options — confirm these values match
// what the backend expects for `duePeriod` (int32) ───────────────────────────
const duePeriodOptions = [
  { id: 1, name: "1 Month" },
  { id: 2, name: "2 Month" },
  { id: 3, name: "3 Month" },
];

interface DuePeriodFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export default function DuePeriodField<T extends FieldValues>({
  control,
  name,
  label = "Due Transaction Period",
}: DuePeriodFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <Box sx={{ width: "100%" }}>
        <DropDown
          name={name}
          control={control}
          label={label}
          options={duePeriodOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}