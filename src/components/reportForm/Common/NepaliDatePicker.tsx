// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import Box from "@mui/material/Box";
// import FormControl from "@mui/material/FormControl";
// import FormHelperText from "@mui/material/FormHelperText";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import calendarService from "@/services/Common/ComCalendarService";

// const BS_MONTHS = [
//   { value: 1, label: "Baisakh" },
//   { value: 2, label: "Jestha" },
//   { value: 3, label: "Ashadh" },
//   { value: 4, label: "Shrawan" },
//   { value: 5, label: "Bhadra" },
//   { value: 6, label: "Ashwin" },
//   { value: 7, label: "Kartik" },
//   { value: 8, label: "Mangsir" },
//   { value: 9, label: "Poush" },
//   { value: 10, label: "Magh" },
//   { value: 11, label: "Falgun" },
//   { value: 12, label: "Chaitra" },
// ];

// const BLANK = -1;

// function pad2(n: number) {
//   return String(n).padStart(2, "0");
// }

// function parseBS(
//   value: string,
// ): { year: number; month: number; day: number } | null {
//   if (!value) return null;
//   const parts = value.split("-").map(Number);
//   if (parts.length !== 3 || parts.some(isNaN)) return null;
//   return { year: parts[0], month: parts[1], day: parts[2] };
// }

// export interface NepaliDatePickerProps {
//   value?: string;
//   onChange: (bsDate: string) => void;
//   defaultDate?: boolean;
//   blankSelection?: boolean;
//   requiredValidation?: boolean;
//   error?: boolean;
//   helperText?: string;
//   disabled?: boolean;
//   size?: "small" | "medium";
// }

// const NepaliDatePicker: React.FC<NepaliDatePickerProps> = ({
//   value = "",
//   onChange,
//   defaultDate = false,
//   blankSelection = false,
//   requiredValidation = false,
//   error = false,
//   helperText,
//   disabled = false,
//   size = "small",
// }) => {
//   const [years, setYears] = useState<number[]>([]);
//   const [days, setDays] = useState<number[]>([]);
//   const [year, setYear] = useState<number>(blankSelection ? BLANK : 0);
//   const [month, setMonth] = useState<number>(blankSelection ? BLANK : 1);
//   const [day, setDay] = useState<number>(blankSelection ? BLANK : 0);
//   const [fetchError, setFetchError] = useState<string | null>(null);

//   const initialValueSet = useRef(false);

//   // ── Always emit valid date ───────────────────────────────────────────────
//   const emitDate = (y: number, m: number, d: number) => {
//     if (y && y !== BLANK && m && m !== BLANK && d && d !== BLANK) {
//       onChange(`${y}-${pad2(m)}-${pad2(d)}`);
//     }
//   };

//   // ── 1. Mount: load years and resolve initial date ────────────────────────
//   useEffect(() => {
//     let cancelled = false;

//     const init = async () => {
//       try {
//         const allYears = await calendarService.getYears();
//         if (cancelled) return;
//         setYears(allYears);

//         let initYear = allYears[0] ?? 0;
//         let initMonth = blankSelection ? BLANK : 1;
//         let initDay = blankSelection ? BLANK : 1;

//         if (value && !initialValueSet.current) {
//           const p = parseBS(value);
//           if (p) {
//             initYear = p.year;
//             initMonth = p.month;
//             initDay = p.day;
//             initialValueSet.current = true;
//           }
//         } else if (defaultDate && !initialValueSet.current) {
//           const today = await calendarService.getTodayBs();
//           if (!cancelled) {
//             initYear = today.year;
//             initMonth = today.month;
//             initDay = today.day;
//             initialValueSet.current = true;
//           }
//         }

//         if (!cancelled) {
//           setYear(initYear);
//           setMonth(initMonth);
//           if (
//             initYear > 0 &&
//             initYear !== BLANK &&
//             initMonth > 0 &&
//             initMonth !== BLANK
//           ) {
//             const allDays = await calendarService.getDays(initYear, initMonth);
//             if (!cancelled) {
//               setDays(allDays);
//               const clamped =
//                 initDay > 0
//                   ? Math.min(initDay, allDays.length)
//                   : blankSelection
//                     ? BLANK
//                     : 1;
//               setDay(clamped);
//               emitDate(initYear, initMonth, clamped);
//             }
//           } else {
//             setDay(blankSelection ? BLANK : 0);
//           }
//         }
//       } catch (e: any) {
//         if (!cancelled) setFetchError(e?.message ?? "Calendar failed to load.");
//       }
//     };

//     init();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // runs once on mount

//   // ── 2. Fetch days when year or month changes ─────────────────────────────
//   useEffect(() => {
//     if (!year || year === BLANK || !month || month === BLANK) {
//       setDays([]);
//       if (!blankSelection) setDay(0);
//       return;
//     }

//     let cancelled = false;
//     calendarService
//       .getDays(year, month)
//       .then((allDays) => {
//         if (cancelled) return;
//         setDays(allDays);
//         const newDay = (() => {
//           if (blankSelection) return BLANK;
//           if (!day || day === BLANK || day > allDays.length)
//             return allDays[0] || 1;
//           return day;
//         })();
//         setDay(newDay);
//         emitDate(year, month, newDay);
//       })
//       .catch((e) => {
//         if (!cancelled) setFetchError(e?.message ?? "Failed to load days.");
//       });
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [year, month]); // day excluded intentionally

//   // ── 3. Emit on every valid internal state change ─────────────────────────
//   useEffect(() => {
//     if (
//       year &&
//       year !== BLANK &&
//       month &&
//       month !== BLANK &&
//       day &&
//       day !== BLANK
//     ) {
//       emitDate(year, month, day);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [year, month, day]);

//   // ── 4. Sync with external `value` prop changes ───────────────────────────
//   //
//   // Problem this solves:
//   //   When the parent calls reset() (e.g. react-hook-form reset after submit),
//   //   the form field goes back to null/"" while the picker's internal state
//   //   still holds the previously selected date. The next submit would send null
//   //   for any date the user didn't physically re-touch.
//   //
//   // Strategy:
//   //   a) If value is cleared externally → re-emit our current internal state
//   //      back to the form so it stays in sync.
//   //   b) If value is set to a new valid BS date that differs from our internal
//   //      state → sync our dropdowns to match the new value.
//   //
//   // We skip this effect on first render (initialValueSet guards the mount path).
//   const prevValueRef = useRef<string>(value);
//   useEffect(() => {
//     const prev = prevValueRef.current;
//     prevValueRef.current = value ?? "";

//     // Skip if nothing actually changed
//     if ((value ?? "") === prev) return;

//     // ── Case A: value was cleared externally ────────────────────────────────
//     if (!value || value === "") {
//       // Only re-emit when not in blankSelection mode and we have a valid date
//       if (
//         !blankSelection &&
//         year &&
//         year !== BLANK &&
//         month &&
//         month !== BLANK &&
//         day &&
//         day !== BLANK
//       ) {
//         emitDate(year, month, day);
//       }
//       return;
//     }

//     // ── Case B: value changed to a new valid BS date ────────────────────────
//     const p = parseBS(value);
//     if (!p) return;

//     // Only update internal state if it actually differs (avoids infinite loop)
//     if (p.year !== year || p.month !== month || p.day !== day) {
//       setYear(p.year);
//       setMonth(p.month);
//       // day will be reconciled after getDays() runs in effect #2
//       setDay(p.day);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value]);

//   const isInvalid =
//     requiredValidation &&
//     (!year ||
//       year === BLANK ||
//       !month ||
//       month === BLANK ||
//       !day ||
//       day === BLANK);
//   const hasError = error || isInvalid;

//   return (
//     <Box>
//       <Box sx={{ display: "flex", gap: 1 }}>
//         {/* Year dropdown */}
//         <FormControl
//           size={size}
//           error={hasError}
//           sx={{ minWidth: 100 }}
//           fullWidth
//         >
//           <Select
//             value={year || ""}
//             disabled={disabled}
//             displayEmpty
//             renderValue={(v: any) => {
//               if (!v || v === BLANK) return blankSelection ? "yyyy" : "Year";
//               return v;
//             }}
//             onChange={(e) => setYear(Number(e.target.value))}
//           >
//             {blankSelection ? (
//               <MenuItem value={BLANK} disabled>
//                 yyyy
//               </MenuItem>
//             ) : (
//               <MenuItem value="" disabled>
//                 Year
//               </MenuItem>
//             )}
//             {years.map((y) => (
//               <MenuItem key={y} value={y}>
//                 {y}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Month dropdown */}
//         <FormControl
//           size={size}
//           error={hasError}
//           sx={{ minWidth: 155 }}
//           fullWidth
//         >
//           <Select
//             value={month || ""}
//             disabled={disabled}
//             displayEmpty
//             renderValue={(v: any) => {
//               if (!v || v === BLANK) return blankSelection ? "mm" : "Month";
//               const m = BS_MONTHS.find((x) => x.value === v);
//               return m ? `${pad2(v)} – ${m.label}` : "Month";
//             }}
//             onChange={(e) => setMonth(Number(e.target.value))}
//           >
//             {blankSelection ? (
//               <MenuItem value={BLANK} disabled>
//                 mm
//               </MenuItem>
//             ) : (
//               <MenuItem value="" disabled>
//                 Month
//               </MenuItem>
//             )}
//             {BS_MONTHS.map((m) => (
//               <MenuItem key={m.value} value={m.value}>
//                 {`${pad2(m.value)} – ${m.label}`}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Day dropdown */}
//         <FormControl
//           size={size}
//           error={hasError}
//           sx={{ minWidth: 90 }}
//           fullWidth
//         >
//           <Select
//             value={days.length ? day || "" : ""}
//             disabled={disabled || !days.length}
//             displayEmpty
//             renderValue={(v: any) => {
//               if (!v || v === BLANK) return blankSelection ? "dd" : "Day";
//               return pad2(v);
//             }}
//             onChange={(e) => setDay(Number(e.target.value))}
//           >
//             {blankSelection ? (
//               <MenuItem value={BLANK} disabled>
//                 dd
//               </MenuItem>
//             ) : (
//               <MenuItem value="" disabled>
//                 Day
//               </MenuItem>
//             )}
//             {days.map((d) => (
//               <MenuItem key={d} value={d}>
//                 {pad2(d)}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       {isInvalid && (
//         <FormHelperText error sx={{ mx: "14px" }}>
//           *
//         </FormHelperText>
//       )}
//       {fetchError && (
//         <FormHelperText error sx={{ mx: "14px" }}>
//           {fetchError}
//         </FormHelperText>
//       )}
//       {helperText && (
//         <FormHelperText error={hasError} sx={{ mx: "14px" }}>
//           {helperText}
//         </FormHelperText>
//       )}
//     </Box>
//   );
// };

// export default NepaliDatePicker;

// components/reportForm/Common/NepaliDatePicker.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
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

const BLANK = -1;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function parseBS(
  value: string,
): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return { year: parts[0], month: parts[1], day: parts[2] };
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
  const initialValueSet = useRef(false);

  const parsedMaxDate = maxDate ? parseBS(maxDate) : null;
  const effectiveMaxYear = parsedMaxDate?.year ?? maxYear ?? null;

  // ── Dropdown filtering ────────────────────────────────────────────────────
  const visibleYears = effectiveMaxYear
    ? years.filter((y) => y <= effectiveMaxYear)
    : years;

  const visibleMonths = (() => {
    if (parsedMaxDate && year === parsedMaxDate.year)
      return BS_MONTHS.filter((m) => m.value <= parsedMaxDate.month);
    return BS_MONTHS;
  })();

  const visibleDays = (() => {
    if (
      parsedMaxDate &&
      year === parsedMaxDate.year &&
      month === parsedMaxDate.month
    )
      return days.filter((d) => d <= parsedMaxDate.day);
    return days;
  })();

  // ── Emit helper ───────────────────────────────────────────────────────────
  const emitDate = (y: number, m: number, d: number) => {
    if (y && y !== BLANK && m && m !== BLANK && d && d !== BLANK)
      onChange(`${y}-${pad2(m)}-${pad2(d)}`);
  };

  // ── Mount: load years + resolve initial date ──────────────────────────────
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

        if (value && !initialValueSet.current) {
          const p = parseBS(value);
          if (p) {
            initYear = p.year;
            initMonth = p.month;
            initDay = p.day;
            initialValueSet.current = true;
          }
        } else if (defaultDate && !initialValueSet.current) {
          const today = await calendarService.getTodayBs();
          if (!cancelled) {
            initYear = today.year;
            initMonth = today.month;
            initDay = today.day;
            initialValueSet.current = true;
          }
        }

        if (effectiveMaxYear && initYear > effectiveMaxYear)
          initYear = effectiveMaxYear;

        if (!cancelled) {
          setYear(initYear);
          setMonth(initMonth);
          if (
            initYear > 0 &&
            initYear !== BLANK &&
            initMonth > 0 &&
            initMonth !== BLANK
          ) {
            const allDays = await calendarService.getDays(initYear, initMonth);
            if (!cancelled) {
              setDays(allDays);
              const maxDayForSlot =
                parsedMaxDate &&
                initYear === parsedMaxDate.year &&
                initMonth === parsedMaxDate.month
                  ? Math.min(allDays.length, parsedMaxDate.day)
                  : allDays.length;
              const clamped =
                initDay > 0
                  ? Math.min(initDay, maxDayForSlot)
                  : blankSelection
                    ? BLANK
                    : 1;
              setDay(clamped);
              emitDate(initYear, initMonth, clamped);
            }
          } else {
            setDay(blankSelection ? BLANK : 0);
          }
        }
      } catch (e: any) {}
    };
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Fetch days when year/month changes ────────────────────────────────────
  useEffect(() => {
    if (!year || year === BLANK || !month || month === BLANK) {
      setDays([]);
      if (!blankSelection) setDay(0);
      return;
    }
    let cancelled = false;
    calendarService
      .getDays(year, month)
      .then((allDays) => {
        if (cancelled) return;
        setDays(allDays);
        const maxDayForSlot =
          parsedMaxDate &&
          year === parsedMaxDate.year &&
          month === parsedMaxDate.month
            ? Math.min(allDays.length, parsedMaxDate.day)
            : allDays.length;
        const newDay = blankSelection
          ? BLANK
          : day && day !== BLANK && day <= maxDayForSlot
            ? day
            : allDays[0] || 1;
        setDay(newDay);
        emitDate(year, month, newDay);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  // ── Emit on any valid change ──────────────────────────────────────────────
  useEffect(() => {
    if (
      year &&
      year !== BLANK &&
      month &&
      month !== BLANK &&
      day &&
      day !== BLANK
    )
      emitDate(year, month, day);
  }, [year, month, day]);

  // ── Sync when external value changes (e.g. after reset) ──────────────────
  const prevValueRef = useRef<string>(value);
  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value ?? "";
    if ((value ?? "") === prev) return;

    if (!value || value === "") {
      if (
        !blankSelection &&
        year &&
        year !== BLANK &&
        month &&
        month !== BLANK &&
        day &&
        day !== BLANK
      )
        emitDate(year, month, day);
      return;
    }
    const p = parseBS(value);
    if (!p) return;
    if (p.year !== year || p.month !== month || p.day !== day) {
      setYear(p.year);
      setMonth(p.month);
      setDay(p.day);
    }
  }, [value]);

  // ── Guard: clamp selections when maxDate/maxYear prop changes ────────────
  useEffect(() => {
    if (!parsedMaxDate) return;
    if (year !== BLANK && year > parsedMaxDate.year) {
      setYear(parsedMaxDate.year);
    } else if (year === parsedMaxDate.year) {
      if (month !== BLANK && month > parsedMaxDate.month)
        setMonth(parsedMaxDate.month);
      else if (
        month === parsedMaxDate.month &&
        day !== BLANK &&
        day > parsedMaxDate.day
      )
        setDay(parsedMaxDate.day);
    }
  }, [maxDate]);

  useEffect(() => {
    if (!effectiveMaxYear) return;
    if (year !== BLANK && year > effectiveMaxYear) setYear(effectiveMaxYear);
  }, [maxYear]);

  // ── Derived error state ───────────────────────────────────────────────────
  const isInvalid =
    requiredValidation &&
    (!year ||
      year === BLANK ||
      !month ||
      month === BLANK ||
      !day ||
      day === BLANK);
  const hasError = error || isInvalid;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Year */}
        <FormControl
          size={size}
          error={hasError}
          sx={{ minWidth: 100 }}
          fullWidth
        >
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

        {/* Month */}
        <FormControl
          size={size}
          error={hasError}
          sx={{ minWidth: 165 }}
          fullWidth
        >
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

        {/* Day */}
        <FormControl
          size={size}
          error={hasError}
          sx={{ minWidth: 100 }}
          fullWidth
        >
          <Select
            value={visibleDays.length ? day || "" : ""}
            disabled={disabled || !visibleDays.length}
            displayEmpty
            renderValue={(v: any) =>
              !v || v === BLANK ? (blankSelection ? "dd" : "Day") : pad2(v)
            }
            onChange={(e) => setDay(Number(e.target.value))}
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
