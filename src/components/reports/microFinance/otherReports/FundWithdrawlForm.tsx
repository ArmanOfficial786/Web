"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import {
  FundWithdrawlFormValues,
  FundWithdrawlResponseExtended,
} from "@/app/(home)/(sidebar)/MicroFinance/OtherReports/FundWithdrawlReport/page";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

const reportModeOptions = [
  { value: "Summary", label: "Summary" },
  { value: "Detail", label: "Detail" },
];

interface FundWithdrawlFormProps {
  control: Control<FundWithdrawlFormValues>;
  handleSubmit: UseFormHandleSubmit<FundWithdrawlFormValues>;
  onSubmit: SubmitHandler<FundWithdrawlFormValues>;
  setValue: UseFormSetValue<FundWithdrawlFormValues>;
  reset: UseFormReset<FundWithdrawlFormValues>;
  reportState: FundWithdrawlResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function FundWithdrawlForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: FundWithdrawlFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
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
            Fund Withdrawl Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<FundWithdrawlFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name ──────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <OfficeNameField<FundWithdrawlFormValues>
              control={control}
              branchFieldName="branchIds"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Report Type">
              <RadioInput
                name="reportMode"
                control={control}
                radioOptions={reportModeOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Order By + Buttons ───────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OrderByField<FundWithdrawlFormValues>
              control={control}
              name="orderBy"
              reportKey="fund-withdrawl-report"
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
                <ViewReportButton<FundWithdrawlFormValues>
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
                    "branchIds",
                    "reportMode",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Box>

          <Divider sx={{ mb: 0.5 }} />
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
