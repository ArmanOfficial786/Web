"use client";
import React, { useEffect, useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DateInput from "@/components/form/DateInput";
import FieldRow from "@/utilis/FieldRow";
import calendarService from "@/services/Common/ComCalendarService";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

interface DateFieldsProps<T extends FieldValues> {
  control: Control<T>;
  fromDateName?: Path<T>;
  toDateName?: Path<T>;
  fromDateLabel?: string;
  toDateLabel?: string;
  dateType?: "AD" | "BS";
  disabled?: boolean;
  showFromDate?: boolean;
  showToDate?: boolean;
}

export default function DateFields<T extends FieldValues>({
  control,
  fromDateName = "fromDate" as Path<T>,
  toDateName = "toDate" as Path<T>,
  fromDateLabel = "From Date" as Path<T>,
  toDateLabel = "To Date" as Path<T>,
  dateType = "BS",
  disabled = false,
  showFromDate = true,
  showToDate = true,
}: DateFieldsProps<T>) {
  const [todayBs, setTodayBs] = useState<string>("");

  useEffect(() => {
    if (dateType !== "BS") return;
    calendarService
      .getTodayBs()
      .then((t) => {
        setTodayBs(`${t.year}-${pad2(t.month)}-${pad2(t.day)}`);
      })
      .catch(() => {});
  }, [dateType]);

  // ── AD today string for native date inputs ────────────────────────────────
  const todayAD = new Date().toISOString().split("T")[0];

  return (
    <Grid container spacing={2} alignItems="center">
      {showFromDate && (
        <Grid size={{ xs: 12, md: 5 }}>
          <FieldRow label={fromDateLabel}>
            <Box sx={{ width: "80%" }}>
              <DateInput
                name={fromDateName}
                control={control}
                dateType={dateType}
                disabled={disabled}
                {...(dateType === "BS" // From Date: full restriction — year, month AND day are all
                  ? { maxDate: todayBs }
                  : { inputProps: { max: todayAD } })}
              />
            </Box>
          </FieldRow>
        </Grid>
      )}

      {/* ── To Date ────────────────────────────────────────────────────────── */}
      {showToDate && (
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldRow label={toDateLabel}>
            <Box sx={{ width: "80%" }}>
              <DateInput
                name={toDateName}
                control={control}
                dateType={dateType}
                disabled={disabled}
                {...(dateType === "BS" // To Date: full restriction — year, month AND day are all capped
                  ? { maxDate: todayBs }
                  : { inputProps: { max: todayAD } })}
              />
            </Box>
          </FieldRow>
        </Grid>
      )}
    </Grid>
  );
}
