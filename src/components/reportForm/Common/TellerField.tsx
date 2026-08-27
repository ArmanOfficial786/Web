"use client";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import React, { useEffect, useRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import calendarService from "@/services/Common/ComCalendarService";

interface TellerFieldProps<T extends FieldValues> {
  control: Control<T>;
  tellerFieldName: Path<T>;
  fromDateBs?: string;
  toDateBs?: string;
  label?: string;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function TellerField<T extends FieldValues>({
  control,
  tellerFieldName,
  fromDateBs,
  toDateBs,
  label = "Teller Name",
}: TellerFieldProps<T>) {
  const { fetchTellers, tellerOptions } = useReportFormContext();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      let effectiveFrom = fromDateBs;
      let effectiveTo = toDateBs;

      if (!effectiveFrom || !effectiveTo) {
        try {
          const today = await calendarService.getTodayBs();
          if (cancelled) return;

          if (!effectiveTo) {
            effectiveTo = `${today.year}-${pad2(today.month)}-${pad2(today.day)}`;
          }
          if (!effectiveFrom) {
            effectiveFrom = `${today.year}-${pad2(today.month)}-01`;
          }
        } catch {
          return;
        }
      }

      if (cancelled) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchTellers(effectiveFrom, effectiveTo);
      }, 300);
    };

    run();

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchTellers, fromDateBs, toDateBs]);

  return (
    <FieldRow label={label}>
      <DropDown
        name={tellerFieldName}
        control={control}
        label={label}
        options={tellerOptions}
        fullWidth
      />
    </FieldRow>
  );
}
