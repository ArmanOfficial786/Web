"use client";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { Control, FieldValues } from "react-hook-form";

interface CollectorFieldProps<T extends FieldValues> {
  control: Control<T>;
  collectorFieldName: string;
  userId?: number;
  label?: string;
}

export default function Collector<T extends FieldValues>({
  control,
  collectorFieldName,
  label = "Collector",
}: CollectorFieldProps<T>) {
  const { fetchCollectors, collectorOptions } = useReportFormContext();
  useEffect(() => {
    void getSession().then((session) => {
      const userId = Number(session?.user?.id);
      fetchCollectors(userId > 0 ? userId : 0);
    });
  }, [fetchCollectors]);

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
