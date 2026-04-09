"use client";

import React from "react";
import type { UseFormReset, UseFormSetValue } from "react-hook-form";
import Button from "@mui/material/Button";

import { useReportForm } from "@/contexts/ReportFormContext";
import type { FormInputs } from "@/components/reports/memberReport/MemberIdCard";

// ── Default blank values ──────────────────────────────────────────────────────
const EMPTY_FORM: FormInputs = {
  memberId: "",
  memberName: "",
  fromDate: "",
  tillDate: "",
  branchId: 0,
  collectionCenterId: 0,
  groupId: 0,
  orderBy: 0,
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface ClearFormButtonProps {
  reset: UseFormReset<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ClearFormButton({
  reset,
  setValue,
}: ClearFormButtonProps) {
  const { resetFormFields, setSelectedMember } = useReportForm();

  const handleClear = () => {
    // Step 1 — reset RHF internal state
    reset(EMPTY_FORM);

    // Step 2 — explicitly setValue each field so useWatch fires in
    //          child components and cascade dropdowns re-render
    (Object.keys(EMPTY_FORM) as (keyof FormInputs)[]).forEach((key) => {
      setValue(key, EMPTY_FORM[key]);
    });

    // Step 3 — reset context cascade options back to "-- Select --"
    resetFormFields();

    // Step 4 — clear member lookup selection
    setSelectedMember(null);
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      onClick={handleClear}
      sx={{ whiteSpace: "nowrap", height: 36 }}
    >
      Clear
    </Button>
  );
}
