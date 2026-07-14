// "use client";

// import React from "react";
// import type { Control, FieldValues, Path } from "react-hook-form";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import DateInput from "@/components/form/DateInput";
// import FieldRow from "@/utilis/FieldRow";
// import NepaliDate from "@/components/reportForm/Common/NepaliDatePicker"; // adjust to your actual BS library

// // ── Helpers ──────────────────────────────────────────────────────────────────

// /**
//  * Returns today's date as a BS string in the same format your NepaliDatePicker
//  * produces, e.g. "2081/08/15". Adjust the format call to match your library.
//  */
// function getTodayBS(): string {
//   const today = new Date();
//   const nepaliDate = new NepaliDate(today);
//   // Format: "YYYY/MM/DD" – change separator/padding if your picker uses a different one
//   const y = nepaliDate.getYear();
//   const m = String(nepaliDate.getMonth() + 1).padStart(2, "0");
//   const d = String(nepaliDate.getDate()).padStart(2, "0");
//   return `${y}/${m}/${d}`;
// }

// /**
//  * Compares two BS date strings (same format).
//  * Returns true when `bsDate` is after today.
//  */
// function isFutureBS(bsDate: string): boolean {
//   const today = getTodayBS();
//   // Lexicographic comparison works for "YYYY/MM/DD" and "YYYY-MM-DD"
//   return bsDate.replace(/-/g, "/") > today.replace(/-/g, "/");
// }

// // ── Component ─────────────────────────────────────────────────────────────────

// interface TillDateFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   /**
//    * The field name in your form schema. Defaults to "tillDate".
//    */
//   name?: Path<T>;
//   label?: string;
// }

// export default function TillDateField<T extends FieldValues>({
//   control,
//   name = "tillDate" as Path<T>,
//   label = "Till Date",
// }: TillDateFieldProps<T>) {
//   return (
//     <Grid container spacing={2} alignItems="center">
//       <Grid size={{ xs: 12, md: 6 }}>
//         <FieldRow label={label}>
//           <Box sx={{ width: "100%" }}>
//             <DateInput
//               name={name}
//               control={control}
//               dateType="BS"
//               rules={{
//                 validate: (value: string) => {
//                   if (!value) return true; // let "required" rule handle empty
//                   if (isFutureBS(value)) {
//                     return "Till Date cannot be greater than today's date.";
//                   }
//                   return true;
//                 },
//               }}
//             />
//           </Box>
//         </FieldRow>
//       </Grid>
//     </Grid>
//   );
// }

// components/reportForm/Common/TillDateBothField.tsx

// components/reportForm/Common/TillDateField.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DateInput from "@/components/form/DateInput";
import FieldRow from "@/utilis/FieldRow";
import calendarService from "@/services/Common/ComCalendarService";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

// ── Helpers ──────────────────────────────────────────────────────────────────
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

// ── Props ─────────────────────────────────────────────────────────────────────
export type TillDateMode = "BS" | "AD" | "BOTH";

interface TillDateFieldProps<T extends FieldValues> {
  control: Control<T>;
  /** "BS" (default) | "AD" | "BOTH" */
  mode?: TillDateMode;
  /** BS field name — used in "BS" and "BOTH" modes. Default "tillDate" */
  name?: Path<T>;
  /** AD field name — used in "AD" and "BOTH" modes. Default "tillDateAD" */
  adName?: Path<T>;
  label?: string;
  adLabel?: string;
  disabled?: boolean;
  /** Required for "BOTH" mode so the other field can be kept in sync */
  setValue?: (name: Path<T>, value: any) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TillDateField<T extends FieldValues>({
  control,
  mode = "BS",
  name = "tillDate" as Path<T>,
  adName = "tillDateAD" as Path<T>,
  label = "Till Date",
  adLabel = "Till Date (A.D.)",
  disabled = false,
  setValue,
}: TillDateFieldProps<T>) {
  const [todayBs, setTodayBs] = useState<string>("");
  const bsValue = useWatch({ control, name });
  const adValue = useWatch({ control, name: adName });
  const todayAD = new Date().toISOString().split("T")[0];

  // ── Fetch today's BS date once, for max-date validation on the BS field ───
  useEffect(() => {
    if (mode === "AD") return; // BS field not shown, no need
    calendarService
      .getTodayBs()
      .then((t) => setTodayBs(`${t.year}-${pad2(t.month)}-${pad2(t.day)}`))
      .catch(() => {});
  }, [mode]);

  // ── BOTH mode: BS changes -> sync AD ──────────────────────────────────────
  useEffect(() => {
    if (mode !== "BOTH" || !setValue) return;
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

  const bsField = (
    <FieldRow label={label}>
      <Box sx={{ width: "100%" }}>
        <DateInput
          name={name}
          control={control}
          dateType="BS"
          disabled={disabled}
          maxDate={todayBs}
          rules={{
            validate: (value: string) => {
              if (!value) return true; // let "required" rule handle empty
              if (
                todayBs &&
                value.replace(/-/g, "/") > todayBs.replace(/-/g, "/")
              ) {
                return "Till Date cannot be greater than today's date.";
              }
              return true;
            },
          }}
        />
      </Box>
    </FieldRow>
  );

  const adField = (
    <FieldRow label={adLabel}>
      <Box sx={{ width: "100%" }}>
        <DateInput
          name={adName}
          control={control}
          dateType="AD"
          disabled={disabled || mode === "BOTH"} // derived/read-only only alongside BS
          inputProps={{ max: todayAD }}
        />
      </Box>
    </FieldRow>
  );

  if (mode === "BS") {
    return (
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>{bsField}</Grid>
      </Grid>
    );
  }

  if (mode === "AD") {
    return (
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>{adField}</Grid>
      </Grid>
    );
  }

  // BOTH
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}>{bsField}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{adField}</Grid>
    </Grid>
  );
}
