// components/reportForm/Common/TransactionTypeField.tsx
"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";

interface BankReceivedTransactionTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

// ⚠️ Static option set — Saving / Loan / Share / Miscellaneous per your spec.
// Values assumed to match backend's expected transactionType strings; confirm.
const TRANSACTION_TYPE_OPTIONS = [
  { id: "", name: "-- Select --" },
  { id: "Saving", name: "Saving" },
  { id: "Loan", name: "Loan" },
  { id: "Share", name: "Share" },
  { id: "Miscellaneous", name: "Miscellaneous" },
];

export default function BankReceivedTransactionTypeField<T extends FieldValues>({
  control,
  name,
  label = "Transaction Type",
}: BankReceivedTransactionTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <DropDown
        name={name}
        control={control}
        label={label}
        options={TRANSACTION_TYPE_OPTIONS}
        fullWidth
      />
    </FieldRow>
  );
}
