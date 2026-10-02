















"use client";
import isObjEmpty from "@/utilis/isObjEmpty";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import type { InputHTMLAttributes } from "react";
import NepaliDatePicker from "@/components/reportForm/Common/NepaliDatePicker";

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
  maxDate?: string;
  maxYear?: number;
  InputLabelProps?: { shrink?: boolean };
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
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
  InputLabelProps: _inputLabelProps,
  inputProps: legacyInputProps,
  slotProps: providedSlotProps,
  ...props
}: TextInputPropType) {
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
        slotProps={{
          ...providedSlotProps,
          inputLabel: { ...providedSlotProps?.inputLabel, shrink: true },
          htmlInput: { ...providedSlotProps?.htmlInput, ...legacyInputProps },
        }}
        defaultValue={getTodayAD()}
        {...props}
      />
    );
  }

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
            sx={{ display: "flex" }}
            value={value ?? ""}
            onChange={onChange}
            {...restFieldOpts}
            {...props}
            slotProps={{
              ...providedSlotProps,
              inputLabel: { ...providedSlotProps?.inputLabel, shrink: true },
              htmlInput: {
                ...providedSlotProps?.htmlInput,
                ...legacyInputProps,
              },
            }}
          />
        );
      }}
    />
  );
}

export default DateInput;
