// // components/reportForm/Common/TypeField.tsx
// "use client";

// import React, { useEffect } from "react";
// import {
//   useWatch,
//   type Control,
//   type FieldValues,
//   type Path,
// } from "react-hook-form";
// import Box from "@mui/material/Box";
// import FieldRow from "@/utilis/FieldRow";
// import DropDown from "@/components/form/DropDown";
// import { useReportFormContext } from "@/contexts/ReportFormContext";

// interface TypeFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>; // the "typeId" field this dropdown writes to
//   transactionTypeName: Path<T>; // the "transactionType" field to watch ("S"/"L")
//   label: string;
// }

// export default function TypeField<T extends FieldValues>({
//   control,
//   name,
//   transactionTypeName,
//   label,
// }: TypeFieldProps<T>) {
//   const transactionType = useWatch({ control, name: transactionTypeName });
//   const {
//     depositTypeOptions,
//     fetchDepositTypes,
//     loanMasterListOptions,
//     fetchLoanMasterList,
//   } = useReportFormContext();

//   useEffect(() => {
//     if (transactionType === "S") {
//       fetchDepositTypes();
//     } else if (transactionType === "L") {
//       fetchLoanMasterList();
//     }
//   }, [transactionType, fetchDepositTypes, fetchLoanMasterList]);

//   const options =
//     transactionType === "L" ? loanMasterListOptions : depositTypeOptions;

//   return (
//     <FieldRow label={label}>
//       <Box sx={{ width: "100%" }}>
//         <DropDown
//           name={name}
//           control={control}
//           label={label}
//           options={options}
//           fullWidth
//         />
//       </Box>
//     </FieldRow>
//   );
// }

// components/reportForm/Common/TypeField.tsx
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
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";

interface TypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>; // the "typeId" field this dropdown writes to (number)
  transactionTypeName: Path<T>; // the "transactionType" field to watch ("S"/"L")
  label: string;
}

export default function TypeField<T extends FieldValues>({
  control,
  setValue,
  name,
  transactionTypeName,
  label,
}: TypeFieldProps<T>) {
  const transactionType = useWatch({ control, name: transactionTypeName });
  const {
    depositTypeOptions,
    fetchDepositTypes,
    loanMasterListOptions,
    fetchLoanMasterList,
  } = useReportFormContext();

  const prevTransactionType = useRef(transactionType);

  useEffect(() => {
    if (transactionType === "S") {
      fetchDepositTypes();
    } else if (transactionType === "L") {
      fetchLoanMasterList();
    }

    // ── Reset to "-- Select --" (id 0) whenever the transaction type
    // actually changes — prevents a stale Saving typeId lingering when
    // switching to Loan, or vice versa. Skip on first mount. ──────────────
    if (
      prevTransactionType.current !== transactionType &&
      prevTransactionType.current !== undefined
    ) {
      setValue(name, 0 as any, { shouldDirty: false, shouldValidate: false });
    }
    prevTransactionType.current = transactionType;
  }, [transactionType, fetchDepositTypes, fetchLoanMasterList, setValue, name]);

  const options =
    transactionType === "L" ? loanMasterListOptions : depositTypeOptions;

  return (
    <FieldRow label={label}>
      <Box sx={{ width: "100%" }}>
        <DropDown
          name={name}
          control={control}
          label={label}
          options={options}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
