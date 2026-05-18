// import isObjEmpty from "@/utilis/isObjEmpty";
// import TextField, { type TextFieldProps } from "@mui/material/TextField";
// import { Controller } from "react-hook-form";
// import NepaliDatePicker from "@/utilis/NepaliDatePicker";

// type TextInputPropType = {
//   name: string;
//   control?: any;
//   rules?: any;
//   label?: string;
//   error?: boolean;
//   helperText?: string;
//   /**
//    * "AD" = standard HTML date input (default)
//    * "BS" = Nepali Bikram Sambat picker
//    */
//   dateType?: "AD" | "BS";
// } & TextFieldProps;

// function DateInput({
//   name,
//   control,
//   rules,
//   label,
//   error,
//   helperText,
//   dateType = "AD",
//   ...props
// }: TextInputPropType) {
//   // ── Uncontrolled (no control passed) ──────────────────────────────────────
//   if (isObjEmpty(control)) {
//     if (dateType === "BS") {
//       return (
//         <NepaliDatePicker
//           //label={label}
//           error={error}
//           helperText={helperText}
//           onChange={() => {}}
//         />
//       );
//     }

//     return (
//       <TextField
//         variant="outlined"
//         size="small"
//         //label={label}
//         sx={{ display: "flex" }}
//         error={error}
//         helperText={helperText}
//         type="date"
//         InputLabelProps={{ shrink: true }}
//         {...props}
//       />
//     );
//   }

//   // ── Controlled via react-hook-form ─────────────────────────────────────────
//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={rules}
//       render={({ field, fieldState }) => {
//         const { value, onChange, ...restFieldOpts } = field;

//         // ── BS picker ──────────────────────────────────────────────────────
//         if (dateType === "BS") {
//           return (
//             <NepaliDatePicker
//               //label={label}
//               value={value ?? ""}
//               onChange={(bsDate: string) => onChange(bsDate)}
//               error={!!fieldState.error}
//               helperText={fieldState.error?.message}
//             />
//           );
//         }

//         // ── AD picker ──────────────────────────────────────────────────────
//         return (
//           <TextField
//             error={!!fieldState.error}
//             helperText={fieldState.error?.message}
//             type="date"
//             //label={label}
//             size="small"
//             variant="outlined"
//             InputLabelProps={{ shrink: true }}
//             sx={{ display: "flex" }}
//             value={value ?? ""}
//             onChange={onChange}
//             {...restFieldOpts}
//             {...props}
//           />
//         );
//       }}
//     />
//   );
// }

// export default DateInput;

// "use client";
// import isObjEmpty from "@/utilis/isObjEmpty";
// import TextField, { type TextFieldProps } from "@mui/material/TextField";
// import { Controller } from "react-hook-form";
// import NepaliDatePicker from "@/components/reportForm/Common/NepaliDatePicker";

// // ── Today's AD date in "yyyy-MM-dd" ──────────────────────────────────────────
// function getTodayAD(): string {
//   return new Date().toISOString().split("T")[0];
// }

// type TextInputPropType = {
//   name: string;
//   control?: any;
//   rules?: any;
//   label?: string;
//   error?: boolean;
//   helperText?: string;
//   dateType?: "AD" | "BS";
// } & TextFieldProps;

// function DateInput({
//   name,
//   control,
//   rules,
//   label,
//   error,
//   helperText,
//   dateType = "AD",
//   ...props
// }: TextInputPropType) {
//   // ── Uncontrolled ───────────────────────────────────────────────────────────
//   if (isObjEmpty(control)) {
//     if (dateType === "BS") {
//       return (
//         <NepaliDatePicker
//           defaultDate
//           error={error}
//           helperText={helperText}
//           onChange={() => {}}
//         />
//       );
//     }
//     return (
//       <TextField
//         variant="outlined"
//         size="small"
//         sx={{ display: "flex" }}
//         error={error}
//         helperText={helperText}
//         type="date"
//         InputLabelProps={{ shrink: true }}
//         defaultValue={getTodayAD()}
//         {...props}
//       />
//     );
//   }

//   // ── Controlled via react-hook-form ─────────────────────────────────────────
//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={rules}
//       shouldUnregister={false}
//       // For BS: no defaultValue here — NepaliDatePicker owns initialisation
//       // via its `defaultDate` prop and will emit the date on mount, which
//       // populates the form field automatically.
//       // For AD: seed with today so the field is never empty on first render.
//       defaultValue={dateType === "AD" ? getTodayAD() : undefined}
//       render={({ field, fieldState }) => {
//         const { value, onChange, ...restFieldOpts } = field;

//         if (dateType === "BS") {
//           return (
//             <NepaliDatePicker
//               // Pass the current form value so the picker can detect when the
//               // parent resets it to null/"" and re-emit its internal state.
//               value={value ?? ""}
//               // defaultDate lets the picker fetch and emit today's BS date on
//               // mount when value is empty (e.g. first render or after reset).
//               defaultDate
//               onChange={(bsDate: string) => onChange(bsDate)}
//               error={!!fieldState.error}
//               helperText={fieldState.error?.message}
//             />
//           );
//         }

//         return (
//           <TextField
//             error={!!fieldState.error}
//             helperText={fieldState.error?.message}
//             type="date"
//             size="small"
//             variant="outlined"
//             InputLabelProps={{ shrink: true }}
//             sx={{ display: "flex" }}
//             value={value ?? ""}
//             onChange={onChange}
//             {...restFieldOpts}
//             {...props}
//           />
//         );
//       }}
//     />
//   );
// }

// export default DateInput;

"use client";
import isObjEmpty from "@/utilis/isObjEmpty";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import NepaliDatePicker from "@/components/reportForm/Common/NepaliDatePicker";

// ── Today's AD date in "yyyy-MM-dd" ──────────────────────────────────────────
function getTodayAD(): string {
  return new Date().toISOString().split("T")[0];
}

type TextInputPropType = {
  name: string;
  control?: any;
  rules?: any;
  label?: string;
  error?: boolean;
  helperText?: string;
  dateType?: "AD" | "BS";
  /**
   * BS upper-bound for the To Date picker (yyyy-mm-dd).
   * Hides years, months AND days beyond this date in all three dropdowns.
   */
  maxDate?: string;
  /**
   * BS year upper-bound for the From Date picker.
   * Only hides years beyond this value; months/days within the year are free.
   */
  maxYear?: number;
} & TextFieldProps;

function DateInput({
  name,
  control,
  rules,
  label,
  error,
  helperText,
  dateType = "AD",
  maxDate,
  maxYear,
  ...props
}: TextInputPropType) {
  // ── Uncontrolled ───────────────────────────────────────────────────────────
  if (isObjEmpty(control)) {
    if (dateType === "BS") {
      return (
        <NepaliDatePicker
          defaultDate
          error={error}
          helperText={helperText}
          maxDate={maxDate}
          maxYear={maxYear}
          onChange={() => {}}
        />
      );
    }
    return (
      <TextField
        variant="outlined"
        size="small"
        sx={{ display: "flex" }}
        error={error}
        helperText={helperText}
        type="date"
        InputLabelProps={{ shrink: true }}
        defaultValue={getTodayAD()}
        {...props}
      />
    );
  }

  // ── Controlled via react-hook-form ─────────────────────────────────────────
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={false}
      defaultValue={dateType === "AD" ? getTodayAD() : undefined}
      render={({ field, fieldState }) => {
        const { value, onChange, ...restFieldOpts } = field;

        if (dateType === "BS") {
          return (
            <NepaliDatePicker
              value={value ?? ""}
              defaultDate
              onChange={(bsDate: string) => onChange(bsDate)}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              // ── Forwarded restriction props ───────────────────────────────
              maxDate={maxDate}
              maxYear={maxYear}
            />
          );
        }

        return (
          <TextField
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            type="date"
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ display: "flex" }}
            value={value ?? ""}
            onChange={onChange}
            {...restFieldOpts}
            {...props}
          />
        );
      }}
    />
  );
}

export default DateInput;
