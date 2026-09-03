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
interface BranchCollectionFieldProps<T extends FieldValues> {
  control: Control<T>;
  branchFieldName: Path<T>; // ✅ configurable, no hardcoded field name
  label: string; // ✅ configurable, no hardcoded label — set by the consuming form
  setValue?: UseFormSetValue<T>; // optional — only needed if you want a default selection
  defaultBranchId?: number; // optional, no default here (unlike BranchNameField)
}

// ── Component ─────────────────────────────────────────────────────────────────
// Reads collectionBranchOptions / fetchCollectionBranches straight from
// ReportFormContext. The actual GET /api/Branch/GetCollectionBranch call is
// guarded there by collectionBranchFetchedRef, so calling fetchCollectionBranches()
// here on every mount is safe — it's a no-op after the very first successful call,
// exactly like fetchBranches() is for BranchNameField above.
export default function BranchCollectionField<T extends FieldValues>({
  control,
  branchFieldName,
  label,
  setValue,
  defaultBranchId,
}: BranchCollectionFieldProps<T>) {
  const { fetchCollectionBranches, collectionBranchOptions } =
    useReportFormContext();

  useEffect(() => {
    fetchCollectionBranches();
  }, [fetchCollectionBranches]);

  // ── Set default once options are available (only if requested) ────────────
  useEffect(() => {
    if (!setValue || defaultBranchId === undefined) return;
    if (!collectionBranchOptions?.length) return;

    const match = collectionBranchOptions.find((b) => b.id === defaultBranchId);
    if (match) {
      setValue(branchFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [collectionBranchOptions, branchFieldName, setValue, defaultBranchId]);

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={branchFieldName}
          control={control}
          label={label}
          options={collectionBranchOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
