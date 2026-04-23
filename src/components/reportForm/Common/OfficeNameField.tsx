// "use client";
// import DropDownMultiple from "@/components/form/DropDownMultiple";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import FieldRow from "@/utilis/FieldRow";
// import Box from "@mui/system/Box";
// import React from "react";
// import { Control, FieldValues, Path } from "react-hook-form";

// interface OfficeNameFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   branchFieldName: Path<T>;
// }

// export default function OfficeNameField<T extends FieldValues>({
//   control,
//   branchFieldName,
// }: OfficeNameFieldProps<T>) {
//   // Fix #1: T forwarded to OfficeNameFieldProps<T>
//   const { fetchBranches, branchOptions } = useReportForm();

//   return (
//     <FieldRow label="Office Name">
//       <Box onMouseEnter={fetchBranches}>
//         <DropDownMultiple
//           name={branchFieldName}
//           control={control}
//           label="Office Name"
//           onOpen={fetchBranches}
//           options={branchOptions}
//           fullWidth
//         />
//       </Box>
//     </FieldRow>
//   );
// }




"use client";
import DropDownMultiple from "@/components/form/DropDownMultiple";
import { useReportForm } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/system/Box";
import React, { useEffect } from "react";
import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

interface OfficeNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  branchFieldName: Path<T>;
  // Optional: caller can tighten/relax validation rules.
  // Defaults to { required: "Branch is required" }.
  rules?: RegisterOptions;
}

export default function OfficeNameField<T extends FieldValues>({
  control,
  branchFieldName,
  rules,
}: OfficeNameFieldProps<T>) {
  const { fetchBranches, branchOptions } = useReportForm();

  // Fetch branches eagerly on mount so defaultSelectAll fires as soon as options arrive
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Filter out any sentinel values (id <= 0) that may exist in initial context state
  const realBranches = branchOptions.filter((o) => Number(o.id) > 0);

  // ── Inline validation rules ──────────────────────────────────────────────
  // These run on the react-hook-form layer (before yup).
  // The yup schema in the page is the authoritative guard; these rules give
  // instant field-level feedback without waiting for form submission.
  const fieldRules: RegisterOptions = rules ?? {
    validate: (val: unknown) => {
      // val is always the raw form-state value (array of IDs from DropDownMultiple)
      if (!Array.isArray(val) || val.length === 0) {
        return "Branch is required";
      }
      return true;
    },
  };

  return (
    <FieldRow label="Office Name">
      <Box sx={{ width: "100%" }}>
        <DropDownMultiple
          name={branchFieldName}
          control={control}
          rules={fieldRules} 
          label="Office Name"
          options={realBranches}
          fullWidth
          showSelectAll
          defaultSelectAll
          onOpen={fetchBranches}
        />
      </Box>
    </FieldRow>
  );
}
