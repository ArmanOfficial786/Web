// "use client";
// import DropDown from "@/components/form/DropDown";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import FieldRow from "@/utilis/FieldRow";
// import React from "react";
// import { Control, FieldValues, Path } from "react-hook-form";

// interface CollectorFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   collectorFieldName: Path<T>;
// }

// export default function Collector<T extends FieldValues>({
//   control,
//   collectorFieldName,
// }: CollectorFieldProps<T>) {
//   const { collectorOptions } = useReportForm();
//   return (
//     <FieldRow label="Branch Name">
//       <DropDown
//         name={collectorFieldName}
//         control={control}
//         label="Collector"
//         options={collectorOptions}
//         fullWidth
//       />
//     </FieldRow>
//   );
// }

import React from "react";

function Collector() {
  return <div>collector</div>;
}

export default Collector;
