"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";

import {
  LoanInstallmentDueACClosingFormValues,
  LoanInstallmentDueACClosingResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAccountWiseReport/LoanInstallmentDueACClosingReport/page";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { createLoanAccountLookupConfig } from "@/config/loanAccountLookupConfig";
import {
  asNoDateOptions,
  interestTypeOptions,
} from "@/config/LoanReportOptions";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

interface LoanInstallmentDueACClosingFormProps {
  control: Control<LoanInstallmentDueACClosingFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanInstallmentDueACClosingFormValues>;
  onSubmit: SubmitHandler<LoanInstallmentDueACClosingFormValues>;
  setValue: UseFormSetValue<LoanInstallmentDueACClosingFormValues>;
  reportState: LoanInstallmentDueACClosingResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function LoanInstallmentDueACClosingForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: LoanInstallmentDueACClosingFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const loanConfig = useMemo(
    () =>
      createLoanAccountLookupConfig<LoanInstallmentDueACClosingFormValues>(),
    [],
  );

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

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
            Loan Installment Due A/C Closing Report
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {/* ── Account Directory Lookup ─────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={loanConfig}
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── Till Date + From Date ────────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <DateFields<LoanInstallmentDueACClosingFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="tillDateBs"
              mode="BS"
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── As On Date ──────────────────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <FieldRow label="As On Date">
              <RadioInput
                name="asNoDate"
                control={control}
                radioOptions={asNoDateOptions}
                row
              />
            </FieldRow>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── Interest Type ───────────────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <FieldRow label="Interest Type">
              <RadioInput
                name="interestType"
                control={control}
                radioOptions={interestTypeOptions}
                row
              />
            </FieldRow>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── View Report | Clear ─────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
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
                <ViewReportButton<LoanInstallmentDueACClosingFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "accountNo",
                    "memberId",
                    "memberName",
                    "fromDateBs",
                    "tillDateBs",
                    "asNoDate",
                    "interestType",
                    "branchIds",
                    "branchName",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {showReport && (
          <ReportNavigation
            pdfData={pdfData ?? ""}
            currentPage={currentPage}
            totalPages={totalPages}
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
              src={`${pdfData}#page=${currentPage}&toolbar=0&zoom=100`}
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
