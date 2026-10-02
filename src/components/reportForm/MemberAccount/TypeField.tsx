
"use client";

import React, { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from "react-hook-form";
import Box from "@mui/material/Box";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";

interface TypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  transactionTypeName: Path<T>;
  label: string;
}

export default function TypeField<T extends FieldValues>({
  control,
  setValue,
  name,
  transactionTypeName,
  label,
}: TypeFieldProps<T>) {
  const transactionType = useWatch({ control, name: transactionTypeName });
  const {
    depositTypeOptions,
    fetchDepositTypes,
    loanMasterListOptions,
    fetchLoanMasterList,
    shareTypeOptions,
    fetchShareType,
  } = useReportFormContext();

  const prevTransactionType = useRef(transactionType);

  const isSaving = transactionType === "S" || transactionType === "Saving";
  const isLoan = transactionType === "L" || transactionType === "Loan";
  const isShare = transactionType === "H" || transactionType === "Share";

  useEffect(() => {
    if (isSaving) {
      fetchDepositTypes();
    } else if (isLoan) {
      fetchLoanMasterList();
    } else if (isShare) {
      fetchShareType();
    }

    if (
      prevTransactionType.current !== transactionType &&
      prevTransactionType.current !== undefined
    ) {
      setValue(name, 0 as any, { shouldDirty: false, shouldValidate: false });
    }
    prevTransactionType.current = transactionType;
  }, [
    transactionType,
    isSaving,
    isLoan,
    isShare,
    fetchDepositTypes,
    fetchLoanMasterList,
    fetchShareType,
    setValue,
    name,
  ]);

  const options = isLoan
    ? loanMasterListOptions
    : isShare
      ? shareTypeOptions
      : depositTypeOptions;

  return (
    <FieldRow label={label}>
      <Box sx={{ width: "100%" }}>
        <DropDown
          name={name}
          control={control}
          label={label}
          options={options}
          fullWidth
          onOpen={() => {
            if (isLoan && loanMasterListOptions.length <= 1) {
              fetchLoanMasterList();
            } else if (isShare && shareTypeOptions.length <= 1) {
              fetchShareType();
            }
          }}
        />
      </Box>
    </FieldRow>
  );
}
