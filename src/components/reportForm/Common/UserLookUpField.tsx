"use client";

import DropDownWithLoading from "@/components/form/DropDownWithLoading";
import {
  SelectOption,
  useReportFormContext,
} from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import { useEffect, useRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface UserLookupFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  lookupKey: string;
  fetcher: () => Promise<SelectOption[]>;
  fullWidth?: boolean;
  disabled?: boolean;
}

const DEFAULT_SELECT: SelectOption[] = [{ id: -1, name: "-- Select --" }];

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
