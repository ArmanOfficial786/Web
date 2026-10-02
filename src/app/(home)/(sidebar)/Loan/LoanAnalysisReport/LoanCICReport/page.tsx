"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanCICRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanCICForm from "@/components/reports/loanReport/LoanAnalysisReport/LoanCICForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

const PROVISION_TYPE_SCHEDULE_WISE = "ScheduleWise";

export interface LoanCICFormValues extends Omit<
  LoanCICRequestDto,
  "branchIds" | "loanTypeId"
> {
  branchIds?: string[];
  loanTypeId?: string;
}

export interface LoanCICResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanCICFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    loanTypeId: yup.string().optional().default("-1"),
    provisionType: yup
      .string()
      .optional()
      .default(PROVISION_TYPE_SCHEDULE_WISE),
    enable1To30Days: yup.boolean().optional().default(false),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (v: LoanCICFormValues): LoanCICRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  return {
    tillDateBs: v.tillDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    loanTypeId: v.loanTypeId || undefined,
    provisionType: v.provisionType || PROVISION_TYPE_SCHEDULE_WISE,
    enable1To30Days: v.enable1To30Days ?? false,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function LoanCICPage(): React.ReactElement {
  const [reportState, setReportState] = useState<LoanCICResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<LoanCICRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue } = useForm<LoanCICFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const callApi = useCallback(
    (request: LoanCICRequestDto, format: string) =>
      loanService.api.loanCicCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanCICRequestDto): Promise<void> => {
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
          "LoanCICReport",
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

  const onSubmit: SubmitHandler<LoanCICFormValues> = useCallback(
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
    <LoanCICForm
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

export default LoanCICPage;
