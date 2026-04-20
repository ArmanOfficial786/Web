"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import accountStatementService from "@/services/AccountStatementService";
import type { AccountStatementRequest } from "types/api/api";
import AccountStatement, {
  type ReportFormat,
} from "@/components/reports/accountReport/AccountStatement";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { toast } from "react-toastify";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { InitialReportState, ReportState } from "@/utilis/Constants/reportConstants";

// ── Schema typed to FormInputs (not AccountStatementRequest) ─────────────────
const schema: yup.ObjectSchema<AccountStatementRequest> = yup.object({
  fromDate: yup.string().default(""),
  toDate: yup
    .string()
    .default("")
    .test("date-order", "Till Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    }),
  branchId: yup.mixed<number | string>().default(0),
  orderBy: yup.mixed<number | string>().default(0),
  reportType: yup.string().default("Summary"),
  transactionType: yup.string().default("All"),
});

// ── Mapper: FormInputs → AccountStatementRequest ──────────────────────────────
// Converts form layer types to exact API contract types.
// branchId etc. are string|number in form (MUI Select) → number in API.
const toRequest = (
  form: AccountStatementRequest,
  page = 1,
): AccountStatementRequest => ({
  fromDate: form.fromDate || undefined,
  toDate: form.toDate || undefined, // API uses toDate
  branchId: Number(form.branchId) || undefined,
  branchSelected: String(form.branchId) || undefined,
  branchName: undefined, // populated server-side
  reportType: String(form.reportType) || undefined,
  transactionType: String(form.transactionType) || undefined,
  orderBy: String(form.orderBy) || undefined,
});



// ── Page ──────────────────────────────────────────────────────────────────────
export default function AccountStatementPage() {
  const [reportState, setReportState] =
    useState<ReportState>(InitialReportState);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastRequest, setLastRequest] =
    useState<AccountStatementRequest | null>(null);

  const { control, handleSubmit, setValue, reset } = useForm<AccountStatementRequest>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  // ── Single API call shared by VIEW + EXPORT ────────────────────────────────
  const callApi = useCallback(
    (request: AccountStatementRequest, format: string) =>
      accountStatementService.api.accountStatementAccountStatementReportCreate(
        request,
        { format },
      ),
    [],
  );

  // ── VIEW ───────────────────────────────────────────────────────────────────
  const fetchReport = useCallback(
    async (request: AccountStatementRequest) => {
      setReportState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const res = await callApi(request, "VIEW");

        if (res.data?.isValid) {
          setLastRequest(request);
          setReportState((prev) => ({
            ...prev,
            loading: false,
            reportLoaded: true,
            pdfData: res.data.data?.pdfData ?? "",
            totalPages: res.data.data?.pagination?.totalPages ?? 1,
            totalRecord: res.data.data?.pagination?.totalRecord ?? 0,
            currentPage: res.data.data?.pagination?.currentPage ?? 1,
          }));
        } else {
          setReportState((prev) => ({
            ...prev,
            loading: false,
            error: res.data?.message ?? "Failed to load report.",
          }));
        }
      } catch {
        setReportState((prev) => ({
          ...prev,
          loading: false,
          error: "An unexpected error occurred.",
        }));
      }
    },
    [callApi],
  );

  // ── EXPORT (server hits cache — no extra DB call) ──────────────────────────
  const handleDownload = useCallback(
    async (format: ReportFormat) => {
      if (!lastRequest) return;

      setIsDownloading(true);
      try {
        const res = await callApi(lastRequest, format);
        const blob = responseToBlob(res.data, format);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        let filename = extractFilenameFromResponse(
          res,
          format,
          "AccountStatement",
        );
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        toast.error(
          `Download failed: ${error instanceof Error ? error.message : "Failed to download report."}`,
        );
      } finally {
        setIsDownloading(false);
      }
    },
    [callApi, lastRequest],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<AccountStatementRequest> = useCallback(
    (formData) => fetchReport(toRequest(formData)), // ✅ mapped here
    [fetchReport],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (lastRequest) fetchReport({ ...lastRequest }); // page not in API type
    },
    [fetchReport, lastRequest],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AccountStatement
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      isDownloading={isDownloading}
    />
  );
}
