"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import monthlyReportService from "@/services/Account/MonthlyReportService";
import type { MonthlyReportRequest, Pagination } from "types/api/api";
import MonthlyReportForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/MonthlyReportForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";

// ── Form values — matches the DTO directly (single branchId, like CostOfFund) ──
export interface MonthlyReportFormValues extends Omit<
  MonthlyReportRequest,
  "isNepali"
> {}

// ── Client-only response state (binary PDF + header pagination) ─────────────
export interface MonthlyReportResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DEFAULT_PAGINATION: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const schema: yup.ObjectSchema<MonthlyReportFormValues> = yup
  .object({
    tillDate: yup
      .string()
      .required("Till Date is required")
      .typeError("Till Date must be a valid date")
      .default(""),
    branchId: yup.string().nullable().optional().default("2"), // matches CostOfFund's defaultBranchId={2}
    branchName: yup.string().nullable().optional().default(""),
    accountTypeId: yup.number().required().default(0),
    reportType: yup.string().optional().default("Summary"),
    isMonthWise: yup.boolean().optional().default(false),
    showBudget: yup.boolean().optional().default(false),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function MonthlyReportPage() {
  const [reportState, setReportState] = useState<MonthlyReportResponseExtended>(
    { isLoading: false },
  );
  const [lastRequest, setLastRequest] = useState<MonthlyReportRequest | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset } =
    useForm<MonthlyReportFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: MonthlyReportFormValues): MonthlyReportRequest => ({
      tillDate: form.tillDate,
      branchId: form.branchId ?? "2",
      branchName: form.branchName ?? "",
      accountTypeId: form.accountTypeId ?? 0,
      reportType: form.reportType,
      isMonthWise: form.isMonthWise ?? false,
      isNepali: true, // Till Date is BS-only in this form
      showBudget: form.showBudget ?? false,
      sameCompanyName: form.sameCompanyName ?? true,
      visualReport: false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: MonthlyReportRequest, format: string) =>
      monthlyReportService.api.monthlyReportCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MonthlyReportRequest) => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return { isLoading: true };
      });
      try {
        const res = await callApi(request, "VIEW");

        const raw =
          (res.headers as Record<string, string>)["x-pagination"] ?? "";
        const pagination: Pagination = (() => {
          try {
            return raw ? (JSON.parse(raw) as Pagination) : DEFAULT_PAGINATION;
          } catch {
            return DEFAULT_PAGINATION;
          }
        })();

        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [callApi],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setReportState((prev) => {
      const total = prev.pagination?.totalPages ?? 1;
      const clamped = Math.max(1, Math.min(newPage, total));
      return {
        ...prev,
        pagination: { ...prev.pagination, currentPage: clamped },
      };
    });
  }, []);

  const handleDownload = useCallback(
    async (format: ReportFormat) => {
      if (!lastRequest) {
        toast.warning("Please view the report before exporting.");
        return;
      }
      try {
        const res = await callApi(lastRequest, format);
        const blob = responseToBlob(res.data, format);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = extractFilenameFromResponse(
          res,
          format,
          "MonthlyReport",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error(
          `Download failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<MonthlyReportFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  // ── Revoke blob URL on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <MonthlyReportForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
    />
  );
}
