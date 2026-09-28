"use client";

import DropDown from "@/components/form/DropDown";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/system/Box";
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";

// ── Static options ────────────────────────────────────────────────────────────
// ⚠️ Confirm the exact labels / wire values with backend.
export const REMITTANCE_SERVICE_TYPE_OPTIONS: {
  id: string;
  name: string;
}[] = [
  { id: "-1", name: "-- Select --" },
  { id: "online", name: "Online" },
  { id: "offline", name: "Offline" },
];

interface RemittanceServiceTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  serviceTypeFieldName: Path<T>;
  setValue?: UseFormSetValue<T>; // optional — only needed for a default selection
  defaultServiceTypeId?: string; // optional, no forced default here
  label?: string; // configurable, defaults to "Remittance Service Type"
}

export default function RemittanceServiceTypeField<T extends FieldValues>({
  control,
  serviceTypeFieldName,
  setValue,
  defaultServiceTypeId,
  label = "Remittance Service Type",
}: RemittanceServiceTypeFieldProps<T>) {
  // ── Set default once on mount (only if requested) ─────────────────────────
  if (
    setValue &&
    defaultServiceTypeId !== undefined &&
    REMITTANCE_SERVICE_TYPE_OPTIONS.some((o) => o.id === defaultServiceTypeId)
  ) {
    setValue(
      serviceTypeFieldName,
      defaultServiceTypeId as PathValue<T, Path<T>>,
      { shouldDirty: false, shouldValidate: false },
    );
  }

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={serviceTypeFieldName}
          control={control}
          label={label}
          options={REMITTANCE_SERVICE_TYPE_OPTIONS}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
