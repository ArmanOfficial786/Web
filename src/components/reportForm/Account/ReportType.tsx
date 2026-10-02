




"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";

const reportTypeOptions = [
  { value: "Summary", label: "Summary" },
  { value: "SubLedger", label: "SubLedger" },
  { value: "Detail", label: "Detail" },
];

interface ReportTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  row?: boolean;
  disabled?: boolean;
}

export default function ReportTypeField<T extends FieldValues>({
  control,
  name,
  label,
  row = true,
  disabled = false,
}: ReportTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <RadioInput
        name={name}
        control={control}
        radioOptions={reportTypeOptions}
        row={row}
        disabled={disabled}
      />
    </FieldRow>
  );
}
