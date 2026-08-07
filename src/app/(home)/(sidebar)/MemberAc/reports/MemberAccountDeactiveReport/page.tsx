// app/(home)/(sidebar)/MemberAc/reports/MemberAccountDeactive/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import memberAccountDeactiveService from "@/services/memberAccount/MemberAccountDeactiveService";
import type { MemberAccountDeactiveRequest, Pagination } from "types/api/api";
import MemberAccountDeactiveForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/MemberAccountDeacitveForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { useReportFormContext } from "@/contexts/ReportFormContext";

// ── branchId (multi-select array) is form-only — resolved into branchIds
// (comma string) on submit. reportType radio ("Active"|"Inactive") maps to
// isActive boolean; transactionType radio: "Saving" | "Loan". ──────────────
export interface MemberAccountDeactiveFormValues extends Omit<
  MemberAccountDeactiveRequest,
  "branchIds" | "isActive"
> {
  branchId?: number[];
  reportType?: "Active" | "Inactive";
}

// ── Client-only response state (raw PDF blob + header pagination) ───────────
export interface MemberAccountDeactiveResponseExtended {
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

const schema: yup.ObjectSchema<MemberAccountDeactiveFormValues> = yup
  .object({
    tillDate: yup
      .string()
      .required("Till Date is required")
      .nullable()
      .optional()
      .typeError("Till Date must be a valid date")
      .default(""),
    branchId: yup.array().of(yup.number().required()).optional().default([]),
    branchName: yup.string().nullable().optional().default("All"),
    duePeriod: yup.number().optional().default(1),
    transactionType: yup.string().nullable().optional().default("S"),
    typeId: yup.number().nullable().optional().default(0),
    reportType: yup
      .mixed<"Active" | "Inactive">()
      .oneOf(["Active", "Inactive"])
      .optional()
      .default("Active"),
    orderBy: yup.string().nullable().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function MemberAccountDeactivePage() {
  const [reportState, setReportState] =
    useState<MemberAccountDeactiveResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<MemberAccountDeactiveRequest | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberAccountDeactiveFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── branchId[] -> branchIds (comma string); reportType -> isActive boolean ──
  const toRequest = useCallback(
    (form: MemberAccountDeactiveFormValues): MemberAccountDeactiveRequest => {
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
        tillDate: normalizeBsDate(form.tillDate),
        branchIds: resolvedIds.join(","),
        branchName,
        duePeriod: form.duePeriod ?? 1,
        transactionType: form.transactionType || "Saving",
        typeId: form.typeId || 0,
        isActive: form.reportType === "Active",
        orderBy: form.orderBy || "",
        sameCompanyName: form.sameCompanyName ?? true,
        visualReport: form.visualReport ?? false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: MemberAccountDeactiveRequest, format: string) =>
      memberAccountDeactiveService.api.memberAccountDeactiveCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MemberAccountDeactiveRequest) => {
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
        "MemberAccountDeactive",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<MemberAccountDeactiveFormValues> = useCallback(
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
    <MemberAccountDeactiveForm
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
