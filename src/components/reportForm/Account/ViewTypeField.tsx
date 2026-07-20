"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";

const viewTypeOptions = [
  { value: "D", label: "Detail" },
  { value: "T", label: "Total Only" },
];

interface ViewTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  row?: boolean;
  disabled?: boolean;
}

export default function ViewTypeField<T extends FieldValues>({
  control,
  name,
  label,
  row = true,
  disabled = false,
}: ViewTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <RadioInput
        name={name}
        control={control}
        radioOptions={viewTypeOptions}
        row={row}
        disabled={disabled}
      />
    </FieldRow>
  );
}
