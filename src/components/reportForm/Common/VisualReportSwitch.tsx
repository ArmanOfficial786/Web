"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

interface VisualReportSwitchProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
}

export function VisualReportSwitch<TFieldValues extends FieldValues>({
  control,
  name,
}: VisualReportSwitchProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <FormControlLabel
          control={
            <Switch
              checked={value ?? false}
              onChange={(e) => onChange(e.target.checked)}
              sx={{ ml: 8.5 }}
            />
          }
          label={value ? "Visual Report" : "Normal Report"}
          labelPlacement="end"
        />
      )}
    />
  );
}
