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

interface LoanTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  loanTypeFieldName: Path<T>;
  label: string;
  setValue?: UseFormSetValue<T>;
  defaultLoanTypeId?: number;
}

export default function LoanTypeField<T extends FieldValues>({
  control,
  loanTypeFieldName,
  label,
  setValue,
  defaultLoanTypeId,
}: LoanTypeFieldProps<T>) {
  const { fetchLoanMasterList, loanMasterListOptions } = useReportFormContext();

  useEffect(() => {
    fetchLoanMasterList();
  }, [fetchLoanMasterList]);

  useEffect(() => {
    if (!setValue || defaultLoanTypeId === undefined) return;
    if (!loanMasterListOptions?.length) return;

    const match = loanMasterListOptions.find((l) => l.id === defaultLoanTypeId);
    if (match) {
      setValue(loanTypeFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [loanMasterListOptions, loanTypeFieldName, setValue, defaultLoanTypeId]);

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={loanTypeFieldName}
          control={control}
          label={label}
          options={loanMasterListOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
