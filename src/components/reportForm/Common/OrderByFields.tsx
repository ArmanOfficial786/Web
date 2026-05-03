"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import {
  OrderByReportKey,
  useReportFormContext,
} from "@/contexts/ReportFormContext";
import Box from "@mui/system/Box";

// ── Props ─────────────────────────────────────────────────────────────────────
interface OrderByFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  reportKey: OrderByReportKey;
  label?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function OrderByField<T extends FieldValues>({
  control,
  name,
  reportKey,
  label = "Order by",
}: OrderByFieldProps<T>) {
  const { fetchOrderBy, orderByMap } = useReportFormContext();

  const options = orderByMap[reportKey] ?? [];

  return (
    <FieldRow label={label}>
      <Box onMouseEnter={fetchOrderBy}>
        <DropDown
          name={name}
          control={control}
          label={label}
          onOpen={fetchOrderBy}
          options={options}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
