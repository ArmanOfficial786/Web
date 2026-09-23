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

import CheckboxInput from "@/components/form/CheckboxInput";
import DropDown from "@/components/form/DropDown";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";

import DateFields from "@/components/reportForm/Common/DateFiels";

import {
  LoanDetailPrincipalFormValues,
  LoanDetailPrincipalResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAnalysisReport/LoanDetailsPrincipalReport/page";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import LoanTypeField from "@/components/reportForm/Loan/LoanTypeField";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import {
  detailReportTypeOptions as reportTypeOptions,
  statusOptions,
} from "@/config/LoanReportOptions";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

interface LoanDetailPrincipalFormProps {
  control: Control<LoanDetailPrincipalFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanDetailPrincipalFormValues>;
  onSubmit: SubmitHandler<LoanDetailPrincipalFormValues>;
  setValue: UseFormSetValue<LoanDetailPrincipalFormValues>;
  reportState: LoanDetailPrincipalResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

// ✅ DropDown expects {id, name}; statusOptions is {value, label} — reshape once here
const STATUS_DROPDOWN_OPTIONS = statusOptions.map((o) => ({
  id: o.value,
  name: o.label,
}));

export default function LoanDetailPrincipalForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: LoanDetailPrincipalFormProps) {
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
            Loan Detail Principal Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Loan Type | Status ───────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <LoanTypeField<LoanDetailPrincipalFormValues>
              control={control}
              loanTypeFieldName="loanTypeId"
              label="Loan Type"
            />
            <FieldRow label="Status">
              <DropDown
                name="status"
                control={control}
                label="Status"
                options={STATUS_DROPDOWN_OPTIONS}
                fullWidth
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<LoanDetailPrincipalFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name ──────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <OfficeNameField<LoanDetailPrincipalFormValues>
              control={control}
              branchFieldName="branchIds"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Collector + Collection Center ────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <Collector<LoanDetailPrincipalFormValues>
              control={control}
              collectorFieldName="collectorId"
            />
            <CollectionCenterField<LoanDetailPrincipalFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              collectionCenterFieldName="collectionCenterId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Enable Collection Center ─────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
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
            <OrderByField<LoanDetailPrincipalFormValues>
              control={control}
              name="orderBy"
              reportKey="loan-detail-principal-report"
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
                <ViewReportButton<LoanDetailPrincipalFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "loanTypeId",
                    "status",
                    "fromDateBs",
                    "toDateBs",
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
