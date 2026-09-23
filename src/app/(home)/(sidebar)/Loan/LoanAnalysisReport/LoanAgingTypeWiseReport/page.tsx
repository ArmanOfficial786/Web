"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanAgeingTypeWiseRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanAgeingTypeWiseForm from "@/components/reports/loanReport/LoanAnalysisReport/LoanAgeingTypeWiseForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

// ⚠️ Guessed wire values — confirm against backend.
// LoanAgeingTypeWiseRequestDto has no reportType field — these are UI-only for now.
const REPORT_TYPE_SCHEDULE_WISE = "ScheduleWise";

// branchIds arrives as string[] from OfficeNameField
export interface LoanAgeingTypeWiseFormValues extends Omit<
  LoanAgeingTypeWiseRequestDto,
  "branchIds" | "memberGroupId"
> {
  branchIds?: string[];
  memberGroupId?: string;
  reportType?: string; // ⚠️ UI-only — DTO has no such field, never sent
}

export interface LoanAgeingTypeWiseResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanAgeingTypeWiseFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    memberGroupId: yup.string().optional().default("-1"),
    penaltyType: yup.string().optional().default(""),
    withMemberCount: yup.boolean().optional().default(false),
    reportType: yup.string().optional().default(REPORT_TYPE_SCHEDULE_WISE),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: LoanAgeingTypeWiseFormValues,
): LoanAgeingTypeWiseRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  return {
    tillDateBs: v.tillDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    memberGroupId: v.memberGroupId || "-1",
    penaltyType: v.penaltyType || undefined,
    withMemberCount: v.withMemberCount ?? false,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
    // reportType intentionally omitted — ⚠️ UI-only, not on this DTO
  };
};

function LoanAgeingTypeWisePage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<LoanAgeingTypeWiseResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<LoanAgeingTypeWiseRequestDto | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<LoanAgeingTypeWiseFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: LoanAgeingTypeWiseRequestDto, format: string) =>
      loanService.api.loanAgeingTypeWiseCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanAgeingTypeWiseRequestDto): Promise<void> => {
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
      }
    },
    [callApi],
  );

  const handleDownload = useCallback(
    async (format: ReportFormat): Promise<void> => {
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
          "LoanAgeingTypeWiseReport",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        toast.error("Failed to download file.");
      }
    },
    [callApi, lastRequest],
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

  const onSubmit: SubmitHandler<LoanAgeingTypeWiseFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
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
    <LoanAgeingTypeWiseForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
    />
  );
}

export default LoanAgeingTypeWisePage;
