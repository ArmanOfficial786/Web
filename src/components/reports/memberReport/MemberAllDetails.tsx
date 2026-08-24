"use client";

import React, { useEffect,  useRef, useState } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse"; // new import
import IconButton from "@mui/material/IconButton"; // new import
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"; // new import
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import DateFields from "@/components/reportForm/Common/DateFiels";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import SelectGroupField from "@/components/reportForm/Common/SelectGroupField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
import MultiCheckboxInput from "@/components/form/MultiCheckboxInput";
import { COLUMN_OPTIONS } from "@/utilis/Constants/MemberColumnOptions";
import type {
  MemberAllDetailsFormValues,
  MemberRegistrationResponseExtended,
} from "@/app/(home)/(sidebar)/Member/reports/MemberAllDetailsReport/page";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";

export type { ReportFormat };

// ── Props ─────────────────────────────────────────────────────────────────────

interface MemberAllDetailsReportProps {
  // ← All three typed against MemberAllDetailsFormValues — was MemberRegistrationFormValues
  control: Control<MemberAllDetailsFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberAllDetailsFormValues>;
  onSubmit: SubmitHandler<MemberAllDetailsFormValues>;
  setValue: UseFormSetValue<MemberAllDetailsFormValues>;
  reportState: MemberRegistrationResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  renderKey: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

function MemberAllDetailsReport({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  iframeRef,
  renderKey,
}: MemberAllDetailsReportProps) {
  const { isLoading, htmlContent, totalPages, currentPage } = reportState;
  const showReport = Boolean(htmlContent);
  const reportRef = useRef<HTMLDivElement>(null);
  const [columnsExpanded, setColumnsExpanded] = useState(true);
  const memberConfig = React.useMemo(
    () => MemberLookupConfig<MemberAllDetailsFormValues>(),
    [],
  );

  useEffect(() => {
    if (htmlContent && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [htmlContent]);

  return (
    <>
      {/* ── Global loading overlay ── */}
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
        {/* ── Filter form ── */}
        <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
          >
            Member All Details Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* Member lookup */}
          <EntityLookupField
            control={control}
            setValue={setValue}
            config={memberConfig}
          />
          <Divider sx={{ mb: 0.5 }} />

          {/* Date range */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Branch + Group */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <BranchNameField<MemberAllDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
            />
            <SelectGroupField<MemberAllDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              collectionCenterFieldName={"collectionCenterId" as any}
              groupFieldName="memberGroupId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Order by + Visual switch */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
              gap: 8,
            }}
          >
            <OrderByField<MemberAllDetailsFormValues>
              control={control}
              name="orderby"
              reportKey="member-all-details"
            />
            <VisualReportSwitch<MemberAllDetailsFormValues>
              control={control}
              name="visualReport"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Column selector ── */}
          {/* <Box sx={{ py: 0.5 }}>
            <MultiCheckboxInput
              name="selectedColumns"
              control={control}
              options={COLUMN_OPTIONS}
              groupLabel="Select Columns to Display"
              columns={{ xs: 2, sm: 3, md: 4, lg: 6 }}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} /> */}

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
                options={COLUMN_OPTIONS}
                groupLabel="" // ← hide internal label (empty string is falsy)
                columns={{ xs: 2, sm: 3, md: 4, lg: 6 }}
              />
            </Collapse>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* View + Clear buttons */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                  //onBeforeSubmit={scrollToReport}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={["memberId", "memberName"]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ── Report iframe area ── */}
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
                title="Member All Details Report"
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(MemberAllDetailsReport);
