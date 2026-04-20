"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";

// ── Props ─────────────────────────────────────────────────────────────────────
interface TransactionTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

// ── Options ───────────────────────────────────────────────────────────────────
const transactionTypeOptions = [
  { id: "All", name: "All" },
  { id: "Cash", name: "Cash" },
  { id: "Bank", name: "Bank" },
  { id: "NoCash", name: "No Cash" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function TransactionTypeField<T extends FieldValues>({
  control,
  name,
  label = "Transaction Type",
}: TransactionTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <DropDown
        name={name}
        control={control}
        label={label}
        options={transactionTypeOptions}
        fullWidth
      />
    </FieldRow>
  );
}
