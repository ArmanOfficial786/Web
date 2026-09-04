// components/reportForm/Common/YearMonthField.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FieldRow from "@/utilis/FieldRow";
import calendarService from "@/services/Common/ComCalendarService";

const BS_MONTHS = [
  { value: 1, label: "Baisakh" },
  { value: 2, label: "Jestha" },
  { value: 3, label: "Ashadh" },
  { value: 4, label: "Shrawan" },
  { value: 5, label: "Bhadra" },
  { value: 6, label: "Ashwin" },
  { value: 7, label: "Kartik" },
  { value: 8, label: "Mangsir" },
  { value: 9, label: "Poush" },
  { value: 10, label: "Magh" },
  { value: 11, label: "Falgun" },
  { value: 12, label: "Chaitra" },
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

interface YearMonthFieldProps<T extends FieldValues> {
  control: Control<T>;
  yearFieldName: Path<T>;
  monthFieldName: Path<T>;
  size?: "small" | "medium";
  disabled?: boolean;
}

// Mirrors NepaliDatePicker's year/month dropdown approach (same
// calendarService.getYears() call, same BS_MONTHS list) but omits the
// day dropdown entirely — for reports that filter by BS year + month only.
export default function YearMonthField<T extends FieldValues>({
  control,
  yearFieldName,
  monthFieldName,
  size = "small",
  disabled = false,
}: YearMonthFieldProps<T>) {
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    calendarService
      .getYears()
      .then((allYears) => {
        if (!cancelled) setYears(allYears);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
      }}
    >
      <FieldRow label="Year">
        <Controller
          name={yearFieldName}
          control={control}
          render={({ field, fieldState }) => (
            <FormControl size={size} error={!!fieldState.error} fullWidth>
              <Select
                value={field.value || ""}
                disabled={disabled}
                displayEmpty
                renderValue={(v: any) => (!v ? "Year" : v)}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                <MenuItem value="" disabled>
                  Year
                </MenuItem>
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </FieldRow>

      <FieldRow label="Month">
        <Controller
          name={monthFieldName}
          control={control}
          render={({ field, fieldState }) => (
            <FormControl size={size} error={!!fieldState.error} fullWidth>
              <Select
                value={field.value || ""}
                disabled={disabled}
                displayEmpty
                renderValue={(v: any) => {
                  if (!v) return "Month";
                  const m = BS_MONTHS.find((x) => x.value === v);
                  return m ? `${pad2(v)} – ${m.label}` : "Month";
                }}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                <MenuItem value="" disabled>
                  Month
                </MenuItem>
                {BS_MONTHS.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {`${pad2(m.value)} – ${m.label}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </FieldRow>
    </Box>
  );
}
