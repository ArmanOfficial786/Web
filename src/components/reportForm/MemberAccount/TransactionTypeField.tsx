// // components/reportForm/Common/TransactionTypeField.tsx
// "use client";

// import React from "react";
// import type { Control, FieldValues, Path } from "react-hook-form";
// import FieldRow from "@/utilis/FieldRow";
// import RadioInput from "@/components/form/RadioInput";

// // ── Values are single-char backend codes: "S" = Saving, "L" = Loan ──────────
// const transactionTypeOptions = [
//   { value: "S", label: "Saving" },
//   { value: "L", label: "Loan" },
// ];

// interface TransactionTypeFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label: string;
//   row?: boolean;
// }

// export default function TransactionTypeField<T extends FieldValues>({
//   control,
//   name,
//   label,
//   row = true,
// }: TransactionTypeFieldProps<T>) {
//   return (
//     <FieldRow label={label}>
//       <RadioInput
//         name={name}
//         control={control}
//         radioOptions={transactionTypeOptions}
//         row={row}
//       />
//     </FieldRow>
//   );
// }

// components/reportForm/Common/TransactionTypeField.tsx
"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";

// ── Values are single-char backend codes: "S" = Saving, "L" = Loan, "H" = Share ──
// ⚠️ "H" for Share is a guess — confirm against the backend's actual code.
const baseOptions = [
  { value: "S", label: "Saving" },
  { value: "L", label: "Loan" },
];

const shareOption = { value: "H", label: "Share" };

interface TransactionTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  row?: boolean;
  // ── Some reports need Saving/Loan only, others need all three ──────────────
  showShareType?: boolean;
}

export default function TransactionTypeField<T extends FieldValues>({
  control,
  name,
  label,
  row = true,
  showShareType = false,
}: TransactionTypeFieldProps<T>) {
  const radioOptions = showShareType
    ? [...baseOptions, shareOption]
    : baseOptions;

  return (
    <FieldRow label={label}>
      <RadioInput
        name={name}
        control={control}
        radioOptions={radioOptions}
        row={row}
      />
    </FieldRow>
  );
}
