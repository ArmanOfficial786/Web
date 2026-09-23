"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";

import Preloader from "@/components/PreLoader/preloader";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { createAccountLookupConfig } from "@/config/AccountLookupConfig";

import {
  LoanStatementDateWiseFormValues,
  LoanStatementDateWiseResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAccountWiseReport/LoanStatementReportDateWise/page";
import DateFields from "@/components/reportForm/Common/DateFiels";
import type { AccountLookUpDtos } from "types/api/api";

export type { ReportFormat };

interface LoanStatementDateWiseFormProps {
  control: Control<LoanStatementDateWiseFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanStatementDateWiseFormValues>;
  onSubmit: SubmitHandler<LoanStatementDateWiseFormValues>;
  setValue: UseFormSetValue<LoanStatementDateWiseFormValues>;
  reportState: LoanStatementDateWiseResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onAccountSelect: (record: AccountLookUpDtos) => void;
}

export default function LoanStatementDateWiseForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  onAccountSelect,
}: LoanStatementDateWiseFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

  const accountConfig = useMemo(
    () => createAccountLookupConfig<LoanStatementDateWiseFormValues>(),
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
            Loan Statement Report (Date Wise)
          </Typography>
          <Divider sx={{ mb: 1 }} />

          <Box sx={{ mb: 1 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={accountConfig}
              onSelect={onAccountSelect}
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Box sx={{ mb: 1 }}>
            <DateFields<LoanStatementDateWiseFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Box sx={{ mb: 1 }}>
            <BranchNameField<LoanStatementDateWiseFormValues>
              control={control}
              branchFieldName="branchIds"
              setValue={setValue}
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <SameCompanyField<LoanStatementDateWiseFormValues>
              control={control}
              label="Same Company Name"
              labelPlacement="end"
              gridSize={{ xs: 12, md: 6 }}
            />
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
                <ViewReportButton<LoanStatementDateWiseFormValues>
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
                    "memberId",
                    "memberName",
                    "fromDateBs",
                    "toDateBs",
                    "fromDateAd",
                    "toDateAd",
                    "branchIds",
                    "branchName",
                    "sameCompanyName",
                  ]}
                />
              </Box>
            </Grid>
          </Box>

          <Divider sx={{ mb: 1 }} />
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
