// app/(home)/(sidebar)/Account/reports/CashFlow/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import type { CashFlowRequest, Pagination } from "types/api/api";
import CashFlowForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/CashFlowForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import accountService from "@/services/Account/AccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── branchId here is already a single string on the DTO — no form-only shape needed ──
export type CashFlowFormValues = CashFlowRequest;

// ── Client-only response state (raw PDF blob + header pagination) ───────────
export interface CashFlowResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<CashFlowFormValues> = yup
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

export default function CashFlowPage() {
  const [reportState, setReportState] = useState<CashFlowResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<CashFlowRequest | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<CashFlowFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: CashFlowFormValues): CashFlowRequest => ({
      fromDate: form.fromDate,
      toDate: form.toDate,
      branchId: form.branchId || undefined,
      branchName: form.branchName || undefined,
      orderBy: form.orderBy || "",
      sameCompanyName: form.sameCompanyName ?? true,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: CashFlowRequest, format: string) =>
      accountService.api.cashFlowCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: CashFlowRequest) => {
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
      link.download = extractFilenameFromResponse(res, format, "CashFlow");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<CashFlowFormValues> = useCallback(
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
    <CashFlowForm
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
