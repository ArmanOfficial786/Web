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
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import Preloader from "@/components/PreLoader/preloader";
import LedgerHeadField from "@/components/reportForm/Common/LedgerHeadField";
import LedgerNameField from "@/components/reportForm/Common/LedgerNameField";
import CheckboxInput from "@/components/form/CheckboxInput";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";
import type {
  LedgerDetailsFormValues,
  LedgerDetailsResponseExtended,
} from "@/app/(home)/(sidebar)/Account/MainLedger/LedgerDetailsReport/page";

export type { ReportFormat };

const reportTypeOptions = [
  { value: "1", label: "Summary" },
  { value: "0", label: "Detail" },
];

const voucherTypeOptions = [
  { value: "All", label: "All" },
  { value: "Manual", label: "Manual" },
  { value: "Auto", label: "Auto" },
];

interface LedgerDetailsFormProps {
  control: Control<LedgerDetailsFormValues>;
  handleSubmit: UseFormHandleSubmit<LedgerDetailsFormValues>;
  onSubmit: SubmitHandler<LedgerDetailsFormValues>;
  setValue: UseFormSetValue<LedgerDetailsFormValues>;
  reportState: LedgerDetailsResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function LedgerDetailsForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: LedgerDetailsFormProps) {
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
            Ledger Details Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<LedgerDetailsFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Branch Name / Ledger Head ────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <BranchNameField<LedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
            />
            <LedgerHeadField<LedgerDetailsFormValues>
              control={control}
              name="ledgerHeadId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Ledger Name (cascades from date/branch/ledger head) ────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <LedgerNameField<LedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="ledgerName"
              fromDateFieldName="fromDateBs"
              toDateFieldName="toDateBs"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchId"
            />
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

          {/* ── Report Type / Voucher Type ───────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="Voucher Type">
              <RadioInput
                name="voucherType"
                control={control}
                radioOptions={voucherTypeOptions}
                row
              />
            </FieldRow>
            <CheckboxInput
              name="showOpeningBalance"
              control={control}
              label="Show Opening Balance"
              size="small"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear ──────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<LedgerDetailsFormValues>
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
                    "branchId",
                    "ledgerHeadId",
                    "ledgerName",
                    "voucherType",
                    "reportType",
                    "showOpeningBalance",
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

export default React.memo(LedgerDetailsForm);
