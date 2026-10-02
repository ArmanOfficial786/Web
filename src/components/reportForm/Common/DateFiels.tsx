

















//     // eslint-disable-next-line react-hooks/exhaustive-deps

//     // eslint-disable-next-line react-hooks/exhaustive-deps



"use client";
import React, { useEffect, useState } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DateInput from "@/components/form/DateInput";
import FieldRow from "@/utilis/FieldRow";
import calendarService from "@/services/Common/ComCalendarService";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

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

export type DateFieldMode = "AD" | "BS" | "BOTH_BS" | "BOTH_AD";

interface DateFieldsProps<T extends FieldValues> {
  control: Control<T>;
  setValue?: (name: Path<T>, value: any) => void;
  fromDateName?: Path<T>;
  toDateName?: Path<T>;
  fromDateADName?: Path<T>;
  toDateADName?: Path<T>;
  fromDateLabel?: string;
  toDateLabel?: string;
  fromDateADLabel?: string;
  toDateADLabel?: string;
  mode?: DateFieldMode;
  disabled?: boolean;
  showFromDate?: boolean;
  showToDate?: boolean;
  capToday?: boolean;
}

export default function DateFields<T extends FieldValues>({
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
  mode = "BS",
  disabled = false,
  showFromDate = true,
  showToDate = true,
  capToday = true,
}: DateFieldsProps<T>) {
  const [todayBs, setTodayBs] = useState<string>("");
  const todayAD = new Date().toISOString().split("T")[0];

  const isSolo = showFromDate !== showToDate;

  useEffect(() => {
    if (mode === "AD" || !capToday) return;
    calendarService
      .getTodayBs()
      .then((t) => setTodayBs(`${t.year}-${pad2(t.month)}-${pad2(t.day)}`))
      .catch(() => {});
  }, [mode, capToday]);

  return (
    <Grid container spacing={3} alignItems="center">
      {showFromDate && (
        <DateFieldPair
          control={control}
          setValue={setValue}
          mode={mode}
          disabled={disabled}
          capToday={capToday}
          todayBs={todayBs}
          todayAD={todayAD}
          bsName={fromDateName}
          adName={fromDateADName}
          bsLabel={fromDateLabel}
          adLabel={fromDateADLabel ?? `${fromDateLabel} (A.D.)`}
          fullWidth={isSolo}
        />
      )}
      {showToDate && (
        <DateFieldPair
          control={control}
          setValue={setValue}
          mode={mode}
          disabled={disabled}
          capToday={capToday}
          todayBs={todayBs}
          todayAD={todayAD}
          bsName={toDateName}
          adName={toDateADName}
          bsLabel={toDateLabel}
          adLabel={toDateADLabel ?? `${toDateLabel} (A.D.)`}
          fullWidth={isSolo}
        />
      )}
    </Grid>
  );
}

function DateFieldPair<T extends FieldValues>({
  control,
  setValue,
  mode,
  disabled,
  capToday,
  todayBs,
  todayAD,
  bsName,
  adName,
  bsLabel,
  adLabel,
  fullWidth = false,
}: {
  control: Control<T>;
  setValue?: (name: Path<T>, value: any) => void;
  mode: DateFieldMode;
  disabled?: boolean;
  capToday: boolean;
  todayBs: string;
  todayAD: string;
  bsName: Path<T>;
  adName: Path<T>;
  bsLabel: string;
  adLabel: string;
  fullWidth?: boolean;
}) {
  const bsValue = useWatch({ control, name: bsName });
  const adValue = useWatch({ control, name: adName });

  useEffect(() => {
    if (mode !== "BOTH_BS" || !setValue) return;
    if (typeof bsValue !== "string" || !bsValue) return;
    let cancelled = false;
    convertBsToAd(bsValue).then((converted) => {
      if (!cancelled && converted && converted !== adValue) {
        setValue(adName, converted);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bsValue, mode]);

  useEffect(() => {
    if (mode !== "BOTH_AD" || !setValue) return;
    if (typeof adValue !== "string" || !adValue) return;
    let cancelled = false;
    convertAdToBs(adValue).then((converted) => {
      if (!cancelled && converted && converted !== bsValue) {
        setValue(bsName, converted);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adValue, mode]);

  const showBS = mode === "BS" || mode === "BOTH_BS" || mode === "BOTH_AD";
  const showAD = mode === "AD" || mode === "BOTH_BS" || mode === "BOTH_AD";
  const bsReadOnly = mode === "BOTH_AD";
  const adReadOnly = mode === "BOTH_BS";

  const colSize = fullWidth
    ? showBS && showAD
      ? { xs: 12, md: 6 }
      : { xs: 12, md: 12 }
    : { xs: 12, md: 6 };

  return (
    <>
      {showBS && (
        <Grid size={colSize}>
          <FieldRow label={bsLabel}>
            <Box sx={{ width: "100%" }}>
              <DateInput
                name={bsName}
                control={control}
                dateType="BS"
                disabled={disabled || bsReadOnly}
                maxDate={capToday ? todayBs : undefined}
              />
            </Box>
          </FieldRow>
        </Grid>
      )}
      {showAD && (
        <Grid size={colSize}>
          <FieldRow label={adLabel}>
            <Box sx={{ width: "100%" }}>
              <DateInput
                name={adName}
                control={control}
                dateType="AD"
                disabled={disabled || adReadOnly}
                inputProps={capToday ? { max: todayAD } : undefined}
              />
            </Box>
          </FieldRow>
        </Grid>
      )}
    </>
  );
}
