"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import Grid from "@mui/material/Grid";
import DateInput from "@/components/form/DateInput";
import FieldRow from "@/utilis/FieldRow";

interface DateFieldsProps<T extends FieldValues> {
  control: Control<T>;
}

export default function DateFields<T extends FieldValues>({
  control,
}: DateFieldsProps<T>) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldRow label="From Date">
          <DateInput
            name={"fromDate" as Path<T>}
            control={control}
            dateType="BS"
          />
        </FieldRow>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldRow label="To Date">
          <DateInput
            name={"toDate" as Path<T>}
            control={control}
            dateType="BS"
          />
        </FieldRow>
      </Grid>
    </Grid>
  );
}
