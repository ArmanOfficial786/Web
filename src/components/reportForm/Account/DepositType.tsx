// "use client";
// import React from "react";
// import DropDown from "@/components/form/DropDown";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import FieldRow from "@/utilis/FieldRow";
// import { Control, FieldValues, Path } from "react-hook-form";

// //---------Props------------------
// interface DepositeTypeFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   depositeTypeFieldName: Path<T>;
// }

// export default function DepositType<T extends FieldValues>({
//   control,
//   depositeTypeFieldName,
// }: DepositeTypeFieldProps<T>) {
//   const { depositeTypeOption } = useReportForm();
//   return (
//     <FieldRow label="Branch Name">
//       <DropDown
//         name={depositeTypeFieldName}
//         control={control}
//         label="Deposite Name"
//         options={depositeTypeOption}
//         fullWidth
//       />
//     </FieldRow>
//   );
// }

import React from "react";

function DepositType() {
  return <div>deposit type</div>;
}

export default DepositType;
