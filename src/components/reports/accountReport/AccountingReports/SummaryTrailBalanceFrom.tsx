"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import type {
  SummaryTrialBalanceFormValues,
  SummaryTrialBalanceResponseExtended,
} from "@/app/(home)/(sidebar)/Account/AccountReports/SummaryTrailBalanceReport/page";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

const reportTypeOptions = [
  { value: "Summary", label: "Summary" },
  { value: "Detail", label: "Detail" },
];

interface SummaryTrialBalanceFormProps {
  control: Control<SummaryTrialBalanceFormValues>;
  handleSubmit: UseFormHandleSubmit<SummaryTrialBalanceFormValues>;
  onSubmit: SubmitHandler<SummaryTrialBalanceFormValues>;
  setValue: UseFormSetValue<SummaryTrialBalanceFormValues>;
  reset: UseFormReset<SummaryTrialBalanceFormValues>;
  reportState: SummaryTrialBalanceResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function SummaryTrialBalanceForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: SummaryTrialBalanceFormProps) {
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
            Summary Trial Balance Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
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
            <OfficeNameField<SummaryTrialBalanceFormValues>
              control={control}
              branchFieldName="branchId"
            />
            <SameCompanyField<SummaryTrialBalanceFormValues>
              control={control}
              labelPlacement="end"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type (Radio) + Order By ───────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="Report Type">
              <RadioInput
                name="reportType"
                control={control}
                radioOptions={reportTypeOptions}
                row
              />
            </FieldRow>

            <OrderByField<SummaryTrialBalanceFormValues>
              control={control}
              name="orderBy"
              reportKey="summary-trail-balance-report"
            />
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
                <ViewReportButton<SummaryTrialBalanceFormValues>
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
          <>
            <ReportNavigation
              pdfData={pdfData ?? ""}
              currentPage={pagination?.currentPage ?? 1}
              totalPages={pagination?.totalPages ?? 1}
              onPageChange={onPageChange}
              onDownload={onDownload}
            />

            <Box ref={reportRef}>
              <ReportIframe
                src={pdfData!}
                page={pagination?.currentPage ?? 1}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={onPageChange}
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default React.memo(SummaryTrialBalanceForm);
