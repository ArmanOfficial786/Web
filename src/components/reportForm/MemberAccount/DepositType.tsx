"use client";
import React, { useEffect } from "react";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import { Control, FieldValues, Path } from "react-hook-form";

//---------Props------------------
interface DepositTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  depositTypeFieldName: Path<T>;
}

export default function DepositType<T extends FieldValues>({
  control,
  depositTypeFieldName,
}: DepositTypeFieldProps<T>) {
  const { fetchDepositTypes, depositTypeOptions } = useReportFormContext();

  useEffect(() => {
    fetchDepositTypes();
  }, [fetchDepositTypes]);

  return (
    <FieldRow label="Deposit Type">
      <DropDown
        name={depositTypeFieldName}
        control={control}
        label="Deposit Name"
        options={depositTypeOptions}
        fullWidth
      />
    </FieldRow>
  );
}
