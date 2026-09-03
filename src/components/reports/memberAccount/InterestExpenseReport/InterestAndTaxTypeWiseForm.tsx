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
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import RadioInput from "@/components/form/RadioInput";
import FieldRow from "@/utilis/FieldRow";
const reportViewOptions = [
  { value: "1", label: "Normal" },
  { value: "2", label: "Tax Wise" },
  { value: "3", label: "Tax Wise All" },
];

import {
  type InterestAndTaxTypeWiseFormValues,
  type InterestAndTaxTypeWiseResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/InterestExpenseReport/InterestAndTaxTypeWiseReport/page";

export type { ReportFormat };

interface InterestAndTaxTypeWiseFormProps {
  control: Control<InterestAndTaxTypeWiseFormValues>;
  handleSubmit: UseFormHandleSubmit<InterestAndTaxTypeWiseFormValues>;
  onSubmit: SubmitHandler<InterestAndTaxTypeWiseFormValues>;
  setValue: UseFormSetValue<InterestAndTaxTypeWiseFormValues>;
  reset: UseFormReset<InterestAndTaxTypeWiseFormValues>;
  reportState: InterestAndTaxTypeWiseResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function InterestAndTaxTypeWiseForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: InterestAndTaxTypeWiseFormProps) {
  const { isLoading, blobUrl, pagination } = reportState;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const showReport = Boolean(blobUrl);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [blobUrl, showReport, isLoading]);

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
            Interest And Tax Type Wise Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report View ───────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Report View">
              <RadioInput
                name="reportView"
                control={control}
                radioOptions={reportViewOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<InterestAndTaxTypeWiseFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Order By ───────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<InterestAndTaxTypeWiseFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <OrderByField<InterestAndTaxTypeWiseFormValues>
              control={control}
              name="orderBy"
              reportKey="interest-and-tax-type-wise-report"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear ──────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<InterestAndTaxTypeWiseFormValues>
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
                    "branchName",
                    "reportView",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

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
                zIndex: 0,
              }}
            >
              <iframe
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

            <ScrollToFirstPageButton
              onClick={() =>
                currentPage <= 1 ? onPageChange(totalPages) : onPageChange(1)
              }
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

export default React.memo(InterestAndTaxTypeWiseForm);
