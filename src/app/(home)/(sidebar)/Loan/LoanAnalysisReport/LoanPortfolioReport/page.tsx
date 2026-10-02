"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanPortfolioRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanPortfolioForm from "@/components/reports/loanReport/LoanAnalysisReport/LoanPortfolioForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export interface LoanPortfolioFormValues extends Omit<
  LoanPortfolioRequestDto,
  "branchIds"
> {
  branchIds?: string[];
}

export interface LoanPortfolioResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<LoanPortfolioFormValues> = yup
  .object({
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (v: LoanPortfolioFormValues): LoanPortfolioRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  return {
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    visualReport: v.visualReport ?? false,
  };
};

function LoanPortfolioPage(): React.ReactElement {
  const [reportState, setReportState] = useState<LoanPortfolioResponseExtended>(
    { isLoading: false },
  );
  const [lastRequest, setLastRequest] =
    useState<LoanPortfolioRequestDto | null>(null);

  const { control, handleSubmit, setValue } = useForm<LoanPortfolioFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const callApi = useCallback(
    (request: LoanPortfolioRequestDto, format: string) =>
      loanService.api.loanPortfolioCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanPortfolioRequestDto): Promise<void> => {
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
          "LoanPortfolioReport",
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

  const onSubmit: SubmitHandler<LoanPortfolioFormValues> = useCallback(
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
    <LoanPortfolioForm
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

export default LoanPortfolioPage;
