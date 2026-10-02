"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import Box from "@mui/material/Box";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";

const smsCategoryOptions = [
  { id: "", name: "-- Select --" },
  { id: "1", name: "No Sms" },
  { id: "2", name: "Daily Sms" },
  { id: "3", name: "Weekly Sms" },
  { id: "4", name: "Monthly Sms" },
  { id: "5", name: "Transaction Wise Sms" },
];

interface SmsCategoryFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export default function SmsCategoryField<T extends FieldValues>({
  control,
  name,
  label = "Sms Category",
}: SmsCategoryFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <Box sx={{ width: "100%" }}>
        <DropDown
          name={name}
          control={control}
          label={label}
          options={smsCategoryOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
