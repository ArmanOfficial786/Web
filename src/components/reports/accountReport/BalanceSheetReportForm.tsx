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
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import ReportTypeField from "@/components/reportForm/Account/ReportType";
import TillDateField from "@/components/reportForm/Common/TillDateField";
import CheckboxInput from "@/components/form/CheckboxInput";
import FieldRow from "@/utilis/FieldRow";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import type {
  BalanceSheetFormValues,
  BalanceSheetResponseExtended,
} from "@/app/(home)/(sidebar)/Account/reports/BalanceSheetReport/page";
import DateFields from "@/components/reportForm/Common/DateFiels";

export type { ReportFormat };

interface BalanceSheetReportFormProps {
  control: Control<BalanceSheetFormValues>;
  handleSubmit: UseFormHandleSubmit<BalanceSheetFormValues>;
  onSubmit: SubmitHandler<BalanceSheetFormValues>;
  setValue: UseFormSetValue<BalanceSheetFormValues>;
  reset: UseFormReset<BalanceSheetFormValues>;
  reportState: BalanceSheetResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function BalanceSheetReportForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: BalanceSheetReportFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () =>
    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

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
            Balance Sheet Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Till Date (BS + AD together, AD derived read-only) ────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<BalanceSheetFormValues>
              control={control}
              setValue={setValue}
              mode="BOTH_BS"
              showFromDate={false}
              toDateName="tillDate"
              toDateADName="tillDateAD"
              toDateLabel="Till Date"
              toDateADLabel="Till Date (A.D.)"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Branch + Report Type ─────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<BalanceSheetFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <ReportTypeField<BalanceSheetFormValues>
              control={control}
              name="reportType"
              label="Report Type"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Same Company + Include Previous Year Balance ────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <SameCompanyField<BalanceSheetFormValues>
              control={control}
              labelPlacement="end"
            />
            <Box>
              <FieldRow label="">
                <CheckboxInput
                  name="includePreviousYearBalance"
                  control={control}
                  label="Include Previous Year Balance"
                  size="small"
                  color="primary"
                  labelPlacement="end"
                />
              </FieldRow>
            </Box>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<BalanceSheetFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                  onBeforeSubmit={scrollToReport}
                />
                <ClearFormButton setValue={setValue} clearFields={[]} />
              </Box>
            </Grid>
          </Grid>
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

export default React.memo(BalanceSheetReportForm);
