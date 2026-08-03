// "use client";
// import DropDown from "@/components/form/DropDown";
// import { useReportFormContext } from "@/contexts/ReportFormContext";
// import FieldRow from "@/utilis/FieldRow";
// import React, { useEffect } from "react";
// import { Control, FieldValues, Path } from "react-hook-form";

// interface CollectorFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   collectorFieldName: Path<T>;
//   userId: number;
// }

// export default function Collector<T extends FieldValues>({
//   control,
//   collectorFieldName,
//   userId,
// }: CollectorFieldProps<T>) {
//   const { fetchCollectors, collectorOptions } = useReportFormContext();
//   useEffect(() => {
//     fetchCollectors(userId);
//   }, [fetchCollectors, userId]);

//   return (
//     <FieldRow label={collectorFieldName}>
//       <DropDown
//         name={collectorFieldName}
//         control={control}
//         label={collectorFieldName}
//         options={collectorOptions}
//         fullWidth
//       />
//     </FieldRow>
//   );
// }

// src/components/reportForm/MemberAccount/Collector.tsx
"use client";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import React, { useEffect } from "react";
import { Control, FieldValues } from "react-hook-form";

interface CollectorFieldProps<T extends FieldValues> {
  control: Control<T>;
  collectorFieldName: string;
  userId: number;
  label?: string;
}

export default function Collector<T extends FieldValues>({
  control,
  collectorFieldName,
  userId,
  label = "Collector",
}: CollectorFieldProps<T>) {
  const { fetchCollectors, collectorOptions } = useReportFormContext();
  useEffect(() => {
    fetchCollectors(userId);
  }, [fetchCollectors, userId]);

  return (
    <FieldRow label={label}>
      <DropDown
        name={collectorFieldName}
        control={control}
        label={label}
        options={collectorOptions}
        fullWidth
      />
    </FieldRow>
  );
}
