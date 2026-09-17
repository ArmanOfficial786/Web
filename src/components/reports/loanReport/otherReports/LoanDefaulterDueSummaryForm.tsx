// components/reports/loan/OtherReports/LoanDefaulterDueSummaryForm.tsx
"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type SubmitHandler,
  type UseFormHandleSubmit,
  type UseFormReset,
  type UseFormSetValue,
} from "react-hook-form";

import {
  LoanDefaulterDueSummaryFormValues,
  LoanDefaulterDueSummaryResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/OtherReports/LoanDefaulterDueSummaryReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

const REPORT_TYPE_SCHEDULE_WISE = "ScheduleWiseInterestReport";
const REPORT_TYPE_TILL_DATE = "TillDateInterestReport";

interface LoanDefaulterDueSummaryFormProps {
  control: Control<LoanDefaulterDueSummaryFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanDefaulterDueSummaryFormValues>;
  onSubmit: SubmitHandler<LoanDefaulterDueSummaryFormValues>;
  setValue: UseFormSetValue<LoanDefaulterDueSummaryFormValues>;
  reset: UseFormReset<LoanDefaulterDueSummaryFormValues>;
  reportState: LoanDefaulterDueSummaryResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function LoanDefaulterDueSummaryForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: LoanDefaulterDueSummaryFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const enableCollectionCenter = useWatch({
    control,
    name: "enableCollectionCenter",
  });

  // Clear the selected Collection Center whenever the checkbox is turned off,
  // so a stale selection never gets sent while the field is inactive.
  useEffect(() => {
    if (!enableCollectionCenter) {
      setValue("collectionCenterId", 0 as any);
    }
  }, [enableCollectionCenter, setValue]);

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
            Loan Defaulter Due Summary Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Till Date ─────────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DateFields<LoanDefaulterDueSummaryFormValues>
              control={control}
              fromDateName="tillDate"
              fromDateLabel="Till Date"
              showToDate={false}
              mode="BS"
            />
            <OfficeNameField<LoanDefaulterDueSummaryFormValues>
              control={control}
              branchFieldName="branchIds"
              multiple={false}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Collector ──────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Collector<LoanDefaulterDueSummaryFormValues>
              control={control}
              collectorFieldName="collectorId"
            />
            <CollectionCenterField<LoanDefaulterDueSummaryFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              collectionCenterFieldName="collectionCenterId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Enable Collection Center + Collection Center ─────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <FieldRow label="Report Type">
              <RadioInput
                control={control}
                name="reportType"
                radioOptions={[
                  {
                    value: REPORT_TYPE_SCHEDULE_WISE,
                    label: "Schedulewise Interest",
                  },
                  {
                    value: REPORT_TYPE_TILL_DATE,
                    label: "Till Date Interest",
                  },
                ]}
                sx={{ gap: 1.5, flexWrap: "wrap" }}
              />
            </FieldRow>
            <FieldRow label="">
              <CheckboxInput
                name="enableCollectionCenter"
                control={control}
                label="Enable Collection Center"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Order By ──────────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <OrderByField<LoanDefaulterDueSummaryFormValues>
              control={control}
              name="orderBy"
              reportKey="loan-defaulters-report"
            />
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<LoanDefaulterDueSummaryFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "tillDate",
                    "branchIds",
                    "collectionCenterId",
                    "enableCollectionCenter",
                    "collectorId",
                    "reportType",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Box>
          <Divider sx={{ mb: 0.5 }} />
        </Paper>

        {/* ── Report Navigation and PDF Viewer ────────────────────────────── */}
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
            <iframe
              key={pdfData}
              src={`${pdfData}#page=${currentPage}&toolbar=0&zoom=100`}
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

export default React.memo(LoanDefaulterDueSummaryForm);
