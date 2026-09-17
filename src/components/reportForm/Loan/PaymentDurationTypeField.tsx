"use client";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/system/Box";
import { useEffect } from "react";
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";

// ── Props ─────────────────────────────────────────────────────────────────────
interface PaymentDurationTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  paymentDurationTypeFieldName: Path<T>;
  setValue?: UseFormSetValue<T>; // optional — only needed for a default selection
  defaultPaymentDurationTypeId?: number; // optional, no forced default here
  label?: string; // configurable, defaults to "Payment Duration Type"
}

export default function PaymentDurationTypeField<T extends FieldValues>({
  control,
  paymentDurationTypeFieldName,
  setValue,
  defaultPaymentDurationTypeId,
  label = "Payment Duration Type",
}: PaymentDurationTypeFieldProps<T>) {
  const { fetchPaymentDurationTypes, paymentDurationTypeOptions } =
    useReportFormContext();

  useEffect(() => {
    fetchPaymentDurationTypes();
  }, [fetchPaymentDurationTypes]);

  // ── Set default once options are available (only if requested) ────────────
  useEffect(() => {
    if (!setValue || defaultPaymentDurationTypeId === undefined) return;
    if (!paymentDurationTypeOptions?.length) return;

    const match = paymentDurationTypeOptions.find(
      (p) => p.id === defaultPaymentDurationTypeId,
    );
    if (match) {
      setValue(
        paymentDurationTypeFieldName,
        match.id as PathValue<T, Path<T>>,
        {
          shouldDirty: false,
          shouldValidate: false,
        },
      );
    }
  }, [
    paymentDurationTypeOptions,
    paymentDurationTypeFieldName,
    setValue,
    defaultPaymentDurationTypeId,
  ]);

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={paymentDurationTypeFieldName}
          control={control}
          label={label}
          options={paymentDurationTypeOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
