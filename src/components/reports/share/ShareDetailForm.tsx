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

import {
  ShareDetailFormValues,
  ShareDetailResponseExtended,
} from "@/app/(home)/(sidebar)/Share/ShareDetailsReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import DropDown from "@/components/form/DropDown";
import Preloader from "@/components/PreLoader/preloader";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import MemberTypeField from "@/components/reportForm/Common/MemberTypeField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SoleSelectGroupField from "@/components/reportForm/Common/SoleSelectGroupField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import TotalShareAmountField from "@/components/reportForm/Share/TotalShareAmtFields";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
export type { ReportFormat };

interface ShareDetailFormProps {
  control: Control<ShareDetailFormValues>;
  handleSubmit: UseFormHandleSubmit<ShareDetailFormValues>;
  onSubmit: SubmitHandler<ShareDetailFormValues>;
  setValue: UseFormSetValue<ShareDetailFormValues>;
  reset: UseFormReset<ShareDetailFormValues>;
  reportState: ShareDetailResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  renderKey: number;
}

function ShareDetailForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  iframeRef,
  renderKey,
}: ShareDetailFormProps) {
  const { isLoading, htmlContent, totalPages, currentPage } = reportState;
  const showReport = Boolean(htmlContent);
  const reportRef = useRef<HTMLDivElement>(null);
  const { shareTypeOptions } = useReportFormContext();

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [htmlContent, showReport, isLoading]);

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
            Share Detail Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Till Date / Share Type ──────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DateFields<ShareDetailFormValues>
              control={control}
              toDateName="tillDateBs"
              toDateLabel="Till Date"
              mode="BS"
              showFromDate={false}
              showToDate={true}
            />
            <BranchNameField<ShareDetailFormValues>
              control={control}
              branchFieldName="officeIds"
              setValue={setValue}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name / Member Type ───────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
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
            <MemberTypeField<ShareDetailFormValues>
              control={control}
              memberTypeFieldName="memberTypeId"
              label="Member Type"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Total Share Amount / Collection Center ─────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "start",
            }}
          >
            <TotalShareAmountField<ShareDetailFormValues>
              control={control}
              comparisonFieldName="isGreaterThan"
              amountFieldName="totalShareAmount"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Group by Collection Center / Sole Select Group ─────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <CollectionCenterField<ShareDetailFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="officeIds"
              collectionCenterFieldName="collectionCenterId"
            />
            <CheckboxInput
              name="enableCollectionCenter"
              control={control}
              label="Group by Collection Center"
              size="small"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Group by Member Group / Order By ────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <SoleSelectGroupField<ShareDetailFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="officeIds"
              groupFieldName="memberGroupId"
            />
            <CheckboxInput
              name="enableGroup"
              control={control}
              label="Group by Member Group"
              size="small"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <OrderByField<ShareDetailFormValues>
              control={control}
              name="orderBy"
              reportKey="copomis-report"
            />
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<ShareDetailFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "tillDateBs",
                    "officeIds",
                    "shareTypeId",
                    "memberTypeId",
                    "isGreaterThan",
                    "totalShareAmount",
                    "collectionCenterId",
                    "memberGroupId",
                    "orderBy",
                    "enableCollectionCenter",
                    "enableGroup",
                  ]}
                />
              </Box>
            </Grid>
          </Box>
        </Paper>

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
                title="Share Detail Report"
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(ShareDetailForm);
