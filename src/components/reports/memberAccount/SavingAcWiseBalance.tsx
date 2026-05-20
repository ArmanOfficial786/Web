"use client";

import React, { lazy, Suspense, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import DateFields from "@/components/reportForm/Common/DateFiels";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import SelectGroupField from "@/components/reportForm/Common/SelectGroupField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import { type SavingAcWiseBalanceRequest } from "types/api/api";
import { type SavingAcWiseBalanceResponseExtended } from "@/app/(home)/(sidebar)/reports/(MemberAccount)/SavingAcWiseBalanceReport/page";
import DepositType from "@/components/reportForm/MemberAccount/DepositType";
import AccountStatus from "@/components/reportForm/MemberAccount/AccountStatus";
import Collector from "@/components/reportForm/MemberAccount/Collector";

export type { ReportFormat };

// ── Lazy-load the heavy report section (code-split) ───────────────────────────
const LazyReportViewer = lazy(
  () => import("@/components/reports/common/LazyReportViewer"),
);
// Skeleton shown by <Suspense> while the chunk is being fetched the first time.
import { ReportViewerSkeleton } from "@/components/reports/common/LazyReportViewer";
// ── Props ─────────────────────────────────────────────────────────────────────
interface SavingAcWiseBalanceProps {
  control: Control<SavingAcWiseBalanceRequest>;
  handleSubmit: UseFormHandleSubmit<SavingAcWiseBalanceRequest>;
  onSubmit: SubmitHandler<SavingAcWiseBalanceRequest>;
  setValue: UseFormSetValue<SavingAcWiseBalanceRequest>;
  reportState: SavingAcWiseBalanceResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────────
function SavingAcWiseBalance({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: SavingAcWiseBalanceProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);

  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () => {
    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const userID = 160;

  return (
    <>
      {/* ── GLOBAL PRELOADER — true viewport center ─────────────────────── */}
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

      {/* ── PAGE CONTENT ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* ── FORM ───────────────────────────────────────────────────────── */}
        <Paper variant="outlined" sx={{ p: 0.3 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
          >
            Saving A/C Wise Balance
          </Typography>
          <Divider sx={{}} />

          {/* Row 1 — Till Date */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DateFields
              control={control}
              showFromDate={false}
              toDateLabel="Till Date"
              toDateName="tillDate"
            />
            <DepositType control={control} depositTypeFieldName="depositId" />
          </Box>
          <Divider sx={{ mb: 0.5 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <AccountStatus control={control} name="status" />
            <Collector
              control={control}
              collectorFieldName="collectorId"
              userId={userID}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 2 — Branch | Collection Center */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <BranchNameField<SavingAcWiseBalanceRequest>
              control={control}
              setValue={setValue}
              branchFieldName="branchSelected"
            />
            <CollectionCenterField<SavingAcWiseBalanceRequest>
              control={control}
              setValue={setValue}
              branchFieldName="branchSelected"
              collectionCenterFieldName="collectionCenterId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 3 — Select Group | Order By */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <SelectGroupField<SavingAcWiseBalanceRequest>
              control={control}
              setValue={setValue}
              branchFieldName="branchSelected"
              collectionCenterFieldName="collectionCenterId"
              groupFieldName="memberGroupId"
            />
            <OrderByField<SavingAcWiseBalanceRequest>
              control={control}
              name="orderBy"
              reportKey="savingTypeWiseBalance"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 4 — View Report | Clear */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<SavingAcWiseBalanceRequest>
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

        {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
        {/* {showReport && (
          <ReportNavigation
            pdfData={pdfData!}
            currentPage={pagination?.currentPage ?? 1}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={onPageChange}
            onDownload={onDownload}
          />
        )}

        {/* ── REPORT AREA — renders immediately when data is ready ────────── */}
        {/* {showReport && (
          <Box ref={reportRef} sx={{ width: "100%", overflow: "auto" }}>
            <Box
              sx={{
                position: "relative",
                height: "1000px",
                overflow: "hidden",
              }}
            >
              <iframe
                key={pagination?.currentPage ?? 1}
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
          </Box> */}
        {/* Lazy-loaded report viewer with built-in pagination and download handling */}
        {/* <ReportNavigation
          pdfData={pdfData!}
          currentPage={pagination?.currentPage ?? 1}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={onPageChange}
          onDownload={onDownload}
        /> */}

        <Box ref={reportRef}>
          {showReport && (
            <Suspense fallback={<ReportViewerSkeleton />}>
              <LazyReportViewer
                pdfData={pdfData!}
                pagination={pagination}
                onPageChange={onPageChange}
                onDownload={onDownload}
              />
            </Suspense>
          )}
        </Box>
      </Box>
    </>
  );
}
// SavingAcWiseBalance.displayName = "SavingAcWiseBalance";
// SavingAcWiseBalance.whyDidYouRender = true;
export default React.memo(SavingAcWiseBalance);
