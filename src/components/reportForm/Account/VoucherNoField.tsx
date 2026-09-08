"use client";

import DropDownWithLoading from "@/components/form/DropDownWithLoading";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import React, { useEffect, useMemo, useRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface VoucherNoFieldProps<T extends FieldValues> {
  control: Control<T>;
  voucherFieldName: Path<T>;
  fromDate?: string;
  toDate?: string;
  branchIds?: number[];
  label?: string;
}

// A BS date string in this app is "YYYY-MM-DD" — 10 chars. Anything shorter
// is still being assembled from the Year/Month/Day segment dropdowns and
// should never trigger a fetch. Adjust MIN_DATE_LENGTH if your date format
// differs.
const MIN_DATE_LENGTH = 8;
const isCompleteDate = (value?: string) =>
  !!value && value.length >= MIN_DATE_LENGTH;

export default function VoucherNoField<T extends FieldValues>({
  control,
  voucherFieldName,
  fromDate,
  toDate,
  branchIds,
  label = "Voucher No",
}: VoucherNoFieldProps<T>) {
  const { fetchVouchers, voucherOptions, voucherLoading } =
    useReportFormContext();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const branchesSignature = useMemo(
    () => [...(branchIds ?? [])].sort((a, b) => a - b).join(","),
    [branchIds],
  );

  const hasBranchSelected = branchesSignature.length > 0;
  const datesComplete = isCompleteDate(fromDate) && isCompleteDate(toDate);

  const mountedRef = useRef(false);
  const prevRef = useRef<{ from?: string; to?: string; branches: string }>({
    from: fromDate,
    to: toDate,
    branches: branchesSignature,
  });

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      prevRef.current = {
        from: fromDate,
        to: toDate,
        branches: branchesSignature,
      };
      return;
    }

    const changed =
      fromDate !== prevRef.current.from ||
      toDate !== prevRef.current.to ||
      branchesSignature !== prevRef.current.branches;

    prevRef.current = {
      from: fromDate,
      to: toDate,
      branches: branchesSignature,
    };

    // Bail out early on partial/incomplete dates — no fetch, no debounce
    // scheduled at all, so intermediate Y/M/D segment changes are silent.
    if (!changed || !datesComplete || !hasBranchSelected) {
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // fromDate/toDate are narrowed to defined+complete by datesComplete
      fetchVouchers(fromDate as string, toDate as string, branchIds);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchVouchers,
    fromDate,
    toDate,
    branchesSignature,
    hasBranchSelected,
    datesComplete,
  ]);

  return (
    <FieldRow label={label}>
      <DropDownWithLoading
        name={voucherFieldName}
        control={control}
        label={label}
        options={voucherOptions}
        fullWidth
        disabled={voucherLoading || !hasBranchSelected}
        loading={voucherLoading}
      />
    </FieldRow>
  );
}
