// "use client";

// import React from "react";
// import type { Control, FieldValues, Path } from "react-hook-form";
// import FieldRow from "@/utilis/FieldRow";
// import DropDown from "@/components/form/DropDown";

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface ReportTypeFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label?: string;
// }

// // ── Static Options (can still be reused globally) ────────────────────────────
// const reportTypeOptions = [
//   { id: "Summary", name: "Summary" },
//   { id: "SubLedger", name: "SubLedger" },
//   { id: "Detail", name: "Detail" },
// ];

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function ReportTypeField<T extends FieldValues>({
//   control,
//   name,
//   label = "Report Type",
// }: ReportTypeFieldProps<T>) {
//   return (
//     <FieldRow label={label}>
//       <DropDown
//         name={name}
//         control={control}
//         label={label}
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
import RadioInput from "@/components/form/RadioInput";

// ── Static Options ────────────────────────────────────────────────────────────
const reportTypeOptions = [
  { value: "Summary", label: "Summary" },
  { value: "SubLedger", label: "SubLedger" },
  { value: "Detail", label: "Detail" },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface ReportTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  row?: boolean;
  disabled?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ReportTypeField<T extends FieldValues>({
  control,
  name,
  label,
  row = true,
  disabled = false,
}: ReportTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <RadioInput
        name={name}
        control={control}
        radioOptions={reportTypeOptions}
        row={row}
        disabled={disabled}
      />
    </FieldRow>
  );
}
