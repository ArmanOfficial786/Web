










//   }, [allIds.length]); // eslint-disable-line react-hooks/exhaustive-deps
















"use client";

import isObjEmpty from "@/utilis/isObjEmpty";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { useEffect, useRef, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

const ALL_SENTINEL = "__ALL__";

const MENU_ITEM_SX = {
  py: 0.25,
  minHeight: "unset",
  "&.Mui-selected": {
    backgroundColor: "transparent",
    fontWeight: "normal",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "action.hover",
  },
};

const SELECT_SX = {
  "& .MuiSelect-select": {
    whiteSpace: "nowrap",
    overflowX: "auto !important",
    overflowY: "hidden !important",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
};

interface DropDownMultipleProps<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T>;
  rules?: any;
  label: string;
  fullWidth?: boolean;
  options: { id: number | string; name: string }[];
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  onOpen?: () => void;
  placeholder?: string;
  showSelectAll?: boolean;
  defaultSelectAll?: boolean;
  defaultSelectFirst?: boolean;
}

function buildDisplayValue(
  selected: unknown,
  options: { id: number | string; name: string }[],
  allIds: (number | string)[],
  showSelectAll: boolean,
  placeholder: string | undefined,
  label: string,
): React.ReactNode {
  const ids = Array.isArray(selected) ? (selected as (string | number)[]) : [];

  if (ids.length === 0) {
    return (
      <em style={{ color: "rgba(0,0,0,0.38)", fontStyle: "normal" }}>
        {placeholder ?? label}
      </em>
    );
  }

  const MAX_DISPLAY = 4;
  const selectedNames = options
    .filter((o) => ids.includes(o.id))
    .map((o) => o.name);

  if (showSelectAll && allIds.length > 0 && ids.length === allIds.length) {
    const visibleNames = selectedNames.slice(0, MAX_DISPLAY - 1);
    const suffix = selectedNames.length > MAX_DISPLAY - 1 ? " ••••" : "";
    return `All; ${visibleNames.join("; ")}${suffix}`;
  }

  const suffix = selectedNames.length > MAX_DISPLAY ? " ••••" : "";
  return `${selectedNames.slice(0, MAX_DISPLAY).join("; ")}${suffix}`;
}

interface InnerProps {
  field: {
    value: any;
    onChange: (val: any) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
  fieldState: { error?: { message?: string } };
  options: { id: number | string; name: string }[];
  label: string;
  fullWidth: boolean;
  disabled: boolean;
  onOpen?: () => void;
  placeholder?: string;
  showSelectAll: boolean;
  defaultSelectAll: boolean;
  defaultSelectFirst: boolean;
}

function ControlledInner({
  field,
  fieldState,
  options,
  label,
  fullWidth,
  disabled,
  onOpen,
  placeholder,
  showSelectAll,
  defaultSelectAll,
  defaultSelectFirst,
}: InnerProps) {
  const { value, onChange, ...restField } = field;

  const currentValue: (string | number)[] = Array.isArray(value) ? value : [];
  const allIds = options.map((o) => o.id);
  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => currentValue.includes(id));
  const isIndeterminate = !isAllSelected && currentValue.length > 0;

  const defaultSetRef = useRef(false);
  useEffect(() => {
    if (defaultSetRef.current || allIds.length === 0) return;
    defaultSetRef.current = true;
    if (defaultSelectFirst) {
      onChange([allIds[0]]);
    } else if (defaultSelectAll) {
      onChange(allIds);
    }
  }, [allIds.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: { target: { value: unknown } }) => {
    const val = e.target.value as (string | number)[];

    if (Array.isArray(val) && val.includes(ALL_SENTINEL)) {
      onChange(currentValue.length > 0 ? [] : allIds);
      return;
    }

    onChange(Array.isArray(val) ? val : []);
  };

  return (
    <FormControl
      className="w-full"
      error={!!fieldState.error}
      sx={{
        "& .MuiInputLabel-root": { mt: "-7px" },
        "& .MuiInputLabel-shrink": { mt: "0px" },
        display: "flex",
      }}
    >
      <InputLabel shrink={currentValue.length > 0 || undefined}>
        {label}
      </InputLabel>

      <Select
        variant="outlined"
        size="small"
        multiple
        displayEmpty
        onOpen={onOpen}
        value={currentValue}
        onChange={handleChange}
        renderValue={(selected) =>
          buildDisplayValue(
            selected,
            options,
            allIds,
            showSelectAll,
            placeholder,
            label,
          )
        }
        input={<OutlinedInput label={label} />}
        fullWidth={fullWidth}
        disabled={disabled}
        sx={SELECT_SX}
        {...restField}
      >
        {/* ── Select All row ─────────────────────────────────────────────── */}
        {showSelectAll && (
          <MenuItem value={ALL_SENTINEL} dense sx={MENU_ITEM_SX}>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              size="small"
            />
            <ListItemText primary="All" />
          </MenuItem>
        )}

        {/* ── Individual options ─────────────────────────────────────────── */}
        {options.map((op) => (
          <MenuItem key={op.id} value={op.id as any} dense sx={MENU_ITEM_SX}>
            <Checkbox checked={currentValue.includes(op.id)} size="small" />
            <ListItemText primary={op.name} />
          </MenuItem>
        ))}
      </Select>

      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}

export default function DropDownMultiple<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  fullWidth = false,
  options,
  disabled = false,
  error,
  helperText,
  onOpen,
  placeholder,
  showSelectAll = false,
  defaultSelectAll = false,
  defaultSelectFirst = false,
}: DropDownMultipleProps<T>) {
  const [selected, setSelected] = useState<(string | number)[]>([]);

  if (!control || isObjEmpty(control)) {
    const allIds = options.map((o) => o.id);
    const isAllSelected =
      allIds.length > 0 && allIds.every((id) => selected.includes(id));
    const isIndeterminate = !isAllSelected && selected.length > 0;

    const handleChange = (e: { target: { value: unknown } }) => {
      const val = e.target.value as (string | number)[];

      if (Array.isArray(val) && val.includes(ALL_SENTINEL)) {
        setSelected(selected.length > 0 ? [] : allIds);
        return;
      }

      setSelected(Array.isArray(val) ? val : []);
    };

    return (
      <FormControl
        className="w-full"
        error={error}
        sx={{
          "& .MuiInputLabel-root": { mt: "-7px" },
          "& .MuiInputLabel-shrink": { mt: "0px" },
          display: "flex",
          minWidth: "7rem",
        }}
      >
        <InputLabel>{label}</InputLabel>

        <Select
          variant="outlined"
          size="small"
          multiple
          displayEmpty
          value={selected}
          onOpen={onOpen}
          onChange={handleChange}
          renderValue={(sel) =>
            buildDisplayValue(
              sel,
              options,
              allIds,
              showSelectAll,
              placeholder,
              label,
            )
          }
          input={<OutlinedInput label={label} />}
          fullWidth={fullWidth}
          disabled={disabled}
          sx={SELECT_SX}
        >
          {showSelectAll && (
            <MenuItem value={ALL_SENTINEL} dense sx={MENU_ITEM_SX}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                size="small"
              />
              <ListItemText primary="All" />
            </MenuItem>
          )}

          {options.map((op) => (
            <MenuItem key={op.id} value={op.id as any} dense sx={MENU_ITEM_SX}>
              <Checkbox checked={selected.includes(op.id)} size="small" />
              <ListItemText primary={op.name} />
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
      render={({ field, fieldState }) => (
        <ControlledInner
          field={field}
          fieldState={fieldState}
          options={options}
          label={label}
          fullWidth={fullWidth}
          disabled={disabled}
          onOpen={onOpen}
          placeholder={placeholder}
          showSelectAll={showSelectAll}
          defaultSelectAll={defaultSelectAll}
          defaultSelectFirst={defaultSelectFirst}
        />
      )}
    />
  );
}
