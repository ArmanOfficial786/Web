// components/reports/memberAccount/PassbookVerificationSection.tsx
"use client";

import React, { useEffect, useRef } from "react";
import type {
  Control,
  Path,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { Box, Divider, Grid, Typography } from "@mui/material";
import DateInput from "@/components/form/DateInput";
import FieldRow from "@/utilis/FieldRow";
import StatementVerifyButton from "@/components/reportForm/Common/StatementVerificationButton";
import calendarService from "@/services/Common/ComCalendarService";
import type { DepositStatementFormValues } from "@/components/reports/memberAccount/DepositStatementForm";
import type { VerificationStatusDto } from "types/api/api";

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

  // WebForm behavior (both in btnViewReport_Click and after a successful
  // btnStatementVerify_Click):
  //   history exists -> ncpVerifiedDateTill = Max(VerifiedToDateOnBs),
  //                      lblVerifiedDetails = "Passbook Verified Till : X"
  //   no history      -> ncpVerifiedDateTill = today (BS),
  //                      lblVerifiedDetails = "No Verification Till Date"
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
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <FieldRow label="Statement Verified Till">
            <Box sx={{ width: "100%" }}>
              <DateInput
                name={
                  "statementVerifiedTill" as Path<DepositStatementFormValues>
                }
                control={control}
                dateType="BS"
              />
            </Box>
          </FieldRow>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="body2"
            sx={{ color: "#FF0000", fontWeight: 700, minHeight: 20 }}
          >
            {errorMessage ?? status?.message ?? ""}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            display="flex"
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
          >
            <StatementVerifyButton<DepositStatementFormValues>
              control={control}
              handleSubmit={handleSubmit}
              onVerify={onVerify}
              verifiedTillFieldName={
                "statementVerifiedTill" as Path<DepositStatementFormValues>
              }
              loading={verifying}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
