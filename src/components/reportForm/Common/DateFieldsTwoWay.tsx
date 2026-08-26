// components/reportForm/Common/DateFieldsTwoWay.tsx
"use client";

import React, { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DateInput from "@/components/form/DateInput";
import FieldRow from "@/utilis/FieldRow";
import calendarService from "@/services/Common/ComCalendarService";

async function convertBsToAd(bsDate: string): Promise<string> {
  try {
    if (!bsDate) return "";
    const result = await calendarService.convertBsToAd(bsDate);
    return result.convertedDate ?? "";
  } catch {
    return "";
  }
}

async function convertAdToBs(adDate: string): Promise<string> {
  try {
    if (!adDate) return "";
    const result = await calendarService.convertAdToBs(adDate);
    return result.convertedDate ?? "";
  } catch {
    return "";
  }
}

interface DateFieldsTwoWayProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  fromDateName?: Path<T>;
  toDateName?: Path<T>;
  fromDateADName?: Path<T>;
  toDateADName?: Path<T>;
  fromDateLabel?: string;
  toDateLabel?: string;
  fromDateADLabel?: string;
  toDateADLabel?: string;
  disabled?: boolean;
  showFromDate?: boolean;
  showToDate?: boolean;
}

// ── Renders one logical date (From or To) with BS stacked directly above
// AD, two-way synced: whichever field the user last edited pushes its
// converted value into the other. Neither field is ever read-only
// (unlike DateFields' BOTH_BS/BOTH_AD modes). ───────────────────────────────
function TwoWayDatePair<T extends FieldValues>({
  control,
  setValue,
  bsName,
  adName,
  bsLabel,
  adLabel,
  disabled,
  colSize,
}: {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  bsName: Path<T>;
  adName: Path<T>;
  bsLabel: string;
  adLabel: string;
  disabled?: boolean;
  colSize: { xs: number; md: number };
}) {
  const bsValue = useWatch({ control, name: bsName }) as unknown as
    | string
    | undefined;
  const adValue = useWatch({ control, name: adName }) as unknown as
    | string
    | undefined;

  // ── Echo guards: when a sync effect programmatically writes the OTHER
  // field, it flags that field's own effect to skip its next run once, so
  // we don't bounce the freshly-converted value straight back through the
  // converter (and don't fight the field the user is actually editing).
  // Unlike the old "did the value change since last render" ref-diff
  // approach, these effects fire on every value (including the very first
  // render), so a field that already has a value on mount — e.g. filled by
  // NepaliDatePicker's own defaultDate/RHF defaultValues before the user
  // touches anything — still syncs into its counterpart immediately. ──────
  const skipBsToAd = useRef(false);
  const skipAdToBs = useRef(false);

  // ── BS changed (including on mount) -> push converted value into AD ──────
  useEffect(() => {
    if (skipBsToAd.current) {
      skipBsToAd.current = false;
      return;
    }
    if (!bsValue) return;
    let cancelled = false;
    convertBsToAd(bsValue).then((converted) => {
      if (!cancelled && converted && converted !== adValue) {
        skipAdToBs.current = true; // this AD write is derived; don't re-convert it back to BS
        setValue(adName, converted as any);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bsValue]);

  // ── AD changed (including on mount) -> push converted value into BS ──────
  useEffect(() => {
    if (skipAdToBs.current) {
      skipAdToBs.current = false;
      return;
    }
    if (!adValue) return;
    let cancelled = false;
    convertAdToBs(adValue).then((converted) => {
      if (!cancelled && converted && converted !== bsValue) {
        skipBsToAd.current = true; // this BS write is derived; don't re-convert it back to AD
        setValue(bsName, converted as any);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adValue]);

  // ── BS on top, AD directly below it, within a single column ──────────────
  return (
    <Grid size={colSize}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <FieldRow label={bsLabel}>
          <Box sx={{ width: "100%" }}>
            <DateInput
              name={bsName}
              control={control}
              dateType="BS"
              disabled={disabled}
            />
          </Box>
        </FieldRow>
        <FieldRow label={adLabel}>
          <Box sx={{ width: "100%" }}>
            <DateInput
              name={adName}
              control={control}
              dateType="AD"
              disabled={disabled}
            />
          </Box>
        </FieldRow>
      </Box>
    </Grid>
  );
}

// ── Both BS and AD are fully editable for each logical date (From/To) —
// whichever side the user last typed into converts and fills the other.
// From and To render as two side-by-side columns; within each column the
// BS row sits directly above its AD row. ────────────────────────────────────
export default function DateFieldsTwoWay<T extends FieldValues>({
  control,
  setValue,
  fromDateName = "fromDate" as Path<T>,
  toDateName = "toDate" as Path<T>,
  fromDateADName = "fromDateAD" as Path<T>,
  toDateADName = "toDateAD" as Path<T>,
  fromDateLabel = "From Date",
  toDateLabel = "To Date",
  fromDateADLabel,
  toDateADLabel,
  disabled = false,
  showFromDate = true,
  showToDate = true,
}: DateFieldsTwoWayProps<T>) {
  // Only one side (From OR To) shown → that column takes the full width
  const isSolo = showFromDate !== showToDate;
  const colSize = isSolo ? { xs: 12, md: 12 } : { xs: 12, md: 6 };

  return (
    <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
      {showFromDate && (
        <TwoWayDatePair
          control={control}
          setValue={setValue}
          bsName={fromDateName}
          adName={fromDateADName}
          bsLabel={fromDateLabel}
          adLabel={fromDateADLabel ?? `${fromDateLabel} (A.D.)`}
          disabled={disabled}
          colSize={colSize}
        />
      )}
      {showToDate && (
        <TwoWayDatePair
          control={control}
          setValue={setValue}
          bsName={toDateName}
          adName={toDateADName}
          bsLabel={toDateLabel}
          adLabel={toDateADLabel ?? `${toDateLabel} (A.D.)`}
          disabled={disabled}
          colSize={colSize}
        />
      )}
    </Grid>
  );
}
