// components/reports/memberAccount/MemberSummaryForm.tsx
"use client";

import React, { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import SelectGroupField from "@/components/reportForm/Common/SelectGroupField";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import CheckboxInput from "@/components/form/CheckboxInput";
import type {
  MemberSummaryFormValues,
  MemberSummaryResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/reports/MemberSummaryReport/page";
import DateFields from "@/components/reportForm/Common/DateFiels";
import Grid from "@mui/material/Grid";

export type { ReportFormat };

interface MemberSummaryFormProps {
  control: Control<MemberSummaryFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberSummaryFormValues>;
  onSubmit: SubmitHandler<MemberSummaryFormValues>;
  setValue: UseFormSetValue<MemberSummaryFormValues>;
  reset: UseFormReset<MemberSummaryFormValues>;
  reportState: MemberSummaryResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function MemberSummaryForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: MemberSummaryFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  // ── Scroll only after the report has actually loaded, not before submit ────
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
            Member Summary Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Till Date (BS) ────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <DateFields<MemberSummaryFormValues>
              control={control}
              setValue={setValue}
              mode="BS"
              showFromDate={true}
              showToDate={false}
              fromDateName={"tillDate" as any}
              fromDateLabel="Till Date"
            />

            <OfficeNameField<MemberSummaryFormValues>
              control={control}
              branchFieldName="branchId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name (multi-select checkboxes) ────────────────────── */}
          <Box sx={{ mb: 0.5 }}></Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Collection Center + Group By Collection Center ───────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <CollectionCenterField<MemberSummaryFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              collectionCenterFieldName="collectionCenterId"
            />
            <FieldRow label="">
              <CheckboxInput
                name="enableCollectionCenterGroup"
                control={control}
                label="Group By Collection Center"
                size="small"
                color="primary"
                labelPlacement="end"
                sx={{ ml: -3 }}
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Select Group + Group By Member Group ─────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <SelectGroupField<MemberSummaryFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              collectionCenterFieldName="collectionCenterId"
              groupFieldName="memberGroupId"
            />
            <FieldRow label="">
              <CheckboxInput
                name="enableMemberGroupGroup"
                control={control}
                label="Group By Member Group"
                size="small"
                color="primary"
                labelPlacement="end"
                sx={{ ml: -3 }}
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Same Company + Order By ───────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <SameCompanyField<MemberSummaryFormValues>
              control={control}
              labelPlacement="end"
            />
            <OrderByField<MemberSummaryFormValues>
              control={control}
              name="orderBy"
              reportKey="member-summary-report" // ⚠️ add this key to memberOrderByOptions.ts
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
                <ViewReportButton<MemberSummaryFormValues>
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

export default React.memo(MemberSummaryForm);
