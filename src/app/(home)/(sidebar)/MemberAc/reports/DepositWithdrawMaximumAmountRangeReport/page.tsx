// app/(home)/(sidebar)/Account/reports/DepositWithdrawMaxAmountRangeReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import depositWithdrawMaxAmountRangeService from "@/services/memberAccount/DepositWithdrawMaxAmountRangeService";
import type {
  DepositWithdrawMaxAmountRangeRequest,
  Pagination,
} from "types/api/api";
import DepositWithdrawMaxAmountRangeForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/DepositWithdrawMaxAmountRangeForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { useReportFormContext } from "@/contexts/ReportFormContext";

// ── branchId (multi-select array) is form-only — resolved into branchIds
// (comma string) on submit. transactionType is a form-only "1"|"2"|"3" radio,
// converted to a number for the DTO's int32 in toRequest(). ─────────────────
export interface DepositWithdrawMaxAmountRangeFormValues extends Omit<
  DepositWithdrawMaxAmountRangeRequest,
  "branchIds" | "transactionType"
> {
  branchId?: number[];
  transactionType?: "1" | "2" | "3";
}

// ── Client-only response state (raw PDF blob + header pagination) ───────────
export interface DepositWithdrawMaxAmountRangeResponseExtended {
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

// ── Normalize BS date string to "yyyy/MM/dd" regardless of picker's separator ──
function normalizeBsDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value.replace(/-/g, "/");
}

const schema: yup.ObjectSchema<DepositWithdrawMaxAmountRangeFormValues> = yup
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
    transactionType: yup
      .mixed<"1" | "2" | "3">()
      .oneOf(["1", "2", "3"])
      .optional()
      .default("3"), // "Both" as default
    amount: yup.number().optional().default(100000.0),
    orderBy: yup.string().nullable().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function DepositWithdrawMaxAmountRangePage() {
  const [reportState, setReportState] =
    useState<DepositWithdrawMaxAmountRangeResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<DepositWithdrawMaxAmountRangeRequest | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<DepositWithdrawMaxAmountRangeFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: DepositWithdrawMaxAmountRangeFormValues,
    ): DepositWithdrawMaxAmountRangeRequest => {
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
        fromDate: normalizeBsDate(form.fromDate),
        toDate: normalizeBsDate(form.toDate),
        branchIds: resolvedIds.join(","),
        branchName,
        transactionType: Number(form.transactionType ?? "3"),
        amount: form.amount ?? 100000.0,
        orderBy: form.orderBy || "",
        sameCompanyName: form.sameCompanyName ?? true,
        visualReport: form.visualReport ?? false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: DepositWithdrawMaxAmountRangeRequest, format: string) =>
      depositWithdrawMaxAmountRangeService.api.depositWithdrawMaxAmountRangeGenerateReportCreate(
        request,
        { format },
      ),
    [],
  );

  const fetchReport = useCallback(
    async (request: DepositWithdrawMaxAmountRangeRequest) => {
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
        "DepositWithdrawMaxAmountRange",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<DepositWithdrawMaxAmountRangeFormValues> =
    useCallback(
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
    <DepositWithdrawMaxAmountRangeForm
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
