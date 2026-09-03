"use client";

import React, { useMemo, useRef, useEffect } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  Path,
} from "react-hook-form";
import { Grid, Box, Paper, Typography, Divider } from "@mui/material";
import CheckboxInput from "@/components/form/CheckboxInput";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import DateFieldsTwoWay from "@/components/reportForm/Common/DateFieldsTwoWay";
import { createAccountLookupConfig } from "@/config/AccountLookupConfig";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import { LanguageSwitch } from "./LanguageSwitch";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import Preloader from "@/components/PreLoader/preloader";
import PassbookVerificationSection from "@/components/reportForm/Common/PassbookVerificationSection";

import type { AccountLookUpDtos, VerificationStatusDto } from "types/api/api";
import type { DepositStatementResponseExtended } from "@/app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/DepositStatementReport/page";

export type { ReportFormat };

export interface DepositStatementFormValues {
  accountNo?: string;
  memberId?: string;
  memberName?: string;
  fromDate?: string;
  toDate?: string;
  fromDateAd?: string;
  toDateAd?: string;
  entryBy?: boolean;
  valueDate?: boolean;
  sameCompanyName?: boolean;
  customNarration?: boolean;
  visualReport?: boolean;
  viewInterest?: boolean;
  nepaliDate?: boolean;
  englishDate?: boolean;
  generateInterest?: boolean;
  billNumber?: boolean;
  language?: "English" | "Nepali";
  statementVerifiedTill?: string;
  passbookVerifiedTill?: string;
}

interface DepositStatementFormProps {
  control: Control<DepositStatementFormValues>;
  handleSubmit: UseFormHandleSubmit<DepositStatementFormValues>;
  onSubmit: SubmitHandler<DepositStatementFormValues>;
  setValue: UseFormSetValue<DepositStatementFormValues>;
  reportState: DepositStatementResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onAccountSelect: (record: AccountLookUpDtos) => void;

  // ── Passbook verification (new) ───────────────────────────────────────
  verificationStatus: VerificationStatusDto | null;
  verifying: boolean;
  verifyErrorMessage?: string;
  onVerifyStatement: SubmitHandler<DepositStatementFormValues>;
}

export default function DepositStatementForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  onAccountSelect,
  verificationStatus,
  verifying,
  verifyErrorMessage,
  onVerifyStatement,
}: DepositStatementFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

  const accountConfig = useMemo(
    () => createAccountLookupConfig<DepositStatementFormValues>(),
    [],
  );

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(2px)",
          }}
        >
          <Preloader />
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
          >
            Deposit Statement Report
          </Typography>
          <Divider sx={{ mb: 1 }} />

          <Box sx={{ mb: 1 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={accountConfig}
              onSelect={onAccountSelect}
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Box sx={{ mb: 1 }}>
            <DateFieldsTwoWay<DepositStatementFormValues>
              control={control}
              setValue={setValue}
              fromDateName={"fromDate" as Path<DepositStatementFormValues>}
              toDateName={"toDate" as Path<DepositStatementFormValues>}
              fromDateADName={"fromDateAd" as Path<DepositStatementFormValues>}
              toDateADName={"toDateAd" as Path<DepositStatementFormValues>}
              fromDateLabel="From Date"
              toDateLabel="To Date"
              fromDateADLabel="From Date (AD)"
              toDateADLabel="To Date (AD)"
            />
          </Box>

          <Divider sx={{ mb: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-around", gap: 1 }}>
            <Box>
              <CheckboxInput
                name="viewInterest"
                control={control}
                label="View Interest"
                size="small"
              />
            </Box>
            <Box>
              <CheckboxInput
                name="entryBy"
                control={control}
                label="Entry By"
                size="small"
              />
            </Box>
            <Box>
              <CheckboxInput
                name="generateInterest"
                control={control}
                label="Generate Interest"
                size="small"
              />
            </Box>
            <Box>
              <CheckboxInput
                name="billNumber"
                control={control}
                label="Bill Number"
                size="small"
              />
            </Box>
          </Box>
          <Divider sx={{ mb: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "space-around", gap: 1 }}>
            <Box>
              <CheckboxInput
                name="sameCompanyName"
                control={control}
                label="Same Company Name"
                size="small"
              />
            </Box>
            <Box>
              <CheckboxInput
                name="valueDate"
                control={control}
                label="Value Date"
                size="small"
              />
            </Box>
            <Box>
              <CheckboxInput
                name="nepaliDate"
                control={control}
                label="Nepali Date"
                size="small"
              />
            </Box>
            <Box>
              <CheckboxInput
                name="englishDate"
                control={control}
                label="English Date"
                size="small"
              />
            </Box>
          </Box>
          <Divider sx={{ mb: 1 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              gap: 2,
            }}
          >
            <LanguageSwitch control={control} name="language" />
            <VisualReportSwitch control={control} name="visualReport" />
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Grid container spacing={1} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  width: "100%",
                }}
              >
                <ViewReportButton<DepositStatementFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={["accountNo", "memberId", "memberName"]}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Statement Verified Till / Passbook status — matches trStatementVerify,
              only rendered once a report has successfully been generated. */}
          <PassbookVerificationSection
            control={control}
            setValue={setValue}
            handleSubmit={handleSubmit}
            onVerify={onVerifyStatement}
            visible={showReport}
            status={verificationStatus}
            verifying={verifying}
            errorMessage={verifyErrorMessage}
          />
        </Paper>

        {showReport && (
          <ReportNavigation
            pdfData={pdfData ?? ""}
            currentPage={pagination?.currentPage ?? 1}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={onPageChange}
            onDownload={onDownload}
          />
        )}

        {showReport && (
          <Box
            ref={reportRef}
            sx={{ position: "relative", height: "1000px", overflow: "hidden" }}
          >
            <embed
              key={pdfData}
              src={`${pdfData}#page=${pagination?.currentPage ?? 1}&toolbar=0&zoom=100`}
              style={{
                position: "absolute",
                top: "-40px",
                left: 0,
                width: "100%",
                height: "calc(100% + 40px)",
                border: "none",
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
