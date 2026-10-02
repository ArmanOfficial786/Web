










"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useLedgerHeadOptions } from "@/components/hooks/useLedgerHeadOptions";

interface LedgerHeadFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export default function LedgerHeadField<T extends FieldValues>({
  control,
  name,
  label = "Ledger Head",
}: LedgerHeadFieldProps<T>) {
  const options = useLedgerHeadOptions();

  return (
    <FieldRow label={label}>
      <DropDown
        name={name}
        control={control}
        label={label}
        options={options}
        fullWidth
      />
    </FieldRow>
  );
}
