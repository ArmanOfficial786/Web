"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";

import type {
  ThirdLedgerDetailsFormValues,
  ThirdLedgerDetailsResponseExtended,
} from "@/app/(home)/(sidebar)/Account/MainLedger/3rdLedgerDetailsReport/page";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import LedgerHeadField from "@/components/reportForm/Common/LedgerHeadField";
import LedgerNameField from "@/components/reportForm/Common/LedgerNameField";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SecondLedgerNameField from "@/components/reportForm/Common/SecondLedgerNameField";
import SubLedgerNameField from "@/components/reportForm/Common/SubLedgerNameField";
import ThirdLedgerNameField from "@/components/reportForm/Common/ThirdLedgerNameField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import FieldRow from "@/utilis/FieldRow";

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

interface ThirdLedgerDetailsFormProps {
  control: Control<ThirdLedgerDetailsFormValues>;
  handleSubmit: UseFormHandleSubmit<ThirdLedgerDetailsFormValues>;
  onSubmit: SubmitHandler<ThirdLedgerDetailsFormValues>;
  setValue: UseFormSetValue<ThirdLedgerDetailsFormValues>;
  reportState: ThirdLedgerDetailsResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function ThirdLedgerDetailsForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: ThirdLedgerDetailsFormProps) {
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
            3rd Ledger Details Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<ThirdLedgerDetailsFormValues>
              control={control}
              fromDateName="fromDate"
              toDateName="toDate"
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
            <BranchNameField<ThirdLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
            />
            <LedgerHeadField<ThirdLedgerDetailsFormValues>
              control={control}
              name="ledgerHeadId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Ledger Name / Sub / 2nd / 3rd Ledger Name (cascade) ─────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <LedgerNameField<ThirdLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="ledgerName"
              fromDateFieldName="fromDate"
              toDateFieldName="toDate"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchIds"
            />
            <SubLedgerNameField<ThirdLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="subLedgerName"
              fromDateFieldName="fromDate"
              toDateFieldName="toDate"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchIds"
              mainLedgerFieldName="ledgerName"
            />
            <SecondLedgerNameField<ThirdLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="secondSubLedgerName"
              fromDateFieldName="fromDate"
              toDateFieldName="toDate"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchIds"
              subLedgerFieldName="subLedgerName"
            />
            <ThirdLedgerNameField<ThirdLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="thirdSubLedgerName"
              fromDateFieldName="fromDate"
              toDateFieldName="toDate"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchIds"
              secondLedgerFieldName="secondSubLedgerName"
            />
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
            <FieldRow label="Report Type">
              <RadioInput
                name="reportType"
                control={control}
                radioOptions={reportTypeOptions}
                row
              />
            </FieldRow>

            <FieldRow label="Voucher Type">
              <RadioInput
                name="voucherType"
                control={control}
                radioOptions={voucherTypeOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.8 }} />

          {/* ── Order By + View Report | Clear ───────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<ThirdLedgerDetailsFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "fromDate",
                    "toDate",
                    "branchIds",
                    "ledgerHeadId",
                    "ledgerName",
                    "subLedgerName",
                    "secondSubLedgerName",
                    "thirdSubLedgerName",
                    "voucherType",
                    "reportType",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Box>
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

export default React.memo(ThirdLedgerDetailsForm);
