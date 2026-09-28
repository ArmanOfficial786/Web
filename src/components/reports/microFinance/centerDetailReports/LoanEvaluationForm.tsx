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

import type {
  LoanEvaluationFormValues,
  LoanEvaluationResponseExtended,
} from "@/app/(home)/(sidebar)/MicroFinance/CenterDetailReports/LoanEvaluationReport/page";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import type { AccountLookUpDtos } from "types/api/api";

export type { ReportFormat };

interface LoanEvaluationFormProps {
  control: Control<LoanEvaluationFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanEvaluationFormValues>;
  onSubmit: SubmitHandler<LoanEvaluationFormValues>;
  setValue: UseFormSetValue<LoanEvaluationFormValues>;
  reset: UseFormReset<LoanEvaluationFormValues>;
  reportState: LoanEvaluationResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onMemberSelect: (record: AccountLookUpDtos) => void;
}

export default function LoanEvaluationForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  onMemberSelect,
}: LoanEvaluationFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<LoanEvaluationFormValues>(),
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
            Loan Evaluation Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Member Directory Lookup ──────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={memberLookupConfig}
              onSelect={onMemberSelect}
            />
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
                <ViewReportButton<LoanEvaluationFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "memberRegistrationId",
                    "memberId",
                    "memberName",
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
