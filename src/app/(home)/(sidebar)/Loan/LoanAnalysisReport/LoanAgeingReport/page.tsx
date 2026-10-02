"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanAgeingRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanAgeingForm from "@/components/reports/loanReport/LoanAnalysisReport/LoanAgeingForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

const DATE_TYPE_ISSUE_DATE = "IssueDate";
const REPORT_TYPE_SCHEDULE_WISE = "ScheduleWise";
const AGEING_ON_PRINCIPAL = "Principal";

export interface LoanAgeingFormValues extends Omit<
  LoanAgeingRequestDto,
  "branchIds" | "memberGroupId" | "collectorId"
> {
  branchIds?: string[];
  memberGroupId?: string;
  collectorId?: string;
  reportType?: string;
}

export interface LoanAgeingResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanAgeingFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    memberGroupId: yup.string().optional().default("-1"),
    collectorId: yup.string().optional().default("-1"),
    showLoanIssueDate: yup.string().optional().default(DATE_TYPE_ISSUE_DATE),
    reportType: yup.string().optional().default(REPORT_TYPE_SCHEDULE_WISE),
    ageingOn: yup.string().optional().default(AGEING_ON_PRINCIPAL),
    penaltyType: yup.string().optional().default(""),
    isNepaliReport: yup.boolean().optional().default(false),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (v: LoanAgeingFormValues): LoanAgeingRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);

  return {
    tillDateBs: v.tillDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    memberGroupId: v.memberGroupId || "-1",
    collectorId: v.collectorId || "-1",
    showLoanIssueDate: v.showLoanIssueDate || DATE_TYPE_ISSUE_DATE,
    ageingOn: v.ageingOn || AGEING_ON_PRINCIPAL,
    penaltyType: v.penaltyType || undefined,
    isNepaliReport: v.isNepaliReport ?? false,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function LoanAgeingPage(): React.ReactElement {
  const [reportState, setReportState] = useState<LoanAgeingResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<LoanAgeingRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue } = useForm<LoanAgeingFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const callApi = useCallback(
    (request: LoanAgeingRequestDto, format: string) =>
      loanService.api.loanAgeingCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanAgeingRequestDto): Promise<void> => {
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
          "LoanAgeingReport",
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

  const onSubmit: SubmitHandler<LoanAgeingFormValues> = useCallback(
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
    <LoanAgeingForm
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

export default LoanAgeingPage;
