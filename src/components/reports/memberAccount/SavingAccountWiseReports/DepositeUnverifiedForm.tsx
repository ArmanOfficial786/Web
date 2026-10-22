"use client";

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

import type {
  DepositUnverifiedFormValues,
  DepositUnverifiedResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/DepositeUnverifiedReport/page";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import DepositType from "@/components/reportForm/MemberAccount/DepositType";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

const reportTypeOptions = [
  { value: "All", label: "All" },
  { value: "Verified", label: "Account Verified Report" },
  { value: "Unverified", label: "Account Unverified Report" },
];

interface DepositUnverifiedFormProps {
  control: Control<DepositUnverifiedFormValues>;
  handleSubmit: UseFormHandleSubmit<DepositUnverifiedFormValues>;
  onSubmit: SubmitHandler<DepositUnverifiedFormValues>;
  setValue: UseFormSetValue<DepositUnverifiedFormValues>;
  reset: UseFormReset<DepositUnverifiedFormValues>;
  reportState: DepositUnverifiedResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function DepositUnverifiedForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: DepositUnverifiedFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const userId = 160;

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<DepositUnverifiedFormValues>(),
    [],
  );

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
            Deposit Unverified Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Member Lookup (Member ID + Member Name) ──────────────────── */}
          <EntityLookupField
            control={control}
            setValue={setValue}
            config={memberLookupConfig}
          />
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Branch Name (single-select dropdown) ─────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <BranchNameField<DepositUnverifiedFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              defaultBranchId={2}
            />

            <DepositType<DepositUnverifiedFormValues>
              control={control}
              depositTypeFieldName="depositTypeId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Deposit Type + Collector ──────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Collector<DepositUnverifiedFormValues>
              control={control}
              collectorFieldName="collectorId"
              userId={userId}
            />
            <OrderByField<DepositUnverifiedFormValues>
              control={control}
              name="orderBy"
              reportKey="deposit-unverified-report"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Generate: All / Verified / Unverified (radio) ────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Generate">
              <RadioInput
                name="reportType"
                control={control}
                radioOptions={reportTypeOptions}
                row
              />
            </FieldRow>
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
                <ViewReportButton<DepositUnverifiedFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={["memberId", "memberName"]}
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
        )}       {showReport && (
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

export default React.memo(DepositUnverifiedForm);
