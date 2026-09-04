// components/reports/memberAccount/OthersReport/ChequeBookWithdrawalForm.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import { createAccountLookupConfig } from "@/config/AccountLookupConfig";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import Preloader from "@/components/PreLoader/preloader";
import type { AccountLookUpDtos } from "types/api/api";
import { ChequeBookWithdrawalResponseExtended } from "@/app/(home)/(sidebar)/MemberAc/ChequeBookReport/ChequeBookWithdrawalReport/page";

export type { ReportFormat };

// UI-only field (accountId) merged onto the real DTO for the account lookup's
// FK; never rendered directly, populated via onAccountSelect.
export interface ChequeBookWithdrawalFormValues {
  accountId?: number;
  accountNo?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

interface ChequeBookWithdrawalFormProps {
  control: Control<ChequeBookWithdrawalFormValues>;
  handleSubmit: UseFormHandleSubmit<ChequeBookWithdrawalFormValues>;
  onSubmit: SubmitHandler<ChequeBookWithdrawalFormValues>;
  setValue: UseFormSetValue<ChequeBookWithdrawalFormValues>;
  reset: UseFormReset<ChequeBookWithdrawalFormValues>;
  reportState: ChequeBookWithdrawalResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  onAccountSelect: (record: AccountLookUpDtos) => void;
}

function ChequeBookWithdrawalForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  onAccountSelect,
}: ChequeBookWithdrawalFormProps) {
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

  // Config is memoized once per mount. cacheKey shared app-wide — if another
  // report already opened the account directory this session, this field
  // reuses that data with no API call.
  const accountConfig = useMemo(
    () => createAccountLookupConfig<ChequeBookWithdrawalFormValues>(),
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
            Cheque Book Withdrawal Report
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {/* ── Account No (Account Directory) ───────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <EntityLookupField
              control={control}
              setValue={setValue}
              config={accountConfig}
              onSelect={onAccountSelect}
            />
          </Box>
          <Divider sx={{ mb: 1 }} />

          {/* ── Order By ──────────────────────────────────────────────────── */}
          <Box sx={{ mb: 1 }}>
            <OrderByField<ChequeBookWithdrawalFormValues>
              control={control}
              name="orderBy"
              reportKey="cheque-book-withdrawal-report" // ⚠️ add this key to your OrderByReportKey union / options map
            />
          </Box>
          <Divider sx={{ mb: 1 }} />

          {/* ── View Report | Clear ───────────────────────────────────────── */}
          <Grid container spacing={1} sx={{ alignItems: "center" }}>
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
                <ViewReportButton<ChequeBookWithdrawalFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "accountId",
                    "accountNo",
                    "memberId",
                    "memberName",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
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
          <Box sx={{ position: "relative", isolation: "isolate", zIndex: 1 }}>
            <Box
              ref={reportRef}
              sx={{
                position: "relative",
                height: "1000px",
                overflow: "hidden",
                zIndex: 0,
              }}
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

            <ScrollToFirstPageButton
              onClick={() =>
                currentPage <= 1 ? onPageChange(totalPages) : onPageChange(1)
              }
              currentPage={currentPage}
              totalPages={totalPages}
              hideWhenSinglePage={true}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(ChequeBookWithdrawalForm);
