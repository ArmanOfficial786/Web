"use client";

import React, { useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import MemberLookupButton from "../../reportForm/Common/MemberLookUpButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import SelectGroupField from "../../reportForm/Common/SelectGroupField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import { MemberIdCardRequest } from "types/api/api";
import {
  MemberIdCardResponseExtended,
  type MemberIdCardFormValues,
} from "@/app/(home)/(sidebar)/reports/(Member)/MemberIDCardDetail/page";
import Preloader from "@/components/PreLoader/preloader";

export type { ReportFormat };

//export type SelectOption = { id: number; name: string };

// ── Props ─────────────────────────────────────────────────────────────────────
interface MemberIdCardProps {
  control: Control<MemberIdCardFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberIdCardFormValues>;
  onSubmit: SubmitHandler<MemberIdCardFormValues>;
  setValue: UseFormSetValue<MemberIdCardFormValues>;
  // reset: UseFormReset<MemberIdCardFormValues>;
  reportState: MemberIdCardResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────────
function MemberIdCard({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: MemberIdCardProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);

  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () => {
    reportRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* ── GLOBAL PRELOADER — true viewport center ─────────────────────── */}
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

      {/* ── PAGE CONTENT ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* ── FORM ───────────────────────────────────────────────────────── */}
        <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
          >
            Create Member ID Card
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 1 — Member Lookup */}
          <MemberLookupButton<MemberIdCardFormValues> control={control} />
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 2 — From Date | Till Date */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 3 — Branch | Collection Center */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <BranchNameField<MemberIdCardFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
            />
            <CollectionCenterField<MemberIdCardFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              collectionCenterFieldName="collectionCenterId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 4 — Select Group | Order By */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <SelectGroupField<MemberIdCardFormValues>
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
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 5 — View Report | Clear */}
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
                  onBeforeSubmit={scrollToReport}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={["memberId", "memberName"]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
        {showReport && (
          <ReportNavigation
            pdfData={pdfData!}
            currentPage={pagination?.currentPage ?? 1}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={onPageChange}
            onDownload={onDownload}
          />
        )}

        {/* ── REPORT AREA — renders immediately when data is ready ────────── */}
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
                  top: "-40px", // pushes the toolbar out of the visible area
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

export default React.memo(MemberIdCard);
