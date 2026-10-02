"use client";

import DropDown from "@/components/form/DropDown";
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

interface AssetNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  assetFieldName: Path<T>;
  categoryFieldName: Path<T>;
  label?: string;
  defaultAssetId?: number;
}

const DEFAULT_ASSET_OPTIONS = [{ id: -1, name: "-- Select --" }];

export default function AssetNameField<T extends FieldValues>({
  control,
  setValue,
  assetFieldName,
  categoryFieldName,
  label = "Asset Name",
  defaultAssetId,
}: AssetNameFieldProps<T>) {
  const { assetOptionsMap, assetLoading, fetchAssets } = useReportFormContext();

  const selectedCategoryId = useWatch({
    control,
    name: categoryFieldName,
  }) as number | string | null | undefined;

  const categoryKey =
    selectedCategoryId != null && Number(selectedCategoryId) > 0
      ? String(selectedCategoryId)
      : "";

  const options: { id: number | string; name: string }[] = categoryKey
    ? (assetOptionsMap[categoryKey] ?? DEFAULT_ASSET_OPTIONS)
    : DEFAULT_ASSET_OPTIONS;

  const loading = categoryKey ? (assetLoading[categoryKey] ?? false) : false;

  const previousCategoryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!categoryKey) return;

    if (
      previousCategoryRef.current !== null &&
      previousCategoryRef.current !== categoryKey
    ) {
      setValue(assetFieldName, -1 as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
    previousCategoryRef.current = categoryKey;

    void fetchAssets(Number(categoryKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryKey, fetchAssets]);

  useEffect(() => {
    if (defaultAssetId === undefined) return;
    const match = options.find((o) => o.id === defaultAssetId);
    if (match) {
      setValue(assetFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, defaultAssetId]);

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={assetFieldName}
          control={control}
          label={label}
          options={options}
          fullWidth
          disabled={loading || !categoryKey}
        />
      </Box>
    </FieldRow>
  );
}
