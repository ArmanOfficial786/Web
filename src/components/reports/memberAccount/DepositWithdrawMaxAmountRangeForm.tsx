// components/reports/accountReport/DepositWithdrawMaxAmountRangeForm.tsx
"use client";

import React, { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";
import type {
  DepositWithdrawMaxAmountRangeFormValues,
  DepositWithdrawMaxAmountRangeResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/DepositWithdrawMaximumAmountRangeReport/page";

export type { ReportFormat };

// ── Type: Deposit / Withdraw / Both — 1/2/3 ──────────────────────────────────
const transactionTypeOptions = [
  { value: "1", label: "Deposit" },
  { value: "2", label: "Withdraw" },
  { value: "3", label: "Both" },
];

interface DepositWithdrawMaxAmountRangeFormProps {
  control: Control<DepositWithdrawMaxAmountRangeFormValues>;
  handleSubmit: UseFormHandleSubmit<DepositWithdrawMaxAmountRangeFormValues>;
  onSubmit: SubmitHandler<DepositWithdrawMaxAmountRangeFormValues>;
  setValue: UseFormSetValue<DepositWithdrawMaxAmountRangeFormValues>;
  reset: UseFormReset<DepositWithdrawMaxAmountRangeFormValues>;
  reportState: DepositWithdrawMaxAmountRangeResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function DepositWithdrawMaxAmountRangeForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: DepositWithdrawMaxAmountRangeFormProps) {
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
            Deposit Withdraw Max Amount Range Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name (multi-select checkboxes) ────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<DepositWithdrawMaxAmountRangeFormValues>
              control={control}
              branchFieldName="branchId"
            />
            <FieldRow label="Type">
              <RadioInput
                name="transactionType"
                control={control}
                radioOptions={transactionTypeOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Type (Radio: Deposit/Withdraw/Both) + Amount ─────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="Amount">
              <Controller
                name="amount"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    size="small"
                    fullWidth
                    value={field.value ?? 100000.0}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ step: "0.01" }}
                  />
                )}
              />
            </FieldRow>
            <OrderByField<DepositWithdrawMaxAmountRangeFormValues>
              control={control}
              name="orderBy"
              reportKey="deposit-withdraw-max-amount-range-report" // ⚠️ add this key to accountOrderByOptions.ts
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
                <ViewReportButton<DepositWithdrawMaxAmountRangeFormValues>
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

export default React.memo(DepositWithdrawMaxAmountRangeForm);
