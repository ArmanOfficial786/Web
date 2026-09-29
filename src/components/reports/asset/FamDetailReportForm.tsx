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

import type {
  FamDetailReportFormValues,
  FamDetailReportResponseExtended,
} from "@/app/(home)/(sidebar)/Asset/Reports/FamDetailReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import AssetCategoryField from "@/components/reportForm/Asset/AssetCategoryField";
import AssetNameField from "@/components/reportForm/Asset/AssetName";
import FamClearanceStatusField from "@/components/reportForm/Asset/FamClearanceStatusField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

const reportTypeOptions = [
  { value: "Summary", label: "Summary" },
  { value: "Detail", label: "Detail" },
];

interface FamDetailReportFormProps {
  control: Control<FamDetailReportFormValues>;
  handleSubmit: UseFormHandleSubmit<FamDetailReportFormValues>;
  onSubmit: SubmitHandler<FamDetailReportFormValues>;
  setValue: UseFormSetValue<FamDetailReportFormValues>;
  reset: UseFormReset<FamDetailReportFormValues>;
  reportState: FamDetailReportResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function FamDetailReportForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: FamDetailReportFormProps) {
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
            Fixed Asset Detail Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Till Date (BS) ───────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr " },
              gap: 2,
              alignItems: "start",
              mb: 0.5,
            }}
          >
            <DateFields<FamDetailReportFormValues>
              control={control}
              showFromDate={false}
              toDateName="toDateBs"
              toDateLabel="Till Date"
              mode="BS"
            />
            <OfficeNameField<FamDetailReportFormValues>
              control={control}
              branchFieldName="branchIds"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Asset Category | Asset Name | Clearance Status ───────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "start",
              mb: 0.5,
            }}
          >
            <AssetCategoryField<FamDetailReportFormValues>
              control={control}
              setValue={setValue}
              typeFieldName="type"
              categoryFieldName="categoryId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type ─────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "start",
              mb: 0.5,
            }}
          >
            <AssetNameField<FamDetailReportFormValues>
              control={control}
              setValue={setValue}
              categoryFieldName="categoryId"
              assetFieldName="assetId"
            />
            <FamClearanceStatusField<FamDetailReportFormValues>
              control={control}
              clearanceStatusFieldName="clearanceStatusId"
            />
          </Box>

          <Divider sx={{ mb: 0.5 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "start",
              mb: 0.5,
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
            <FieldRow label="">
              <CheckboxInput
                name="isTypeWise"
                control={control}
                label="Type Wise"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
          </Box>

          <Divider sx={{ mb: 0.5 }} />

          {/* ── Type Wise + Order By | Buttons ───────────────────────────── */}
          <Grid container spacing={2} sx={{ mb: 0.5 }}>
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
                <ViewReportButton<FamDetailReportFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "toDateBs",
                    "branchIds",
                    "type",
                    "categoryId",
                    "assetId",
                    "clearanceStatusId",
                    "reportType",
                    "isTypeWise",
                    "orderBy",
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
