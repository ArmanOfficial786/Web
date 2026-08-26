"use client";

import React, { useEffect, useRef } from "react";
import type {
  Control,
  Path,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { Box, Divider, Stack, Typography } from "@mui/material";
import DateInput from "@/components/form/DateInput";
import StatementVerifyButton from "@/components/reportForm/Common/StatementVerificationButton";
import calendarService from "@/services/Common/ComCalendarService";
import type { DepositStatementFormValues } from "@/components/reports/memberAccount/DepositStatementForm";
import { VerificationStatusDto } from "../../../../types/api/api";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

interface PassbookVerificationSectionProps {
  control: Control<DepositStatementFormValues>;
  setValue: UseFormSetValue<DepositStatementFormValues>;
  handleSubmit: UseFormHandleSubmit<DepositStatementFormValues>;
  onVerify: SubmitHandler<DepositStatementFormValues>;
  visible: boolean; // mirrors trStatementVerify.Visible
  status: VerificationStatusDto | null;
  verifying: boolean;
  errorMessage?: string; // mirrors trMessage/ltrMessage for the verify action
}

export default function PassbookVerificationSection({
  control,
  setValue,
  handleSubmit,
  onVerify,
  visible,
  status,
  verifying,
  errorMessage,
}: PassbookVerificationSectionProps) {
  const seededForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!visible || !status) return;
    const key = `${status.hasVerification ?? false}|${status.verifiedTillBs ?? ""}`;
    if (seededForRef.current === key) return;
    seededForRef.current = key;

    if (status.hasVerification && status.verifiedTillBs) {
      setValue("statementVerifiedTill", status.verifiedTillBs, {
        shouldValidate: false,
      });
    } else {
      calendarService
        .getTodayBs()
        .then((t) => {
          setValue(
            "statementVerifiedTill",
            `${t.year}-${pad2(t.month)}-${pad2(t.day)}`,
            { shouldValidate: false },
          );
        })
        .catch(() => {});
    }

    setValue(
      "passbookVerifiedTill",
      status.message ?? "No Verification Till Date",
      { shouldValidate: false },
    );
  }, [visible, status, setValue]);

  if (!visible) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Divider sx={{ mb: 1 }} />
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
      >
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
        >
          Statement Verified Till
        </Typography>

        <Box sx={{ minWidth: 220 }}>
          <DateInput
            name={"statementVerifiedTill" as Path<DepositStatementFormValues>}
            control={control}
            dateType="BS"
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "#FF0000", fontWeight: 700, whiteSpace: "nowrap" }}
        >
          {errorMessage ?? status?.message ?? ""}
        </Typography>

        <Box sx={{ ml: { xs: 0, md: "auto" } }}>
          <StatementVerifyButton<DepositStatementFormValues>
            control={control}
            handleSubmit={handleSubmit}
            onVerify={onVerify}
            verifiedTillFieldName={
              "statementVerifiedTill" as Path<DepositStatementFormValues>
            }
            loading={verifying}
            sx={{ height: 26, fontSize: "0.7rem", px: 1.5 }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
