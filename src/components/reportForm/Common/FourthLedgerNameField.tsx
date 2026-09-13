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
import { use4thLedgerName } from "@/components/hooks/use4thLedgerName";

interface FourthLedgerNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  fromDateFieldName: Path<T>;
  toDateFieldName: Path<T>;
  ledgerHeadFieldName: Path<T>;
  branchFieldName: Path<T>;
  thirdLedgerFieldName: Path<T>;
  label?: string;
}

export default function FourthLedgerNameField<T extends FieldValues>({
  control,
  setValue,
  name,
  fromDateFieldName,
  toDateFieldName,
  ledgerHeadFieldName,
  branchFieldName,
  thirdLedgerFieldName,
  label = "4th Ledger Name",
}: FourthLedgerNameFieldProps<T>) {
  const fromDate = useWatch({ control, name: fromDateFieldName }) as
    | string
    | null
    | undefined;
  const toDate = useWatch({ control, name: toDateFieldName }) as
    | string
    | null
    | undefined;
  const branchId = useWatch({ control, name: branchFieldName }) as
    | string
    | null
    | undefined;
  const ledgerHeadId = useWatch({ control, name: ledgerHeadFieldName }) as
    | string
    | number
    | null
    | undefined;
  const parentLedger = useWatch({ control, name: thirdLedgerFieldName }) as
    | string
    | null
    | undefined;
  const { options, loading } = use4thLedgerName({
    level: 4,
    fromDate,
    toDate,
    branchId,
    ledgerHeadId,
    parentLedger,
  });
  const dependencyRef = useRef<string | null>(null);
  const dependencyKey = `${fromDate ?? ""}|${toDate ?? ""}|${branchId ?? ""}|${ledgerHeadId ?? ""}|${parentLedger ?? ""}`;

  useEffect(() => {
    if (dependencyRef.current === dependencyKey) return;
    dependencyRef.current = dependencyKey;
    setValue(name, "" as PathValue<T, Path<T>>, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [dependencyKey, name, setValue]);

  return (
    <FieldRow label={label}>
      <DropDownWithLoading
        name={name}
        control={control}
        label={label}
        options={options}
        fullWidth
        disabled={loading || !parentLedger}
        loading={loading}
      />
    </FieldRow>
  );
}
