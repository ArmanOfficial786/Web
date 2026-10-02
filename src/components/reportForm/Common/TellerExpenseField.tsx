












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
