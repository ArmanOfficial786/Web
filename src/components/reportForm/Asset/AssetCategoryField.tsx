// src/components/reportForm/Asset/AssetCategoryField.tsx
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

// ── Wire values for the type radio ────────────────────────────────────────────
export const ASSET_TYPE_FIXED = "F"; // Assets (default)
export const ASSET_TYPE_STOCK = "O"; // Stock

export const assetTypeOptions = [
  { value: ASSET_TYPE_FIXED, label: "Assets" },
  { value: ASSET_TYPE_STOCK, label: "Stock" },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface AssetCategoryFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  /** Field name for the selected category id (number) */
  categoryFieldName: Path<T>;
  /** Field name for the selected type ("F" | "O") */
  typeFieldName: Path<T>;
  /** Label shown above the category dropdown. Defaults to "Asset Category". */
  label?: string;
  /** Label shown above the type radio. Defaults to "Type". */
  typeLabel?: string;
  /** Optional: force a specific category as default once options load */
  defaultCategoryId?: number;
}

const DEFAULT_CATEGORY_OPTIONS = [{ id: -1, name: "-- Select --" }];

// ── Component ─────────────────────────────────────────────────────────────────
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

  // Never bail out on an empty type — fall back to the default so the API is
  // always called on mount / page reload.
  const effectiveType = selectedType || ASSET_TYPE_FIXED;

  const categoryOptions =
    assetCategoryOptionsMap[effectiveType] ?? DEFAULT_CATEGORY_OPTIONS;
  const loading = assetCategoryLoading[effectiveType] ?? false;

  // Tracks the last type we handled. Safe under React Strict Mode.
  const previousTypeRef = useRef<string | null>(null);

  // Seed the form value if it's empty so the radio and the API agree.
  useEffect(() => {
    if (!selectedType) {
      setValue(typeFieldName, ASSET_TYPE_FIXED as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Call the context fetch on mount / reload and whenever type changes ────
  // The context skips the network call if this type is already cached.
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

  // ── Optional default category once options are available ──────────────────
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
