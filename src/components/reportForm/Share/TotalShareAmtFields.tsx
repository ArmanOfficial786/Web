"use client";

import TextInput from "@/components/form/TextInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

interface TotalShareAmountFieldProps<T extends FieldValues> {
  control: Control<T>;
  comparisonFieldName: Path<T>;
  amountFieldName: Path<T>;
  label?: string;
}

const sanitizeAmount = (value: string) => {
  let cleaned = value.replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, "");
  }
  return cleaned;
};

export default function TotalShareAmountField<T extends FieldValues>({
  control,
  comparisonFieldName,
  amountFieldName,
  label = "Total Share Amount",
}: TotalShareAmountFieldProps<T>) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        flexWrap: "nowrap",
        minWidth: 0,
      }}
    >
      {/* ── Label ───────────────────────────────────────────────────────── */}
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: 14,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>

      {/* ── Greater Than / Less Than (rbGreaterOrLessThan) ─────────────── */}
      <Controller
        name={comparisonFieldName}
        control={control}
        defaultValue={"1" as any}
        render={({ field }) => (
          <RadioGroup
            row
            value={field.value ?? "1"}
            onChange={(e) => field.onChange(e.target.value)}
            sx={{ columnGap: 1, flexWrap: "nowrap", flexShrink: 0 }}
          >
            <FormControlLabel
              value="1"
              control={<Radio size="small" />}
              label="Greater Than"
              sx={{ whiteSpace: "nowrap", mr: 1 }}
            />
            <FormControlLabel
              value="0"
              control={<Radio size="small" />}
              label="Less Than"
              sx={{ whiteSpace: "nowrap" }}
            />
          </RadioGroup>
        )}
      />

      {/* ── Amount textbox (txtTotalShareAmt) via TextInput ────────────── */}
      <Controller
        name={amountFieldName}
        control={control}
        defaultValue={0 as any}
        rules={{ required: "*" }}
        render={({ field, fieldState }) => (
          <TextInput
            name={amountFieldName as string}
            control={undefined}
            value={field.value ?? 0}
            onChange={(e) =>
              field.onChange(Number(sanitizeAmount(e.target.value)) || 0)
            }
            onBlur={field.onBlur}
            size="small"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            inputProps={{ inputMode: "decimal" }}
            sx={{
              flex: "1 1 60px",
              minWidth: 60,
              maxWidth: 160,
              display: "flex",
            }}
          />
        )}
      />
    </Box>
  );
}
