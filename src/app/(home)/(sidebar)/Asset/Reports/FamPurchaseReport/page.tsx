"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  FamPurchaseReportRequestDto as ApiFamPurchaseReportRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import { ASSET_TYPE_FIXED } from "@/components/reportForm/Asset/AssetCategoryField";
import FamPurchaseReportForm from "@/components/reports/asset/FamPurchaseReportForm";
import assetService from "@/services/Asset/assetService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export type FamPurchaseReportRequestDto = ApiFamPurchaseReportRequestDto;

// branchIds arrives as string[] from OfficeNameField.
// categoryId is a number on the DTO; `type` is UI-only (drives the category list).
export interface FamPurchaseReportFormValues extends Omit<
  FamPurchaseReportRequestDto,
  "branchIds" | "categoryId"
> {
  branchIds?: string[];
  categoryId?: number | null;
  type?: string; // UI-only — drives AssetCategoryField fetch
  reportType?: string | null;
}

export interface FamPurchaseReportResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<FamPurchaseReportFormValues> = yup
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
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    type: yup.string().optional().default(ASSET_TYPE_FIXED),
    categoryId: yup.number().nullable().optional().default(-1),
    reportType: yup.string().nullable().optional().default(""),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: FamPurchaseReportFormValues,
): FamPurchaseReportRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  return {
    fromDateBs: v.fromDateBs || undefined,
    toDateBs: v.toDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    categoryId: Number(v.categoryId ?? -1),
    reportType: v.reportType || undefined,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function FamPurchaseReportPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<FamPurchaseReportResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<FamPurchaseReportRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<FamPurchaseReportFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: FamPurchaseReportRequestDto, format: string) =>
      assetService.api.famPurchaseReportCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: FamPurchaseReportRequestDto): Promise<void> => {
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
          "FamPurchaseReport",
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

  const onSubmit: SubmitHandler<FamPurchaseReportFormValues> = useCallback(
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
    <FamPurchaseReportForm
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

export default FamPurchaseReportPage;
