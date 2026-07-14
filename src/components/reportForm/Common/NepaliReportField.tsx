// components/reportForm/Common/NepaliReportField.tsx
"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import Grid from "@mui/material/Grid";
import FieldRow from "@/utilis/FieldRow";
import CheckboxInput, { LabelPlacement } from "@/components/form/CheckboxInput";

interface NepaliReportFieldProps<T extends FieldValues> {
  control: Control<T>;
  name?: Path<T>;
  label?: string;
  labelPlacement?: LabelPlacement;
  gridSize?: { xs?: number; md?: number };
}

export default function NepaliReportField<T extends FieldValues>({
  control,
  name = "isNepaliReport" as Path<T>,
  label = "Nepali Report",
  labelPlacement = "start" as LabelPlacement,
  gridSize = { xs: 12, md: 6 },
}: NepaliReportFieldProps<T>) {
  return (
    <Grid size={gridSize}>
      <FieldRow label="">
        <CheckboxInput
          name={name}
          control={control}
          label={label}
          size="small"
          color="primary"
          labelPlacement={labelPlacement}
          sx={{ ml: -3 }}
        />
      </FieldRow>
    </Grid>
  );
}
