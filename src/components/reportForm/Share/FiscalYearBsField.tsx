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

interface FiscalYearBsFieldProps<T extends FieldValues> {
  control: Control<T>;
  fiscalYearFieldName: Path<T>;
  setValue?: UseFormSetValue<T>;
  defaultFiscalYearId?: number;
  label?: string;
}

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
