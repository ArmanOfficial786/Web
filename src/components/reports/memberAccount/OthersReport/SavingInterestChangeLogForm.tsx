// components/reports/memberAccount/OthersReport/SavingInterestChangeLogForm.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
  UseFormWatch,
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
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";
import DepositType from "@/components/reportForm/MemberAccount/DepositType";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import { createAccountLookupConfig } from "@/config/AccountLookupConfig";
import type { AccountLookUpDtos } from "types/api/api";
import {
  SavingInterestChangeLogFormValues,
  SavingInterestChangeLogResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/OtherReports/SavingInterestLogReport/page";

export type { ReportFormat };

// ── Report Type: Account No / Deposit Type ───────────────────────────────
const reportTypeOptions = [
  { value: "AccountNo", label: "Account No" },
  { value: "DepositType", label: "Deposit Type" },
];

interface SavingInterestChangeLogFormProps {
  control: Control<SavingInterestChangeLogFormValues>;
  handleSubmit: UseFormHandleSubmit<SavingInterestChangeLogFormValues>;
  onSubmit: SubmitHandler<SavingInterestChangeLogFormValues>;
  setValue: UseFormSetValue<SavingInterestChangeLogFormValues>;
  reset: UseFormReset<SavingInterestChangeLogFormValues>;
  watch: UseFormWatch<SavingInterestChangeLogFormValues>;
  reportState: SavingInterestChangeLogResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onAccountSelect: (record: AccountLookUpDtos) => void;
}

function SavingInterestChangeLogForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  watch,
  reportState,
  onPageChange,
  onDownload,
  onAccountSelect,
}: SavingInterestChangeLogFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const reportType = watch("reportType");
  const isAccountNoMode = reportType === "AccountNo";

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

  const accountConfig = useMemo(
    () => createAccountLookupConfig<SavingInterestChangeLogFormValues>(),
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
            Saving Interest Change Log Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {isAccountNoMode ? (
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={accountConfig}
              onSelect={onAccountSelect}
            />
          ) : (
            <DepositType<SavingInterestChangeLogFormValues>
              control={control}
              depositTypeFieldName="depositTypeId"
            />
          )}
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<SavingInterestChangeLogFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name ───────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <BranchNameField<SavingInterestChangeLogFormValues>
              control={control}
              branchFieldName="officeId"
              setValue={setValue}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Report Type: Account No / Deposit Type ───────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <FieldRow label="Report Type">
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
                <ViewReportButton<SavingInterestChangeLogFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "accountNo",
                    "depositTypeId",
                    "memberId",
                    "memberName",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ── Report Navigation and PDF Viewer ────────────────────────────── */}
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
            <iframe
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

            <ScrollToFirstPageButton
              onClick={() => {
                if (currentPage <= 1) {
                  onPageChange(totalPages);
                } else {
                  onPageChange(1);
                }
              }}
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

export default React.memo(SavingInterestChangeLogForm);
