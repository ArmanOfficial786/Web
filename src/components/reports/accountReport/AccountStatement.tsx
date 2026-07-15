"use client";

import React, { useRef } from "react";
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
import DateFields from "@/components/reportForm/Common/DateFiels";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ReportTypeField from "@/components/reportForm/Account/ReportType";
import TransactionTypeField from "@/components/reportForm/Account/TransactionType";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import Preloader from "@/components/PreLoader/preloader";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import type {
  AccountStatementRequestExtended,
  AccountStatementResponseExtended,
} from "@/app/(home)/(sidebar)/Account/reports/AccountStatementReport/page";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";

export type { ReportFormat };

interface AccountStatementProps {
  control: Control<AccountStatementRequestExtended>;
  handleSubmit: UseFormHandleSubmit<AccountStatementRequestExtended>;
  onSubmit: SubmitHandler<AccountStatementRequestExtended>;
  setValue: UseFormSetValue<AccountStatementRequestExtended>;
  reset: UseFormReset<AccountStatementRequestExtended>;
  reportState: AccountStatementResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function AccountStatement({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: AccountStatementProps) {
  // ── Destructure from reportState ─────────────────────────────────────────
  const { blobUrl, isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData) && Boolean(blobUrl);
  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () =>
    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* ── Full-screen loader — driven by isLoading ─────────────────────── */}
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
            Account Statement Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<AccountStatementRequestExtended>
              control={control}
              branchFieldName="branchId"
            />
            <ReportTypeField<AccountStatementRequestExtended>
              control={control}
              name="reportType"
              label="Report Type"
            />
          </Box>
          <Divider sx={{}} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
              gap: 2,
            }}
          >
            <TransactionTypeField<AccountStatementRequestExtended>
              control={control}
              name="transactionType"
            />
            <SameCompanyField<AccountStatementRequestExtended>
              control={control}
              labelPlacement="end"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
              gap: 8,
            }}
          >
            <OrderByField<AccountStatementRequestExtended>
              control={control}
              name="orderBy"
              reportKey="account-statement-report"
            />

            <VisualReportSwitch<AccountStatementRequestExtended>
              control={control}
              name="visualReport"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<AccountStatementRequestExtended>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                  onBeforeSubmit={scrollToReport}
                />
                <ClearFormButton setValue={setValue} clearFields={[]} />
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
              key={blobUrl}
              src={`${blobUrl}#page=${pagination?.currentPage ?? 1}&toolbar=0&zoom=100`}
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
export default React.memo(AccountStatement);
