import isObjEmpty from "@/utilis/isObjEmpty";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { Controller } from "react-hook-form";

type TextInputPropType = {
  name: string;
  control: any;
  rules?: any;
} & TextFieldProps;

export default function TextInput({
  name,
  control,
  rules,
  label,
  ...props
}: TextInputPropType) {
  if (isObjEmpty(control)) {
    return (
      <TextField
        variant="outlined"
        label={label}
        rows={props.multiline ? 4 : 0}
        sx={{ display: "flex" }}
        {...props}
      />
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
          <TextField
            variant="outlined"
            size="small"
            label={label}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{ inputLabel: { shrink: !!field.value } }}
            rows={props.multiline ? 4 : 0}
            sx={{ display: "flex" }}
            value={value ?? ""}
            {...restFieldOpts}
            {...props}
          />
        );
      }}
    />
  );
}
