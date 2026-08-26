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
import type { SxProps, Theme } from "@mui/material/styles";
import SubmitButton from "@/components/form/SubmitButton";

// ── Props ─────────────────────────────────────────────────────────────────
interface StatementVerifyButtonProps<T extends FieldValues> {
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onVerify: SubmitHandler<T>;
  verifiedTillFieldName: Path<T>;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

export default function StatementVerifyButton<T extends FieldValues>({
  control,
  handleSubmit,
  onVerify,
  verifiedTillFieldName,
  loading = false,
  sx,
}: StatementVerifyButtonProps<T>) {
  const verifiedTillBs = useWatch({
    control,
    name: verifiedTillFieldName,
  }) as string | undefined;

  const handleClick = () => {
    handleSubmit(
      (data) => onVerify(data),
      () => {},
    )();
  };

  return (
    <SubmitButton
      type="button"
      variant="contained"
      size="small"
      color="primary"
      loading={loading}
      disabled={!verifiedTillBs}
      onClick={handleClick}
      sx={{ whiteSpace: "nowrap", height: 30, width: 150, ...sx }}
    >
      {loading ? "Updating..." : "Statement Verified"}
    </SubmitButton>
  );
}
