// components/reports/memberAccount/MemberAccountDeactiveForm.tsx
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
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import DuePeriodField from "@/components/reportForm/MemberAccount/DuePeriodField";
import MemberAccountTypeField from "@/components/reportForm/MemberAccount/MemberAccountTypeField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";
import type {
  MemberAccountDeactiveFormValues,
  MemberAccountDeactiveResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/reports/MemberAccountDeactiveReport/page";
import DateFields from "@/components/reportForm/Common/DateFiels";
import TransactionTypeField from "@/components/reportForm/MemberAccount/TransactionTypeField";
import TypeField from "@/components/reportForm/MemberAccount/TypeField";

export type { ReportFormat };

// ── Report Type: Active / Inactive ───────────────────────────────────────────
const reportTypeOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

// ── Transaction Type: Saving / Loan ──────────────────────────────────────────
const transactionTypeOptions = [
  { value: "Saving", label: "Saving" },
  { value: "Loan", label: "Loan" },
];

interface MemberAccountDeactiveFormProps {
  control: Control<MemberAccountDeactiveFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberAccountDeactiveFormValues>;
  onSubmit: SubmitHandler<MemberAccountDeactiveFormValues>;
  setValue: UseFormSetValue<MemberAccountDeactiveFormValues>;
  reset: UseFormReset<MemberAccountDeactiveFormValues>;
  reportState: MemberAccountDeactiveResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function MemberAccountDeactiveForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: MemberAccountDeactiveFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  // ── Scroll only after the report has actually loaded, not before submit ────
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
            Member Account Acitve/Inactive Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type: Active / Inactive ────────────────────────────── */}
          <Box
            sx={{
              mb: 0.5,
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
            <DateFields<MemberAccountDeactiveFormValues>
              control={control}
              setValue={setValue}
              mode="BS"
              showFromDate={false}
              showToDate={true}
              toDateName="tillDate"
              toDateLabel="Till Date"
            />
          </Box>

          <Divider sx={{ mb: 0.5 }} />

          {/* ── Branch Name (multi-select checkboxes) ────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<MemberAccountDeactiveFormValues>
              control={control}
              branchFieldName="branchId"
            />
            <DuePeriodField<MemberAccountDeactiveFormValues>
              control={control}
              name="duePeriod"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Due Transaction Period + Type ─────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TransactionTypeField<MemberAccountDeactiveFormValues>
              control={control}
              name="transactionType"
              label="Transaction Type"
            />
            <TypeField<MemberAccountDeactiveFormValues>
              control={control}
              setValue={setValue}
              name="typeId"
              transactionTypeName="transactionType"
              label="Type"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Transaction Type: Saving / Loan + Order By ───────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OrderByField<MemberAccountDeactiveFormValues>
              control={control}
              name="orderBy"
              reportKey="member-account-deactive-report" // ⚠️ add this key to accountOrderByOptions.ts
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear ───────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<MemberAccountDeactiveFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton setValue={setValue} clearFields={[]} />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {showReport && (
          <ReportNavigation
            pdfData={pdfData ?? ""}
            currentPage={pagination?.currentPage ?? 1}
            totalPages={pagination?.totalPages ?? 1}
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
              src={`${pdfData}#page=${pagination?.currentPage ?? 1}&toolbar=0&zoom=100`}
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

export default React.memo(MemberAccountDeactiveForm);
