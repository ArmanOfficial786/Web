"use client";

import React, { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
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
import BranchCollectionField from "@/components/reportForm/Common/BranchCollectionField";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";
import type {
  BranchToBranchExpenseFormValues,
  BranchToBranchExpenseResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/OtherReports/BranchToBranchExpenseReport/page";

export type { ReportFormat };

const reportTypeOptions = [
  { value: "All", label: "All" },
  { value: "SavingWise", label: "Saving Wise" },
  { value: "MiscellaneousWise", label: "Miscellaneous Wise" },
  { value: "ShareWise", label: "Share Wise" },
];

interface BranchToBranchExpenseFormProps {
  control: Control<BranchToBranchExpenseFormValues>;
  handleSubmit: UseFormHandleSubmit<BranchToBranchExpenseFormValues>;
  onSubmit: SubmitHandler<BranchToBranchExpenseFormValues>;
  setValue: UseFormSetValue<BranchToBranchExpenseFormValues>;
  reportState: BranchToBranchExpenseResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function BranchToBranchExpenseForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: BranchToBranchExpenseFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

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
            Branch To Branch Expense Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type (Radio Buttons) ──────────────────────────────── */}
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

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<BranchToBranchExpenseFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Select Collection Branch + Account Opened Branch ─────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <BranchCollectionField<BranchToBranchExpenseFormValues>
              control={control}
              branchFieldName="branchFromId"
              label="Select Collection Branch"
              setValue={setValue}
            />
            <BranchNameField<BranchToBranchExpenseFormValues>
              control={control}
              branchFieldName="branchToId"
              setValue={setValue}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Select Collector + Order By ───────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Collector<BranchToBranchExpenseFormValues>
              control={control}
              collectorFieldName="collectorId"
              label="Select Collector"
              userId={160}
            />
            <OrderByField<BranchToBranchExpenseFormValues>
              control={control}
              name="orderBy"
              reportKey="branch-to-branch-collection-report"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear Buttons ──────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<BranchToBranchExpenseFormValues>
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
                    "branchFromId",
                    "branchToId",
                    "collectorId",
                    "reportType",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
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
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(BranchToBranchExpenseForm);
