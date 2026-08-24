"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type { BalanceSheetRequest, Pagination } from "types/api/api";
import BalanceSheetReportForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/BalanceSheetReportForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import accountService from "@/services/Account/AccountService";

// ── UI-only fields — stripped/derived before hitting the API ────────────────
export interface BalanceSheetFormValues extends Omit<
  BalanceSheetRequest,
  "branchIds"
> {
  branchIds?: number[]; // multi-select in the form; joined into a comma string on submit
  tillDateAD?: string; // derived AD display only — never sent to API
}

// ── Client-only response state (binary PDF + header pagination) ─────────────
export interface BalanceSheetResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<BalanceSheetFormValues> = yup
  .object({
    tillDate: yup
      .string()
      .required("Till Date is required")
      .typeError("Till Date must be a valid date")
      .default(""),
    tillDateAD: yup.string().optional().default(""),
    branchIds: yup.array().of(yup.number().required()).optional().default([]),
    branchName: yup.string().nullable().optional().default("All"),
    reportType: yup
      .string()
      .required("Report Type is required")
      .typeError("Report Type must be a string")
      .default("Summary"),
    orderBy: yup.string().nullable().optional().default("Ledger Name"),
    includePreviousYearBalance: yup.boolean().optional().default(false),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function BalanceSheetReportPage() {
  const [reportState, setReportState] = useState<BalanceSheetResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<BalanceSheetRequest | null>(
    null,
  );
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<BalanceSheetFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── branchIds (number[] in the form) -> branchIds (comma string on the DTO).
  // Backend regex rejects "-1", so "all branches" resolves to the full id list ──
  const toRequest = useCallback(
    (form: BalanceSheetFormValues): BalanceSheetRequest => {
      const selectedIds = (form.branchIds ?? [])
        .map(Number)
        .filter((id) => id > 0);
      const allIds = branchOptions
        .map((o) => Number(o.id))
        .filter((id) => id > 0);
      const isAll = selectedIds.length === 0;
      const resolvedIds = isAll ? allIds : selectedIds;

      const branchName =
        branchOptions
          .filter((o) => resolvedIds.includes(Number(o.id)))
          .map((o) => o.name)
          .join(", ") || "All";

      return {
        tillDate: form.tillDate,
        branchIds: resolvedIds.join(","),
        branchName,
        reportType: form.reportType || "Summary",
        orderBy: form.orderBy || "Ledger Name",
        includePreviousYearBalance: form.includePreviousYearBalance ?? false,
        sameCompanyName: form.sameCompanyName ?? true,
        visualReport: false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: BalanceSheetRequest, format: string) =>
      accountService.api.balanceSheetCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: BalanceSheetRequest) => {
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
            return raw ? (JSON.parse(raw) as Pagination) : DefaultPagination;
          } catch {
            return DefaultPagination;
          }
        })();

        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
        // Error toast handled by Axios interceptor
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
          "BalanceSheet",
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

  const onSubmit: SubmitHandler<BalanceSheetFormValues> = useCallback(
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
    <BalanceSheetReportForm
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
