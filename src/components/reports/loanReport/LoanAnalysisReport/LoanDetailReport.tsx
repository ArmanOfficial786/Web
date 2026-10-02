"use client";

import {
  type LoanDetailFormValues,
  type LoanDetailResponseExtended,
} from "@/app/(home)/(sidebar)/Loan/LoanAnalysisReport/LoanAllDetailsReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import DropDown from "@/components/form/DropDown";
import MultiCheckboxInput from "@/components/form/MultiCheckboxInput";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SoleSelectGroupField from "@/components/reportForm/Common/SoleSelectGroupField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import LoanTypeField from "@/components/reportForm/Loan/LoanTypeField";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import { LOAN_COLUMN_OPTIONS } from "@/utilis/Constants/LoanColumnOptions";
import FieldRow from "@/utilis/FieldRow";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef, useState } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";

export type { ReportFormat };

interface LoanDetailReportProps {
  control: Control<LoanDetailFormValues>;
  handleSubmit: UseFormHandleSubmit<LoanDetailFormValues>;
  onSubmit: SubmitHandler<LoanDetailFormValues>;
  setValue: UseFormSetValue<LoanDetailFormValues>;
  reportState: LoanDetailResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  renderKey: number;
}

const STATUS_OPTIONS = [
  { value: "All", label: "-- All --" },
  { value: "Active", label: "Active" },
  { value: "Closed", label: "Closed" },
  { value: "Overdue", label: "Overdue" },
];

const STATUS_DROPDOWN_OPTIONS = STATUS_OPTIONS.map((o) => ({
  id: o.value,
  name: o.label,
}));

function LoanDetailReport({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  iframeRef,
  renderKey,
}: LoanDetailReportProps) {
  const { isLoading, htmlContent, totalPages, currentPage } = reportState;
  const showReport = Boolean(htmlContent);
  const reportRef = useRef<HTMLDivElement>(null);
  const [columnsExpanded, setColumnsExpanded] = useState(true);

  useEffect(() => {
    if (htmlContent && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [htmlContent]);

  const memberLookupConfig = React.useMemo(
    () => MemberLookupConfig<LoanDetailFormValues>(),
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
            Loan Detail Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />
          <Box>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={memberLookupConfig}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Till Date | Status ──────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
              alignItems: "center",
            }}
          >
            <DateFields<LoanDetailFormValues>
              control={control}
              toDateName="tillDateBs"
              toDateLabel="Till Date"
              mode="BS"
              showFromDate={false}
            />
            <OfficeNameField<LoanDetailFormValues>
              control={control}
              branchFieldName="branchIds"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Loan Type | Order By | Select Collector ─────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr " },
              gap: 2,
              mb: 0.5,
            }}
          >
            <FieldRow label="Status">
              <DropDown
                name="status"
                control={control}
                label="Status"
                options={STATUS_DROPDOWN_OPTIONS}
                fullWidth
              />
            </FieldRow>
            <LoanTypeField<LoanDetailFormValues>
              control={control}
              loanTypeFieldName="loanTypeId"
              label="Loan Type"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Collection Center | Enable Collection Center ────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
              alignItems: "center",
            }}
          >
            <CollectionCenterField<LoanDetailFormValues>
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
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Select Group | Group By Member Group ────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
              alignItems: "center",
            }}
          >
            <SoleSelectGroupField<LoanDetailFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              groupFieldName="memberGroupId"
            />
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
          </Box>
          <Divider sx={{ mb: 0.5 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            {" "}
            <Collector<LoanDetailFormValues>
              control={control}
              collectorFieldName="collectorId"
              label="Select Collector"
            />
            <OrderByField<LoanDetailFormValues>
              control={control}
              name="orderBy"
              reportKey="loan-all-details-report"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Select Columns to Display (collapsible) ──────────────────
               same collapse pattern as Member's Select Columns block */}
          <Box sx={{ py: 0.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Select Columns to Display
              </Typography>
              <IconButton
                onClick={() => setColumnsExpanded(!columnsExpanded)}
                size="small"
              >
                {columnsExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>

            <Collapse in={columnsExpanded}>
              <MultiCheckboxInput
                name="selectedColumns"
                control={control}
                options={LOAN_COLUMN_OPTIONS}
                groupLabel=""
                columns={{ xs: 2, sm: 3, md: 4, lg: 6 }}
              />
            </Collapse>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear ─────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<LoanDetailFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "loanTypeId",
                    "orderBy",
                    "collectorId",
                    "status",
                    "branchIds",
                    "collectionCenterId",
                    "enableCollectionCenter",
                    "memberGroupId",
                    "memberId",
                    "memberName",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ── Report iframe area ──────────────────────────────────────── */}
        {showReport && (
          <Box
            ref={reportRef}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <ReportNavigation
              pdfData={undefined}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onDownload={onDownload}
            />

            <Box
              sx={{
                width: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                overflow: "auto",
                height: "100vh",
                backgroundColor: "#d0d0d0",
              }}
            >
              <iframe
                ref={iframeRef}
                key={renderKey}
                srcDoc={htmlContent}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                }}
                sandbox="allow-scripts allow-modals allow-same-origin"
                title="Loan Detail Report"
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(LoanDetailReport);
