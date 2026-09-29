"use client";

import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import { useEffect } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// ── Props ─────────────────────────────────────────────────────────────────────
interface FamClearanceStatusFieldProps<T extends FieldValues> {
  control: Control<T>;
  clearanceStatusFieldName: Path<T>;
  /** Label shown above the dropdown. Defaults to "Clearance Status". */
  label?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FamClearanceStatusField<T extends FieldValues>({
  control,
  clearanceStatusFieldName,
  label = "Clearance Status",
}: FamClearanceStatusFieldProps<T>) {
  const { fetchClearanceStatus, clearanceStatusOptions } =
    useReportFormContext();

  useEffect(() => {
    fetchClearanceStatus();
  }, [fetchClearanceStatus]);

  return (
    <FieldRow label={label}>
      <DropDown
        name={clearanceStatusFieldName}
        control={control}
        label={label}
        options={clearanceStatusOptions}
        fullWidth
      />
    </FieldRow>
  );
}
