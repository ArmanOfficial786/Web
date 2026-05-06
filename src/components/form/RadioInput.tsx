import isObjEmpty from "@/utilis/isObjEmpty";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Controller } from "react-hook-form";
import type { SxProps, Theme } from "@mui/material/styles";
interface RadioInputPropType {
  control: any;
  rules?: any;
  name: string;
  radioOptions: {
    value: string | number;
    label: string;
  }[];
  row?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
}

function RadioInput({
  control,
  rules,
  name,
  radioOptions,
  row = true,
  disabled = false,
  error,
  helperText,
  sx,
}: RadioInputPropType) {
  const radioGroupSx = {
    ...sx,
  };
  if (isObjEmpty(control)) {
    return (
      <FormControl error={error} sx={{ display: "flex", ...sx }}>
        <RadioGroup row={row}>
          {radioOptions.map((opt, idx) => (
            <FormControlLabel
              key={idx}
              value={opt.value}
              control={<Radio disabled={disabled} />}
              label={opt.label}
            />
          ))}
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const { value, ...restFieldOpts } = field;
        return (
          <FormControl error={!!fieldState.error} sx={{ display: "flex" }}>
            <RadioGroup
              row={row}
              value={value ?? ""}
              {...restFieldOpts}
              sx={radioGroupSx}
            >
              {radioOptions.map((opt, idx) => (
                <FormControlLabel
                  key={idx}
                  value={opt.value}
                  control={<Radio disabled={disabled} />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}

export default RadioInput;
