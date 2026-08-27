// // src/components/reportForm/Common/TellerExpenseField.tsx
// "use client";
// import DropDown from "@/components/form/DropDown";
// import { useReportFormContext } from "@/contexts/ReportFormContext";
// import FieldRow from "@/utilis/FieldRow";
// import React, { useEffect, useRef } from "react";
// import { Control, FieldValues, Path } from "react-hook-form";
// import calendarService from "@/services/Common/ComCalendarService";

// interface TellerExpenseFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   tellerFieldName: Path<T>;
//   fromDateBs?: string;
//   toDateBs?: string;
//   label?: string;
// }

// function pad2(n: number) {
//   return String(n).padStart(2, "0");
// }

// export default function TellerExpenseField<T extends FieldValues>({
//   control,
//   tellerFieldName,
//   fromDateBs,
//   toDateBs,
//   label = "Teller Name",
// }: TellerExpenseFieldProps<T>) {
//   const { fetchTellerExpenses, tellerExpenseOptions } = useReportFormContext();
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
//     undefined,
//   );

//   useEffect(() => {
//     let cancelled = false;

//     const run = async () => {
//       let effectiveFrom = fromDateBs;
//       let effectiveTo = toDateBs;

//       if (!effectiveFrom || !effectiveTo) {
//         try {
//           const today = await calendarService.getTodayBs();
//           if (cancelled) return;

//           if (!effectiveTo) {
//             effectiveTo = `${today.year}-${pad2(today.month)}-${pad2(today.day)}`;
//           }
//           if (!effectiveFrom) {
//             effectiveFrom = `${today.year}-${pad2(today.month)}-01`;
//           }
//         } catch {
//           return;
//         }
//       }

//       if (cancelled) return;

//       if (debounceRef.current) clearTimeout(debounceRef.current);
//       debounceRef.current = setTimeout(() => {
//         fetchTellerExpenses(effectiveFrom, effectiveTo);
//       }, 300);
//     };

//     run();

//     return () => {
//       cancelled = true;
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//     };
//   }, [fetchTellerExpenses, fromDateBs, toDateBs]);

//   return (
//     <FieldRow label={label}>
//       <DropDown
//         name={tellerFieldName}
//         control={control}
//         label={label}
//         options={tellerExpenseOptions}
//         fullWidth
//       />
//     </FieldRow>
//   );
// }

// src/components/reportForm/Common/TellerExpenseField.tsx
"use client";
import DropDownWithLoading from "@/components/form/DropDownWithLoading";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import React, { useEffect, useRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface TellerExpenseFieldProps<T extends FieldValues> {
  control: Control<T>;
  tellerFieldName: Path<T>;
  fromDateBs?: string;
  toDateBs?: string;
  label?: string;
}

export default function TellerExpenseField<T extends FieldValues>({
  control,
  tellerFieldName,
  fromDateBs,
  toDateBs,
  label = "Teller Name",
}: TellerExpenseFieldProps<T>) {
  const { fetchTellerExpenses, tellerExpenseOptions, tellerExpenseLoading } =
    useReportFormContext();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // ── Skip the very first time dates become non-empty — that's
  // NepaliDatePicker's own defaultDate auto-fill firing on mount, not a
  // user selection. Only react to CHANGES after that initial snapshot. ────
  const mountedRef = useRef(false);
  const prevDatesRef = useRef<{ from?: string; to?: string }>({
    from: fromDateBs,
    to: toDateBs,
  });

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!mountedRef.current) {
      mountedRef.current = true;
      prevDatesRef.current = { from: fromDateBs, to: toDateBs };
      return;
    }

    const changed =
      fromDateBs !== prevDatesRef.current.from ||
      toDateBs !== prevDatesRef.current.to;
    prevDatesRef.current = { from: fromDateBs, to: toDateBs };

    if (!changed || !fromDateBs || !toDateBs) {
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchTellerExpenses(fromDateBs, toDateBs);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchTellerExpenses, fromDateBs, toDateBs]);

  return (
    <FieldRow label={label}>
      <DropDownWithLoading
        name={tellerFieldName}
        control={control}
        label={label}
        options={tellerExpenseOptions}
        fullWidth
        disabled={tellerExpenseLoading}
        loading={tellerExpenseLoading}
      />
    </FieldRow>
  );
}
