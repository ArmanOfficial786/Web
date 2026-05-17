"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DateInput from "@/components/form/DateInput";
import FieldRow from "@/utilis/FieldRow";
import NepaliDate from "@/components/reportForm/Common/NepaliDatePicker"; // adjust to your actual BS library

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns today's date as a BS string in the same format your NepaliDatePicker
 * produces, e.g. "2081/08/15". Adjust the format call to match your library.
 */
function getTodayBS(): string {
  const today = new Date();
  const nepaliDate = new NepaliDate(today);
  // Format: "YYYY/MM/DD" – change separator/padding if your picker uses a different one
  const y = nepaliDate.getYear();
  const m = String(nepaliDate.getMonth() + 1).padStart(2, "0");
  const d = String(nepaliDate.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

/**
 * Compares two BS date strings (same format).
 * Returns true when `bsDate` is after today.
 */
function isFutureBS(bsDate: string): boolean {
  const today = getTodayBS();
  // Lexicographic comparison works for "YYYY/MM/DD" and "YYYY-MM-DD"
  return bsDate.replace(/-/g, "/") > today.replace(/-/g, "/");
}

// ── Component ─────────────────────────────────────────────────────────────────

interface TillDateFieldProps<T extends FieldValues> {
  control: Control<T>;
  /**
   * The field name in your form schema. Defaults to "tillDate".
   */
  name?: Path<T>;
  label?: string;
}

export default function TillDateField<T extends FieldValues>({
  control,
  name = "tillDate" as Path<T>,
  label = "Till Date",
}: TillDateFieldProps<T>) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldRow label={label}>
          <Box sx={{ width: "100%" }}>
            <DateInput
              name={name}
              control={control}
              dateType="BS"
              rules={{
                validate: (value: string) => {
                  if (!value) return true; // let "required" rule handle empty
                  if (isFutureBS(value)) {
                    return "Till Date cannot be greater than today's date.";
                  }
                  return true;
                },
              }}
            />
          </Box>
        </FieldRow>
      </Grid>
    </Grid>
  );
}
