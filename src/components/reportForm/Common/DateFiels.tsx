// // "use client";

// // import React from "react";
// // import type { Control, FieldValues, Path } from "react-hook-form";
// // import Grid from "@mui/material/Grid";
// // import DateInput from "@/components/form/DateInput";
// // import FieldRow from "@/utilis/FieldRow";

// // interface DateFieldsProps<T extends FieldValues> {
// //   control: Control<T>;
// // }

// // export default function DateFields<T extends FieldValues>({
// //   control,
// // }: DateFieldsProps<T>) {
// //   return (
// //     <Grid container spacing={2} alignItems="center">
// //       <Grid size={{ xs: 12, md: 6 }}>
// //         <FieldRow label="From Date">
// //           <DateInput
// //             name={"fromDate" as Path<T>}
// //             control={control}
// //             dateType="BS"
// //           />
// //         </FieldRow>
// //       </Grid>
// //       <Grid size={{ xs: 12, md: 6 }}>
// //         <FieldRow label="To Date">
// //           <DateInput
// //             name={"toDate" as Path<T>}
// //             control={control}
// //             dateType="BS"
// //           />
// //         </FieldRow>
// //       </Grid>
// //     </Grid>
// //   );
// // }

// "use client";

// import React from "react";
// import type { Control, FieldValues, Path } from "react-hook-form";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import DateInput from "@/components/form/DateInput";
// import FieldRow from "@/utilis/FieldRow";

// interface DateFieldsProps<T extends FieldValues> {
//   control: Control<T>;
// }

// export default function DateFields<T extends FieldValues>({
//   control,
// }: DateFieldsProps<T>) {
//   return (
//     <Grid container spacing={2} alignItems="center">
//       <Grid size={{ xs: 12, md: 6 }}>
//         <FieldRow label="From Date">
//           <Box sx={{ width: "100%" }}>
//             <DateInput
//               name={"fromDate" as Path<T>}
//               control={control}
//               dateType="BS"
//             />
//           </Box>
//         </FieldRow>
//       </Grid>
//       <Grid size={{ xs: 12, md: 6 }}>
//         <FieldRow label="To Date">
//           <Box sx={{ width: "100%" }}>
//             <DateInput
//               name={"toDate" as Path<T>}
//               control={control}
//               dateType="BS"
//             />
//           </Box>
//         </FieldRow>
//       </Grid>
//     </Grid>
//   );
// }

"use client";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DateInput from "@/components/form/DateInput";
import FieldRow from "@/utilis/FieldRow";

interface DateFieldsProps<T extends FieldValues> {
  control: Control<T>;
  fromDateName?: Path<T>;
  toDateName?: Path<T>;
  fromDateLabel?: string;
  toDateLabel?: string;
  dateType?: "AD" | "BS";
  disabled?: boolean;
}

export default function DateFields<T extends FieldValues>({
  control,
  fromDateName = "fromDate" as Path<T>,
  toDateName = "toDate" as Path<T>,
  fromDateLabel = "From Date",
  toDateLabel = "To Date",
  dateType = "BS",
  disabled = false,
}: DateFieldsProps<T>) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldRow label={fromDateLabel}>
          <Box sx={{ width: "100%" }}>
            <DateInput
              name={fromDateName}
              control={control}
              dateType={dateType}
              disabled={disabled}
            />
          </Box>
        </FieldRow>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <FieldRow label={toDateLabel}>
          <Box sx={{ width: "100%" }}>
            <DateInput
              name={toDateName}
              control={control}
              dateType={dateType}
              disabled={disabled}
            />
          </Box>
        </FieldRow>
      </Grid>
    </Grid>
  );
}
