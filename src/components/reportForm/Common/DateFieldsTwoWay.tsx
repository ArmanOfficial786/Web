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

  const skipBsToAd = useRef(false);
  const skipAdToBs = useRef(false);

  useEffect(() => {
    if (skipBsToAd.current) {
      skipBsToAd.current = false;
      return;
    }
    if (!bsValue) return;
    let cancelled = false;
    convertBsToAd(bsValue).then((converted) => {
      if (!cancelled && converted && converted !== adValue) {
        skipAdToBs.current = true;
        setValue(adName, converted as any);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bsValue]);

  useEffect(() => {
    if (skipAdToBs.current) {
      skipAdToBs.current = false;
      return;
    }
    if (!adValue) return;
    let cancelled = false;
    convertAdToBs(adValue).then((converted) => {
      if (!cancelled && converted && converted !== bsValue) {
        skipBsToAd.current = true;
        setValue(bsName, converted as any);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adValue]);

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
