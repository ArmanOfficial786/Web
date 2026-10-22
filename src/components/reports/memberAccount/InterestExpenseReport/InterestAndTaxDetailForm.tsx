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
  InterestAndTaxDetailFormValues,
  InterestAndTaxDetailResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/InterestExpenseReport/InterestAndTaxDetailReport/page";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import type { MemberLookUpDtos } from "types/api/api";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";

export type { ReportFormat };

interface InterestAndTaxDetailFormProps {
  control: Control<InterestAndTaxDetailFormValues>;
  handleSubmit: UseFormHandleSubmit<InterestAndTaxDetailFormValues>;
  onSubmit: SubmitHandler<InterestAndTaxDetailFormValues>;
  setValue: UseFormSetValue<InterestAndTaxDetailFormValues>;
  reset: UseFormReset<InterestAndTaxDetailFormValues>;
  reportState: InterestAndTaxDetailResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onMemberSelect: (member: MemberLookUpDtos) => void;
}

function InterestAndTaxDetailForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  onMemberSelect,
}: InterestAndTaxDetailFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<InterestAndTaxDetailFormValues>(),
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
            Interest And Tax Detail Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Member Directory Lookup ──────────────────────────────── */}
          <EntityLookupField
            control={control}
            setValue={setValue}
            config={memberLookupConfig}
            onSelect={onMemberSelect}
          />
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<InterestAndTaxDetailFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Order By ───────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<InterestAndTaxDetailFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <OrderByField<InterestAndTaxDetailFormValues>
              control={control}
              name="orderBy"
              reportKey="interest-and-tax-detail-report"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear ──────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<InterestAndTaxDetailFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "fromDateBs",
                    "toDateBs",
                    "branchIds",
                    "branchName",
                    "memberRegistrationId",
                    "memberId",
                    "memberName",
                    "orderBy",
                  ]}
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
        )}
      </Box>
    </>
  );
}

export default React.memo(InterestAndTaxDetailForm);
