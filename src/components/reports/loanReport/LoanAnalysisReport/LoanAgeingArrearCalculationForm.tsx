"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import {
  LoanAgeingArrearCalculationFormValues,
  LoanAgeingArrearCalculationResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAnalysisReport/LoanAgingArrearCalculationReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

interface LoanAgeingArrearCalculationFormProps {
  control: Control<LoanAgeingArrearCalculationFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanAgeingArrearCalculationFormValues>;
  onSubmit: SubmitHandler<LoanAgeingArrearCalculationFormValues>;
  setValue: UseFormSetValue<LoanAgeingArrearCalculationFormValues>;
  reportState: LoanAgeingArrearCalculationResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function LoanAgeingArrearCalculationForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: LoanAgeingArrearCalculationFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const enableCollectionCenter = useWatch({
    control,
    name: "enableCollectionCenter",
  });

  useEffect(() => {
    if (!enableCollectionCenter) {
      setValue("collectionCenterId", "0" as any);
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
            Loan Ageing Arrear Calculation Report
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {/* ── Till Date ────────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DateFields<LoanAgeingArrearCalculationFormValues>
              control={control}
              toDateName="tillDateBs"
              toDateLabel="Till Date"
              mode="BS"
              showFromDate={false}
            />
            <OfficeNameField<LoanAgeingArrearCalculationFormValues>
              control={control}
              branchFieldName="branchIds"
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── Office Name ──────────────────────────────────────────────── */}

          <Divider sx={{ mb: 1 }} />

          {/* ── Collector + Collection Center ────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CollectionCenterField<LoanAgeingArrearCalculationFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              collectionCenterFieldName="collectionCenterId"
            />
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

          <Divider sx={{ mb: 1 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Collector<LoanAgeingArrearCalculationFormValues>
              control={control}
              collectorFieldName="collectorId"
            />
            <FieldRow label="">
              <CheckboxInput
                name="enable1To30Days"
                control={control}
                label="Enable 1 to 30 Days"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 1 }} />

          {/* ── Enable Collection Center + Enable 1 to 30 Days ───────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <OrderByField<LoanAgeingArrearCalculationFormValues>
              control={control}
              name="orderBy"
              reportKey="loan-ageing-arrear-calculation-report"
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
                <ViewReportButton<LoanAgeingArrearCalculationFormValues>
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
                    "collectorId",
                    "collectionCenterId",
                    "enableCollectionCenter",
                    "enable1To30Days",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Box>
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
