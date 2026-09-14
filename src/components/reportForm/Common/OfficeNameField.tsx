"use client";

import DropDown from "@/components/form/DropDown";
import DropDownMultiple from "@/components/form/DropDownMultiple";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/system/Box";
import { useEffect } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface OfficeNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  branchFieldName: Path<T>;
  multiple?: boolean;
}

export default function OfficeNameField<T extends FieldValues>({
  control,
  branchFieldName,
  multiple = true,
}: OfficeNameFieldProps<T>) {
  const { fetchBranches, branchOptions } = useReportFormContext();

  // Fetch branches eagerly on mount so defaultSelectAll fires as soon as options arrive
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Filter out any sentinel values (id <= 0) that may exist in initial context state
  const realBranches = branchOptions.filter((o) => Number(o.id) > 0);

  return (
    <FieldRow label="Office Name">
      <Box sx={{ width: "100%" }}>
        {multiple ? (
          <DropDownMultiple
            name={branchFieldName}
            control={control}
            label=""
            options={realBranches}
            fullWidth
            showSelectAll
            defaultSelectAll
            onOpen={fetchBranches}
          />
        ) : (
          <DropDown
            name={branchFieldName}
            control={control}
            label=""
            options={realBranches}
            fullWidth
            onOpen={fetchBranches}
          />
        )}
      </Box>
    </FieldRow>
  );
}
