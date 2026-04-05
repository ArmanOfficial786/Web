import isObjEmpty from "@/utilis/isObjEmpty";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";

interface TextInputPropType {
  name: string;
  control: any;
  rules?: any;
  label: string;
  fullWidth?: boolean;
  disabled?: boolean;
  options: {
    id: number | string;
    name: string;
  }[];
  error?: boolean;
  helperText?: string;
}

export default function DropDown({
  name,
  control,
  rules,
  label,
  fullWidth = false,
  disabled = false,
  options,
  error,
  helperText,
}: TextInputPropType) {
  if (isObjEmpty(control)) {
    return (
      <FormControl
        error={error}
        sx={{
          "& .MuiInputLabel-root": {
            mt: "-7px",
          },
          "& .MuiInputLabel-shrink": {
            mt: "0px",
          },
          display: "flex",
          minWidth: "7rem",
        }}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          variant="outlined"
          size="small"
          input={<OutlinedInput label={label} />}
          fullWidth={fullWidth}
          disabled={disabled}
        >
          {options.map((op) => (
            <MenuItem key={op.id} value={op.id}>
              {op.name}
            </MenuItem>
          ))}
        </Select>
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
          <FormControl
            className="w-full"
            error={!!fieldState.error}
            sx={{
              "& .MuiInputLabel-root": {
                mt: "-7px",
              },
              "& .MuiInputLabel-shrink": {
                mt: "0px",
              },
              display: "flex",
            }}
          >
            <InputLabel>{label}</InputLabel>
            <Select
              variant="outlined"
              size="small"
              input={<OutlinedInput label={label} />}
              fullWidth={fullWidth}
              disabled={disabled}
              value={value ?? ""}
              {...restFieldOpts}
            >
              {options.map((op) => (
                <MenuItem key={op.id} value={op.id}>
                  {op.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
