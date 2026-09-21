"use client";
import React, { useEffect } from "react";
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import Box from "@mui/system/Box";

// ── Props ─────────────────────────────────────────────────────────────────────
interface MemberTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  memberTypeFieldName: Path<T>;
  setValue?: UseFormSetValue<T>; // optional — only needed for a default selection
  defaultMemberTypeId?: number; // optional, no default here
  label?: string; // configurable, defaults to "Member Type"
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MemberTypeField<T extends FieldValues>({
  control,
  memberTypeFieldName,
  setValue,
  defaultMemberTypeId,
  label = "Member Type",
}: MemberTypeFieldProps<T>) {
  const { fetchMemberTypes, memberTypeOptions } = useReportFormContext();

  useEffect(() => {
    fetchMemberTypes();
  }, [fetchMemberTypes]);

  // ── Set default once options are available (only if requested) ────────────
  useEffect(() => {
    if (!setValue || defaultMemberTypeId === undefined) return;
    if (!memberTypeOptions?.length) return;

    const match = memberTypeOptions.find((m) => m.id === defaultMemberTypeId);
    if (match) {
      setValue(memberTypeFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [memberTypeOptions, memberTypeFieldName, setValue, defaultMemberTypeId]);

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={memberTypeFieldName}
          control={control}
          label={label}
          options={memberTypeOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
