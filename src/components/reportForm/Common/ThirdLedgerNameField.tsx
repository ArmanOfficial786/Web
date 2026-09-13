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
import { use3rdLedgerName } from "@/components/hooks/use3rdLedgerName";

interface ThirdLedgerNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  fromDateFieldName: Path<T>;
  toDateFieldName: Path<T>;
  ledgerHeadFieldName: Path<T>;
  branchFieldName: Path<T>;
  secondLedgerFieldName: Path<T>;
  label?: string;
}

export default function ThirdLedgerNameField<T extends FieldValues>({
  control,
  setValue,
  name,
  fromDateFieldName,
  toDateFieldName,
  ledgerHeadFieldName,
  branchFieldName,
  secondLedgerFieldName,
  label = "3rd Ledger Name",
}: ThirdLedgerNameFieldProps<T>) {
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
  const parentLedger = useWatch({ control, name: secondLedgerFieldName }) as
    | string
    | null
    | undefined;
  const { options, loading } = use3rdLedgerName({
    level: 3,
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
