"use client";

import React, { useMemo, useRef, useEffect } from "react";
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
import CheckboxInput from "@/components/form/CheckboxInput";

import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import { createAccountLookupConfig } from "@/config/AccountLookupConfig";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import Preloader from "@/components/PreLoader/preloader";

import type { AccountLookUpDtos } from "types/api/api";
import {
  FixedDepositCertificateScheduleFormValues,
  FixedDepositCertificateScheduleResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/InterestPayableReport/FixedDepositCertificateAndScheduleReport/page";

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
  const { isLoading, loadingKind, blobUrl, pagination } = reportState;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const showReport = Boolean(blobUrl);
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

export default React.memo(FixedDepositCertificateScheduleForm);
