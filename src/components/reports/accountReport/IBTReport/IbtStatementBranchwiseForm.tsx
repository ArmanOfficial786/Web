"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { getSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import {
  IbtStatementBranchwiseFormValues,
  IbtStatementBranchwiseResponseExtended,
} from "@/app/(home)/(sidebar)/Account/IBTReport/IBTStatementBranchwiseReport/page";
import Preloader from "@/components/PreLoader/preloader";
import RadioInput from "@/components/form/RadioInput";
import TextInput from "@/components/form/TextInput";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

interface IbtStatementBranchwiseFormProps {
  control: Control<IbtStatementBranchwiseFormValues>;
  handleSubmit: UseFormHandleSubmit<IbtStatementBranchwiseFormValues>;
  onSubmit: SubmitHandler<IbtStatementBranchwiseFormValues>;
  setValue: UseFormSetValue<IbtStatementBranchwiseFormValues>;
  reportState: IbtStatementBranchwiseResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function IbtStatementBranchwiseForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: IbtStatementBranchwiseFormProps) {
  const { fetchBranches, branchOptions } = useReportFormContext();
  const { blobUrl, isLoading, pdfData, pagination } = reportState;
  const reportRef = useRef<HTMLDivElement>(null);
  const showReport = Boolean(blobUrl);
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const reportType = useWatch({ control, name: "reportType" });
  const isInterestCalculation = reportType === "InterestCalculation";

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // ── Login (read-only) branch name — resolved once from the session's
  // officeId against the fetched branch list, or falls back to the
  // session's own branchName if no match is found.
  useEffect(() => {
    let active = true;

    getSession().then((session) => {
      if (!active) return;

      const officeId = session?.user?.officeId;
      const realBranches = branchOptions.filter((o) => Number(o.id) > 0);
      const branch = officeId
        ? realBranches.find((option) => Number(option.id) === officeId)
        : undefined;

      if (branch) {
        setValue("officeId", String(branch.id));
        setValue("branchName", branch.name);
      } else {
        setValue("branchName", session?.user?.branchName ?? "");
      }
    });

    return () => {
      active = false;
    };
  }, [branchOptions, setValue]);

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
            IBT Statement Branchwise
          </Typography>
          <Divider sx={{ mb: 1 }} />

          <Grid container spacing={1.5} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldRow label="Login Branch Name">
                <TextInput
                  name="branchName"
                  control={control}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </FieldRow>
            </Grid>

            {/* ── Payable Branch — bound via the standard BranchNameField
                contract (control/setValue/branchFieldName), same as every
                other report. Default value "2" comes from the page's yup
                schema via schema.getDefault(). */}
            <Grid size={{ xs: 12, md: 6 }}>
              <BranchNameField<IbtStatementBranchwiseFormValues>
                control={control}
                setValue={setValue}
                branchFieldName="payableBranchId"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <DateFields<IbtStatementBranchwiseFormValues>
                control={control}
                fromDateName="fromDateBs"
                toDateName="toDateBs"
                mode="BS"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FieldRow label="Report Type">
                <RadioInput
                  control={control}
                  name="reportType"
                  radioOptions={[
                    { value: "Detail", label: "Detail" },
                    { value: "LedgerWise", label: "Ledger Wise" },
                    {
                      value: "InterestCalculation",
                      label: "Interest Calculation",
                    },
                  ]}
                  sx={{ gap: 1.5, flexWrap: "wrap" }}
                />
              </FieldRow>
            </Grid>

            {/* ── Interest Rate / Minimum Closing Balance — DTO fields that
                only make sense for the InterestCalculation report type. */}
            {isInterestCalculation && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FieldRow label="Interest Rate (%)">
                    <TextInput
                      name="interestRate"
                      control={control}
                      type="number"
                      fullWidth
                    />
                  </FieldRow>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FieldRow label="Minimum Closing Balance">
                    <TextInput
                      name="minimumClosingBalance"
                      control={control}
                      type="number"
                      fullWidth
                    />
                  </FieldRow>
                </Grid>
              </>
            )}
          </Grid>

          <Divider sx={{ my: 1 }} />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={5}
          >
            <ViewReportButton<IbtStatementBranchwiseFormValues>
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
                "payableBranchId",
                "reportType",
                "interestRate",
                "minimumClosingBalance",
              ]}
            />
          </Box>
        </Paper>

        {showReport && (
          <ReportNavigation
            pdfData={blobUrl}
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
              key={blobUrl}
              src={`${blobUrl}#page=${currentPage}&toolbar=0&zoom=100`}
              style={{
                position: "absolute",
                top: "-40px",
                left: 0,
                width: "100%",
                height: "calc(100% + 40px)",
                border: "none",
              }}
            />
            <ScrollToFirstPageButton
              onClick={() => onPageChange(currentPage <= 1 ? totalPages : 1)}
              currentPage={currentPage}
              totalPages={totalPages}
              hideWhenSinglePage
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(IbtStatementBranchwiseForm);
