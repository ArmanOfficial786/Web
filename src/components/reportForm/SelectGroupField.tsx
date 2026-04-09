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
interface SelectGroupFieldProps {
  control: Control<FormInputs>;
  setValue: UseFormSetValue<FormInputs>; // ✅ prop instead of useFormContext
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SelectGroupField({
  control,
  setValue,
}: SelectGroupFieldProps) {
  const { memberGroupOptions, fetchMemberGroups } = useReportForm();

  const selectedBranchId = useWatch({ control, name: "branchId" });
  const selectedCollectionCenterId = useWatch({
    control,
    name: "collectionCenterId",
  });

  useEffect(() => {
    const branchId = Number(selectedBranchId);
    const collectionCenterId = Number(selectedCollectionCenterId);
    // Reset group selection whenever collection center changes
    setValue("groupId", 0);
    fetchMemberGroups(branchId, collectionCenterId);
  }, [
    selectedBranchId,
    selectedCollectionCenterId,
    fetchMemberGroups,
    setValue,
  ]);

  return (
    <FieldRow label="Select Group">
      <DropDown
        name="groupId"
        control={control}
        label="Select Group"
        options={memberGroupOptions}
        fullWidth
      />
    </FieldRow>
  );
}
