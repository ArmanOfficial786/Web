// components/reports/memberAccount/InterestPayableReport/SavingAccountNextInterestTransferForm.tsx
"use client";

import React, { useEffect, useRef } from "react";
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
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import Preloader from "@/components/PreLoader/preloader";
import {
  SavingAccountNextInterestTransferFormValues,
  SavingAccountNextInterestTransferResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/InterestPayableReport/SavingsAccountNextInterestTransferReport/page";

export type { ReportFormat };

interface SavingAccountNextInterestTransferFormProps {
  control: Control<SavingAccountNextInterestTransferFormValues>;
  handleSubmit: UseFormHandleSubmit<SavingAccountNextInterestTransferFormValues>;
  onSubmit: SubmitHandler<SavingAccountNextInterestTransferFormValues>;
  setValue: UseFormSetValue<SavingAccountNextInterestTransferFormValues>;
  reset: UseFormReset<SavingAccountNextInterestTransferFormValues>;
  reportState: SavingAccountNextInterestTransferResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function SavingAccountNextInterestTransferForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: SavingAccountNextInterestTransferFormProps) {
  const { blobUrl, isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(blobUrl);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

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
            backdropFilter: "blur(3px)",
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
            Saving Account Next Interest Transfer Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<SavingAccountNextInterestTransferFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Same Company ───────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<SavingAccountNextInterestTransferFormValues>
              control={control}
              branchFieldName="branchIds"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear ───────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<SavingAccountNextInterestTransferFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "fromDateBs",
                    "toDateBs",
                    "branchName",
                    "branchIds",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ── Report Navigation and PDF Viewer ────────────────────────────── */}
        {showReport && (
          <ReportNavigation
            pdfData={blobUrl ?? ""}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onDownload={onDownload}
          />
        )}

        {showReport && (
          <Box sx={{ position: "relative", isolation: "isolate", zIndex: 1 }}>
            <Box
              ref={reportRef}
              sx={{
                position: "relative",
                height: "1000px",
                overflow: "hidden",
              }}
            >
              <embed
                key={blobUrl}
                src={`${blobUrl}#page=${currentPage}&toolbar=0&zoom=100`}
                style={{
                  position: "absolute",
                  top: "-40px",
                  left: 0,
                  width: "100%",
                  height: "calc(100% + 40px)",
                  border: "none",
                  zIndex: 0,
                }}
              />
            </Box>

            {/* Jump to first page of the report / last page if already on first */}
            <ScrollToFirstPageButton
              onClick={() => {
                if (currentPage <= 1) {
                  onPageChange(totalPages);
                } else {
                  onPageChange(1);
                }
              }}
              currentPage={currentPage}
              totalPages={totalPages}
              hideWhenSinglePage={true}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(SavingAccountNextInterestTransferForm);
