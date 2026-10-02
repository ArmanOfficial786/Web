"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  FamDetailReportRequestDto as ApiFamDetailReportRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import { ASSET_TYPE_FIXED } from "@/components/reportForm/Asset/AssetCategoryField";
import FamDetailReportForm from "@/components/reports/asset/FamDetailReportForm";
import assetService from "@/services/Asset/assetService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export type FamDetailReportRequestDto = ApiFamDetailReportRequestDto;

const REPORT_TYPE_SUMMARY = "Summary";

export interface FamDetailReportFormValues extends Omit<
  FamDetailReportRequestDto,
  "branchIds" | "categoryId" | "assetId" | "clearanceStatusId"
> {
  branchIds?: string[];
  type?: string;
  categoryId?: number | null;
  assetId?: number | null;
  clearanceStatusId?: number | null;
}

export interface FamDetailReportResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<FamDetailReportFormValues> = yup
  .object({
    toDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    type: yup.string().optional().default(ASSET_TYPE_FIXED),
    categoryId: yup.number().nullable().optional().default(-1),
    assetId: yup.number().nullable().optional().default(-1),
    clearanceStatusId: yup.number().nullable().optional().default(-1),
    reportType: yup.string().optional().default(REPORT_TYPE_SUMMARY),
    isSummary: yup.boolean().optional().default(true),
    isTypeWise: yup.boolean().optional().default(false),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (v: FamDetailReportFormValues): FamDetailReportRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  const reportType = v.reportType || REPORT_TYPE_SUMMARY;
  return {
    toDateBs: v.toDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    categoryId: Number(v.categoryId ?? -1),
    assetId: Number(v.assetId ?? -1),
    clearanceStatusId: Number(v.clearanceStatusId ?? -1),
    reportType,
    isSummary: reportType === REPORT_TYPE_SUMMARY,
    isTypeWise: v.isTypeWise ?? false,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function FamDetailReportPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<FamDetailReportResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<FamDetailReportRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<FamDetailReportFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: FamDetailReportRequestDto, format: string) =>
      assetService.api.famDetailReportCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: FamDetailReportRequestDto): Promise<void> => {
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
          "FamDetailReport",
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

  const onSubmit: SubmitHandler<FamDetailReportFormValues> = useCallback(
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
    <FamDetailReportForm
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

export default FamDetailReportPage;
