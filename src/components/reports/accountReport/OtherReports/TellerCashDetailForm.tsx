"use client";

import React, { useEffect, useRef } from "react";
import type {
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { Controller } from "react-hook-form";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import TellerField from "@/components/reportForm/Common/TellerField";
import BranchField from "@/components/reportForm/Common/BranchNameField";
import DateInput from "@/components/form/DateInput";
import FieldRow from "@/utilis/FieldRow";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import type {
  TellerCashDetailFormValues,
  TellerCashDetailResponseExtended,
} from "@/app/(home)/(sidebar)/Account/OtherReports/TellerCashDetailReport/page";

export type { ReportFormat };

interface TellerCashDetailFormProps {
  control: Control<TellerCashDetailFormValues>;
  handleSubmit: UseFormHandleSubmit<TellerCashDetailFormValues>;
  onSubmit: SubmitHandler<TellerCashDetailFormValues>;
  setValue: UseFormSetValue<TellerCashDetailFormValues>;
  reset: UseFormReset<TellerCashDetailFormValues>;
  reportState: TellerCashDetailResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  errors: FieldErrors<TellerCashDetailFormValues>;
}

function TellerCashDetailForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  errors,
}: TellerCashDetailFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  // Teller options narrow to the selected till date — same day used for
  // both fromDateBs/toDateBs since TellerField expects a range.
  const tillDateBs = useWatch({ control, name: "tillDateBs" }) as
    | string
    | undefined;

  const dateError = errors.tillDateBs?.message ?? undefined;

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
            Teller Cash Detail Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Transaction Date (Till Date) ─────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Till Date">
              <DateInput name="tillDateBs" control={control} dateType="BS" />
            </FieldRow>
          </Box>

          {dateError && (
            <Alert severity="error" sx={{ mb: 0.5 }}>
              {dateError}
            </Alert>
          )}

          <Divider sx={{ mb: 0.5 }} />

          {/* ── Branch Name + Teller Name ────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <BranchField<TellerCashDetailFormValues>
              control={control}
              branchFieldName="branchId"
              setValue={setValue}
            />
            <TellerField<TellerCashDetailFormValues>
              control={control}
              tellerFieldName="tellerId"
              fromDateBs={tillDateBs}
              toDateBs={tillDateBs}
            />
          </Box>

          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type + Order By ───────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Box>
              <FormLabel sx={{ fontSize: 14, mb: 0.5, display: "block" }}>
                Report Type
              </FormLabel>
              <Controller
                name="reportType"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value="Detail"
                      control={<Radio size="small" />}
                      label="Detail"
                    />
                    <FormControlLabel
                      value="Summary"
                      control={<Radio size="small" />}
                      label="Summary"
                    />
                  </RadioGroup>
                )}
              />
            </Box>

            <OrderByField<TellerCashDetailFormValues>
              control={control}
              name="orderBy"
              reportKey="teller-cash-detail-report" // ⚠️ add this key to memberOrderByOptions.ts
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
                <ViewReportButton<TellerCashDetailFormValues>
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

export default React.memo(TellerCashDetailForm);
