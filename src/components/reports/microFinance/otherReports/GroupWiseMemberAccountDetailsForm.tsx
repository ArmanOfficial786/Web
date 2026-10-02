"use client";

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import {
  GroupWiseMemberAccountDetailsFormValues,
  GroupWiseMemberAccountDetailsResponseExtended,
} from "@/app/(home)/(sidebar)/MicroFinance/OtherReports/GroupWiseMemberDetailsReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import Preloader from "@/components/PreLoader/preloader";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import SoleSelectGroupField from "@/components/reportForm/Common/SoleSelectGroupField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";

export type { ReportFormat };

interface GroupWiseMemberAccountDetailsFormProps {
  control: Control<GroupWiseMemberAccountDetailsFormValues>;
  handleSubmit: UseFormHandleSubmit<GroupWiseMemberAccountDetailsFormValues>;
  onSubmit: SubmitHandler<GroupWiseMemberAccountDetailsFormValues>;
  setValue: UseFormSetValue<GroupWiseMemberAccountDetailsFormValues>;
  reset: UseFormReset<GroupWiseMemberAccountDetailsFormValues>;
  reportState: GroupWiseMemberAccountDetailsResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export default function GroupWiseMemberAccountDetailsForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: GroupWiseMemberAccountDetailsFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

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
            Group Wise Member Account Details Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<GroupWiseMemberAccountDetailsFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name ──────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <BranchNameField<GroupWiseMemberAccountDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              defaultBranchId={2}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Collection Center + Select Group ─────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
              alignItems: "start",
            }}
          >
            <CollectionCenterField<GroupWiseMemberAccountDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              collectionCenterFieldName="collectionCenterIds"
              // mode omitted → only the CC dropdown renders (no Address / Meeting fields)
            />
            <SoleSelectGroupField<GroupWiseMemberAccountDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchIds"
              groupFieldName="memberGroupId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Group By / Same Company toggles ──────────────────────────── */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              gap: 5,
              mb: 0.5,
              width: "100%",
              flexWrap: "nowrap",
            }}
          >
            <Box sx={{ flexShrink: 0, whiteSpace: "nowrap" }}>
              <CheckboxInput
                name="groupByCollectionCenter"
                control={control}
                label="Group By Collection Center"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </Box>

            <Box sx={{ flexShrink: 0, whiteSpace: "nowrap" }}>
              <CheckboxInput
                name="groupByMemberGroup"
                control={control}
                label="Group By Member"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </Box>

            <Box sx={{ flexShrink: 0, whiteSpace: "nowrap" }}>
              <CheckboxInput
                name="groupByBranch"
                control={control}
                label="Group By Branch"
                size="small"
                color="primary"
                labelPlacement="end"
              />
            </Box>

            <Box sx={{ flexShrink: 0, whiteSpace: "nowrap" }}>
              <SameCompanyField<GroupWiseMemberAccountDetailsFormValues>
                control={control}
                label="Same Company"
                labelPlacement="end"
              />
            </Box>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Order By + Buttons ───────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OrderByField<GroupWiseMemberAccountDetailsFormValues>
              control={control}
              name="orderBy"
              reportKey="group-wise-member-account-details"
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
                <ViewReportButton<GroupWiseMemberAccountDetailsFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "fromDateBs",
                    "toDateBs",
                    "branchIds",
                    "collectionCenterIds",
                    "memberGroupId",
                    "groupByCollectionCenter",
                    "groupByMemberGroup",
                    "groupByBranch",
                    "sameCompanyName",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Box>

          <Divider sx={{ mb: 0.5 }} />
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
