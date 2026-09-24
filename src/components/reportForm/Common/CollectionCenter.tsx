"use client";

import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import { Box } from "@mui/system";
import { useEffect } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from "react-hook-form";

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
    const id = Number(selectedBranchId ?? -1); // ← guaranteed number, never NaN
    setValue(collectionCenterFieldName, -1 as any); // reset collection center when branch changes
    if (!id || id === -1) {
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
      <Box>
        <DropDown
          name={collectionCenterFieldName}
          control={control}
          label="Collection Center"
          options={collectionCenterOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
