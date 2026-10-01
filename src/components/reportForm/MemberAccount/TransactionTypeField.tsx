"use client";

import RadioInput from "@/components/form/RadioInput";
import FieldRow from "@/utilis/FieldRow";
import type { Control, FieldValues, Path } from "react-hook-form";

const baseOptions = [
  { value: "S", label: "Saving" },
  { value: "L", label: "Loan" },
];

const shareOption = { value: "H", label: "Share" };

interface TransactionTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  row?: boolean;
  // ── Some reports need Saving/Loan only, others need all three ──────────────
  showShareType?: boolean;
}

export default function TransactionTypeField<T extends FieldValues>({
  control,
  name,
  label,
  row = true,
  showShareType = false,
}: TransactionTypeFieldProps<T>) {
  const radioOptions = showShareType
    ? [...baseOptions, shareOption]
    : baseOptions;

  return (
    <FieldRow label={label}>
      <RadioInput
        name={name}
        control={control}
        radioOptions={radioOptions}
        row={row}
      />
    </FieldRow>
  );
}
