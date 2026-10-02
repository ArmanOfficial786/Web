"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  RemittancePaymentDetailRequestDto as ApiRemittancePaymentDetailRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import RemittancePaymentDetailForm from "@/components/reports/remit/RemittancePaymentDetailForm";
import remitService from "@/services/Remit/remitService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export type RemittancePaymentDetailRequestDto =
  ApiRemittancePaymentDetailRequestDto;

export interface RemittancePaymentDetailFormValues extends Omit<
  RemittancePaymentDetailRequestDto,
  "branchIds" | "remittanceTypeId" | "remittanceServiceType"
> {
  branchIds?: string[];
  remittanceTypeId?: number | null;
  serviceType?: string;
}

export interface RemittancePaymentDetailResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<RemittancePaymentDetailFormValues> = yup
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
    serviceType: yup.string().optional().default("-1"),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: RemittancePaymentDetailFormValues,
): RemittancePaymentDetailRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  return {
    fromDateBs: v.fromDateBs || undefined,
    toDateBs: v.toDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    remittanceTypeId: Number(v.remittanceTypeId ?? -1),
    remittanceServiceType: v.serviceType || "-1",
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function RemittancePaymentDetailPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<RemittancePaymentDetailResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<RemittancePaymentDetailRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<RemittancePaymentDetailFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: RemittancePaymentDetailRequestDto, format: string) =>
      remitService.api.remittancePaymentDetailCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: RemittancePaymentDetailRequestDto): Promise<void> => {
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
          "RemittancePaymentDetailReport",
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

  const onSubmit: SubmitHandler<RemittancePaymentDetailFormValues> =
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
    <RemittancePaymentDetailForm
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

export default RemittancePaymentDetailPage;
