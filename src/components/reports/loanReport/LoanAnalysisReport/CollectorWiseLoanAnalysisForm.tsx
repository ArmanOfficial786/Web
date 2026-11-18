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
  CollectorWiseLoanAnalysisFormValues,
  CollectorWiseLoanAnalysisResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAnalysisReport/CollectorWiseLoanAnalysisReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import RadioInput from "@/components/form/RadioInput";
import { useVisualReportToggle } from "@/components/hooks/useVisualReportToggle";
import Preloader from "@/components/PreLoader/preloader";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import {
  detailReportTypeOptions as reportModeOptions,
  loanAnalysisReportTypeOptions as reportTypeOptions,
} from "@/config/LoanReportOptions";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

interface CollectorWiseLoanAnalysisFormProps {
  control: Control<CollectorWiseLoanAnalysisFormValues>;
  handleSubmit: UseFormHandleSubmit<CollectorWiseLoanAnalysisFormValues>;
  onSubmit: SubmitHandler<CollectorWiseLoanAnalysisFormValues>;
  setValue: UseFormSetValue<CollectorWiseLoanAnalysisFormValues>;
  reportState: CollectorWiseLoanAnalysisResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function CollectorWiseLoanAnalysisForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: CollectorWiseLoanAnalysisFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);
  const { submitAndRemember, handleVisualToggle } =
    useVisualReportToggle<CollectorWiseLoanAnalysisFormValues>({
      onSubmit,
      showReport,
      isLoading,
    });

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const enableCollectionCenter = useWatch({
    control,
    name: "enableCollectionCenter",
  });

  useEffect(() => {
    if (!enableCollectionCenter) {
      setValue("collectionCenterIds", "0" as any);
    }
  }, [enableCollectionCenter, setValue]);

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
            Collector Wise Loan Analysis Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<CollectorWiseLoanAnalysisFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name ──────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <BranchNameField<CollectorWiseLoanAnalysisFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              defaultBranchId={2}
            />
            <Collector<CollectorWiseLoanAnalysisFormValues>
              control={control}
              collectorFieldName="collectorId"
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
            <CollectionCenterField<CollectorWiseLoanAnalysisFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              collectionCenterFieldName="collectionCenterIds"
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
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Enable Collection Center + Group By Collection Center ────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <FieldRow label="">
              <CheckboxInput
                name="groupByCollectionCenter"
                control={control}
                label="Group By Collection Center"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
            <FieldRow label="View Type">
              <RadioInput
                name="reportMode"
                control={control}
                radioOptions={reportModeOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type ─────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="Report Type">
              <RadioInput
                name="penaltyType"
                control={control}
                radioOptions={reportTypeOptions}
                row
              />
            </FieldRow>
            <OrderByField<CollectorWiseLoanAnalysisFormValues>
              control={control}
              name="orderBy"
              reportKey="collector-wise-loan-analysis-report"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Order By + Buttons ───────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <VisualReportSwitch<CollectorWiseLoanAnalysisFormValues>
              control={control}
              name="visualReport"
              onToggle={handleVisualToggle}
              disabled={isLoading}
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
                <ViewReportButton<CollectorWiseLoanAnalysisFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={submitAndRemember}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "fromDateBs",
                    "toDateBs",
                    "branchIds",
                    "collectorId",
                    "collectionCenterIds",
                    "enableCollectionCenter",
                    "groupByCollectionCenter",
                    "penaltyType",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {showReport && (
          <>
            <ReportNavigation
              pdfData={pdfData ?? ""}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onDownload={onDownload}
            />

            <Box ref={reportRef}>
              <ReportIframe
                src={pdfData!}
                page={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
