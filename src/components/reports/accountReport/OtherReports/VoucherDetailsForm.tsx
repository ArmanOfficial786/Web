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
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import type {
  VoucherDetailsFormValues,
  VoucherDetailsResponseExtended,
} from "@/app/(home)/(sidebar)/Account/OtherReports/VoucherDetailReport/page";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import VoucherNoField from "@/components/reportForm/Account/VoucherNoField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

const viewTypeOptions = [
  { value: "None", label: "None" },
  { value: "Grouping", label: "Grouping" },
];

interface VoucherDetailsFormProps {
  control: Control<VoucherDetailsFormValues>;
  handleSubmit: UseFormHandleSubmit<VoucherDetailsFormValues>;
  onSubmit: SubmitHandler<VoucherDetailsFormValues>;
  setValue: UseFormSetValue<VoucherDetailsFormValues>;
  reset: UseFormReset<VoucherDetailsFormValues>;
  reportState: VoucherDetailsResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function VoucherDetailsForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: VoucherDetailsFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

  const fromDate = useWatch({ control, name: "fromDate" }) ?? undefined;
  const toDate = useWatch({ control, name: "toDate" }) ?? undefined;
  const branchIdsRaw = useWatch({ control, name: "branchIds" });
  const branchIds = (branchIdsRaw ?? [])
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id));

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
            Voucher Details Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<VoucherDetailsFormValues>
              control={control}
              fromDateName="fromDate"
              toDateName="toDate"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Voucher No ──────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<VoucherDetailsFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <VoucherNoField<VoucherDetailsFormValues>
              control={control}
              voucherFieldName="voucherId"
              fromDate={fromDate}
              toDate={toDate}
              branchIds={branchIds}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View As: None / Grouping ──────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="View As">
              <RadioInput
                name="viewType"
                control={control}
                radioOptions={viewTypeOptions}
                row
              />
            </FieldRow>
            <OrderByField<VoucherDetailsFormValues>
              control={control}
              name="orderBy"
              reportKey="voucher-details-report"
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
                <ViewReportButton<VoucherDetailsFormValues>
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
                    "voucherId",
                    "orderBy",
                    "viewType",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
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

export default React.memo(VoucherDetailsForm);
