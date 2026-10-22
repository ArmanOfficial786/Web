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
  AccountDayOpenCloseFormValues,
  AccountDayOpenCloseResponseExtended,
} from "@/app/(home)/(sidebar)/Account/OtherReports/AccountDayOpenAndCloseReport/page";
import Preloader from "@/components/PreLoader/preloader";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import UserLookupField from "@/components/reportForm/Common/UserLookUpField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import userLookupService from "@/services/Common/UserLookUpService";

export type { ReportFormat };

interface AccountDayOpenCloseFormProps {
  control: Control<AccountDayOpenCloseFormValues>;
  handleSubmit: UseFormHandleSubmit<AccountDayOpenCloseFormValues>;
  onSubmit: SubmitHandler<AccountDayOpenCloseFormValues>;
  setValue: UseFormSetValue<AccountDayOpenCloseFormValues>;
  reset: UseFormReset<AccountDayOpenCloseFormValues>;
  reportState: AccountDayOpenCloseResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function AccountDayOpenCloseForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: AccountDayOpenCloseFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

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
            Account Day Open And Close Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<AccountDayOpenCloseFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── User Name (User Lookup) + Office Name ────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <UserLookupField<AccountDayOpenCloseFormValues>
              control={control}
              name="userId"
              label="User Name"
              lookupKey="users"
              fetcher={async () => {
                const users = await userLookupService.getAll();
                return users.map((user) => ({
                  id: user.id ?? 0,
                  name: user.fullName ?? "",
                }));
              }}
            />
            <BranchNameField<AccountDayOpenCloseFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Order By ──────────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <OrderByField<AccountDayOpenCloseFormValues>
              control={control}
              name="orderBy"
              reportKey="account-day-open-close-report"
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
                <ViewReportButton<AccountDayOpenCloseFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={["userId", "userName"]}
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

export default React.memo(AccountDayOpenCloseForm);
