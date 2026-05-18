"use client";
import DropDown from "@/components/form/DropDown";
import FieldRow from "@/utilis/FieldRow";
import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface StatusProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

const StatusOptions = [
  { id: "0", name: "-- Select --" },
  { id: "1", name: "Opened" },
  { id: "2", name: "Closed" },
  { id: "3", name: "With Balance" },
  { id: "4", name: "Suspended" },
  { id: "5", name: "Disabled" },
];

export default function AccountStatus<T extends FieldValues>({
  control,
  name,
  label = "Status",
}: StatusProps<T>) {
  return (
    <FieldRow label={label}>
      <DropDown
        name={name}
        control={control}
        label={label}
        options={StatusOptions}
        fullWidth
      />
    </FieldRow>
  );
}
