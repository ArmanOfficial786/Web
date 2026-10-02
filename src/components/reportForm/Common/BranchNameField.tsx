





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

interface BranchNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  branchFieldName: Path<T>;
  setValue: UseFormSetValue<T>;
  defaultBranchId?: number;
}

export default function BranchNameField<T extends FieldValues>({
  control,
  branchFieldName,
  setValue,
  defaultBranchId,
}: BranchNameFieldProps<T>) {
  const { fetchBranches, branchOptions } = useReportFormContext();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    if (!branchOptions?.length) return;

    const match = branchOptions.find((b) => b.id === defaultBranchId);
    if (match) {
      setValue(branchFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [branchOptions, branchFieldName, setValue, defaultBranchId]);

  return (
    <FieldRow label="Branch Name">
      <Box>
        <DropDown
          name={branchFieldName}
          control={control}
          label="Branch Name"
          options={branchOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
