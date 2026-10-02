"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import {
  LoanIssueDetailsFormValues,
  LoanIssueDetailsResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAccountWiseReport/LoanIssueDetailsReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { loanIssueReportTypeOptions as reportTypeOptions } from "@/config/LoanReportOptions";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

interface LoanIssueDetailsFormProps {
  control: Control<LoanIssueDetailsFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanIssueDetailsFormValues>;
  onSubmit: SubmitHandler<LoanIssueDetailsFormValues>;
  setValue: UseFormSetValue<LoanIssueDetailsFormValues>;
  reset: UseFormReset<LoanIssueDetailsFormValues>;
  reportState: LoanIssueDetailsResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function LoanIssueDetailsForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: LoanIssueDetailsFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const memberLookupConfig = React.useMemo(
    () => MemberLookupConfig<LoanIssueDetailsFormValues>(),
    [],
  );

  const enableCollectionCenter = useWatch({
    control,
    name: "enableCollectionCenter",
  });

  useEffect(() => {
    if (!enableCollectionCenter) {
      setValue("collectionCenterIds", "0" as any);
    }
  }, [enableCollectionCenter, setValue]);

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
            Loan Issue Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Member Directory Lookup ──────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={memberLookupConfig}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<LoanIssueDetailsFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Collection Center ──────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<LoanIssueDetailsFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <CollectionCenterField<LoanIssueDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              collectionCenterFieldName="collectionCenterIds"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Enable Collection Center + Report Type ───────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <FieldRow label="">
              <CheckboxInput
                name="enableCollectionCenter"
                control={control}
                label="Enable Collection Center"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
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

          {/* ── View Report | Clear ──────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<LoanIssueDetailsFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "memberId",
                    "memberName",
                    "fromDateBs",
                    "toDateBs",
                    "branchIds",
                    "collectionCenterIds",
                    "enableCollectionCenter",
                    "reportType",
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
                zIndex: 0,
              }}
            />
            <ScrollToFirstPageButton
              onClick={() =>
                currentPage <= 1 ? onPageChange(totalPages) : onPageChange(1)
              }
              currentPage={currentPage}
              totalPages={totalPages}
              hideWhenSinglePage
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(LoanIssueDetailsForm);
