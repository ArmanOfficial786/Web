"use client";
import React from "react";
import type {
  FieldValues,
  Path,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import Button from "@mui/material/Button";
import { useReportForm } from "@/contexts/ReportFormContext";

// ── Props ─────────────────────────────────────────────────────────────────────
interface ClearFormButtonProps<T extends FieldValues> {
  reset: UseFormReset<T>;
  setValue: UseFormSetValue<T>;

  // 🔥 instead of form type → we use field names
  clearFields?: Path<T>[];

  clearSelectedMember?: () => void;
}

export default function ClearFormButton<T extends FieldValues>({
  reset,
  setValue,
  clearFields = [],
  clearSelectedMember,
}: ClearFormButtonProps<T>) {
  const { resetFormFields } = useReportForm();

  const handleClear = () => {
    // reset full form
    reset();

    // clear only specified fields
    clearFields.forEach((field) => {
      setValue(field, "" as any);
    });

    // reset shared context
    resetFormFields();

    // optional external reset
    clearSelectedMember?.();
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      onClick={handleClear}
      sx={{ whiteSpace: "nowrap", height: 36 }}
    >
      Clear
    </Button>
  );
}
