"use client";
import React, { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type UseFormSetValue,
  type FieldValues,
  type Path,
} from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import Box from "@mui/system/Box";

// ── Props ─────────────────────────────────────────────────────────────────────
interface SoleSelectGroupFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  branchFieldName: Path<T>;
  groupFieldName: Path<T>;
  defaultGroupValue?: any; // optional safer reset value
}

// ── Component ─────────────────────────────────────────────────────────────────
// Reusable, branch-only group selector — calls the dedicated
// /api/SoleMemberGroup endpoint via fetchSoleMemberGroups. Use this whenever
// a report has NO Collection Center field (unlike SelectGroupField, which
// requires branch + collection center).
// Fetches on mount AND whenever the selected branch changes.
export default function SoleSelectGroupField<T extends FieldValues>({
  control,
  setValue,
  branchFieldName,
  groupFieldName,
  defaultGroupValue = 0,
}: SoleSelectGroupFieldProps<T>) {
  const { soleMemberGroupOptions, fetchSoleMemberGroups } =
    useReportFormContext();

  const selectedBranchId = useWatch({
    control,
    name: branchFieldName,
  });

  const isFirstRun = useRef(true);

  useEffect(() => {
    const branchId = Number(selectedBranchId);

    // ✅ Always fetch on mount/reload — even before user touches branch field
    if (isFirstRun.current) {
      isFirstRun.current = false;
      fetchSoleMemberGroups(branchId);
      return;
    }

    // On subsequent branch changes: reset dependent field, then refetch
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
