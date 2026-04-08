// "use client";

// import React from "react";
// import type {
//   Control,
//   UseFormHandleSubmit,
//   SubmitHandler,
// } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";

// import DropDown from "@/components/form/DropDown";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import type { FormInputs } from "@/components/MemberIdCard";

// // ── FieldRow (local, keeps label-left design) ─────────────────────────────────
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
// interface OrderByFieldProps {
//   control: Control<FormInputs>;
//   handleSubmit: UseFormHandleSubmit<FormInputs>;
//   onSubmit: SubmitHandler<FormInputs>;
//   loading: boolean;
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function OrderByField({
//   control,
//   handleSubmit,
//   onSubmit,
//   loading,
// }: OrderByFieldProps) {
//   const { orderByOptions } = useReportForm();

//   return (
//     <Grid container spacing={1} alignItems="center">
//       <Grid size={{ xs: 12, md: 6 }}>
//         <FieldRow label="Order by">
//           <DropDown
//             name="orderBy"
//             control={control}
//             label="Order by"
//             options={orderByOptions}
//             fullWidth
//           />
//         </FieldRow>
//       </Grid>
//       <Grid size={{ xs: 12, md: 6 }}>
//         <Button
//           variant="contained"
//           size="small"
//           disabled={loading}
//           onClick={handleSubmit(onSubmit)}
//           sx={{ whiteSpace: "nowrap", height: 36 }}
//         >
//           {loading ? "Loading..." : "View Report"}
//         </Button>
//       </Grid>
//     </Grid>
//   );
// }

"use client";

import React from "react";
import type { Control } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import DropDown from "@/components/form/DropDown";
import { useReportForm } from "@/contexts/ReportFormContext";
import type { FormInputs } from "@/components/MemberIdCard";

// ── FieldRow (local, keeps label-left design) ─────────────────────────────────
function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 40 }}>
      <Typography
        sx={{
          width: 110,
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 500,
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface OrderByFieldProps {
  control: Control<FormInputs>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function OrderByField({ control }: OrderByFieldProps) {
  const { orderByOptions } = useReportForm();

  return (
    <FieldRow label="Order by">
      <DropDown
        name="orderBy"
        control={control}
        label="Order by"
        options={orderByOptions}
        fullWidth
      />
    </FieldRow>
  );
}
