// app/(home)/(sidebar)/Account/reports/DetailTrialBalance/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


import type { DetailTrialBalanceRequest, Pagination } from "types/api/api";
import DetailTrialBalanceForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/DeatialTrailBalanceForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import accountService from "@/services/Account/AccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── branchId here is already a single string on the DTO — no form-only shape needed ──
export type DetailTrialBalanceFormValues = DetailTrialBalanceRequest;

// ── Client-only response state (raw PDF blob + header pagination) ───────────
export interface DetailTrialBalanceResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

// ── Normalize BS date string to "yyyy/MM/dd" regardless of picker's separator ──
function normalizeBsDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value.replace(/-/g, "/");
}

const schema: yup.ObjectSchema<DetailTrialBalanceFormValues> = yup
  .object({
    fromDate: yup
      .string()
      .nullable()
      .required("From Date is required")
      .typeError("From Date must be a valid date")
      .default(""),
    toDate: yup
      .string()
      .nullable()
      .required("To Date is required")
      .typeError("To Date must be a valid date")
      .default(""),
    branchId: yup.string().nullable().optional().default("2"),
    branchName: yup.string().nullable().optional().default("All"),
    orderBy: yup.string().nullable().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function DetailTrialBalancePage() {
  const [reportState, setReportState] =
    useState<DetailTrialBalanceResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<DetailTrialBalanceRequest | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<DetailTrialBalanceFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: DetailTrialBalanceFormValues): DetailTrialBalanceRequest => ({
      fromDate: normalizeBsDate(form.fromDate),
      toDate: normalizeBsDate(form.toDate),
      branchId: form.branchId || undefined,
      branchName: form.branchName || undefined,
      orderBy: form.orderBy || "",
      sameCompanyName: form.sameCompanyName ?? true,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: DetailTrialBalanceRequest, format: string) =>
      accountService.api.detailTrialBalanceCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: DetailTrialBalanceRequest) => {
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
        // Interceptor shows the error toast — this just stops the spinner
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
        "DetailTrialBalance",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<DetailTrialBalanceFormValues> = useCallback(
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
    <DetailTrialBalanceForm
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
