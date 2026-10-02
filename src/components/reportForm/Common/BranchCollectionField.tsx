"use client";
import React, { useEffect } from "react";
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import Box from "@mui/system/Box";

interface BranchCollectionFieldProps<T extends FieldValues> {
  control: Control<T>;
  branchFieldName: Path<T>;
  label: string;
  setValue?: UseFormSetValue<T>;
  defaultBranchId?: number;
}

export default function BranchCollectionField<T extends FieldValues>({
  control,
  branchFieldName,
  label,
  setValue,
  defaultBranchId,
}: BranchCollectionFieldProps<T>) {
  const { fetchCollectionBranches, collectionBranchOptions } =
    useReportFormContext();

  useEffect(() => {
    fetchCollectionBranches();
  }, [fetchCollectionBranches]);

  useEffect(() => {
    if (!setValue || defaultBranchId === undefined) return;
    if (!collectionBranchOptions?.length) return;

    const match = collectionBranchOptions.find((b) => b.id === defaultBranchId);
    if (match) {
      setValue(branchFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [collectionBranchOptions, branchFieldName, setValue, defaultBranchId]);

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={branchFieldName}
          control={control}
          label={label}
          options={collectionBranchOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
