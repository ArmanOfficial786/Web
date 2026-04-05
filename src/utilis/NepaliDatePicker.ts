"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

// ── BS calendar data ──────────────────────────────────────────────────────────
const BS_DAYS: Record<number, number[]> = {
  2070: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2072: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2074: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2076: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2078: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2085: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2086: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2087: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2088: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2089: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 31],
  2090: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
};

const BS_MONTHS = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

const MIN_YEAR = 2070;
const MAX_YEAR = 2090;
const DEFAULT_YEAR = 2081;

// ── Helpers ───────────────────────────────────────────────────────────────────
function daysInMonth(year: number, month: number): number {
  return BS_DAYS[year]?.[month - 1] ?? 30;
}

function parseBS(
  value: string,
): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return { year: parts[0], month: parts[1], day: parts[2] };
}

// ── Props ─────────────────────────────────────────────────────────────────────
export interface NepaliDatePickerProps {
  value?: string;
  onChange: (bsDate: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  size?: "small" | "medium";
}

// ── Component (no JSX — pure React.createElement) ────────────────────────────
const NepaliDatePicker: React.FC<NepaliDatePickerProps> = ({
  value = "",
  onChange,
  label,
  error = false,
  helperText,
  disabled = false,
  size = "small",
}) => {
  const parsed = parseBS(value) ?? { year: DEFAULT_YEAR, month: 1, day: 1 };

  const [year, setYear] = useState<number>(parsed.year);
  const [month, setMonth] = useState<number>(parsed.month);
  const [day, setDay] = useState<number>(parsed.day);

  // ── Sync inward when parent updates value ────────────────────────────────
  useEffect(() => {
    const p = parseBS(value);
    if (p) {
      setYear(p.year);
      setMonth(p.month);
      setDay(p.day);
    }
  }, [value]);

  // ── Emit + clamp day whenever any part changes ───────────────────────────
  useEffect(() => {
    const max = daysInMonth(year, month);
    const clamped = Math.min(day, max);

    if (clamped !== day) {
      setDay(clamped);
      return;
    }

    onChange(
      `${year}-${String(month).padStart(2, "0")}-${String(clamped).padStart(2, "0")}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, day]);

  // ── Derived lists ────────────────────────────────────────────────────────
  const years = Array.from(
    { length: MAX_YEAR - MIN_YEAR + 1 },
    (_, i) => MIN_YEAR + i,
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from(
    { length: daysInMonth(year, month) },
    (_, i) => i + 1,
  );

  // ── Year select ──────────────────────────────────────────────────────────
  const yearSelect = React.createElement(
    FormControl,
    { size, error, sx: { minWidth: 0 }, fullWidth: true },
    React.createElement(InputLabel, null, "Year"),
    React.createElement(
      Select,
      {
        label: "Year",
        value: year,
        disabled,
        onChange: (e: { target: { value: unknown } }) =>
          setYear(Number(e.target.value)),
      },
      ...years.map((y) =>
        React.createElement(MenuItem, { key: y, value: y }, y),
      ),
    ),
  );

  // ── Month select ─────────────────────────────────────────────────────────
  const monthSelect = React.createElement(
    FormControl,
    { size, error, sx: { minWidth: 0 }, fullWidth: true },
    React.createElement(InputLabel, null, "Month"),
    React.createElement(
      Select,
      {
        label: "Month",
        value: month,
        disabled,
        onChange: (e: { target: { value: unknown } }) =>
          setMonth(Number(e.target.value)),
      },
      ...months.map((m) =>
        React.createElement(
          MenuItem,
          { key: m, value: m },
          `${String(m).padStart(2, "0")} – ${BS_MONTHS[m - 1]}`,
        ),
      ),
    ),
  );

  // ── Day select ───────────────────────────────────────────────────────────
  const daySelect = React.createElement(
    FormControl,
    { size, error, sx: { minWidth: 80 } },
    React.createElement(InputLabel, null, "Day"),
    React.createElement(
      Select,
      {
        label: "Day",
        value: day,
        disabled,
        onChange: (e: { target: { value: unknown } }) =>
          setDay(Number(e.target.value)),
      },
      ...days.map((d) =>
        React.createElement(
          MenuItem,
          { key: d, value: d },
          String(d).padStart(2, "0"),
        ),
      ),
    ),
  );

  // ── Selects row ──────────────────────────────────────────────────────────
  const selectsRow = React.createElement(
    Box,
    { sx: { display: "flex", gap: 1 } },
    yearSelect,
    monthSelect,
    daySelect,
  );

  // ── Optional label ───────────────────────────────────────────────────────
  const labelEl = label
    ? React.createElement(
        InputLabel,
        {
          shrink: true,
          error,
          sx: { position: "static", transform: "none", mb: 0.5, fontSize: 14 },
        },
        label,
      )
    : null;

  // ── Optional helper text ─────────────────────────────────────────────────
  const helperEl = helperText
    ? React.createElement(
        FormHelperText,
        { error, sx: { mx: "14px" } },
        helperText,
      )
    : null;

  // ── Root ─────────────────────────────────────────────────────────────────
  return React.createElement(Box, null, labelEl, selectsRow, helperEl);
};

export default NepaliDatePicker;
