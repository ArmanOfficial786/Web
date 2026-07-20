"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";

const provisionTypeOptions = [
  { value: "S", label: "Schedule Wise" },
  { value: "R", label: "Remaining Principal" },
  { value: "A", label: "After Maturity" },
];

interface ProvisionTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  row?: boolean;
  disabled?: boolean;
}

export default function ProvisionTypeField<T extends FieldValues>({
  control,
  name,
  label,
  row = true,
  disabled = false,
}: ProvisionTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <RadioInput
        name={name}
        control={control}
        radioOptions={provisionTypeOptions}
        row={row}
        disabled={disabled}
      />
    </FieldRow>
  );
}
