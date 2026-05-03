"use client";
import React from "react";
import type { FieldValues, Path, UseFormSetValue } from "react-hook-form";
import Button from "@mui/material/Button";

// ── Props ─────────────────────────────────────────────────────────────────────
interface ClearFormButtonProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  // 🔥 instead of form type → we use field names
  clearFields?: Path<T>[];
  clearSelectedMember?: () => void;
}

export default function ClearFormButton<T extends FieldValues>({
  //reset,
  setValue,
  clearFields = [],
  clearSelectedMember,
}: ClearFormButtonProps<T>) {
  const handleClear = () => {
    // clear only specified fields
    clearFields.forEach((field) => {
      setValue(field, "" as any);
    });
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
