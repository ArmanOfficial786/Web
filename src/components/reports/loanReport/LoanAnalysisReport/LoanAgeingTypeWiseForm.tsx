"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";

import {
  LoanAgeingTypeWiseFormValues,
  LoanAgeingTypeWiseResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAnalysisReport/LoanAgingTypeWiseReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SoleSelectGroupField from "@/components/reportForm/Common/SoleSelectGroupField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { loanAnalysisReportTypeOptions as reportTypeOptions } from "@/config/LoanReportOptions";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

interface LoanAgeingTypeWiseFormProps {
  control: Control<LoanAgeingTypeWiseFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanAgeingTypeWiseFormValues>;
  onSubmit: SubmitHandler<LoanAgeingTypeWiseFormValues>;
  setValue: UseFormSetValue<LoanAgeingTypeWiseFormValues>;
  reportState: LoanAgeingTypeWiseResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function LoanAgeingTypeWiseForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: LoanAgeingTypeWiseFormProps) {
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
            Loan Ageing Type Wise Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Till Date ────────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <DateFields<LoanAgeingTypeWiseFormValues>
              control={control}
              toDateName="tillDateBs"
              toDateLabel="Till Date"
              mode="BS"
              showFromDate={false}
            />
            <OfficeNameField<LoanAgeingTypeWiseFormValues>
              control={control}
              branchFieldName="branchIds"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Sole Select Group + With Member ──────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
              alignItems: "center",
            }}
          >
            <SoleSelectGroupField<LoanAgeingTypeWiseFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              groupFieldName="memberGroupId"
            />
            <FieldRow label="">
              <CheckboxInput
                name="withMemberCount"
                control={control}
                label="With Member"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Report Type">
              <RadioInput
                name="reportType"
                control={control}
                radioOptions={reportTypeOptions}
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
            <OrderByField<LoanAgeingTypeWiseFormValues>
              control={control}
              name="orderBy"
              reportKey="loan-ageing-type-wise-report"
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
                <ViewReportButton<LoanAgeingTypeWiseFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "tillDateBs",
                    "branchIds",
                    "memberGroupId",
                    "withMemberCount",
                    "reportType",
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
