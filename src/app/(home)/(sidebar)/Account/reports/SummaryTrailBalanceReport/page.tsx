"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import summaryTrialBalanceService from "@/services/Account/SummaryTrailBalaneService";
import type { SummaryTrialBalanceRequest, Pagination } from "types/api/api";
import SummaryTrialBalanceForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/SummaryTrailBalanceFrom";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── branchId is form-only — resolved into branchIds (comma string) on submit ─
export interface SummaryTrialBalanceFormValues extends Omit<
  SummaryTrialBalanceRequest,
  "branchIds"
> {
  branchId?: number[];
}

// ── Client-only response state (raw PDF blob + header pagination) ───────────
export interface SummaryTrialBalanceResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<SummaryTrialBalanceFormValues> = yup
  .object({
    fromDate: yup
      .string()
      .required("From Date is required")
      .nullable()
      .optional()
      .typeError("From Date must be a valid date"),
    toDate: yup
      .string()
      .required("To Date is required")
      .nullable()
      .optional()
      .typeError("To Date must be a valid date")
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDate } = this.parent as { fromDate: string | null };
        if (!fromDate || !val) return true;
        return String(val) >= String(fromDate);
      }),
    branchId: yup.array().of(yup.number().required()).optional().default([]),
    branchName: yup.string().nullable().optional().default("All"),
    orderBy: yup.string().nullable().optional().default(""),
    withClosingBalance: yup.boolean().optional().default(false),
    reportType: yup
      .string()
      .nullable()
      .optional()
      .typeError("Report Type must be a string")
      .default("Summary"),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
    isSubLedger: yup.boolean().optional().default(false),
  })
  .required();

export default function SummaryTrialBalancePage() {
  const [reportState, setReportState] =
    useState<SummaryTrialBalanceResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<SummaryTrialBalanceRequest | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<SummaryTrialBalanceFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── branchId[] -> branchIds (comma string). "All" resolves to full id list ──
  const toRequest = useCallback(
    (form: SummaryTrialBalanceFormValues): SummaryTrialBalanceRequest => {
      const selectedIds = (form.branchId ?? [])
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
        fromDate: form.fromDate || undefined,
        toDate: form.toDate || undefined,
        branchIds: resolvedIds.join(","),
        branchName,
        orderBy: form.orderBy || "",
        withClosingBalance: form.withClosingBalance ?? false,
        reportType: form.reportType || "Summary",
        sameCompanyName: form.sameCompanyName ?? true,
        visualReport: form.visualReport ?? false,
        isSubLedger: form.isSubLedger ?? false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: SummaryTrialBalanceRequest, format: string) =>
      summaryTrialBalanceService.api.summaryTrialBalanceCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SummaryTrialBalanceRequest) => {
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
      } catch (err) {
        setReportState({ isLoading: false });
        throw err;
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
      if (!lastRequest) return;

      const res = await callApi(lastRequest, format);
      const blob = responseToBlob(res.data, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = extractFilenameFromResponse(
        res,
        format,
        "SummaryTrialBalance",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<SummaryTrialBalanceFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <SummaryTrialBalanceForm
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
