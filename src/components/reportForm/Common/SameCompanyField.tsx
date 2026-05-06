"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import Grid from "@mui/material/Grid";
import FieldRow from "@/utilis/FieldRow";
import CheckboxInput, { LabelPlacement } from "@/components/form/CheckboxInput";

interface SameCompanyFieldProps<T extends FieldValues> {
  control: Control<T>;
  name?: Path<T>;
  label?: string;
  labelPlacement?: LabelPlacement;
  gridSize?: { xs?: number; md?: number };
}

export default function SameCompanyField<T extends FieldValues>({
  control,
  name = "sameCompanyName" as Path<T>,
  label = "same Company Name",
  labelPlacement = "start" as LabelPlacement,
  gridSize = { xs: 12, md: 6 },
}: SameCompanyFieldProps<T>) {
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
