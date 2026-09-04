// components/reports/memberAccount/OthersReport/ChequeBookLostForm.tsx
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
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import Preloader from "@/components/PreLoader/preloader";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import {
  ChequeBookLostFormValues,
  ChequeBookLostResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/ChequeBookReport/ChequeBookLostReport/page";

export type { ReportFormat };

interface ChequeBookLostFormProps {
  control: Control<ChequeBookLostFormValues>;
  handleSubmit: UseFormHandleSubmit<ChequeBookLostFormValues>;
  onSubmit: SubmitHandler<ChequeBookLostFormValues>;
  setValue: UseFormSetValue<ChequeBookLostFormValues>;
  reset: UseFormReset<ChequeBookLostFormValues>;
  reportState: ChequeBookLostResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function ChequeBookLostForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: ChequeBookLostFormProps) {
  const { isLoading, blobUrl, pagination } = reportState;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const showReport = Boolean(blobUrl);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [blobUrl, showReport, isLoading]);

  // Config is memoized once per mount. cacheKey inside it is "member-lookup",
  // shared app-wide — if any other report already opened the member
  // directory this session, this field reuses that data with no API call.
  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<ChequeBookLostFormValues>(),
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
            Cheque Book Lost Report
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
            <DateFields<ChequeBookLostFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Order By ───────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<ChequeBookLostFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <OrderByField<ChequeBookLostFormValues>
              control={control}
              name="orderBy"
              reportKey="cheque-book-lost-report" // ⚠️ add this key to your OrderByReportKey union / options map
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
                <ViewReportButton<ChequeBookLostFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={["memberId", "memberIdText", "memberName"]}
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

export default React.memo(ChequeBookLostForm);
