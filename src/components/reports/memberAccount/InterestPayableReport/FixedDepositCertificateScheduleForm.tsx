"use client";

import CheckboxInput from "@/components/form/CheckboxInput";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useMemo, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { createAccountLookupConfig } from "@/config/AccountLookupConfig";

import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import {
  type FixedDepositCertificateScheduleFormValues,
  type FixedDepositCertificateScheduleResponseExtended,
} from "@/components/reports/memberAccount/InterestPayableReport/fixedDepositCertificateSchedule.types";
import type { AccountLookUpDtos } from "types/api/api";

export type { ReportFormat };

interface FixedDepositCertificateScheduleFormProps {
  control: Control<FixedDepositCertificateScheduleFormValues>;
  handleSubmit: UseFormHandleSubmit<FixedDepositCertificateScheduleFormValues>;
  setValue: UseFormSetValue<FixedDepositCertificateScheduleFormValues>;
  reset: UseFormReset<FixedDepositCertificateScheduleFormValues>;
  reportState: FixedDepositCertificateScheduleResponseExtended;
  onAccountSelect: (record: AccountLookUpDtos) => void;
  onViewSchedule: SubmitHandler<FixedDepositCertificateScheduleFormValues>;
  onViewCertificate: SubmitHandler<FixedDepositCertificateScheduleFormValues>;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function FixedDepositCertificateScheduleForm({
  control,
  handleSubmit,
  setValue,
  reportState,
  onAccountSelect,
  onViewSchedule,
  onViewCertificate,
  onPageChange,
  onDownload,
}: FixedDepositCertificateScheduleFormProps) {
  const { isLoading, loadingKind, pdfData, pagination } = reportState;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const accountConfig = useMemo(
    () =>
      createAccountLookupConfig<FixedDepositCertificateScheduleFormValues>(),
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
            Fixed Deposit Certificate / Schedule Report
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {/* ── Account Directory Lookup ─────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={accountConfig}
              onSelect={onAccountSelect}
            />
          </Box>
          <Divider sx={{ mb: 1 }} />

          {/* ── Show Header ───────────────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <CheckboxInput
              name="showHeader"
              control={control}
              label="Show Header"
              size="small"
            />
          </Box>
          <Divider sx={{ mb: 1 }} />

          {/* ── View Schedule | View Certificate | Clear ─────────────── */}
          <Grid container spacing={1} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  width: "100%",
                }}
              >
                <ViewReportButton<FixedDepositCertificateScheduleFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onViewSchedule}
                  setValue={setValue}
                  loading={isLoading && loadingKind === "schedule"}
                  disabled={isLoading}
                  label="View Schedule"
                />
                <ViewReportButton<FixedDepositCertificateScheduleFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onViewCertificate}
                  setValue={setValue}
                  loading={isLoading && loadingKind === "certificate"}
                  disabled={isLoading}
                  label="View Certificate"
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "accountNo",
                    "memberId",
                    "memberName",
                    "accountId",
                    "showHeader",
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

export default React.memo(FixedDepositCertificateScheduleForm);
