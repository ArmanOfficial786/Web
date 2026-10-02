"use client";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/system/Box";
import { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from "react-hook-form";

interface SoleSelectGroupFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  branchFieldName: Path<T>;
  groupFieldName: Path<T>;
  defaultGroupValue?: any;
}

export default function SoleSelectGroupField<T extends FieldValues>({
  control,
  setValue,
  branchFieldName,
  groupFieldName,
  defaultGroupValue = -1,
}: SoleSelectGroupFieldProps<T>) {
  const { soleMemberGroupOptions, fetchSoleMemberGroups } =
    useReportFormContext();

  const selectedBranchId = useWatch({
    control,
    name: branchFieldName,
  });

  const isFirstRun = useRef(true);

  useEffect(() => {
    const branchId = Number(
      Array.isArray(selectedBranchId) ? selectedBranchId[0] : selectedBranchId,
    );

    if (isFirstRun.current) {
      isFirstRun.current = false;
      fetchSoleMemberGroups(branchId);
      return;
    }

    setValue(groupFieldName, defaultGroupValue);
    fetchSoleMemberGroups(branchId);
  }, [
    selectedBranchId,
    fetchSoleMemberGroups,
    setValue,
    groupFieldName,
    defaultGroupValue,
  ]);

  return (
    <FieldRow label="Select Group">
      <Box>
        <DropDown
          name={groupFieldName}
          control={control}
          label="Select Group"
          options={soleMemberGroupOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
