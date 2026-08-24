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
import DateFields from "@/components/reportForm/Common/DateFiels";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import type { MemberRecord } from "@/contexts/ReportFormContext";
import type { MemberBasicDetailsRequest } from "types/api/api";

import {
  MemberBasicDetailsFormValues,
  MemberBasicDetailsResponseExtended,
} from "@/app/(home)/(sidebar)/Member/reports/MemberBasicDetailReport/page";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";

export type { ReportFormat };

interface MemberBasicDetailsFormProps {
  control: Control<MemberBasicDetailsFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberBasicDetailsFormValues>;
  onSubmit: SubmitHandler<MemberBasicDetailsFormValues>;
  setValue: UseFormSetValue<MemberBasicDetailsFormValues>;
  reportState: MemberBasicDetailsResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onMemberSelect: (member: MemberRecord) => void;
}

function MemberBasicDetailsForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: MemberBasicDetailsFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);

  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () => {
    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const memberConfig = React.useMemo(
    () => MemberLookupConfig<MemberBasicDetailsFormValues>(),
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
            Member Basic Details Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 1 — From Date | To Date */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 2 — Member ID | Member Name (modal lookup) */}
          <EntityLookupField
            control={control}
            setValue={setValue}
            config={memberConfig}
          />
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 3 — Branch | Order By */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <BranchNameField<MemberBasicDetailsFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
            />
            <OrderByField<MemberBasicDetailsRequest>
              control={control}
              name="orderBy"
              reportKey="member-basic-details"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 4 — View Report | Clear */}
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
                  clearFields={["memberRegistrationId", "memberName"]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {showReport && (
          <ReportNavigation
            pdfData={pdfData!}
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

export default React.memo(MemberBasicDetailsForm);
