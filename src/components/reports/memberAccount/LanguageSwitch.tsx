// components/reportForm/Common/LanguageSwitch.tsx
"use client";

import React from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

interface LanguageSwitchProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>; // field holding "English" | "Nepali"
}

// ── Off = English (default), On = Nepali ─────────────────────────────────
export function LanguageSwitch<TFieldValues extends FieldValues>({
  control,
  name,
}: LanguageSwitchProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const isNepali = value === "Nepali";
        return (
          <FormControlLabel
            control={
              <Switch
                checked={isNepali}
                onChange={(e) =>
                  onChange(e.target.checked ? "Nepali" : "English")
                }
              />
            }
            label={isNepali ? "Nepali" : "English"}
            labelPlacement="end"
          />
        );
      }}
    />
  );
}
