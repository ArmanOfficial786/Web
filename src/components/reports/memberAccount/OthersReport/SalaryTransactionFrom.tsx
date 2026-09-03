// components/reports/memberAccount/OthersReport/SalaryTransactionForm.tsx
"use client";

import React, { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
import type {
  SalaryTransactionFormValues,
  SalaryTransactionResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/OtherReports/SalaryTransactionReport/page";

export type { ReportFormat };

// ── Report Type: Summary / Detail ────────────────────────────────────────
// ⚠️ numeric codes are placeholders — confirm against backend
const reportTypeOptions = [
  { value: 1, label: "Summary" },
  { value: 2, label: "Detail" },
];

// ── Transfer On: All / Saving / Bank ─────────────────────────────────────
const transferOnOptions = [
  { value: "all", label: "All" },
  { value: "saving", label: "Saving" },
  { value: "bank", label: "Bank" },
];

// ── Select Staff: Office Wise / All Staff ────────────────────────────────
const staffSelectionOptions = [
  { value: "officewise", label: "Office Wise" },
  { value: "allstaff", label: "All Staff" },
];

// ⚠️ Hardcoded placeholder IDs — "All" maps to null (no filter), Arman/Roshan
// use placeholder numeric ids. Replace with real staff IDs or a live lookup.
const staffNameOptions: { value: number | null; label: string }[] = [
  { value: null, label: "All" },
  { value: 1, label: "Arman" },
  { value: 2, label: "Roshan" },
];

interface SalaryTransactionFormProps {
  control: Control<SalaryTransactionFormValues>;
  handleSubmit: UseFormHandleSubmit<SalaryTransactionFormValues>;
  onSubmit: SubmitHandler<SalaryTransactionFormValues>;
  setValue: UseFormSetValue<SalaryTransactionFormValues>;
  reset: UseFormReset<SalaryTransactionFormValues>;
  watch: UseFormWatch<SalaryTransactionFormValues>;
  reportState: SalaryTransactionResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function SalaryTransactionForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  watch,
  reportState,
  onPageChange,
  onDownload,
}: SalaryTransactionFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  // Staff Name dropdown only meaningful under "Office Wise" —
  // ⚠️ assumption: reset to "All" (null) when "All Staff" is picked.
  const staffSelection = watch("staffSelection");
  const staffDropdownDisabled = staffSelection === "allstaff";

  useEffect(() => {
    if (staffDropdownDisabled) {
      setValue("staffId", null);
    }
  }, [staffDropdownDisabled, setValue]);

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
            Salary Transaction Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<SalaryTransactionFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name ───────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <OfficeNameField<SalaryTransactionFormValues>
              control={control}
              branchFieldName="branchIds"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type: Summary / Detail ────────────────────────────── */}
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

          {/* ── Transfer On: All / Saving / Bank ─────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Transfer On">
              <RadioInput
                name="transferOn"
                control={control}
                radioOptions={transferOnOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Select Staff: Office Wise / All Staff ────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Select Staff">
              <RadioInput
                name="staffSelection"
                control={control}
                radioOptions={staffSelectionOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Staff Name + Order By + Visual Report ────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Controller
              name="staffId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Staff Name"
                  size="small"
                  fullWidth
                  disabled={staffDropdownDisabled}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    field.onChange(raw === "" ? null : Number(raw));
                  }}
                >
                  {staffNameOptions.map((opt) => (
                    <MenuItem key={opt.label} value={opt.value ?? ""}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <OrderByField<SalaryTransactionFormValues>
              control={control}
              name="orderBy"
              reportKey="salary-transfer-report" // ⚠️ add this key to your OrderByReportKey union / options map
            />

            <VisualReportSwitch<SalaryTransactionFormValues>
              control={control}
              name="visualReport"
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
                <ViewReportButton<SalaryTransactionFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={["staffId"]}
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

            <ScrollToFirstPageButton
              onClick={() => {
                if (currentPage <= 1) {
                  onPageChange(totalPages);
                } else {
                  onPageChange(1);
                }
              }}
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

export default React.memo(SalaryTransactionForm);
