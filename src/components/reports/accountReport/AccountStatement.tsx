"use client";

import React, { useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ReportTypeField from "@/components/reportForm/Account/ReportType";
import TransactionTypeField from "@/components/reportForm/Account/TransactionType";
import { AccountStatementRequest } from "types/api/api";
import type { ReportState } from "@/utilis/Constants/reportConstants";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import Preloader from "@/components/PreLoader/preloader";

export type { ReportFormat };

interface AccountStatementProps {
  control: Control<AccountStatementRequest>;
  handleSubmit: UseFormHandleSubmit<AccountStatementRequest>;
  onSubmit: SubmitHandler<AccountStatementRequest>;
  setValue: UseFormSetValue<AccountStatementRequest>;
  reset: UseFormReset<AccountStatementRequest>;
  reportState: ReportState;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  isDownloading?: boolean;
}

export default function AccountStatement({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reset,
  reportState,
  onPageChange,
  onDownload,
  isDownloading = false,
}: AccountStatementProps) {
  const { loading, reportLoaded, pdfData, currentPage, totalPages } =
    reportState;

  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () => {
    reportRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* ── GLOBAL PRELOADER — true viewport center ─────────────────────── */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(3px)",
          }}
        >
          <Preloader />
        </Box>
      )}

      {/* ── PAGE CONTENT ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* ── FORM ───────────────────────────────────────────────────────── */}
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
          >
            Account Statement Report
          </Typography>
          <Divider sx={{ mb: 1.5 }} />

          <Box sx={{ mb: 1 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 1.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 1,
            }}
          >
            <OfficeNameField<AccountStatementRequest>
              control={control}
              branchFieldName="branchId"
            />
            <ReportTypeField<AccountStatementRequest>
              control={control}
              name="reportType"
            />
          </Box>
          <Divider sx={{ mb: 1.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 1,
            }}
          >
            <TransactionTypeField<AccountStatementRequest>
              control={control}
              name="transactionType"
            />
            <OrderByField<AccountStatementRequest>
              control={control}
              name="orderBy"
              reportKey="savingTypeWiseBalance"
            />
          </Box>
          <Divider sx={{ mb: 1.5 }} />

          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<AccountStatementRequest>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={loading}
                  onBeforeSubmit={scrollToReport}
                />
                <ClearFormButton
                  reset={reset}
                  setValue={setValue}
                  clearFields={[
                    "fromDate",
                    "toDate",
                    "branchId",
                    "reportType",
                    "transactionType",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
        {reportLoaded && (
          <ReportNavigation
            pdfData={pdfData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onDownload={onDownload}
            isDownloading={isDownloading}
          />
        )}

        {/* ── REPORT AREA — renders immediately when data is ready ────────── */}
        {reportLoaded && pdfData && (
          <Box ref={reportRef} sx={{ width: "100%", overflow: "auto" }}>
            <iframe
              src={`data:application/pdf;base64,${pdfData}#zoom=155`}
              style={{
                width: "100%",
                height: "1000px",
                border: "none",
                display: "block",
                margin: "0 auto",
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
