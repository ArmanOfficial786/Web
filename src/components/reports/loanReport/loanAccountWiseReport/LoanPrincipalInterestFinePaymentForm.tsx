"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import CheckboxInput from "@/components/form/CheckboxInput";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import Collector from "@/components/reportForm/MemberAccount/Collector";

import {
  LoanPrincipalInterestFinePaymentFormValues,
  LoanPrincipalInterestFinePaymentResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAccountWiseReport/LoanFineInterestPrincipalPaymentReport/page";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import {
  cashTypeOptions,
  paymentReportTypeOptions as reportTypeOptions,
} from "@/config/LoanReportOptions";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import FieldRow from "@/utilis/FieldRow";
import type { AccountLookUpDtos } from "types/api/api";

export type { ReportFormat };

interface LoanPrincipalInterestFinePaymentFormProps {
  control: Control<LoanPrincipalInterestFinePaymentFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanPrincipalInterestFinePaymentFormValues>;
  onSubmit: SubmitHandler<LoanPrincipalInterestFinePaymentFormValues>;
  setValue: UseFormSetValue<LoanPrincipalInterestFinePaymentFormValues>;
  reportState: LoanPrincipalInterestFinePaymentResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onMemberSelect: (record: AccountLookUpDtos) => void;
}

export default function LoanPrincipalInterestFinePaymentForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  onMemberSelect,
}: LoanPrincipalInterestFinePaymentFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<LoanPrincipalInterestFinePaymentFormValues>(),
    [],
  );

  const enableCollectionCenter = useWatch({
    control,
    name: "enableCollectionCenter",
  });

  // Clear the selected Collection Center whenever the checkbox is turned off,
  // so a stale selection never gets sent while the field is inactive.
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
            Loan Principal / Interest / Fine Payment Report
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {/* ── Member Directory Lookup ──────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={memberLookupConfig}
              onSelect={onMemberSelect}
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <DateFields<LoanPrincipalInterestFinePaymentFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── Office Name ──────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<LoanPrincipalInterestFinePaymentFormValues>
              control={control}
              branchFieldName="branchIds"
            />
            <Collector<LoanPrincipalInterestFinePaymentFormValues>
              control={control}
              collectorFieldName="collectorId"
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── Collector + Collection Center ────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CollectionCenterField<LoanPrincipalInterestFinePaymentFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              collectionCenterFieldName="collectionCenterId"
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

          <Divider sx={{ mb: 1 }} />

          {/* ── Enable Collection Center + Report Type ───────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <FieldRow label="Report Type">
              <RadioInput
                name="reportType"
                control={control}
                radioOptions={reportTypeOptions}
                row
              />
            </FieldRow>
            <FieldRow label="Select">
              <RadioInput
                name="selectAllOrOnlyCash"
                control={control}
                radioOptions={cashTypeOptions}
                row
              />
            </FieldRow>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* ── All / Only Cash ──────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OrderByField<LoanPrincipalInterestFinePaymentFormValues>
              control={control}
              name="orderBy"
              reportKey="loan-principal-interest-fine-payment-report"
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
                <ViewReportButton<LoanPrincipalInterestFinePaymentFormValues>
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
                    "fromDateBs",
                    "toDateBs",
                    "branchIds",
                    "collectorId",
                    "collectionCenterId",
                    "enableCollectionCenter",
                    "reportType",
                    "selectAllOrOnlyCash",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Box>

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
