// components/reportForm/Common/StatementVerifyButton.tsx
"use client";

import React from "react";
import type {
  Control,
  FieldValues,
  Path,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import Button from "@mui/material/Button";

// ── Props ─────────────────────────────────────────────────────────────────
interface StatementVerifyButtonProps<T extends FieldValues> {
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onVerify: SubmitHandler<T>;
  verifiedTillFieldName: Path<T>;
  loading?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────
// Deliberately built like ViewReportButton: reuses the SAME react-hook-form
// handleSubmit() so the payload always reflects the live form state
// (accountNo, fromDate, statementVerifiedTill) — no separate state to fall
// out of sync. Disabled while statementVerifiedTill is empty, matching the
// WebForm's ncpVerifiedDateTill RequiredValidation.
export default function StatementVerifyButton<T extends FieldValues>({
  control,
  handleSubmit,
  onVerify,
  verifiedTillFieldName,
  loading = false,
}: StatementVerifyButtonProps<T>) {
  const verifiedTillBs = useWatch({
    control,
    name: verifiedTillFieldName,
  }) as string | undefined;

  const handleClick = () => {
    handleSubmit(
      (data) => onVerify(data),
      () => {}, // invalid — do nothing, same as ViewReportButton
    )();
  };

  return (
    <Button
      variant="contained"
      size="small"
      color="primary"
      disabled={loading || !verifiedTillBs}
      onClick={handleClick}
      sx={{ whiteSpace: "nowrap", height: 30 }}
    >
      {loading ? "Updating..." : "Statement Verified Update"}
    </Button>
  );
}
