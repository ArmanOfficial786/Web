









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
import { useSubLedgerNameOptions } from "@/components/hooks/useSubLedgerNameOptions";

interface SubLedgerNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  fromDateFieldName: Path<T>;
  toDateFieldName: Path<T>;
  ledgerHeadFieldName: Path<T>;
  branchFieldName: Path<T>;
  mainLedgerFieldName: Path<T>;
  label?: string;
}

export default function SubLedgerNameField<T extends FieldValues>({
  control,
  setValue,
  name,
  fromDateFieldName,
  toDateFieldName,
  ledgerHeadFieldName,
  branchFieldName,
  mainLedgerFieldName,
  label = "Sub Ledger Name",
}: SubLedgerNameFieldProps<T>) {
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
  const mainLedger = useWatch({ control, name: mainLedgerFieldName }) as
    | string
    | null
    | undefined;

  const { options, loading } = useSubLedgerNameOptions({
    fromDate,
    toDate,
    branchId,
    ledgerHeadId,
    mainLedger,
  });

  const depKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const depKey = `${fromDate ?? ""}|${toDate ?? ""}|${branchId ?? ""}|${ledgerHeadId ?? ""}|${mainLedger ?? ""}`;
    if (depKeyRef.current === depKey) return;
    depKeyRef.current = depKey;

    setValue(name, "" as PathValue<T, Path<T>>, {
      shouldDirty: false,
      shouldValidate: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, branchId, ledgerHeadId, mainLedger]);

  return (
    <FieldRow label={label}>
      <DropDownWithLoading
        name={name}
        control={control}
        label={label}
        options={options}
        fullWidth
        disabled={loading || !mainLedger}
        loading={loading}
      />
    </FieldRow>
  );
}
