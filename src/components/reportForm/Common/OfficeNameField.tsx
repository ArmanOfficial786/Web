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
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/system/Box";
import React, { useEffect } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface OfficeNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  branchFieldName: Path<T>;
}

export default function OfficeNameField<T extends FieldValues>({
  control,
  branchFieldName,
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
        <DropDownMultiple
          name={branchFieldName}
          control={control}
          label="Office Name"
          options={realBranches}
          fullWidth
          //placeholder="-- Select --"
          showSelectAll
          defaultSelectAll
          onOpen={fetchBranches}
        />
      </Box>
    </FieldRow>
  );
}
