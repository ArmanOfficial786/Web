"use client";
import React from "react";
import type { FieldValues, Path, UseFormSetValue } from "react-hook-form";
import Button from "@mui/material/Button";

interface ClearFormButtonProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  clearFields?: Path<T>[];
  clearSelectedMember?: () => void;
}

export default function ClearFormButton<T extends FieldValues>({
  setValue,
  clearFields = [],
  clearSelectedMember,
}: ClearFormButtonProps<T>) {
  const handleClear = () => {
    clearFields.forEach((field) => {
      setValue(field, "" as any);
    });
    clearSelectedMember?.();
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      onClick={handleClear}
      sx={{ whiteSpace: "nowrap", height: 30 }}
    >
      Clear
    </Button>
  );
}
