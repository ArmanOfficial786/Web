"use client";

import React, { useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import { RefreshCw } from "lucide-react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/ReportNavigation";
//import PdfSlideViewer from "../../reportForm/PdfSlideViewer";
import MemberLookupButton from "../../reportForm/MemberLookUpButton";
import DateFields from "@/components/reportForm/DateFiels";
import BranchNameField from "@/components/reportForm/BranchNameField";
import CollectionCenterField from "@/components/reportForm/CollectionCenter";
import SelectGroupField from "../../reportForm/SelectGroupField";
import OrderByField from "@/components/reportForm/OrderByFields";
import ViewReportButton from "@/components/reportForm/ViewReportButton";
import ClearFormButton from "@/components/reportForm/ClearFormButton";
import type { ReportState } from "@/utilis/Constants/reportConstants";
import { MemberIdCardRequest } from "types/api/api";
import { MemberIdCardFormValues } from "@/app/(home)/(sidebar)/reports/MemberIDCardDetail/page";

export type { ReportFormat };

export type SelectOption = { id: number; name: string };

// ── Props ─────────────────────────────────────────────────────────────────────
interface MemberIdCardProps {
  control: Control<MemberIdCardFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberIdCardFormValues>;
  onSubmit: SubmitHandler<MemberIdCardFormValues>;
  setValue: UseFormSetValue<MemberIdCardFormValues>;
  reset: UseFormReset<MemberIdCardFormValues>;
  reportState: ReportState;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  isDownloading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
function MemberIdCard({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reset,
  reportState,
  onPageChange,
  onDownload,
  isDownloading = false,
}: MemberIdCardProps) {
  const { loading, reportLoaded, pdfData, currentPage, totalPages } =
    reportState;
  //Scroll up to report area when report is loaded
  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () => {
    reportRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
        >
          Create Member ID Card
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        {/* Row 1 — Member ID + Name */}

        <MemberLookupButton<MemberIdCardFormValues> control={control} />
        <Divider sx={{ mb: 1.5 }} />
        {/* Row 2 — From Date | Till Date */}
        <Box sx={{ mb: 1 }}>
          <DateFields control={control} />
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        {/* Row 3 — Branch | Collection Center */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          <BranchNameField<MemberIdCardRequest>
            control={control}
            branchFieldName="branchId"
          />

          <CollectionCenterField<MemberIdCardRequest>
            control={control}
            setValue={setValue}
            branchFieldName="branchId"
            collectionCenterFieldName="collectionCenterId"
          />
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        {/* Row 4 — Select Group | Order By */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          <SelectGroupField<MemberIdCardRequest>
            control={control}
            setValue={setValue}
            branchFieldName="branchId"
            collectionCenterFieldName="collectionCenterId"
            groupFieldName="memberGroupId"
          />

          <OrderByField<MemberIdCardRequest>
            control={control}
            name="orderby"
            reportKey="memberIdCard"
          />
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        {/* Row 5 — View Report */}
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
                loading={loading}
                onBeforeSubmit={scrollToReport}
              />
              <ClearFormButton reset={reset} setValue={setValue} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ── NAVIGATION ───────────────────────────────────────────────── */}
      {reportLoaded && (
        <ReportNavigation
          pdfData={pdfData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      )}

      {/* ── REPORT AREA ──────────────────────────────────────────────── */}
      <Box
        ref={reportRef}
        sx={{ width: "100%", overflow: "auto", height: "100vh" }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <RefreshCw className="animate-spin text-blue-500" size={48} />
          </Box>
        ) : reportLoaded && pdfData ? (
          <iframe
            src={`${pdfData}#zoom=155`}
            style={{
              width: "100%",
              height: "1000px",
              border: "none",
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
}

export default MemberIdCard;
