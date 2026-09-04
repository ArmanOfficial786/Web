// "use client";

// import React from "react";
// import type {
//   Control,
//   FieldValues,
//   Path,
//   SubmitHandler,
//   UseFormHandleSubmit,
//   UseFormSetValue,
// } from "react-hook-form";
// import { useWatch } from "react-hook-form";
// import Button from "@mui/material/Button";

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface ViewReportButtonProps<T extends FieldValues> {
//   control: Control<T>;
//   handleSubmit: UseFormHandleSubmit<T>;
//   onSubmit: SubmitHandler<T>;
//   setValue: UseFormSetValue<T>;
//   loading: boolean;
//   onBeforeSubmit?: () => void;

//   // 🔥 configurable logic (instead of hardcoded memberId)
//   watchField?: Path<T>;
//   clearFields?: Path<T>[]; // fields to clear before submit
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function ViewReportButton<T extends FieldValues>({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
//   loading,
//   onBeforeSubmit,
//   watchField,
//   clearFields = [],
// }: ViewReportButtonProps<T>) {
//   const watchedValue = useWatch({
//     control,
//     name: watchField as Path<T>,
//     disabled: !watchField,
//   });

//   const handleClick = () => {
//     if (watchedValue) {
//       clearFields.forEach((field) => setValue(field, "" as any));
//     }

//     handleSubmit(
//       // ✅ onValid — validation passed, safe to scroll then submit
//       (data) => {
//         onBeforeSubmit?.();
//         onSubmit(data);
//       },
//       // ✅ onInvalid — validation failed, do nothing (no scroll)
//       () => {},
//     )();
//   };

//   return (
//     <Button
//       variant="outlined"
//       size="small"
//       disabled={loading}
//       onClick={handleClick}
//       sx={{ whiteSpace: "nowrap", height: 30 }}
//     >
//       {loading ? "Loading..." : "View Report"}
//     </Button>
//   );
// }

"use client";

import React from "react";
import type {
  Control,
  FieldValues,
  Path,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import Button from "@mui/material/Button";

interface ViewReportButtonProps<T extends FieldValues> {
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: SubmitHandler<T>;
  setValue: UseFormSetValue<T>;
  loading: boolean;
  onBeforeSubmit?: () => void;

  watchField?: Path<T>;
  clearFields?: Path<T>[];

  // ── New, optional — fully backward compatible ───────────────────────────
  label?: string; // defaults to "View Report" as before
  disabled?: boolean; // overrides `loading` for the disabled state only —
  // lets a page disable this button while a SIBLING action is in flight
  // (e.g. two view buttons sharing one form)
}

export default function ViewReportButton<T extends FieldValues>({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  loading,
  onBeforeSubmit,
  watchField,
  clearFields = [],
  label = "View Report",
  disabled,
}: ViewReportButtonProps<T>) {
  const watchedValue = useWatch({
    control,
    name: watchField as Path<T>,
    disabled: !watchField,
  });

  const handleClick = () => {
    if (watchedValue) {
      clearFields.forEach((field) => setValue(field, "" as any));
    }

    handleSubmit(
      (data) => {
        onBeforeSubmit?.();
        onSubmit(data);
      },
      () => {},
    )();
  };

  return (
    <Button
      variant="outlined"
      size="small"
      disabled={disabled ?? loading}
      onClick={handleClick}
      sx={{ whiteSpace: "nowrap", height: 30 }}
    >
      {loading ? "Loading..." : label}
    </Button>
  );
}
