"use client";

import React from "react";
import type {
  Control,
  FieldValues,
  Path,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  FormState,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import Button from "@mui/material/Button";

// ── Props ─────────────────────────────────────────────────────────────────────
interface ViewReportButtonProps<T extends FieldValues> {
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: SubmitHandler<T>;
  setValue: UseFormSetValue<T>;
  formState: FormState<T>;
  loading: boolean;
  onBeforeSubmit?: () => void;

  // 🔥 configurable logic (instead of hardcoded memberId)
  watchField?: Path<T>;
  clearFields?: Path<T>[]; // fields to clear before submit
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ViewReportButton<T extends FieldValues>({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  formState,
  loading,
  onBeforeSubmit,
  watchField,
  clearFields = [],
}: ViewReportButtonProps<T>) {
  const watchedValue = useWatch({
    control,
    name: watchField as Path<T>,
    disabled: !watchField, // ← skips subscription when undefined
  });

  const handleClick = () => {
    // Clear dependent fields if condition is met
    if (watchedValue && watchedValue) {
      clearFields.forEach((field) => {
        setValue(field, "" as any);
      });
    }

    // Only scroll to report if there are no validation errors
    if (!formState.isValid) {
      return; // Don't scroll if form has errors
    }

    onBeforeSubmit?.();
    handleSubmit(onSubmit)();
  };

  return (
    <Button
      variant="outlined"
      size="small"
      disabled={loading}
      onClick={handleClick}
      sx={{ whiteSpace: "nowrap", height: 36 }}
    >
      {loading ? "Loading..." : "View Report"}
    </Button>
  );
}
