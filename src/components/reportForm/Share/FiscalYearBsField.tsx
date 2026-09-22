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
interface FiscalYearBsFieldProps<T extends FieldValues> {
  control: Control<T>;
  fiscalYearFieldName: Path<T>;
  setValue?: UseFormSetValue<T>; // optional — only needed for a default selection
  defaultFiscalYearId?: number; // optional, no default here
  label?: string; // configurable, defaults to "Fiscal Year (BS)"
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FiscalYearBsField<T extends FieldValues>({
  control,
  fiscalYearFieldName,
  setValue,
  defaultFiscalYearId,
  label = "Fiscal Year (BS)",
}: FiscalYearBsFieldProps<T>) {
  const { fetchFiscalYearBs, fiscalYearBsOptions } = useReportFormContext();

  useEffect(() => {
    fetchFiscalYearBs();
  }, [fetchFiscalYearBs]);

  // ── Set default once options are available (only if requested) ────────────
  useEffect(() => {
    if (!setValue || defaultFiscalYearId === undefined) return;
    if (!fiscalYearBsOptions?.length) return;

    const match = fiscalYearBsOptions.find((f) => f.id === defaultFiscalYearId);
    if (match) {
      setValue(fiscalYearFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [fiscalYearBsOptions, fiscalYearFieldName, setValue, defaultFiscalYearId]);

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={fiscalYearFieldName}
          control={control}
          label={label}
          options={fiscalYearBsOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
