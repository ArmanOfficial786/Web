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
import { useWatch } from "react-hook-form";

import type {
  TellerCashVaultFormValues,
  TellerCashVaultResponseExtended,
} from "@/app/(home)/(sidebar)/Account/OtherReports/TellerCashVaultReport/page";
import Preloader from "@/components/PreLoader/preloader";
import { VaultTypeSwitch } from "@/components/reportForm/Account/VaultTypeSwitch";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportIframe from "@/components/reportForm/Common/ReportIframe";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";

export type { ReportFormat };

interface TellerCashVaultFormProps {
  control: Control<TellerCashVaultFormValues>;
  handleSubmit: UseFormHandleSubmit<TellerCashVaultFormValues>;
  onSubmit: SubmitHandler<TellerCashVaultFormValues>;
  setValue: UseFormSetValue<TellerCashVaultFormValues>;
  reset: UseFormReset<TellerCashVaultFormValues>;
  reportState: TellerCashVaultResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function TellerCashVaultForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: TellerCashVaultFormProps) {
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

  const isToVault = useWatch({ control, name: "type" });
  const excludeKeys = isToVault ? ["issuedBy"] : ["returnedBy"];

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
            Teller Cash Vault Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<TellerCashVaultFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Branch Name + Same Company Name ──────────────────────────── */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BranchNameField<TellerCashVaultFormValues>
                control={control}
                setValue={setValue}
                branchFieldName="branchId"
              />
            </Grid>
            <SameCompanyField<TellerCashVaultFormValues>
              control={control}
              name="sameCompanyName"
              labelPlacement="end"
            />
          </Grid>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From Vault / To Vault + Order By ─────────────────────────── */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <OrderByField<TellerCashVaultFormValues>
                control={control}
                name="orderBy"
                reportKey="teller-cash-vault-report"
                excludeKeys={excludeKeys}
              />
            </Grid>
            <VaultTypeSwitch<TellerCashVaultFormValues>
              control={control}
              name="type"
            />
          </Grid>
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
                <ViewReportButton<TellerCashVaultFormValues>
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
                    "branchId",
                    "sameCompanyName",
                    "orderBy",
                    "type",
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

export default React.memo(TellerCashVaultForm);
