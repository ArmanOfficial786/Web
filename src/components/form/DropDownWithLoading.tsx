// src/components/form/DropDownWithLoading.tsx
import isObjEmpty from "@/utilis/isObjEmpty";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";

interface DropDownWithLoadingPropType {
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
  onOpen?: (() => void | Promise<void>) | null;
  /** Shows a small spinner inside the field, right corner, left of the arrow. */
  loading?: boolean;
}

export default function DropDownWithLoading({
  name,
  control,
  rules,
  fullWidth = false,
  disabled = false,
  options,
  error,
  helperText,
  onOpen,
  loading = false,
}: DropDownWithLoadingPropType) {
  // ── Spinner sits inside the field's own box (position: relative on
  // FormControl), offset left of the native Select arrow icon (~32px),
  // vertically centered — not a sibling element below the field. ───────────
  const Spinner = loading ? (
    <Box
      sx={{
        position: "absolute",
        right: 32,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <CircularProgress size={16} thickness={5} />
    </Box>
  ) : null;

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
          position: "relative",
        }}
      >
        <Select
          variant="outlined"
          size="small"
          fullWidth={fullWidth}
          disabled={disabled}
          displayEmpty
          onOpen={onOpen ?? undefined}
        >
          {options.map((op) => (
            <MenuItem key={op.id} value={op.id}>
              {op.name}
            </MenuItem>
          ))}
        </Select>
        {Spinner}
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
              position: "relative",
            }}
          >
            <Select
              variant="outlined"
              size="small"
              fullWidth={fullWidth}
              disabled={disabled}
              value={value ?? ""}
              displayEmpty
              onOpen={onOpen ?? undefined}
              {...restFieldOpts}
            >
              {options.map((op) => (
                <MenuItem key={op.id} value={op.id}>
                  {op.name}
                </MenuItem>
              ))}
            </Select>
            {Spinner}
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
