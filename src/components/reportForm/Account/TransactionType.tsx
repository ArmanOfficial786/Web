"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";

// ── Props ─────────────────────────────────────────────────────────────────────
interface TransactionTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  row?: boolean;
  disabled?: boolean;
}

// ── Options ───────────────────────────────────────────────────────────────────
const transactionTypeOptions = [
  { value: "All", label: "All" },
  { value: "Cash", label: "Cash" },
  { value: "Bank", label: "Bank" },
  { value: "NoCash", label: "No Cash" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function TransactionTypeField<T extends FieldValues>({
  control,
  name,
  label = "Transaction Type",
  row = true,
  disabled = false,
}: TransactionTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <RadioInput
        name={name}
        control={control}
        radioOptions={transactionTypeOptions}
        row={row}
        disabled={disabled}
      />
    </FieldRow>
  );
}
