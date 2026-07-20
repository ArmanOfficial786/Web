// app/(home)/(sidebar)/Account/reports/RatioAnalysisReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import ratioAnalysisService from "@/services/Account/RatioAnalysisService";
import type { RatioAnalysisRequest, Pagination } from "types/api/api";
import RatioAnalysisForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/RatioAnalysisForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";

// ── branchId is a plain string here (default "2"), same as MonthlyReport —
// NOT a multi-select array. viewType ("D"/"T") is still form-only, resolved
// into isTotalOnly (boolean) on submit. ──────────────────────────────────────
export interface RatioAnalysisFormValues extends Omit<
  RatioAnalysisRequest,
  "isTotalOnly"
> {
  viewType?: "D" | "T";
}

// ── Client-only response state (raw PDF blob + header pagination) ───────────
export interface RatioAnalysisResponseExtended {
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

const schema: yup.ObjectSchema<RatioAnalysisFormValues> = yup
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
    branchId: yup.string().nullable().optional().default("2"), // matches MonthlyReport's default
    branchName: yup.string().nullable().optional().default(""),
    provisionType: yup.string().nullable().optional().default("S"),
    enable1to30Days: yup.boolean().optional().default(false),
    viewType: yup.mixed<"D" | "T">().oneOf(["D", "T"]).optional().default("D"),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function RatioAnalysisPage() {
  const [reportState, setReportState] = useState<RatioAnalysisResponseExtended>(
    { isLoading: false },
  );
  const [lastRequest, setLastRequest] = useState<RatioAnalysisRequest | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset } =
    useForm<RatioAnalysisFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── branchId passes straight through as a string now; only viewType
  // ("D"/"T") needs converting to the isTotalOnly boolean ──────────────────
  const toRequest = useCallback(
    (form: RatioAnalysisFormValues): RatioAnalysisRequest => ({
      fromDate: normalizeBsDate(form.fromDate),
      toDate: normalizeBsDate(form.toDate),
      branchId: form.branchId ?? "2",
      branchName: form.branchName ?? "",
      provisionType: form.provisionType || "ScheduleWise",
      enable1to30Days: form.enable1to30Days ?? false,
      isTotalOnly: form.viewType === "T",
      sameCompanyName: form.sameCompanyName ?? true,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: RatioAnalysisRequest, format: string) =>
      ratioAnalysisService.api.ratioAnalysisCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: RatioAnalysisRequest) => {
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
      if (!lastRequest) return;

      const res = await callApi(lastRequest, format);
      const blob = responseToBlob(res.data, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = extractFilenameFromResponse(res, format, "RatioAnalysis");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<RatioAnalysisFormValues> = useCallback(
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
    <RatioAnalysisForm
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
