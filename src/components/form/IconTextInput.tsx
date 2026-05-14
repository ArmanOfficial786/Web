import isObjEmpty from "@/utilis/isObjEmpty";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

type IconTextInputPropType = {
  name: string;
  control: any;
  rules?: any;
  fullWidth?: boolean;
  minWidth?: string | number;
  icon?: React.ReactNode;
  onIconClick?: () => void;
} & TextFieldProps;

export default function IconTextInput({
  name,
  control,
  rules,
  label,
  fullWidth = true,
  size = "small",
  minWidth,
  icon,
  onIconClick,
  ...props
}: IconTextInputPropType) {
  const textFieldSx = {
    display: "flex",
    minWidth: minWidth || (fullWidth ? "auto" : "283px"),
    "& .MuiInputBase-root": {
      minHeight: "40px",
    },
    "& .MuiInputBase-input": {
      padding: "8px 12px",
      minHeight: "24px",
      lineHeight: "1.5",
      fontSize: "0.875rem",
    },
    ...props.sx,
  };

  // Common props for TextField
  const commonProps = {
    variant: "outlined" as const,
    size: size,
    label: label,
    fullWidth: fullWidth,
    sx: textFieldSx,
    InputProps: icon
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={onIconClick}
                edge="end"
                size="small"
                sx={{
                  padding: "4px",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                {icon}
              </IconButton>
            </InputAdornment>
          ),
        }
      : undefined,
  };

  if (isObjEmpty(control)) {
    return (
      <TextField {...commonProps} rows={props.multiline ? 4 : 0} {...props} />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const { value, onChange, onBlur, ref, ...restFieldOpts } = field;
        return (
          <TextField
            {...commonProps}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            InputLabelProps={{ shrink: !!value }}
            rows={props.multiline ? 4 : 0}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            inputRef={ref}
            {...restFieldOpts}
            {...props}
          />
        );
      }}
    />
  );
}
