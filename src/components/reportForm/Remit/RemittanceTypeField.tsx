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

interface RemittanceTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  remittanceTypeFieldName: Path<T>;
  setValue?: UseFormSetValue<T>;
  defaultRemittanceTypeId?: number;
  label?: string;
}

export default function RemittanceTypeField<T extends FieldValues>({
  control,
  remittanceTypeFieldName,
  setValue,
  defaultRemittanceTypeId,
  label = "Remittance Type",
}: RemittanceTypeFieldProps<T>) {
  const { fetchRemittanceTypes, remittanceTypeOptions } =
    useReportFormContext();

  useEffect(() => {
    fetchRemittanceTypes();
  }, [fetchRemittanceTypes]);

  useEffect(() => {
    if (!setValue || defaultRemittanceTypeId === undefined) return;
    if (!remittanceTypeOptions?.length) return;

    const match = remittanceTypeOptions.find(
      (r) => r.id === defaultRemittanceTypeId,
    );
    if (match) {
      setValue(remittanceTypeFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [
    remittanceTypeOptions,
    remittanceTypeFieldName,
    setValue,
    defaultRemittanceTypeId,
  ]);

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={remittanceTypeFieldName}
          control={control}
          label={label}
          options={remittanceTypeOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
