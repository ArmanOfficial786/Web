// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   useWatch,
//   type Control,
//   type FieldValues,
//   type Path,
//   type PathValue,
//   type UseFormSetValue,
// } from "react-hook-form";
// import FieldRow from "@/utilis/FieldRow";
// import DropDownWithLoading from "@/components/form/DropDownWithLoading";
// import ledgerLookupService, {
//   SubLedgerNameOption,
// } from "@/services/Common/LedgerLookupService";

// interface SubLedgerNameFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   setValue: UseFormSetValue<T>;
//   name: Path<T>; // "subLedgerName"
//   fromDateFieldName: Path<T>;
//   toDateFieldName: Path<T>;
//   ledgerHeadFieldName: Path<T>;
//   branchFieldName: Path<T>;
//   mainLedgerFieldName: Path<T>; // "ledgerName" — the field this cascades from
//   label?: string;
// }

// type Option = { id: string; name: string };
// const DEFAULT_OPTIONS: Option[] = [{ id: "", name: "-- Select --" }];

// // Feeds ddlSubLedgerName — refetches whenever From/To Date, Ledger Head,
// // Branch, or Ledger Name changes. Stays disabled until a Ledger Name is
// // chosen (backend requires MainLedger = @MainLedger). Mirrors Level 1 of
// // sp_6_56_GetVoucherLedgerDetailsMainLedger via
// // POST /api/LedgerLookup/SubLedgerName.
// //
// // Same fix as LedgerNameField: watches its own dependencies via useWatch
// // instead of taking pre-resolved values as props, so it reacts immediately
// // when Ledger Name (or any upstream field) changes.
// export default function SubLedgerNameField<T extends FieldValues>({
//   control,
//   setValue,
//   name,
//   fromDateFieldName,
//   toDateFieldName,
//   ledgerHeadFieldName,
//   branchFieldName,
//   mainLedgerFieldName,
//   label = "Sub Ledger Name",
// }: SubLedgerNameFieldProps<T>) {
//   const [options, setOptions] = useState<Option[]>(DEFAULT_OPTIONS);
//   const [loading, setLoading] = useState(false);
//   const requestIdRef = useRef(0);

//   const fromDate = useWatch({ control, name: fromDateFieldName }) as
//     | string
//     | null
//     | undefined;
//   const toDate = useWatch({ control, name: toDateFieldName }) as
//     | string
//     | null
//     | undefined;
//   const ledgerHeadId = useWatch({ control, name: ledgerHeadFieldName }) as
//     | string
//     | number
//     | null
//     | undefined;
//   const branchId = useWatch({ control, name: branchFieldName }) as
//     | string
//     | null
//     | undefined;
//   const mainLedger = useWatch({ control, name: mainLedgerFieldName }) as
//     | string
//     | null
//     | undefined;

//   useEffect(() => {
//     setValue(name, "" as PathValue<T, Path<T>>, {
//       shouldDirty: false,
//       shouldValidate: false,
//     });

//     if (!fromDate || !toDate || !mainLedger) {
//       setOptions(DEFAULT_OPTIONS);
//       return;
//     }

//     const requestId = ++requestIdRef.current;
//     setLoading(true);

//     const accountTypeId =
//       ledgerHeadId === undefined || ledgerHeadId === null || ledgerHeadId === ""
//         ? -1
//         : Number(ledgerHeadId);

//     ledgerLookupService
//       .getSubLedgerNames({
//         fromDate,
//         toDate,
//         branchId: String(branchId ?? "2"),
//         accountTypeId,
//         mainLedger,
//       })
//       .then((subLedgers: SubLedgerNameOption[]) => {
//         if (requestId !== requestIdRef.current) return;
//         setOptions([
//           { id: "", name: "-- Select --" },
//           ...subLedgers.map((s) => ({ id: s.subLedger1, name: s.subLedger1 })),
//         ]);
//       })
//       .catch(() => {
//         if (requestId !== requestIdRef.current) return;
//         setOptions(DEFAULT_OPTIONS);
//       })
//       .finally(() => {
//         if (requestId === requestIdRef.current) setLoading(false);
//       });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [fromDate, toDate, ledgerHeadId, branchId, mainLedger]);

//   return (
//     <FieldRow label={label}>
//       <DropDownWithLoading
//         name={name}
//         control={control}
//         label={label}
//         options={options}
//         fullWidth
//         disabled={loading || !mainLedger}
//         loading={loading}
//       />
//     </FieldRow>
//   );
// }

// src/components/reportForm/Common/SubLedgerNameField.tsx
"use client";

import React, { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormSetValue,
} from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDownWithLoading from "@/components/form/DropDownWithLoading";
import { useSubLedgerNameOptions } from "@/components/hooks/useSubLedgerNameOptions";

interface SubLedgerNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>; // "subLedgerName"
  fromDateFieldName: Path<T>;
  toDateFieldName: Path<T>;
  ledgerHeadFieldName: Path<T>;
  branchFieldName: Path<T>;
  mainLedgerFieldName: Path<T>; // "ledgerName" — the field this cascades from
  label?: string;
}

// Feeds ddlSubLedgerName — refetches whenever From/To Date, Ledger Head,
// Branch, or Ledger Name changes. Stays disabled until a Ledger Name is
// chosen (backend requires MainLedger = @MainLedger). Mirrors Level 1 of
// sp_6_56_GetVoucherLedgerDetailsMainLedger via
// POST /api/LedgerLookup/SubLedgerName.
//
// Data comes from the shared subLedgerNameStore (lib/ledgerLookupStore.ts) —
// identical filter combos across different forms/pages hit the cache
// instead of refetching, same as LedgerNameField.
export default function SubLedgerNameField<T extends FieldValues>({
  control,
  setValue,
  name,
  fromDateFieldName,
  toDateFieldName,
  ledgerHeadFieldName,
  branchFieldName,
  mainLedgerFieldName,
  label = "Sub Ledger Name",
}: SubLedgerNameFieldProps<T>) {
  const fromDate = useWatch({ control, name: fromDateFieldName }) as
    | string
    | null
    | undefined;
  const toDate = useWatch({ control, name: toDateFieldName }) as
    | string
    | null
    | undefined;
  const ledgerHeadId = useWatch({ control, name: ledgerHeadFieldName }) as
    | string
    | number
    | null
    | undefined;
  const branchId = useWatch({ control, name: branchFieldName }) as
    | string
    | null
    | undefined;
  const mainLedger = useWatch({ control, name: mainLedgerFieldName }) as
    | string
    | null
    | undefined;

  const { options, loading } = useSubLedgerNameOptions({
    fromDate,
    toDate,
    branchId,
    ledgerHeadId,
    mainLedger,
  });

  // Clear the selected Sub Ledger Name whenever the dependency combination
  // actually changes — same behavior as before, so a stale selection from
  // a different date/branch/head/ledger combo never lingers.
  const depKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const depKey = `${fromDate ?? ""}|${toDate ?? ""}|${branchId ?? ""}|${ledgerHeadId ?? ""}|${mainLedger ?? ""}`;
    if (depKeyRef.current === depKey) return;
    depKeyRef.current = depKey;

    setValue(name, "" as PathValue<T, Path<T>>, {
      shouldDirty: false,
      shouldValidate: false,
    });
    // setValue/name are stable; only the watched filter values should
    // re-trigger the reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, branchId, ledgerHeadId, mainLedger]);

  return (
    <FieldRow label={label}>
      <DropDownWithLoading
        name={name}
        control={control}
        label={label}
        options={options}
        fullWidth
        disabled={loading || !mainLedger}
        loading={loading}
      />
    </FieldRow>
  );
}
