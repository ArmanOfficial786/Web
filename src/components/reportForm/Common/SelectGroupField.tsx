"use client";

import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from "react-hook-form";

// ── Props ─────────────────────────────────────────────────────────────────────
interface SelectGroupFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;

  branchFieldName: Path<T>;
  collectionCenterFieldName: Path<T>;
  groupFieldName: Path<T>;

  defaultGroupValue?: any; // optional safer reset value
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SelectGroupField<T extends FieldValues>({
  control,
  setValue,
  branchFieldName,
  collectionCenterFieldName,
  groupFieldName,
  defaultGroupValue = -1,
}: SelectGroupFieldProps<T>) {
  const { memberGroupOptions, fetchMemberGroups } = useReportFormContext();

  const selectedBranchId = useWatch({
    control,
    name: branchFieldName,
  });

  const selectedCollectionCenterId = useWatch({
    control,
    name: collectionCenterFieldName,
  });

  useEffect(() => {
    const branchId = Number(selectedBranchId);
    const collectionCenterId = Number(selectedCollectionCenterId);

    // reset dependent field
    setValue(groupFieldName, defaultGroupValue);

    // fetch new options
    fetchMemberGroups(branchId, collectionCenterId);
  }, [
    selectedBranchId,
    selectedCollectionCenterId,
    fetchMemberGroups,
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
          options={memberGroupOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
