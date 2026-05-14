"use client";
import { FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import Checkbox, { type CheckboxProps } from "@mui/material/Checkbox";
import { Controller } from "react-hook-form";

export type LabelPlacement = "end" | "start" | "top" | "bottom";

interface CheckboxInputPropType extends CheckboxProps {
  name: string;
  control: any;
  rules?: any;
  label: string;
  labelPlacement?: LabelPlacement;
}

function CheckboxInput({
  name,
  control,
  rules,
  label,
  labelPlacement,
  ...props
}: CheckboxInputPropType) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const { value, ...restFieldOpts } = field;
        return (
          <FormControl error={!!fieldState.error} sx={{ display: "flex" }}>
            {label ? (
              // If a label is provided, use FormControlLabel (with its default spacing)
              <FormControlLabel
                labelPlacement={labelPlacement}
                control={
                  <Checkbox checked={value} {...restFieldOpts} {...props} />
                }
                label={label}
              />
            ) : (
              // No label → render only the checkbox (no extra spacing)
              <Checkbox checked={value} {...restFieldOpts} {...props} />
            )}
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}

export default CheckboxInput;
