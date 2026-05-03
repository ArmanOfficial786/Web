"use client";

import React, { useEffect } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
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
  const { fetchBranches, branchOptions } = useReportFormContext();

  // ── Fetch on mount(refresh) so branches are ready immediately on page refresh ──────
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return (
    <FieldRow label="Branch Name">
      <Box>
        <DropDown
          name={branchFieldName}
          control={control}
          label="Branch Name"
          //onOpen={fetchBra nches} //fallback if hover not work
          options={branchOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
