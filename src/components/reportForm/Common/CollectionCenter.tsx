"use client";

import React, { useEffect } from "react";
import {
  useWatch,
  type Control,
  type UseFormSetValue,
  type FieldValues,
  type Path,
} from "react-hook-form";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";

// ── Props ─────────────────────────────────────────────────────────────────────
interface CollectionCenterFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  branchFieldName: Path<T>;
  collectionCenterFieldName: Path<T>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CollectionCenterField<T extends FieldValues>({
  control,
  setValue,
  branchFieldName,
  collectionCenterFieldName,
}: CollectionCenterFieldProps<T>) {
  const { fetchCollectionCenters, collectionCenterOptions } =
    useReportFormContext();

  // ✅ cast to unknown first, then to a safe primitive type
  const rawBranchId = useWatch({ control, name: branchFieldName });
  const selectedBranchId = rawBranchId as number | string | undefined;

  useEffect(() => {
    const id = Number(selectedBranchId ?? 0); // ← guaranteed number, never NaN
    setValue(collectionCenterFieldName, 0 as any);
    if (!id || id === 0) {
      // don't bother fetching — reset is enough
      return;
    }

    fetchCollectionCenters(id);
  }, [
    selectedBranchId,
    fetchCollectionCenters,
    setValue,
    collectionCenterFieldName,
  ]);

  return (
    <FieldRow label="Collection Center">
      <DropDown
        name={collectionCenterFieldName}
        control={control}
        label="Collection Center"
        options={collectionCenterOptions}
        fullWidth
      />
    </FieldRow>
  );
}
