"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import {
  LoanTypeWiseFormValues,
  LoanTypeWiseResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAnalysisReport/LoanTypeWiseReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import SoleSelectGroupField from "@/components/reportForm/Common/SoleSelectGroupField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import LoanTypeField from "@/components/reportForm/Loan/LoanTypeField";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import {
  loanGuaranteeOptions,
  shareTypeOptions,
} from "@/config/LoanReportOptions";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

interface LoanTypeWiseFormProps {
  control: Control<LoanTypeWiseFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanTypeWiseFormValues>;
  onSubmit: SubmitHandler<LoanTypeWiseFormValues>;
  setValue: UseFormSetValue<LoanTypeWiseFormValues>;
  reportState: LoanTypeWiseResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function LoanTypeWiseForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: LoanTypeWiseFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const enableCollectionCenter = useWatch({
    control,
    name: "enableCollectionCenter",
  });

  useEffect(() => {
    if (!enableCollectionCenter) {
      setValue("collectionCenterId", "0" as any);
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
            Loan Type Wise Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<LoanTypeWiseFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name ──────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <OfficeNameField<LoanTypeWiseFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <LoanTypeField<LoanTypeWiseFormValues>
              control={control}
              loanTypeFieldName="loanTypeId"
              label="Loan Type"
              setValue={setValue}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Collector + Collection Center ────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <Collector<LoanTypeWiseFormValues>
              control={control}
              collectorFieldName="collectorId"
            />
            <CollectionCenterField<LoanTypeWiseFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              collectionCenterFieldName="collectionCenterId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Sole Select Group + Enable Collection Center ─────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
              alignItems: "center",
            }}
          >
            <SoleSelectGroupField<LoanTypeWiseFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              groupFieldName="memberGroupId"
            />
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
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Loan Guarantee ──────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <FieldRow label="Loan Guarantee">
              <RadioInput
                name="loanGuarantee"
                control={control}
                radioOptions={loanGuaranteeOptions}
                row
              />
            </FieldRow>
            <FieldRow label="Share Type">
              <RadioInput
                name="shareType"
                control={control}
                radioOptions={shareTypeOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Group By / Toggles ──────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr 1fr 1fr" },
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <FieldRow label="">
              <CheckboxInput
                name="groupByBranch"
                control={control}
                label="Group By Collection Center"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
            <FieldRow label="">
              <CheckboxInput
                name="groupByMemberGroup"
                control={control}
                label="Group By Member Group"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
            <SameCompanyField<LoanTypeWiseFormValues>
              control={control}
              label="Same Company"
              labelPlacement="end"
            />
            <FieldRow label="">
              <CheckboxInput
                name="showOpeningBalance"
                control={control}
                label="Opening Balance"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
            <FieldRow label="">
              <CheckboxInput
                name="showDetail"
                control={control}
                label="View Detail"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Order By + Buttons ───────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OrderByField<LoanTypeWiseFormValues>
              control={control}
              name="orderBy"
              reportKey="loan-type-wise-report"
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
                <ViewReportButton<LoanTypeWiseFormValues>
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
                    "collectorId",
                    "collectionCenterId",
                    "enableCollectionCenter",
                    "memberGroupId",
                    "loanGuarantee",
                    "shareType",
                    "groupByBranch",
                    "groupByMemberGroup",
                    "sameCompanyName",
                    "showOpeningBalance",
                    "showDetail",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Box>

          <Divider sx={{ mb: 0.5 }} />
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
