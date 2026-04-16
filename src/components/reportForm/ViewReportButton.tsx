"use client";

import React from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import Button from "@mui/material/Button";

import type { FormInputs } from "@/components/reports/memberReport/MemberIdCard";

// ── Props ─────────────────────────────────────────────────────────────────────
interface ViewReportButtonProps {
  control: Control<FormInputs>;
  handleSubmit: UseFormHandleSubmit<FormInputs>;
  onSubmit: SubmitHandler<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  loading: boolean;
  onBeforeSubmit?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ViewReportButton({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  loading,
  onBeforeSubmit,
}: ViewReportButtonProps) {
  // Watch memberId reactively so we can detect when it has a value
  const memberId = useWatch({ control, name: "memberId" });

  const handleClick = () => {
    // If a member is selected via lookup, date fields are not required —
    // clear them from the payload so the API only filters by memberId.
    if (memberId) {
      setValue("fromDate", "");
      setValue("tillDate", "");
    }
    onBeforeSubmit?.();
    handleSubmit(onSubmit)();
  };

  return (
    <Button
      variant="contained"
      size="small"
      disabled={loading}
      onClick={handleClick}
      sx={{ whiteSpace: "nowrap", height: 36 }}
    >
      {loading ? "Loading..." : "View Report"}
    </Button>
  );
}
