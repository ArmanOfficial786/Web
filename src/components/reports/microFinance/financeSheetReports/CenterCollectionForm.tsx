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
  CenterCollectionFormValues,
  CenterCollectionResponseExtended,
} from "@/app/(home)/(sidebar)/MicroFinance/MicroFinanceSheetReports/CenterCollectionReport/page";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";

export type { ReportFormat };

interface CenterCollectionFormProps {
  control: Control<CenterCollectionFormValues>;
  handleSubmit: UseFormHandleSubmit<CenterCollectionFormValues>;
  onSubmit: SubmitHandler<CenterCollectionFormValues>;
  setValue: UseFormSetValue<CenterCollectionFormValues>;
  reset: UseFormReset<CenterCollectionFormValues>;
  reportState: CenterCollectionResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function CenterCollectionForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: CenterCollectionFormProps) {
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
            Center Collection Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Collection Center (with Address + Meeting Date & Time) ───── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 2,
              mb: 0.5,
              alignItems: "start",
            }}
          >
            <CollectionCenterField<CenterCollectionFormValues>
              control={control}
              setValue={setValue}
              branchFieldName={"branchIds" as any}
              collectionCenterFieldName="collectionCenterId"
              mode="both"
              addressFieldName="address"
              meetingDateTimeFieldName="meetingDateTimeBs"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Collection Date (BS + A.D.) ──────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<CenterCollectionFormValues>
              control={control}
              setValue={setValue}
              showFromDate={false}
              toDateName="tillDateBs"
              toDateADName="tillDateAd"
              toDateLabel="Collection Date BS"
              toDateADLabel="Collection Date (A.D.)"
              mode="BOTH_BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear ─────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
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
                <ViewReportButton<CenterCollectionFormValues>
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
                    "tillDateAd",
                    "collectionCenterId",
                    "address",
                    "meetingDateTimeBs",
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
