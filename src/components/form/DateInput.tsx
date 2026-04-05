import isObjEmpty from "@/utilis/isObjEmpty";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import NepaliDatePicker from "@/utilis/NepaliDatePicker";

type TextInputPropType = {
  name: string;
  control?: any;
  rules?: any;
  label?: string;
  error?: boolean;
  helperText?: string;
  /**
   * "AD" = standard HTML date input (default)
   * "BS" = Nepali Bikram Sambat picker
   */
  dateType?: "AD" | "BS";
} & TextFieldProps;

function DateInput({
  name,
  control,
  rules,
  label,
  error,
  helperText,
  dateType = "AD",
  ...props
}: TextInputPropType) {
  // ── Uncontrolled (no control passed) ──────────────────────────────────────
  if (isObjEmpty(control)) {
    if (dateType === "BS") {
      return (
        <NepaliDatePicker
          label={label}
          error={error}
          helperText={helperText}
          onChange={() => {}}
        />
      );
    }

    return (
      <TextField
        variant="outlined"
        size="small"
        label={label}
        sx={{ display: "flex" }}
        error={error}
        helperText={helperText}
        type="date"
        InputLabelProps={{ shrink: true }}
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
      render={({ field, fieldState }) => {
        const { value, onChange, ...restFieldOpts } = field;

        // ── BS picker ──────────────────────────────────────────────────────
        if (dateType === "BS") {
          return (
            <NepaliDatePicker
              label={label}
              value={value ?? ""}
              onChange={(bsDate: string) => onChange(bsDate)}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          );
        }

        // ── AD picker ──────────────────────────────────────────────────────
        return (
          <TextField
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            type="date"
            label={label}
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
