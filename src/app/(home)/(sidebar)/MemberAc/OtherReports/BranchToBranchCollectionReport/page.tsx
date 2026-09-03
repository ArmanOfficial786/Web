// app/(home)/(sidebar)/MemberAc/reports/BranchToBranchCollectionReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type {
  BranchToBranchCollectionRequestDto,
  Pagination,
} from "types/api/api";
import BranchToBranchCollectionForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/BranchToBranchCollectionForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── Form-only shape ──────────────────────────────────────────────────────────
// Following the same pattern as DataEditedReport
export interface BranchToBranchCollectionFormValues extends Omit<
  BranchToBranchCollectionRequestDto,
  "branchFromId" | "branchToId" | "collectorId"
> {
  branchFromId?: number;
  branchToId?: number;
  collectorId?: number;
}

// ── Client-only response state (raw PDF blob URL + header pagination) ──────
export interface BranchToBranchCollectionResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<BranchToBranchCollectionFormValues> = yup
  .object({
    fromDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    toDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE)
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDateBs } = this.parent as { fromDateBs: string | null };
        if (!fromDateBs || !val) return true;
        return String(val) >= String(fromDateBs);
      }),
    branchFromId: yup.number().optional().default(0),
    branchToId: yup.number().optional().default(0),
    collectorId: yup.number().optional().default(0),
    reportType: yup.string().nullable().optional().default("All"),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function BranchToBranchCollectionPage() {
  const [reportState, setReportState] =
    useState<BranchToBranchCollectionResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<BranchToBranchCollectionRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<BranchToBranchCollectionFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  // ── Transform form values to API request (matching DataEditedReport pattern) ──
  const toRequest = useCallback(
    (
      form: BranchToBranchCollectionFormValues,
    ): BranchToBranchCollectionRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchFromId:
        form.branchFromId && form.branchFromId !== 0
          ? form.branchFromId
          : undefined,
      branchToId:
        form.branchToId && form.branchToId !== 0 ? form.branchToId : undefined,
      collectorId:
        form.collectorId && form.collectorId !== 0
          ? form.collectorId
          : undefined,
      reportType: form.reportType || "All",
      orderBy: form.orderBy || "",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  // ── API call method (matching DataEditedReport pattern) ──────────────────
  const callApi = useCallback(
    (request: BranchToBranchCollectionRequestDto, format: string) =>
      memberAccountService.api.branchToBranchCollectionCreate(request, {
        format,
      }),
    [],
  );

  // ── Fetch report (matching DataEditedReport pattern exactly) ─────────────
  const fetchReport = useCallback(
    async (request: BranchToBranchCollectionRequestDto) => {
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

  // ── Handle page change ────────────────────────────────────────────────────
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

  // ── Handle download (matching DataEditedReport pattern) ──────────────────
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
        "BranchToBranchCollection",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  // ── Handle form submission ───────────────────────────────────────────────
  const onSubmit: SubmitHandler<BranchToBranchCollectionFormValues> =
    useCallback(
      (formData) => fetchReport(toRequest(formData)),
      [fetchReport, toRequest],
    );

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <BranchToBranchCollectionForm
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
