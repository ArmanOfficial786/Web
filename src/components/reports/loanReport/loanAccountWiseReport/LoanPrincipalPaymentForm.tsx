"use client";

import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  LoanPrincipalPaymentFormValues,
  LoanPrincipalPaymentResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAccountWiseReport/LoanPrinciplePaymentReport/page";
import Preloader from "@/components/PreLoader/preloader";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SoleSelectGroupField from "@/components/reportForm/Common/SoleSelectGroupField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";

import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import React from "react";
import type { AccountLookUpDtos } from "types/api/api";

export type { ReportFormat };

interface LoanPrincipalPaymentFormProps {
  control: Control<LoanPrincipalPaymentFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanPrincipalPaymentFormValues>;
  onSubmit: SubmitHandler<LoanPrincipalPaymentFormValues>;
  setValue: UseFormSetValue<LoanPrincipalPaymentFormValues>;
  reportState: LoanPrincipalPaymentResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onMemberSelect: (record: AccountLookUpDtos) => void;
}

export default function LoanPrincipalPaymentForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: LoanPrincipalPaymentFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

  const memberLookupConfig = React.useMemo(
    () => MemberLookupConfig<LoanPrincipalPaymentFormValues>(),
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
            Loan Principal Payment Report
          </Typography>
          <Divider sx={{ mb: 1 }} />

          <Box sx={{ mb: 1 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={memberLookupConfig}
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Box sx={{ mb: 1 }}>
            <DateFields<LoanPrincipalPaymentFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
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
            <BranchNameField<LoanPrincipalPaymentFormValues>
              control={control}
              branchFieldName="branchIds"
              setValue={setValue}
            />
            <SoleSelectGroupField<LoanPrincipalPaymentFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              groupFieldName="memberGroupId"
            />
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Box sx={{ mb: 1 }}>
            <Controller
              name="paymentType"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <RadioGroup
                    row
                    value={field.value ?? "Principal Payment"}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <FormControlLabel
                      value="Principal Payment"
                      control={<Radio size="small" />}
                      label="Principal Payment"
                    />
                    <FormControlLabel
                      value="Interest Payment"
                      control={<Radio size="small" />}
                      label="Interest Payment"
                    />
                  </RadioGroup>
                </FormControl>
              )}
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
            <OrderByField<LoanPrincipalPaymentFormValues>
              control={control}
              name="orderBy"
              reportKey="loan-principal-payment-report"
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
                <ViewReportButton<LoanPrincipalPaymentFormValues>
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
                    "branchName",
                    "memberGroupId",
                    "memberGroupName",
                    "paymentType",
                    "orderBy",
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
