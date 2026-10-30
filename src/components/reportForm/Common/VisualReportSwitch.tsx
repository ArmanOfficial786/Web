// "use client";

// import React from "react";
// import { Controller, Control, FieldValues, Path } from "react-hook-form";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Switch from "@mui/material/Switch";

// interface VisualReportSwitchProps<TFieldValues extends FieldValues> {
//   control: Control<TFieldValues>;
//   name: Path<TFieldValues>;
// }

// export function VisualReportSwitch<TFieldValues extends FieldValues>({
//   control,
//   name,
// }: VisualReportSwitchProps<TFieldValues>) {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field: { value, onChange } }) => (
//         <FormControlLabel
//           control={
//             <Switch
//               checked={value ?? false}
//               onChange={(e) => onChange(e.target.checked)}
//               sx={{ ml: 8.5 }}
//             />
//           }
//           label={value ? "Visual Report" : "Normal Report"}
//           labelPlacement="end"
//         />
//       )}
//     />
//   );
// }

"use client";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface VisualReportSwitchProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  /** Called with the new value after the user flips the switch (e.g. to re-generate the report). */
  onToggle?: (checked: boolean) => void;
  /** Lock the switch, e.g. while a report is loading. */
  disabled?: boolean;
}

export function VisualReportSwitch<TFieldValues extends FieldValues>({
  control,
  name,
  onToggle,
  disabled,
}: VisualReportSwitchProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <FormControlLabel
          control={
            <Switch
              checked={value ?? false}
              disabled={disabled}
              onChange={(e) => {
                onChange(e.target.checked); // updates the form value
                onToggle?.(e.target.checked); // then tells the parent
              }}
              sx={{ ml: 8.5 }}
            />
          }
          label={value ? "Visual Report" : "Normal Report"}
          labelPlacement="end"
        />
      )}
    />
  );
}
