"use client";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FieldRow from "@/utilis/FieldRow";

interface MonthWiseFieldProps<T extends FieldValues> {
  control: Control<T>;
  name?: Path<T>;
  label: string;
  row?: boolean;
}

export default function DisplayTypeField<T extends FieldValues>({
  control,
  name = "isMonthWise" as Path<T>,
  label,
  row = true,
}: MonthWiseFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            row={row}
            value={field.value ? "monthwise" : "normal"}
            onChange={(e) => field.onChange(e.target.value === "monthwise")}
          >
            <FormControlLabel
              value="normal"
              control={<Radio />}
              label="Normal"
            />
            <FormControlLabel
              value="monthwise"
              control={<Radio />}
              label="Month Wise"
            />
          </RadioGroup>
        )}
      />
    </FieldRow>
  );
}
