"use client";

import { Controller } from "react-hook-form";
import { FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import type { CheckboxProps } from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CheckboxOption {
  key: string;
  label: string;
}

export type LabelPlacement = "end" | "start" | "top" | "bottom";

interface MultiCheckboxInputProps extends Omit<
  CheckboxProps,
  "name" | "checked" | "onChange"
> {
  /** Field name in the form — value must be string[] */
  name: string;
  /** react-hook-form control (any, same as CheckboxInput) */
  control: any;
  /** Validation rules */
  rules?: any;
  /** Options list: { key, label } */
  options: readonly CheckboxOption[];
  /** Optional heading above the Select-All row */
  groupLabel?: string;
  /**
   * Responsive column counts.
   * Defaults: xs=2  sm=3  md=4  lg=6
   */
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

function MultiCheckboxInput({
  name,
  control,
  rules,
  options,
  groupLabel,
  columns = { xs: 2, sm: 3, md: 4, lg: 6 },
  size = "small",
  ...checkboxProps // remaining CheckboxProps forwarded to every Checkbox
}: MultiCheckboxInputProps) {
  const gridTemplateColumns = {
    xs: `repeat(${columns.xs ?? 2}, 1fr)`,
    sm: `repeat(${columns.sm ?? 3}, 1fr)`,
    md: `repeat(${columns.md ?? 4}, 1fr)`,
    lg: `repeat(${columns.lg ?? 6}, 1fr)`,
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        // Safely coerce — matches how CheckboxInput reads field.value
        const selected: string[] = Array.isArray(field.value)
          ? (field.value as string[])
          : [];

        const allChecked = selected.length === options.length;
        const indeterminate = selected.length > 0 && !allChecked;

        // ── Handlers ──────────────────────────────────────────────────────────

        const handleSelectAll = () => {
          field.onChange(allChecked ? [] : options.map((o) => o.key));
        };

        const handleToggleOne = (key: string) => {
          field.onChange(
            selected.includes(key)
              ? selected.filter((k) => k !== key)
              : [...selected, key],
          );
        };

        // ── Render ─────────────────────────────────────────────────────────────

        return (
          <FormControl
            error={!!fieldState.error}
            sx={{ display: "flex", width: "100%" }}
          >
            {/* Optional section heading */}
            {groupLabel && (
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
                sx={{ mb: 0.25 }}
              >
                {groupLabel}
              </Typography>
            )}

            {/* ── Select All row ── */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.25 }}>
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    size={size}
                    checked={allChecked}
                    indeterminate={indeterminate}
                    onChange={handleSelectAll}
                    sx={{ py: 0.25, px: 0.5 }}
                    {...checkboxProps}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={600}>
                    Select All
                  </Typography>
                }
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                ({selected.length}&nbsp;/&nbsp;{options.length} selected)
              </Typography>
            </Box>

            <Divider sx={{ mb: 0.5 }} />

            {/* ── Individual option checkboxes ── */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns,
                rowGap: 0,
                columnGap: 1,
              }}
            >
              {options.map((opt) => (
                <FormControlLabel
                  key={opt.key}
                  sx={{ m: 0, alignItems: "center" }}
                  control={
                    <Checkbox
                      size={size}
                      checked={selected.includes(opt.key)}
                      onChange={() => handleToggleOne(opt.key)}
                      sx={{ py: 0.25, px: 0.5 }}
                      {...checkboxProps}
                    />
                  }
                  label={
                    <Typography variant="caption" lineHeight={1.3}>
                      {opt.label}
                    </Typography>
                  }
                />
              ))}
            </Box>

            {/* ── Validation error — mirrors CheckboxInput exactly ── */}
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}

export default MultiCheckboxInput;
