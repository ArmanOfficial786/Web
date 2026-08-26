// src/components/reports/memberAccount/savingTypeWiseIndividualBalanceForm.tsx
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
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import DateFields from "@/components/reportForm/Common/DateFiels";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import SelectGroupField from "@/components/reportForm/Common/SelectGroupField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import CheckboxInput from "@/components/form/CheckboxInput";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import {
  SavingTypeWiseIndividualBalanceFormValues,
  SavingTypeWiseIndividualBalanceResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/SavingTypeWiseIndividualBalance/page";

export type { ReportFormat };

interface SavingTypeWiseIndividualBalanceFormProps {
  control: Control<SavingTypeWiseIndividualBalanceFormValues>;
  handleSubmit: UseFormHandleSubmit<SavingTypeWiseIndividualBalanceFormValues>;
  onSubmit: SubmitHandler<SavingTypeWiseIndividualBalanceFormValues>;
  setValue: UseFormSetValue<SavingTypeWiseIndividualBalanceFormValues>;
  reset: UseFormReset<SavingTypeWiseIndividualBalanceFormValues>;
  reportState: SavingTypeWiseIndividualBalanceResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}
const userID = 160;
function SavingTypeWiseIndividualBalanceForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: SavingTypeWiseIndividualBalanceFormProps) {
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
            Saving Type Wise Individual Balance Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Branch + Collection Center ────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <BranchNameField<SavingTypeWiseIndividualBalanceFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
            />

            <CollectionCenterField<SavingTypeWiseIndividualBalanceFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              collectionCenterFieldName="collectionCenterId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Select Group + Collector ──────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <SelectGroupField<SavingTypeWiseIndividualBalanceFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              collectionCenterFieldName="collectionCenterId"
              groupFieldName="memberGroupId"
            />

            <Collector
              control={control}
              collectorFieldName="collectorId"
              userId={userID}
              label="Collector"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Group By Collection Center / Member Group / Branch ──────────── */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItem: "center",
            }}
          >
            <CheckboxInput
              name="groupByCollectionCenter"
              control={control}
              label="Group By Collection Center"
              size="small"
              color="primary"
              labelPlacement="end"
              sx={{ ml: -3 }}
            />

            <CheckboxInput
              name="groupByMemberGroup"
              control={control}
              label="Group By Member Group"
              size="small"
              color="primary"
              labelPlacement="end"
              sx={{ ml: -3 }}
            />

            <CheckboxInput
              name="groupByBranch"
              control={control}
              label="Group By Branch"
              size="small"
              color="primary"
              labelPlacement="end"
              sx={{ ml: -3 }}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Same Company + Opening Balance + Percentage Balance + View Detail ── */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItem: "center",
              gap: 2.5,
            }}
          >
            <CheckboxInput
              name="sameCompanyName"
              control={control}
              label="Same Company"
              size="small"
              color="primary"
              labelPlacement="end"
            />

            <CheckboxInput
              name="openingBalance"
              control={control}
              label="Opening Balance"
              size="small"
              color="primary"
              labelPlacement="end"
            />
            <CheckboxInput
              name="percentageBalance"
              control={control}
              label="Percentage Balance"
              size="small"
              color="primary"
              labelPlacement="end"
            />
            <CheckboxInput
              name="viewDetail"
              control={control}
              label="View Detail"
              size="small"
              color="primary"
              labelPlacement="end"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Order By + View Report + Clear ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OrderByField<SavingTypeWiseIndividualBalanceFormValues>
              control={control}
              name="orderBy"
              reportKey="saving-type-wise-balance-report"
            />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={5}
              width="100%"
            >
              <ViewReportButton<SavingTypeWiseIndividualBalanceFormValues>
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                setValue={setValue}
                loading={isLoading}
                onBeforeSubmit={scrollToReport}
              />
              <ClearFormButton setValue={setValue} clearFields={[]} />
            </Box>
          </Box>
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

export default React.memo(SavingTypeWiseIndividualBalanceForm);
