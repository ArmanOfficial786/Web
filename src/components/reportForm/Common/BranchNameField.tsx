// "use client";

// import React, { useEffect } from "react";
// import type { Control, FieldValues, Path } from "react-hook-form";
// import FieldRow from "@/utilis/FieldRow";
// import DropDown from "@/components/form/DropDown";
// import { useReportFormContext } from "@/contexts/ReportFormContext";
// import Box from "@mui/system/Box";

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface BranchNameFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   branchFieldName: Path<T>; // ✅ configurable, no hardcoded "branchName"
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function BranchNameField<T extends FieldValues>({
//   control,
//   branchFieldName,
// }: BranchNameFieldProps<T>) {
//   const { fetchBranches, branchOptions } = useReportFormContext();

//   // ── Fetch on mount(refresh) so branches are ready immediately on page refresh ──────
//   useEffect(() => {
//     fetchBranches();
//   }, [fetchBranches]);

//   return (
//     <FieldRow label="Branch Name">
//       <Box
//       //  sx={{ width: 283 }}
//       >
//         <DropDown
//           name={branchFieldName}
//           control={control}
//           label="Branch Name"
//           options={branchOptions}
//           fullWidth
//         />
//       </Box>
//     </FieldRow>
//   );
// }

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

// ── Props ─────────────────────────────────────────────────────────────────────
interface BranchNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  branchFieldName: Path<T>;
  setValue: UseFormSetValue<T>; // ← add this
  defaultBranchId?: number; // ← optional, defaults to 2
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BranchNameField<T extends FieldValues>({
  control,
  branchFieldName,
  setValue,
  defaultBranchId = 2, // ← default is 2
}: BranchNameFieldProps<T>) {
  const { fetchBranches, branchOptions } = useReportFormContext();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // ── Set default once options are available ────────────────────────────────
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
