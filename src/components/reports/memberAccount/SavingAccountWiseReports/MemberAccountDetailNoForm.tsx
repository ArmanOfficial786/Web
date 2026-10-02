
























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

import type {
  MemberAccountDetailNoFormValues,
  MemberAccountDetailNoResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/MemberAccountDetailNoReport/page";
import DateInput from "@/components/form/DateInput";
import DropDown from "@/components/form/DropDown";
import RadioInput from "@/components/form/RadioInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import TransactionTypeField from "@/components/reportForm/MemberAccount/TransactionTypeField";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

const memberTypeOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

interface MemberAccountDetailNoFormProps {
  control: Control<MemberAccountDetailNoFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberAccountDetailNoFormValues>;
  onSubmit: SubmitHandler<MemberAccountDetailNoFormValues>;
  setValue: UseFormSetValue<MemberAccountDetailNoFormValues>;
  reset: UseFormReset<MemberAccountDetailNoFormValues>;
  reportState: MemberAccountDetailNoResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function MemberAccountDetailNoForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: MemberAccountDetailNoFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const {
    depositTypeOptions,
    fetchDepositTypes,
    loanMasterListOptions,
    fetchLoanMasterList,
    shareTypeOptions,
    fetchShareType,
  } = useReportFormContext();

  useEffect(() => {
    fetchDepositTypes();
    fetchShareType();
    fetchLoanMasterList();
  }, [fetchDepositTypes, fetchShareType, fetchLoanMasterList]);

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
            Active/Inactive Member List Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Till Date + Member Type (Active/Inactive radio) ──────────── */}
          <Box
            sx={{
              mb: 0.5,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="Till Date">
              <Box sx={{ width: "100%" }}>
                <DateInput name="tillDate" control={control} dateType="BS" />
              </Box>
            </FieldRow>

            <FieldRow label="Member Type">
              <RadioInput
                name="memberType"
                control={control}
                radioOptions={memberTypeOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name (multi-select checkboxes) ────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <OfficeNameField<MemberAccountDetailNoFormValues>
              control={control}
              branchFieldName="branchId"
            />
            <TransactionTypeField<MemberAccountDetailNoFormValues>
              control={control}
              name="transactionType"
              label="Transaction Type"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Saving and Loan Types ────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <FieldRow label="Share Type">
              <Box sx={{ width: "100%" }}>
                <DropDown
                  name="shareTypeId"
                  control={control}
                  label="Share Type"
                  options={shareTypeOptions}
                  fullWidth
                />
              </Box>
            </FieldRow>
            <FieldRow label="Saving Type">
              <Box sx={{ width: "100%" }}>
                <DropDown
                  name="savingTypeId"
                  control={control}
                  label="Saving Type"
                  options={depositTypeOptions}
                  fullWidth
                />
              </Box>
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Share Type + Loan Type ────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="Loan Type">
              <Box sx={{ width: "100%" }}>
                <DropDown
                  name="loanTypeId"
                  control={control}
                  label="Loan Type"
                  options={loanMasterListOptions}
                  fullWidth
                />
              </Box>
            </FieldRow>
            <OrderByField<MemberAccountDetailNoFormValues>
              control={control}
              name="orderBy"
              reportKey="member-account-detail-no-report"
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
                <ViewReportButton<MemberAccountDetailNoFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
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

export default React.memo(MemberAccountDetailNoForm);
