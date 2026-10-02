











//     // eslint-disable-next-line react-hooks/exhaustive-deps


"use client";

import React, { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormSetValue,
} from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDownWithLoading from "@/components/form/DropDownWithLoading";
import { useLedgerNameOptions } from "@/components/hooks/useLedgerNameOptions";

interface LedgerNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  fromDateFieldName: Path<T>;
  toDateFieldName: Path<T>;
  ledgerHeadFieldName: Path<T>;
  branchFieldName: Path<T>;
  label?: string;
}

export default function LedgerNameField<T extends FieldValues>({
  control,
  setValue,
  name,
  fromDateFieldName,
  toDateFieldName,
  ledgerHeadFieldName,
  branchFieldName,
  label = "Ledger Name",
}: LedgerNameFieldProps<T>) {
  const fromDate = useWatch({ control, name: fromDateFieldName }) as
    | string
    | null
    | undefined;
  const toDate = useWatch({ control, name: toDateFieldName }) as
    | string
    | null
    | undefined;
  const ledgerHeadId = useWatch({ control, name: ledgerHeadFieldName }) as
    | string
    | number
    | null
    | undefined;
  const branchId = useWatch({ control, name: branchFieldName }) as
    | string
    | null
    | undefined;

  const { options, loading } = useLedgerNameOptions({
    fromDate,
    toDate,
    branchId,
    ledgerHeadId,
  });

  const depKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const depKey = `${fromDate ?? ""}|${toDate ?? ""}|${branchId ?? ""}|${ledgerHeadId ?? ""}`;
    if (depKeyRef.current === depKey) return;
    depKeyRef.current = depKey;

    setValue(name, "" as PathValue<T, Path<T>>, {
      shouldDirty: false,
      shouldValidate: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, branchId, ledgerHeadId]);

  return (
    <FieldRow label={label}>
      <DropDownWithLoading
        name={name}
        control={control}
        label={label}
        options={options}
        fullWidth
        disabled={loading}
        loading={loading}
      />
    </FieldRow>
  );
}
