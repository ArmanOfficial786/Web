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
  RatioAnalysisFormValues,
  RatioAnalysisResponseExtended,
} from "@/app/(home)/(sidebar)/Account/AccountReports/RatioAnalysisReport/page";
import Preloader from "@/components/PreLoader/preloader";
import CheckboxInput from "@/components/form/CheckboxInput";
import ProvisionTypeField from "@/components/reportForm/Account/ProvisionTypeField";
import ViewTypeField from "@/components/reportForm/Account/ViewTypeField";
import BranchFieldName from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";

export type { ReportFormat };

interface RatioAnalysisFormProps {
  control: Control<RatioAnalysisFormValues>;
  handleSubmit: UseFormHandleSubmit<RatioAnalysisFormValues>;
  onSubmit: SubmitHandler<RatioAnalysisFormValues>;
  setValue: UseFormSetValue<RatioAnalysisFormValues>;
  reset: UseFormReset<RatioAnalysisFormValues>;
  reportState: RatioAnalysisResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function RatioAnalysisForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: RatioAnalysisFormProps) {
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
            Ratio Analysis Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Branch + Same Company ────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <BranchFieldName<RatioAnalysisFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
            />
            <SameCompanyField<RatioAnalysisFormValues>
              control={control}
              labelPlacement="end"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Provision Type (Radio) + Enable 1 to 30 Days ─────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.52fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <ProvisionTypeField<RatioAnalysisFormValues>
              control={control}
              name="provisionType"
              label="Provision Type"
            />

            <CheckboxInput
              name="enable1to30Days"
              control={control}
              label="Enable 1 to 30 Days"
              labelPlacement="end"
              size="small"
              color="primary"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View (Detail / Total Only) ───────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <ViewTypeField<RatioAnalysisFormValues>
              control={control}
              name="viewType"
              label="View"
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
                <ViewReportButton<RatioAnalysisFormValues>
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

export default React.memo(RatioAnalysisForm);
