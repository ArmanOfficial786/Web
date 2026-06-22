// "use client";

// import React from "react";
// import type { Control, FieldValues, Path } from "react-hook-form";
// import FieldRow from "@/utilis/FieldRow";
// import DropDown from "@/components/form/DropDown";
// import {
//   OrderByReportKey,
//   useReportFormContext,
// } from "@/contexts/ReportFormContext";
// import Box from "@mui/system/Box";

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface OrderByFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   reportKey: OrderByReportKey;
//   label?: string;
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function OrderByField<T extends FieldValues>({
//   control,
//   name,
//   reportKey,
//   label = "Order by",
// }: OrderByFieldProps<T>) {
//   const { fetchOrderBy, orderByMap } = useReportFormContext();

//   const options = orderByMap[reportKey] ?? [];

//   return (
//     <FieldRow label={label}>
//       <Box onMouseEnter={fetchOrderBy}>
//         <DropDown
//           name={name}
//           control={control}
//           label={label}
//           onOpen={fetchOrderBy}
//           options={options}
//           fullWidth
//         />
//       </Box>
//     </FieldRow>
//   );
// }

// @/components/form/OrderByField.tsx
// @/components/form/OrderByField.tsx

"use client";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import {
  orderByOptionsMap,
  type OrderByReportKey,
} from "@/utilis/OrderbyOptions/OrderByRegistry";

interface OrderByFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  reportKey: OrderByReportKey;
  label?: string;
}

export default function OrderByField<T extends FieldValues>({
  control,
  name,
  reportKey,
  label = "Order by",
}: OrderByFieldProps<T>) {
  const options = [
    { id: "", name: "-- Select --" },
    ...orderByOptionsMap[reportKey].map((opt:any) => ({
      id: opt.key,
      name: opt.label,
    })),
  ];

  return (
    <FieldRow label={label}>
      <DropDown
        name={name}
        control={control}
        label={label}
        options={options}
        fullWidth
      />
    </FieldRow>
  );
}
