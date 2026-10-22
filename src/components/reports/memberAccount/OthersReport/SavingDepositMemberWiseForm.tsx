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

import {
  SavingDepositMemberWiseFormValues,
  SavingDepositMemberWiseResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/OtherReports/SavingDepositAmountMemberReport/page";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
import TypeField from "@/components/reportForm/MemberAccount/TypeField";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

const transactionTypeOptions = [
  { value: "Deposit", label: "Deposit" },
  { value: "Withdrawl", label: "Withdrawl" },
];

interface SavingDepositMemberWiseFormProps {
  control: Control<SavingDepositMemberWiseFormValues>;
  handleSubmit: UseFormHandleSubmit<SavingDepositMemberWiseFormValues>;
  onSubmit: SubmitHandler<SavingDepositMemberWiseFormValues>;
  setValue: UseFormSetValue<SavingDepositMemberWiseFormValues>;
  reset: UseFormReset<SavingDepositMemberWiseFormValues>;
  reportState: SavingDepositMemberWiseResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function SavingDepositMemberWiseForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: SavingDepositMemberWiseFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<SavingDepositMemberWiseFormValues>(),
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
            Saving Deposit Member Wise Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type: Deposit / Withdrawal ────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Report Type">
              <RadioInput
                name="transactionType"
                control={control}
                radioOptions={transactionTypeOptions}
                row
              />
            </FieldRow>
          </Box>
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
            <DateFields<SavingDepositMemberWiseFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Saving Type ─────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<SavingDepositMemberWiseFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <TypeField<SavingDepositMemberWiseFormValues>
              control={control}
              setValue={setValue}
              name="savingTypeId"
              transactionTypeName="typeCategory"
              label="Saving Type"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Order By + Visual Report Switch ──────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <OrderByField<SavingDepositMemberWiseFormValues>
              control={control}
              name="orderBy"
              reportKey="saving-deposit-member-wise-report"
            />
            <VisualReportSwitch<SavingDepositMemberWiseFormValues>
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
                <ViewReportButton<SavingDepositMemberWiseFormValues>
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

        {/* ── Report Navigation and PDF Viewer ────────────────────────────── */}
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

export default React.memo(SavingDepositMemberWiseForm);
