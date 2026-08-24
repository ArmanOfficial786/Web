"use client";

import React, { useEffect, useMemo, useRef } from "react";
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
import MemberLookupButton from "@/components/reportForm/Common/MemberLookUpButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import DepositType from "@/components/reportForm/MemberAccount/DepositType";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";
import type {
  DepositUnverifiedFormValues,
  DepositUnverifiedResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/reports/DepositeUnverifiedReport/page";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";

export type { ReportFormat };

// ── Generate options — All / Account Verified / Account Unverified ──────────
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

  // ⚠️ ASSUMPTION: swap this for your real auth/user hook
  const userId = 160;

  // ── Scroll only after the report has actually loaded, not before submit ────
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
              reportKey="deposit-unverified-report" // ⚠️ add this key to accountOrderByOptions.ts
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

export default React.memo(DepositUnverifiedForm);
