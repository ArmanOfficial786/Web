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
//   LedgerNameOption,
// } from "@/services/Common/LedgerLookupService";

// interface LedgerNameFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   setValue: UseFormSetValue<T>;
//   name: Path<T>; // "ledgerName"
//   fromDateFieldName: Path<T>;
//   toDateFieldName: Path<T>;
//   ledgerHeadFieldName: Path<T>;
//   branchFieldName: Path<T>;
//   label?: string;
// }

// type Option = { id: string; name: string };
// const DEFAULT_OPTIONS: Option[] = [{ id: "", name: "-- Select --" }];

// export default function LedgerNameField<T extends FieldValues>({
//   control,
//   setValue,
//   name,
//   fromDateFieldName,
//   toDateFieldName,
//   ledgerHeadFieldName,
//   branchFieldName,
//   label = "Ledger Name",
// }: LedgerNameFieldProps<T>) {
//   const [options, setOptions] = useState<Option[]>(DEFAULT_OPTIONS);
//   const [loading, setLoading] = useState(false);

//   // Guards against out-of-order responses (fast field flipping / slow API).
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

//   useEffect(() => {
//     setValue(name, "" as PathValue<T, Path<T>>, {
//       shouldDirty: false,
//       shouldValidate: false,
//     });

//     // ⚠️ Gate on Ledger Head being selected, not just From/To Date — a
//     // restored/pre-filled date pair (e.g. after page refresh) must not
//     // trigger a fetch on its own. The API only runs once the user has
//     // actually picked a Ledger Head.
//     const hasLedgerHead =
//       ledgerHeadId !== undefined &&
//       ledgerHeadId !== null &&
//       ledgerHeadId !== "";

//     if (!fromDate || !toDate || !hasLedgerHead) {
//       setOptions(DEFAULT_OPTIONS);
//       return;
//     }

//     const requestId = ++requestIdRef.current;
//     setLoading(true);

//     const accountTypeId = Number(ledgerHeadId);

//     ledgerLookupService
//       .getLedgerNames({
//         fromDate,
//         toDate,
//         branchId: String(branchId ?? "2"),
//         accountTypeId,
//       })
//       .then((names: LedgerNameOption[]) => {
//         if (requestId !== requestIdRef.current) return; // stale response
//         setOptions([
//           { id: "", name: "-- Select --" },
//           ...names.map((n) => ({ id: n.mainLedger, name: n.mainLedger })),
//         ]);
//       })
//       .catch(() => {
//         if (requestId !== requestIdRef.current) return;
//         setOptions(DEFAULT_OPTIONS);
//       })
//       .finally(() => {
//         if (requestId === requestIdRef.current) setLoading(false);
//       });
//     // setValue/name are stable across renders; only the watched values
//     // should re-trigger the fetch.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [fromDate, toDate, ledgerHeadId, branchId]);

//   return (
//     <FieldRow label={label}>
//       <DropDownWithLoading
//         name={name}
//         control={control}
//         label={label}
//         options={options}
//         fullWidth
//         disabled={loading}
//         loading={loading}
//       />
//     </FieldRow>
//   );
// }

// components/reportForm/Common/LedgerNameField.tsx
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
import { useLedgerNameOptions } from "@/components/hooks/useLedgerNameOptions";

interface LedgerNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>; // "ledgerName"
  fromDateFieldName: Path<T>;
  toDateFieldName: Path<T>;
  ledgerHeadFieldName: Path<T>;
  branchFieldName: Path<T>;
  label?: string;
}

// Feeds ddlLedgerName. Cascades on From/To Date, Ledger Head, and Branch —
// gated on Ledger Head being selected (a restored date pair alone must not
// trigger a fetch). Results for a given filter combination are cached
// globally via useLedgerNameOptions, so switching between two forms that
// happen to share the same date/branch/ledger-head filters costs no
// additional network call.
export default function LedgerNameField<T extends FieldValues>({
  control,
  setValue,
  name,
  fromDateFieldName,
  toDateFieldName,
  ledgerHeadFieldName,
  branchFieldName,
  label = "Ledger Name",
}: LedgerNameFieldProps<T>) {
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

  const { options, loading } = useLedgerNameOptions({
    fromDate,
    toDate,
    branchId,
    ledgerHeadId,
  });

  // Clear the selected Ledger Name whenever the dependency combination
  // actually changes — same behavior as before, so a stale selection from
  // a different date/branch/head combo never lingers.
  const depKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const depKey = `${fromDate ?? ""}|${toDate ?? ""}|${branchId ?? ""}|${ledgerHeadId ?? ""}`;
    if (depKeyRef.current === depKey) return;
    depKeyRef.current = depKey;

    setValue(name, "" as PathValue<T, Path<T>>, {
      shouldDirty: false,
      shouldValidate: false,
    });
    // setValue/name are stable; only the watched filter values should
    // re-trigger the reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, branchId, ledgerHeadId]);

  return (
    <FieldRow label={label}>
      <DropDownWithLoading
        name={name}
        control={control}
        label={label}
        options={options}
        fullWidth
        disabled={loading}
        loading={loading}
      />
    </FieldRow>
  );
}
