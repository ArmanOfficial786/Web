// // components/reportForm/Common/LedgerHeadField.tsx
// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import type { Control, FieldValues, Path } from "react-hook-form";
// import FieldRow from "@/utilis/FieldRow";
// import DropDown from "@/components/form/DropDown";
// import ledgerLookupService, {
//   type LedgerHeadOption,
// } from "@/services/Common/LedgerLookupService";

// interface LedgerHeadFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label?: string;
// }

// type LedgerHeadSelectOption = {
//   id: string;
//   name: string;
// };

// const DEFAULT_OPTIONS: LedgerHeadSelectOption[] = [
//   { id: "", name: "-- Select --" },
// ];

// export default function LedgerHeadField<T extends FieldValues>({
//   control,
//   name,
//   label = "Ledger Head",
// }: LedgerHeadFieldProps<T>) {
//   const [options, setOptions] =
//     useState<LedgerHeadSelectOption[]>(DEFAULT_OPTIONS);
//   const fetchedRef = useRef(false);

//   useEffect(() => {
//     if (fetchedRef.current) return;
//     fetchedRef.current = true;

//     (async () => {
//       try {
//         const heads: LedgerHeadOption[] =
//           await ledgerLookupService.getLedgerHeads();

//         const mapped: LedgerHeadSelectOption[] = heads.map((h) => ({
//           id: String(h.acoAccountTypeId),
//           name: h.accountType,
//         }));

//         setOptions([{ id: "", name: "-- Select --" }, ...mapped]);
//       } catch {
//         fetchedRef.current = false; // allow retry if this attempt failed
//       }
//     })();
//   }, []);

//   return (
//     <FieldRow label={label}>
//       <DropDown
//         name={name}
//         control={control}
//         label={label}
//         options={options}
//         fullWidth
//       />
//     </FieldRow>
//   );
// }

// components/reportForm/Common/LedgerHeadField.tsx
"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useLedgerHeadOptions } from "@/components/hooks/useLedgerHeadOptions";

interface LedgerHeadFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

// Feeds ddlLedgerHead. Data comes from the shared ledgerHeadStore — the
// first form to mount this field triggers the one-time fetch; every
// subsequent LedgerHeadField anywhere in the app (this page or any other)
// reads the same cached list instantly.
export default function LedgerHeadField<T extends FieldValues>({
  control,
  name,
  label = "Ledger Head",
}: LedgerHeadFieldProps<T>) {
  const options = useLedgerHeadOptions();

  return (
    <FieldRow label={label}>
      <DropDown
        name={name}
        control={control}
        label={label}
        options={options}
        fullWidth
      />
    </FieldRow>
  );
}
