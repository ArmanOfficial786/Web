"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import type {
  RemitReceiptPrintFormValues,
  RemitReceiptPrintResponseExtended,
} from "@/app/(home)/(sidebar)/Remit/Reports/RemitReceiptPrintReport/page";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import UserLookupField from "@/components/reportForm/Common/UserLookUpField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import RemittanceReceiptField from "@/components/reportForm/Remit/RemittanceReceiptField";
import type { SelectOption } from "@/contexts/ReportFormContext";
import userLookupService from "@/services/Common/UserLookUpService";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

const RECEIPT_OF_RECEIVED = "Received";

const remittanceReceiptOfOptions = [
  { value: "Payment", label: "Payment" },
  { value: "Received", label: "Received" },
];

const getReceiptOptions = [
  { value: "Single", label: "Single" },
  { value: "Double", label: "Double" },
];

interface RemitReceiptPrintFormProps {
  control: Control<RemitReceiptPrintFormValues>;
  handleSubmit: UseFormHandleSubmit<RemitReceiptPrintFormValues>;
  onSubmit: SubmitHandler<RemitReceiptPrintFormValues>;
  setValue: UseFormSetValue<RemitReceiptPrintFormValues>;
  reset: UseFormReset<RemitReceiptPrintFormValues>;
  reportState: RemitReceiptPrintResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function RemitReceiptPrintForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: RemitReceiptPrintFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const receiptOf = useWatch({ control, name: "getRemittanceReceiptOf" });
  const isReceived = receiptOf === RECEIPT_OF_RECEIVED;

  // UserLookup fetcher for Entry By — cached under this lookupKey.
  const fetchEntryBy = useMemo(
    () => async (): Promise<SelectOption[]> => {
      const res = await userLookupService.getAll();
      return (res ?? [])
        .filter((u) => u.id != null)
        .map((u) => ({
          id: u.id as number,
          name: u.fullName ?? "",
        }));
    },
    [],
  );

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
            Remit Receipt Print Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<RemitReceiptPrintFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Entry By ──────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <OfficeNameField<RemitReceiptPrintFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <UserLookupField<RemitReceiptPrintFormValues>
              control={control}
              name="entryBy"
              label="Entry By"
              lookupKey="remit-entry-by"
              fetcher={fetchEntryBy}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Get Remittance Receipt Of ───────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Get Remittance Receipt Of">
              <RadioInput
                name="getRemittanceReceiptOf"
                control={control}
                radioOptions={remittanceReceiptOfOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Person (Receipt) — auto-refetches when dates / isReceived change ── */}
          <Box sx={{ mb: 0.5 }}>
            <RemittanceReceiptField<RemitReceiptPrintFormValues>
              control={control}
              setValue={setValue}
              name="remittanceReceiptId"
              fromDateFieldName="fromDateBs"
              toDateFieldName="toDateBs"
              isReceived={isReceived}
              label="Person (Receipt)"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Get Receipt ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Get Receipt">
              <RadioInput
                name="getReceipt"
                control={control}
                radioOptions={getReceiptOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear ─────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
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
                <ViewReportButton<RemitReceiptPrintFormValues>
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
                    "entryBy",
                    "getRemittanceReceiptOf",
                    "remittanceReceiptId",
                    "getReceipt",
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
          <Box
            ref={reportRef}
            sx={{ position: "relative", height: "1000px", overflow: "hidden" }}
          >
            <embed
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
