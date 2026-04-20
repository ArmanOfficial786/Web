"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useReportForm } from "@/contexts/ReportFormContext";
import Box from "@mui/system/Box";

// ── Props ─────────────────────────────────────────────────────────────────────
interface BranchNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  branchFieldName: Path<T>; // ✅ configurable, no hardcoded "branchName"
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BranchNameField<T extends FieldValues>({
  control,
  branchFieldName,
}: BranchNameFieldProps<T>) {
  const { fetchBranches, branchOptions } = useReportForm();

  return (
    <FieldRow label="Branch Name">
      <Box onMouseEnter={fetchBranches}>
        <DropDown
          name={branchFieldName}
          control={control}
          label="Branch Name"
          onOpen={fetchBranches} //fallback if hover not work
          options={branchOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
