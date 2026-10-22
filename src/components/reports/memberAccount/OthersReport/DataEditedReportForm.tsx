"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useMemo, useRef } from "react";
import type {
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import type {
  DataEditedReportFormValues,
  DataEditedReportResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/OtherReports/DataEditedReport/page";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import UserLookupField from "@/components/reportForm/Common/UserLookUpField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import userLookupService from "@/services/Common/UserLookUpService";

export type { ReportFormat };

interface DataEditedReportFormProps {
  control: Control<DataEditedReportFormValues>;
  handleSubmit: UseFormHandleSubmit<DataEditedReportFormValues>;
  onSubmit: SubmitHandler<DataEditedReportFormValues>;
  setValue: UseFormSetValue<DataEditedReportFormValues>;
  reset: UseFormReset<DataEditedReportFormValues>;
  reportState: DataEditedReportResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  errors: FieldErrors<DataEditedReportFormValues>;
}

function DataEditedReportForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  errors,
}: DataEditedReportFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<DataEditedReportFormValues>(),
    [],
  );

  const dateError =
    errors.fromDateBs?.message ?? errors.toDateBs?.message ?? undefined;
  const branchError = (errors as FieldErrors<{ branchId?: unknown }>).branchId
    ?.message as string | undefined;

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
            Data Edited Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          <Box
            sx={{
              mb: 0.5,
            }}
          >
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={memberLookupConfig}
            />
          </Box>

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<DataEditedReportFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>

          {dateError && (
            <Alert severity="error" sx={{ mb: 0.5 }}>
              {dateError}
            </Alert>
          )}

          <Divider sx={{ mb: 0.5 }} />

          {/* ── Entry By | Edited By ──────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <UserLookupField<DataEditedReportFormValues>
              control={control}
              name="entryBy"
              label="Entry By"
              lookupKey="users"
              fetcher={async () => {
                const users = await userLookupService.getAll();
                return users.map((user) => ({
                  id: user.id ?? 0,
                  name: user.fullName ?? "",
                }));
              }}
            />
            <UserLookupField<DataEditedReportFormValues>
              control={control}
              name="editedBy"
              label="Edited By"
              lookupKey="users"
              fetcher={async () => {
                const users = await userLookupService.getAll();
                return users.map((user) => ({
                  id: user.id ?? 0,
                  name: user.fullName ?? "",
                }));
              }}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name (multi-select checkboxes) ────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <OfficeNameField<DataEditedReportFormValues>
              control={control}
              branchFieldName="branchId"
            />
          </Box>

          {branchError && (
            <Alert severity="error" sx={{ mb: 0.5 }}>
              {branchError}
            </Alert>
          )}

          <Divider sx={{ mb: 0.5 }} />

          {/* ── Member Id (with Member Directory lookup) | Order By ──────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
              alignItems: "start",
            }}
          >
            <OrderByField<DataEditedReportFormValues>
              control={control}
              name="orderBy"
              reportKey="data-edited-report"
            />
            <VisualReportSwitch<DataEditedReportFormValues>
              control={control}
              name="visualReport"
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
                <ViewReportButton<DataEditedReportFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "memberId",
                    "memberName",
                    "memberRegistrationId",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {showReport && (
          <>
            <ReportNavigation
              pdfData={pdfData ?? ""}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onDownload={onDownload}
            />

            <Box ref={reportRef}>
              <ReportIframe
                src={pdfData!}
                page={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default React.memo(DataEditedReportForm);
