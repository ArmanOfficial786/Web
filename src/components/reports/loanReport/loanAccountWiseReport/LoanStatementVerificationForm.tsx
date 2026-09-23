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
  LoanStatementVerificationFormValues,
  LoanStatementVerificationResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAccountWiseReport/LoanStatementVerificationReport/page";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import type { AccountLookUpDtos } from "types/api/api";

export type { ReportFormat };

interface LoanStatementVerificationFormProps {
  control: Control<LoanStatementVerificationFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanStatementVerificationFormValues>;
  onSubmit: SubmitHandler<LoanStatementVerificationFormValues>;
  setValue: UseFormSetValue<LoanStatementVerificationFormValues>;
  reportState: LoanStatementVerificationResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onMemberSelect: (record: AccountLookUpDtos) => void;
}

export default function LoanStatementVerificationForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  onMemberSelect,
}: LoanStatementVerificationFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<LoanStatementVerificationFormValues>(),
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
            Loan Statement Verification Report
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {/* ── Member Directory Lookup ──────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={memberLookupConfig}
              onSelect={onMemberSelect}
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <DateFields<LoanStatementVerificationFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── Office Name ──────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<LoanStatementVerificationFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <Collector<LoanStatementVerificationFormValues>
              control={control}
              collectorFieldName="collectorId"
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── Order By + Buttons ───────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OrderByField<LoanStatementVerificationFormValues>
              control={control}
              name="orderBy"
              reportKey="loan-statement-verification-report"
            />
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
                <ViewReportButton<LoanStatementVerificationFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "memberRegistrationId",
                    "memberId",
                    "memberName",
                    "fromDateBs",
                    "toDateBs",
                    "branchIds",
                    "collectorId",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Box>

          <Divider sx={{ mb: 1 }} />
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
