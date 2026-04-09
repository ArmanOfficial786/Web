"use client";

import React, { useEffect } from "react";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import DropDown from "@/components/form/DropDown";
import { useReportForm } from "@/contexts/ReportFormContext";
import type { FormInputs } from "@/components/reports/memberReport/MemberIdCard";

// ── FieldRow ──────────────────────────────────────────────────────────────────
function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 40 }}>
      <Typography
        sx={{
          width: 110,
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 500,
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface CollectionCenterFieldProps {
  control: Control<FormInputs>;
  setValue: UseFormSetValue<FormInputs>; // ✅ passed as prop, no FormProvider needed
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CollectionCenterField({
  control,
  setValue,
}: CollectionCenterFieldProps) {
  const { collectionCenterOptions, fetchCollectionCenters } = useReportForm();

  const selectedBranchId = useWatch({ control, name: "branchId" });

  useEffect(() => {
    const id = Number(selectedBranchId);
    // Reset collection center selection whenever branch changes
    setValue("collectionCenterId", 0);
    fetchCollectionCenters(id);
  }, [selectedBranchId, fetchCollectionCenters, setValue]);

  return (
    <FieldRow label="Collection Center">
      <DropDown
        name="collectionCenterId"
        control={control}
        label="Collection Center"
        options={collectionCenterOptions}
        fullWidth
      />
    </FieldRow>
  );
}
