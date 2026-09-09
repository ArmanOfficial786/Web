// components/reports/accountReport/OtherReports/BankReceivedPaymentForm.tsx
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
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import RadioInput from "@/components/form/RadioInput";
import FieldRow from "@/utilis/FieldRow";
import type {
  BankReceivedPaymentFormValues,
  BankReceivedPaymentResponseExtended,
} from "@/app/(home)/(sidebar)/Account/OtherReports/BankReceivedPaymentReport/page";
import BankReceivedTransactionTypeField from "@/components/reports/accountReport/OtherReports/BankReceivedTransactionTypeField";

export type { ReportFormat };

interface BankReceivedPaymentFormProps {
  control: Control<BankReceivedPaymentFormValues>;
  handleSubmit: UseFormHandleSubmit<BankReceivedPaymentFormValues>;
  onSubmit: SubmitHandler<BankReceivedPaymentFormValues>;
  setValue: UseFormSetValue<BankReceivedPaymentFormValues>;
  reset: UseFormReset<BankReceivedPaymentFormValues>;
  reportState: BankReceivedPaymentResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

// ⚠️ Values assumed to be "BankReceivedPayment" / "ChequeReceivedPayment" per
// BankReceivedPaymentRequestDto.paymentType (free string). Confirm exact
// backend strings and adjust if different.
const PAYMENT_TYPE_OPTIONS = [
  { value: "BankReceivedPayment", label: "Bank Received Payment" },
  { value: "ChequeReceivedPayment", label: "Cheque Received Payment" },
];

function BankReceivedPaymentForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: BankReceivedPaymentFormProps) {
  const { isLoading, blobUrl, pagination } = reportState;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const showReport = Boolean(blobUrl);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [blobUrl, showReport, isLoading]);

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
            Bank Received Payment Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<BankReceivedPaymentFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Same Company Name ──────────────────────────── */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <OfficeNameField<BankReceivedPaymentFormValues>
                control={control}
                branchFieldName="branchIds"
              />
            </Grid>
            <SameCompanyField<BankReceivedPaymentFormValues>
              control={control}
              name="sameCompanyName"
              labelPlacement="end"
            />
          </Grid>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Payment Type (radio) ─────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Payment Type">
              <RadioInput
                control={control}
                name="paymentType"
                radioOptions={PAYMENT_TYPE_OPTIONS}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Transaction Type + Order By ──────────────────────────────── */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BankReceivedTransactionTypeField<BankReceivedPaymentFormValues>
                control={control}
                name="transactionType"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <OrderByField<BankReceivedPaymentFormValues>
                control={control}
                name="orderBy"
                reportKey="bank-received-payment-report"
              />
            </Grid>
          </Grid>
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
                <ViewReportButton<BankReceivedPaymentFormValues>
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
                    "branchIds",
                    "sameCompanyName",
                    "paymentType",
                    "transactionType",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {showReport && (
          <ReportNavigation
            pdfData={blobUrl ?? ""}
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
                key={blobUrl}
                src={`${blobUrl}#page=${currentPage}&toolbar=0&zoom=100`}
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

export default React.memo(BankReceivedPaymentForm);
