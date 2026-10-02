"use client";

import DropDownWithLoading from "@/components/form/DropDownWithLoading";
import { useRemittanceReceipts } from "@/components/hooks/useRemittanceReceipts";
import FieldRow from "@/utilis/FieldRow";
import { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormSetValue,
} from "react-hook-form";

interface RemittanceReceiptFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  fromDateFieldName: Path<T>;
  toDateFieldName: Path<T>;
  isReceived?: boolean;
  label?: string;
}

export default function RemittanceReceiptField<T extends FieldValues>({
  control,
  setValue,
  name,
  fromDateFieldName,
  toDateFieldName,
  isReceived = true,
  label = "Remittance Receipt",
}: RemittanceReceiptFieldProps<T>) {
  const fromDate = useWatch({ control, name: fromDateFieldName }) as
    | string
    | null
    | undefined;
  const toDate = useWatch({ control, name: toDateFieldName }) as
    | string
    | null
    | undefined;

  const { options, loading } = useRemittanceReceipts({
    fromDate,
    toDate,
    isReceived,
  });

  const dependencyRef = useRef<string | null>(null);
  const dependencyKey = `${fromDate ?? ""}|${toDate ?? ""}|${isReceived}`;

  useEffect(() => {
    if (dependencyRef.current === dependencyKey) return;
    dependencyRef.current = dependencyKey;
    setValue(name, null as PathValue<T, Path<T>>, {
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
        disabled={loading || !fromDate || !toDate}
        loading={loading}
      />
    </FieldRow>
  );
}
