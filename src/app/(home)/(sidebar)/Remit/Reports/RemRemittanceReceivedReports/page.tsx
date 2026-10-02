"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  RemittanceReceivedRequestDto as ApiRemittanceReceivedRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import RemittanceReceivedForm from "@/components/reports/remit/RemittanceReceivedForm";
import remitService from "@/services/Remit/remitService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export type RemittanceReceivedRequestDto = ApiRemittanceReceivedRequestDto;

export interface RemittanceReceivedFormValues extends Omit<
  RemittanceReceivedRequestDto,
  "branchIds" | "remittanceTypeId"
> {
  branchIds?: string[];
  remittanceTypeId?: number | null;
}

export interface RemittanceReceivedResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<RemittanceReceivedFormValues> = yup
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
    remittanceTypeId: yup.number().nullable().optional().default(-1),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: RemittanceReceivedFormValues,
): RemittanceReceivedRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  return {
    fromDateBs: v.fromDateBs || undefined,
    toDateBs: v.toDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    remittanceTypeId: Number(v.remittanceTypeId ?? -1),
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function RemittanceReceivedPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<RemittanceReceivedResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<RemittanceReceivedRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<RemittanceReceivedFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: RemittanceReceivedRequestDto, format: string) =>
      remitService.api.remittanceReceivedCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: RemittanceReceivedRequestDto): Promise<void> => {
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
          "RemittanceReceivedReport",
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

  const onSubmit: SubmitHandler<RemittanceReceivedFormValues> = useCallback(
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
    <RemittanceReceivedForm
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

export default RemittanceReceivedPage;
