// app/(home)/(sidebar)/Account/reports/SavingTypeWiseBalance/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { SavingTypeWiseBalanceRequest, Pagination } from "types/api/api";
import SavingTypeWiseBalanceForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/SavingAccountWiseReports/savingTypeWiseBalanceForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";

// ── branchId is a single number here (matches the Branch Name dropdown in
// the UI), not a multi-select array — the DTO's string field is derived
// from this number in toRequest(). ───────────────────────────────────────────
export interface SavingTypeWiseBalanceFormValues extends Omit<
  SavingTypeWiseBalanceRequest,
  "branchId"
> {
  branchId?: number;
}

// ── Client-only response state (raw PDF blob + header pagination) ───────────
export interface SavingTypeWiseBalanceResponseExtended {
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

const schema: yup.ObjectSchema<SavingTypeWiseBalanceFormValues> = yup
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
    branchId: yup.number().optional().default(2), // ✅ single value, matches BranchNameField
    branchName: yup.string().nullable().optional().default(""),
    collectionCenterId: yup.string().nullable().optional().default(""),
    memberGroupId: yup.string().nullable().optional().default(""),
    collectorId: yup.string().nullable().optional().default("0"),
    orderBy: yup.string().nullable().optional().default(""),
    isNepali: yup.boolean().optional().default(false),
    openingBalance: yup.boolean().optional().default(false),
    percentageBalance: yup.boolean().optional().default(false),
    groupByBranch: yup.boolean().optional().default(false),
    groupByCollectionCenter: yup.boolean().optional().default(false),
    groupByMemberGroup: yup.boolean().optional().default(false),
    viewCollector: yup.boolean().optional().default(false),
    viewDetail: yup.boolean().optional().default(true), // ✅ checked by default per image
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function SavingTypeWiseBalancePage() {
  const [reportState, setReportState] =
    useState<SavingTypeWiseBalanceResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<SavingTypeWiseBalanceRequest | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<SavingTypeWiseBalanceFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: SavingTypeWiseBalanceFormValues): SavingTypeWiseBalanceRequest => ({
      fromDate: normalizeBsDate(form.fromDate),
      toDate: normalizeBsDate(form.toDate),
      branchId: form.branchId != null ? String(form.branchId) : undefined,
      branchName: form.branchName || undefined,
      collectionCenterId: form.collectionCenterId || undefined,
      memberGroupId: form.memberGroupId || undefined,
      collectorId: form.collectorId || undefined,
      orderBy: form.orderBy || "",
      isNepali: form.isNepali ?? false,
      openingBalance: form.openingBalance ?? false,
      percentageBalance: form.percentageBalance ?? false,
      groupByBranch: form.groupByBranch ?? false,
      groupByCollectionCenter: form.groupByCollectionCenter ?? false,
      groupByMemberGroup: form.groupByMemberGroup ?? false,
      viewCollector: form.viewCollector ?? false,
      viewDetail: form.viewDetail ?? true,
      sameCompanyName: form.sameCompanyName ?? true,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: SavingTypeWiseBalanceRequest, format: string) =>
      memberAccountService.api.savingTypeWiseBalanceCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SavingTypeWiseBalanceRequest) => {
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
        "SavingTypeWiseBalance",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<SavingTypeWiseBalanceFormValues> = useCallback(
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
    <SavingTypeWiseBalanceForm
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
