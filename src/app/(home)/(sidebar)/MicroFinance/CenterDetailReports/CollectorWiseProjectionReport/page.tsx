"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  CollectorWiseProjectionRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import CollectorWiseProjectionForm from "@/components/reports/microFinance/centerDetailReports/CollectorWiseProjectionForm";
import microFinanceService from "@/services/MicroFinance/microFinanceService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export type CollectorWiseProjectionFormValues =
  CollectorWiseProjectionRequestDto;

export interface CollectorWiseProjectionResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<CollectorWiseProjectionFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE)
      .default(""),
    branchId: yup.string().nullable().optional().default("2"),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: CollectorWiseProjectionFormValues,
): CollectorWiseProjectionRequestDto => {
  return {
    tillDateBs: v.tillDateBs || undefined,
    branchId: v.branchId ?? "",
    visualReport: v.visualReport ?? false,
  };
};

function CollectorWiseProjectionPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<CollectorWiseProjectionResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<CollectorWiseProjectionRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<CollectorWiseProjectionFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: CollectorWiseProjectionRequestDto, format: string) =>
      microFinanceService.api.collectorWiseProjectionCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: CollectorWiseProjectionRequestDto): Promise<void> => {
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
        toast.error("Failed to generate report.");
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
          "CollectorWiseProjectionReport",
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

  const onSubmit: SubmitHandler<CollectorWiseProjectionFormValues> =
    useCallback((formData) => fetchReport(toRequest(formData)), [fetchReport]);

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <CollectorWiseProjectionForm
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

export default CollectorWiseProjectionPage;
