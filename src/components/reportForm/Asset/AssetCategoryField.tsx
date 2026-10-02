"use client";

import DropDown from "@/components/form/DropDown";
import RadioInput from "@/components/form/RadioInput";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/system/Box";
import { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormSetValue,
} from "react-hook-form";

export const ASSET_TYPE_FIXED = "F";
export const ASSET_TYPE_STOCK = "O";

export const assetTypeOptions = [
  { value: ASSET_TYPE_FIXED, label: "Assets" },
  { value: ASSET_TYPE_STOCK, label: "Stock" },
];

interface AssetCategoryFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  categoryFieldName: Path<T>;
  typeFieldName: Path<T>;
  label?: string;
  typeLabel?: string;
  defaultCategoryId?: number;
}

const DEFAULT_CATEGORY_OPTIONS = [{ id: -1, name: "-- Select --" }];

export default function AssetCategoryField<T extends FieldValues>({
  control,
  setValue,
  categoryFieldName,
  typeFieldName,
  label = "Asset Category",
  typeLabel = "Type",
  defaultCategoryId,
}: AssetCategoryFieldProps<T>) {
  const {
    assetCategoryOptionsMap,
    assetCategoryLoading,
    fetchAssetCategories,
  } = useReportFormContext();

  const selectedType = useWatch({ control, name: typeFieldName }) as
    | string
    | undefined;

  const effectiveType = selectedType || ASSET_TYPE_FIXED;

  const categoryOptions =
    assetCategoryOptionsMap[effectiveType] ?? DEFAULT_CATEGORY_OPTIONS;
  const loading = assetCategoryLoading[effectiveType] ?? false;

  const previousTypeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedType) {
      setValue(typeFieldName, ASSET_TYPE_FIXED as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      previousTypeRef.current !== null &&
      previousTypeRef.current !== effectiveType
    ) {
      setValue(categoryFieldName, -1 as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
    previousTypeRef.current = effectiveType;

    void fetchAssetCategories(effectiveType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveType, fetchAssetCategories]);

  useEffect(() => {
    if (defaultCategoryId === undefined) return;
    const match = categoryOptions.find((o) => o.id === defaultCategoryId);
    if (match) {
      setValue(categoryFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryOptions, defaultCategoryId]);

  return (
    <>
      {/* ── Type radio ────────────────────────────────────────────────── */}
      <FieldRow label={typeLabel}>
        <RadioInput
          name={typeFieldName}
          control={control}
          radioOptions={assetTypeOptions}
          row
        />
      </FieldRow>

      {/* ── Category dropdown ─────────────────────────────────────────── */}
      <FieldRow label={label}>
        <Box>
          <DropDown
            name={categoryFieldName}
            control={control}
            label={label}
            options={categoryOptions}
            fullWidth
            disabled={loading}
          />
        </Box>
      </FieldRow>
    </>
  );
}
