"use client";

import React, { useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
  FormState,
} from "react-hook-form";
import { RefreshCw } from "lucide-react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
//import MemberLookupButton from "@/components/reportForm/MemberLookUpButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
// import CollectionCenterField from "@/components/reportForm/CollectionCenter";
// import SelectGroupField from "@/components/reportForm/SelectGroupField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ReportTypeField from "@/components/reportForm/Account/ReportType";
import TransactionTypeField from "@/components/reportForm/Account/TransactionType";
import { AccountStatementRequest } from "types/api/api";
import type { ReportState } from "@/utilis/Constants/reportConstants";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";

export type { ReportFormat };
interface AccountStatementProps {
  control: Control<AccountStatementRequest>;
  handleSubmit: UseFormHandleSubmit<AccountStatementRequest>;
  onSubmit: SubmitHandler<AccountStatementRequest>;
  setValue: UseFormSetValue<AccountStatementRequest>;
  reset: UseFormReset<AccountStatementRequest>;
  formState: FormState<AccountStatementRequest>;
  reportState: ReportState;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  isDownloading?: boolean;
}

export default function AccountStatement({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reset,
  formState,
  reportState,
  onPageChange,
  onDownload,
  isDownloading = false,
}: AccountStatementProps) {
  const { loading, reportLoaded, error, pdfData, currentPage, totalPages } =
    reportState;
  //Scroll up to report area when report is loaded
  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () => {
    reportRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* ── FORM ─────────────────────────────────────────────────────────── */}
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
        >
          Account Statement Report
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        {/* <MemberLookupButton
          control={control}
          title="Account Statement — Member Directory"
        />
        <Divider sx={{ mb: 1.5 }} /> */}

        <Box sx={{ mb: 1 }}>
          <DateFields control={control} />
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          {/* <BranchNameField control={control} /> */}
          {/* <BranchNameField<AccountStatementRequest>
            control={control}
            branchFieldName="branchId"
          /> */}
          <OfficeNameField<AccountStatementRequest>
            control={control}
            branchFieldName="branchId"
          />

          {/* <CollectionCenterField control={control} setValue={setValue} /> */}
          {/* <ReportTypeField control={control} /> */}
          <ReportTypeField<AccountStatementRequest>
            control={control}
            name="reportType"
          />
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          {/* <SelectGroupField control={control} setValue={setValue} /> */}
          {/* <TransactionTypeField control={control} /> */}
          <TransactionTypeField<AccountStatementRequest>
            control={control}
            name="transactionType"
          />
          {/* <OrderByField control={control} reportKey="savingTypeWiseBalance" /> */}
          <OrderByField<AccountStatementRequest>
            control={control}
            name="orderBy"
            reportKey="savingTypeWiseBalance"
          />
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={5}
              width="100%"
            >
              {/* <ViewReportButton
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                setValue={setValue}
                loading={loading}
                onBeforeSubmit={scrollToReport}
              /> */}
              <ViewReportButton<AccountStatementRequest>
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                setValue={setValue}
                loading={loading}
                onBeforeSubmit={scrollToReport}
                formState={formState}
              />

              <ClearFormButton
                reset={reset}
                setValue={setValue}
                clearFields={[
                  "fromDate",
                  "toDate",
                  "branchId",
                  "reportType",
                  "transactionType",
                  "orderBy",
                ]}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ── NAVIGATION ───────────────────────────────────────────────────── */}
      {reportLoaded && (
        <ReportNavigation
          pdfData={pdfData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      )}

      {/* ── REPORT AREA ──────────────────────────────────────────────────── */}
      <Box
        ref={reportRef}
        sx={{ width: "100%", overflow: "auto", height: "100vh" }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <RefreshCw className="animate-spin text-blue-500" size={48} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : reportLoaded && pdfData ? (
          <iframe
            src={`data:application/pdf;base64,${pdfData}#zoom=155`}
            style={{
              width: "100%",
              height: "1000px",
              border: "none",
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : (
          // <Box sx={{ display: "flex", justifyContent: "center" }}>
          //   <PdfSlideViewer
          //     base64Pdf={pdfData}
          //     pageNumber={currentPage}
          //     onTotalPagesChange={(_pages: number) => {}}
          //     onLoadError={(_err: string) => {}}
          //   />
          // </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">
              Select filters and click View Report to load the statement.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
