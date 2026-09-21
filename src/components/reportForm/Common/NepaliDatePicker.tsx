// components/reportForm/Common/NepaliDatePicker.tsx
"use client";
import calendarService from "@/services/Common/ComCalendarService";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

const BLANK = -1;

type BsParts = { year: number; month: number; day: number };

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function parseBS(value: string): BsParts | null {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return { year: parts[0], month: parts[1], day: parts[2] };
}

/**
 * Pure helper: pulls (y, m, d) back inside the allowed upper bound.
 * BLANK (-1) / 0 values are never touched because they are never > a bound.
 */
function clampToMax(
  y: number,
  m: number,
  d: number,
  max: BsParts | null,
  maxYear: number | null,
) {
  if (max) {
    if (y > max.year) y = max.year;
    if (y === max.year) {
      if (m > max.month) m = max.month;
      if (m === max.month && d > max.day) d = max.day;
    }
  } else if (maxYear && y > maxYear) {
    y = maxYear;
  }
  return { y, m, d };
}

export interface NepaliDatePickerProps {
  value?: string;
  onChange: (bsDate: string) => void;
  defaultDate?: boolean;
  blankSelection?: boolean;
  requiredValidation?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  /**
   * Full upper-bound restriction (yyyy-mm-dd in BS).
   * Hides years, months AND days beyond this date in all three dropdowns.
   */
  maxDate?: string;
  /**
   * Year-only upper-bound. Ignored when maxDate is supplied.
   */
  maxYear?: number;
}

const NepaliDatePicker: React.FC<NepaliDatePickerProps> = ({
  value = "",
  onChange,
  defaultDate = false,
  blankSelection = false,
  requiredValidation = false,
  error = false,
  disabled = false,
  size = "small",
  maxDate,
  maxYear,
}) => {
  const [years, setYears] = useState<number[]>([]);
  const [days, setDays] = useState<number[]>([]);
  const [year, setYear] = useState<number>(blankSelection ? BLANK : 0);
  const [month, setMonth] = useState<number>(blankSelection ? BLANK : 1);
  const [day, setDay] = useState<number>(blankSelection ? BLANK : 0);

  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value ?? "");
  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value ?? "";
  });

  const lastEmittedDate = useRef(value ?? "");
  const preserveDay = useRef(false);
  const prevValueRef = useRef<string>(value ?? "");

  const parsedMaxDate = useMemo(
    () => (maxDate ? parseBS(maxDate) : null),
    [maxDate],
  );
  const effectiveMaxYear = parsedMaxDate?.year ?? maxYear ?? null;

  const visibleYears = effectiveMaxYear
    ? years.filter((y) => y <= effectiveMaxYear)
    : years;

  const visibleMonths =
    parsedMaxDate && year === parsedMaxDate.year
      ? BS_MONTHS.filter((m) => m.value <= parsedMaxDate.month)
      : BS_MONTHS;

  const visibleDays =
    parsedMaxDate &&
    year === parsedMaxDate.year &&
    month === parsedMaxDate.month
      ? days.filter((d) => d <= parsedMaxDate.day)
      : days;

  const emitDate = useCallback((y: number, m: number, d: number) => {
    if (y <= 0 || m <= 0 || d <= 0) return;
    const nextDate = `${y}-${pad2(m)}-${pad2(d)}`;
    if (nextDate === lastEmittedDate.current) return;
    lastEmittedDate.current = nextDate;
    if (nextDate === valueRef.current) return;
    onChangeRef.current(nextDate);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const allYears = await calendarService.getYears();
        if (cancelled) return;
        setYears(allYears);

        let initYear = allYears[0] ?? 0;
        let initMonth = blankSelection ? BLANK : 1;
        let initDay = blankSelection ? BLANK : 1;

        const p = valueRef.current ? parseBS(valueRef.current) : null;
        if (p) {
          initYear = p.year;
          initMonth = p.month;
          initDay = p.day;
        } else if (defaultDate) {
          const today = await calendarService.getTodayBs();
          if (cancelled) return;
          initYear = today.year;
          initMonth = today.month;
          initDay = today.day;
        }

        const c = clampToMax(
          initYear,
          initMonth,
          initDay,
          parsedMaxDate,
          effectiveMaxYear,
        );

        if (c.y !== year || c.m !== month) preserveDay.current = true;
        setYear(c.y);
        setMonth(c.m);
        setDay(c.d > 0 ? c.d : blankSelection ? BLANK : 0);
      } catch {
        /* calendar service failed – leave the picker empty */
      }
    };
    init();
    return () => {
      cancelled = true;
    };
    // Runs once on mount with the initial field state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (year <= 0 || month <= 0) {
      setDays([]);
      if (!blankSelection) setDay(0);
      return;
    }
    let cancelled = false;
    const keepDay = preserveDay.current;

    calendarService
      .getDays(year, month)
      .then((allDays) => {
        if (cancelled) return;
        preserveDay.current = false;
        setDays(allDays);

        const maxDayForSlot =
          parsedMaxDate &&
          year === parsedMaxDate.year &&
          month === parsedMaxDate.month
            ? Math.min(allDays.length, parsedMaxDate.day)
            : allDays.length;

        let newDay: number;
        if (blankSelection && !keepDay) newDay = BLANK;
        else if (day > 0 && day <= maxDayForSlot) newDay = day;
        else newDay = blankSelection ? BLANK : allDays[0] || 1;

        setDay(newDay);
        emitDate(year, month, newDay);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  useEffect(() => {
    const incoming = value ?? "";
    if (incoming === prevValueRef.current) return;
    prevValueRef.current = incoming;

    if (incoming === lastEmittedDate.current) return;

    if (!incoming) {
      lastEmittedDate.current = "";
      if (!blankSelection) emitDate(year, month, day);
      return;
    }

    const p = parseBS(incoming);
    if (!p) return;

    lastEmittedDate.current = incoming;

    if (p.year === year && p.month === month && p.day === day) return;
    preserveDay.current = p.year !== year || p.month !== month;
    setYear(p.year);
    setMonth(p.month);
    setDay(p.day);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!parsedMaxDate && !effectiveMaxYear) return;
    const c = clampToMax(year, month, day, parsedMaxDate, effectiveMaxYear);
    if (c.y === year && c.m === month && c.d === day) return;

    if (c.y !== year || c.m !== month) {
      preserveDay.current = true;
      setYear(c.y);
      setMonth(c.m);
      setDay(c.d);
    } else {
      setDay(c.d);
      emitDate(c.y, c.m, c.d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDate, maxYear]);

  const handleDayChange = (d: number) => {
    setDay(d);
    emitDate(year, month, d);
  };

  const isInvalid = requiredValidation && (year <= 0 || month <= 0 || day <= 0);
  const hasError = error || isInvalid;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl size={size} error={hasError} sx={{ minWidth: 80 }}>
          <Select
            value={year || ""}
            disabled={disabled}
            displayEmpty
            renderValue={(v: any) =>
              !v || v === BLANK ? (blankSelection ? "yyyy" : "Year") : v
            }
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {blankSelection ? (
              <MenuItem value={BLANK} disabled>
                yyyy
              </MenuItem>
            ) : (
              <MenuItem value="" disabled>
                Year
              </MenuItem>
            )}
            {visibleYears.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size={size} error={hasError} sx={{ minWidth: 130 }}>
          <Select
            value={month || ""}
            disabled={disabled}
            displayEmpty
            renderValue={(v: any) => {
              if (!v || v === BLANK) return blankSelection ? "mm" : "Month";
              const m = BS_MONTHS.find((x) => x.value === v);
              return m ? `${pad2(v)} – ${m.label}` : "Month";
            }}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {blankSelection ? (
              <MenuItem value={BLANK} disabled>
                mm
              </MenuItem>
            ) : (
              <MenuItem value="" disabled>
                Month
              </MenuItem>
            )}
            {visibleMonths.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {`${pad2(m.value)} – ${m.label}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size={size} error={hasError} sx={{ minWidth: 80 }}>
          <Select
            value={visibleDays.length ? day || "" : ""}
            disabled={disabled || !visibleDays.length}
            displayEmpty
            renderValue={(v: any) =>
              !v || v === BLANK ? (blankSelection ? "dd" : "Day") : pad2(v)
            }
            onChange={(e) => handleDayChange(Number(e.target.value))}
          >
            {blankSelection ? (
              <MenuItem value={BLANK} disabled>
                dd
              </MenuItem>
            ) : (
              <MenuItem value="" disabled>
                Day
              </MenuItem>
            )}
            {visibleDays.map((d) => (
              <MenuItem key={d} value={d}>
                {pad2(d)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default NepaliDatePicker;
