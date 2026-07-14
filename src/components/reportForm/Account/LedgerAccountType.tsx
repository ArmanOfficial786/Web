"use client";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FieldRow from "@/utilis/FieldRow";

// ⚠️ ASSUMPTION: numeric codes for accountTypeId. Adjust to match your backend.
export const Account_Type_Option = [
  { value: 0, label: "All" },
  { value: 1, label: "Assets" },
  { value: 2, label: "Liabilities" },
  { value: 3, label: "Income" },
  { value: 4, label: "Expense" },
];

interface LedgerAccountTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name?: Path<T>;
  label: string;
}

export default function LedgerAccountTypeField<T extends FieldValues>({
  control,
  name = "accountTypeId" as Path<T>,
  label,
}: LedgerAccountTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            size="small"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          >
            {Account_Type_Option.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </FieldRow>
  );
}
