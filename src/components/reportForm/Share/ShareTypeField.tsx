"use client";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/system/Box";
import { useEffect } from "react";
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";

interface ShareTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  shareTypeFieldName: Path<T>;
  setValue?: UseFormSetValue<T>;
  defaultShareTypeId?: number;
  label?: string;
}

export default function ShareTypeField<T extends FieldValues>({
  control,
  shareTypeFieldName,
  setValue,
  defaultShareTypeId,
  label = "Share Type",
}: ShareTypeFieldProps<T>) {
  const { fetchShareType, shareTypeOptions } = useReportFormContext();

  useEffect(() => {
    fetchShareType();
  }, [fetchShareType]);

  useEffect(() => {
    if (!setValue || defaultShareTypeId === undefined) return;
    const match = shareTypeOptions.find((s) => s.id === defaultShareTypeId);
    if (match) {
      setValue(shareTypeFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [shareTypeOptions, shareTypeFieldName, setValue, defaultShareTypeId]);

  return (
    <FieldRow label={label}>
      <Box sx={{ width: "100%" }}>
        <DropDown
          name={shareTypeFieldName}
          control={control}
          label={label}
          options={shareTypeOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
