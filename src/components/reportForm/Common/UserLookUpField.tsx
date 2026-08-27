"use client";

import DropDownWithLoading from "@/components/form/DropDownWithLoading";
import {
  useReportFormContext,
  SelectOption,
} from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import React, { useEffect, useRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface UserLookupFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  /**
   * Unique cache key for this dropdown's data. Any two fields using the
   * same key (across any report) share one fetch and one result — the
   * second mount is served from cache, no API call.
   */
  lookupKey: string;
  /** Fetches + maps the raw API response into SelectOption[]. */
  fetcher: () => Promise<SelectOption[]>;
  fullWidth?: boolean;
  disabled?: boolean;
}

const DEFAULT_SELECT: SelectOption[] = [{ id: 0, name: "-- Select --" }];

export default function UserLookupField<T extends FieldValues>({
  control,
  name,
  label,
  lookupKey,
  fetcher,
  fullWidth = true,
  disabled = false,
}: UserLookupFieldProps<T>) {
  const { userLookupOptionsMap, userLookupLoading, fetchUserLookupOnce } =
    useReportFormContext();

  // Keep the latest fetcher in a ref so the effect doesn't need it as a dep
  // (fetcher is usually a fresh arrow fn each render) — only lookupKey drives
  // when we (re)request, and fetchUserLookupOnce itself no-ops after the
  // first call for that key.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    fetchUserLookupOnce(lookupKey, () => fetcherRef.current());
  }, [lookupKey, fetchUserLookupOnce]);

  const options = userLookupOptionsMap[lookupKey] ?? DEFAULT_SELECT;
  const loading = !!userLookupLoading[lookupKey];

  return (
    <FieldRow label={label}>
      <DropDownWithLoading
        name={name}
        control={control}
        label={label}
        options={options}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        loading={loading}
      />
    </FieldRow>
  );
}
