// components/reports/accountReport/MainLedger/FourthLedgerDetailsForm.tsx
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
import SubLedgerNameField from "@/components/reportForm/Common/SubLedgerNameField";
import SecondLedgerNameField from "@/components/reportForm/Common/SecondLedgerNameField";
import ThirdLedgerNameField from "@/components/reportForm/Common/ThirdLedgerNameField";
import FourthLedgerNameField from "@/components/reportForm/Common/FourthLedgerNameField";
import type {
  FourthLedgerDetailsFormValues,
  FourthLedgerDetailsResponseExtended,
} from "@/app/(home)/(sidebar)/Account/MainLedger/4thLedgerDetailsReport/page";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";

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

interface FourthLedgerDetailsFormProps {
  control: Control<FourthLedgerDetailsFormValues>;
  handleSubmit: UseFormHandleSubmit<FourthLedgerDetailsFormValues>;
  onSubmit: SubmitHandler<FourthLedgerDetailsFormValues>;
  setValue: UseFormSetValue<FourthLedgerDetailsFormValues>;
  reportState: FourthLedgerDetailsResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function FourthLedgerDetailsForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: FourthLedgerDetailsFormProps) {
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
            4th Ledger Details Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<FourthLedgerDetailsFormValues>
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
            <BranchNameField<FourthLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
            />
            <LedgerHeadField<FourthLedgerDetailsFormValues>
              control={control}
              name="ledgerHeadId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Ledger Name / Sub / 2nd / 3rd / 4th Ledger Name (cascade) ──── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <LedgerNameField<FourthLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="ledgerName"
              fromDateFieldName="fromDateBs"
              toDateFieldName="toDateBs"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchId"
            />
            <SubLedgerNameField<FourthLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="subLedgerName"
              fromDateFieldName="fromDateBs"
              toDateFieldName="toDateBs"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchId"
              mainLedgerFieldName="ledgerName"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <SecondLedgerNameField<FourthLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="secondSubLedgerName"
              fromDateFieldName="fromDateBs"
              toDateFieldName="toDateBs"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchId"
              subLedgerFieldName="subLedgerName"
            />
            <ThirdLedgerNameField<FourthLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="thirdSubLedgerName"
              fromDateFieldName="fromDateBs"
              toDateFieldName="toDateBs"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchId"
              secondLedgerFieldName="secondSubLedgerName"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FourthLedgerNameField<FourthLedgerDetailsFormValues>
              control={control}
              setValue={setValue}
              name="fourthSubLedgerName"
              fromDateFieldName="fromDateBs"
              toDateFieldName="toDateBs"
              ledgerHeadFieldName="ledgerHeadId"
              branchFieldName="branchId"
              thirdLedgerFieldName="thirdSubLedgerName"
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<FourthLedgerDetailsFormValues>
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
                    "subLedgerName",
                    "secondSubLedgerName",
                    "thirdSubLedgerName",
                    "fourthSubLedgerName",
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

export default React.memo(FourthLedgerDetailsForm);
