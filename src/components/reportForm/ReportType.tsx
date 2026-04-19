// "use client";

// import React from "react";
// import type { Control } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";

// import DropDown from "@/components/form/DropDown";
// import type { FormInputs } from "@/components/reports/memberReport/MemberIdCard";

// // ── FieldRow ──────────────────────────────────────────────────────────────────
// function FieldRow({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 40 }}>
//       <Typography
//         sx={{
//           width: 110,
//           flexShrink: 0,
//           fontSize: 13,
//           fontWeight: 500,
//           color: "text.secondary",
//         }}
//       >
//         {label}
//       </Typography>
//       <Box sx={{ flex: 1 }}>{children}</Box>
//     </Box>
//   );
// }

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface ReportTypeFieldProps {
//   control: Control<FormInputs>;
// }

// // ── Static Options ────────────────────────────────────────────────────────────
// const reportTypeOptions = [
//   { id: "Summary", name: "Summary" },
//   { id: "SubLedger", name: "SubLedger" },
//   { id: "Detail", name: "Detail" },
// ];

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function ReportTypeField({ control }: ReportTypeFieldProps) {
//   return (
//     <FieldRow label="Report Type">
//       <DropDown
//         name="reportType"
//         control={control}
//         label="Report Type"
//         options={reportTypeOptions}
//         fullWidth
//       />
//     </FieldRow>
//   );
// }

"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";

// ── Props ─────────────────────────────────────────────────────────────────────
interface ReportTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

// ── Static Options (can still be reused globally) ────────────────────────────
const reportTypeOptions = [
  { id: "Summary", name: "Summary" },
  { id: "SubLedger", name: "SubLedger" },
  { id: "Detail", name: "Detail" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ReportTypeField<T extends FieldValues>({
  control,
  name,
  label = "Report Type",
}: ReportTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <DropDown
        name={name}
        control={control}
        label={label}
        options={reportTypeOptions}
        fullWidth
      />
    </FieldRow>
  );
}
