// components/reportForm/Common/VaultTypeSwitch.tsx
"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

interface VaultTypeSwitchProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
}

export function VaultTypeSwitch<TFieldValues extends FieldValues>({
  control,
  name,
}: VaultTypeSwitchProps<TFieldValues>) {
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
          label={value ? "To Vault" : "From Vault"}
          labelPlacement="end"
        />
      )}
    />
  );
}
