// components/reports/accountReport/CashFlowForm.tsx
"use client";

import React, { useRef } from "react";
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
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import DateInput from "@/components/form/DateInput";
import type {
  CashFlowFormValues,
  CashFlowResponseExtended,
} from "@/app/(home)/(sidebar)/Account/reports/CashDayBookReport/page";

export type { ReportFormat };

interface CashFlowFormProps {
  control: Control<CashFlowFormValues>;
  handleSubmit: UseFormHandleSubmit<CashFlowFormValues>;
  onSubmit: SubmitHandler<CashFlowFormValues>;
  setValue: UseFormSetValue<CashFlowFormValues>;
  reset: UseFormReset<CashFlowFormValues>;
  reportState: CashFlowResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function CashFlowForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: CashFlowFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () =>
    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

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
            Cash Flow Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 1 — From Date | To Date (BS) */}
          <Box sx={{ mb: 0.5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldRow label="From Date">
                  <Box sx={{ width: "100%" }}>
                    <DateInput
                      name="fromDate"
                      control={control}
                      dateType="BS"
                    />
                  </Box>
                </FieldRow>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldRow label="To Date">
                  <Box sx={{ width: "100%" }}>
                    <DateInput name="toDate" control={control} dateType="BS" />
                  </Box>
                </FieldRow>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 2 — Branch Name | Order By */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <BranchNameField<CashFlowFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              defaultBranchId={2}
            />
            <OrderByField<CashFlowFormValues>
              control={control}
              name="orderBy"
              reportKey="cash-flow-report"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 3 — View Report | Clear */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<CashFlowFormValues>
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
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(CashFlowForm);
