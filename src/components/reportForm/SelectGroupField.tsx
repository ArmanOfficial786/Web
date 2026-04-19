"use client";

import React, { useEffect } from "react";
import {
  useWatch,
  type Control,
  type UseFormSetValue,
  type FieldValues,
  type Path,
} from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useReportForm } from "@/contexts/ReportFormContext";

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
  defaultGroupValue = 0,
}: SelectGroupFieldProps<T>) {
  const { memberGroupOptions, fetchMemberGroups } = useReportForm();

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
      <DropDown
        name={groupFieldName}
        control={control}
        label="Select Group"
        options={memberGroupOptions}
        fullWidth
      />
    </FieldRow>
  );
}
