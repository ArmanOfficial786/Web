"use client";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import {
  orderByOptionsMap,
  type OrderByReportKey,
} from "@/utilis/OrderbyOptions/OrderByRegistry";

interface OrderByFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  reportKey: OrderByReportKey;
  label?: string;
  excludeKeys?: string[];
}

export default function OrderByField<T extends FieldValues>({
  control,
  name,
  reportKey,
  label = "Order by",
  excludeKeys,
}: OrderByFieldProps<T>) {
  const options = [
    { id: "", name: "-- Select --" },
    ...orderByOptionsMap[reportKey]
      .filter((opt: any) => !excludeKeys?.includes(opt.key))
      .map((opt: any) => ({
        id: opt.key,
        name: opt.label,
      })),
  ];
  // const options = [
  //   { id: "", name: "-- Select --" },
  //   ...orderByOptionsMap[reportKey].map((opt: any) => ({
  //     id: opt.key,
  //     name: opt.label,
  //   })),
  // ];

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
