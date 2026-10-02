"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { Pagination, RemitReceiptPrintRequestDto } from "types/api/api";

import * as yup from "yup";

import RemitReceiptPrintForm from "@/components/reports/remit/RemitReceiptPrintForm";
import remitService from "@/services/Remit/remitService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export type RemittanceReceiptPrintRequestDto = RemitReceiptPrintRequestDto;

const RECEIPT_OF_PAYMENT = "Payment";
const GET_RECEIPT_DOUBLE = "Double";

export interface RemitReceiptPrintFormValues extends Omit<
  RemittanceReceiptPrintRequestDto,
  "branchIds" | "isReceived" | "remittanceDetailId"
> {
  branchIds?: string[];
  entryBy?: number | null;
  getRemittanceReceiptOf?: string | null;
  remittanceReceiptId?: number | null;
  getReceipt?: string;
}

export interface RemitReceiptPrintResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<RemitReceiptPrintFormValues> = yup
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
    entryBy: yup.number().nullable().optional().default(0),
    getRemittanceReceiptOf: yup.string().optional().default(RECEIPT_OF_PAYMENT),
    remittanceReceiptId: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue == null ? -1 : value,
      )
      .nullable()
      .optional()
      .default(-1),
    getReceipt: yup.string().optional().default(GET_RECEIPT_DOUBLE),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: RemitReceiptPrintFormValues,
): RemittanceReceiptPrintRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  const receiptId =
    v.remittanceReceiptId == null ? Number.NaN : Number(v.remittanceReceiptId);

  return {
    fromDateBs: v.fromDateBs || undefined,
    toDateBs: v.toDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    isReceived: v.getRemittanceReceiptOf || RECEIPT_OF_PAYMENT,
    remittanceDetailId: Number.isFinite(receiptId) ? receiptId : -1,
    visualReport: v.visualReport ?? false,
  };
};

function RemitReceiptPrintPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<RemitReceiptPrintResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<RemittanceReceiptPrintRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<RemitReceiptPrintFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: RemittanceReceiptPrintRequestDto, format: string) =>
      remitService.api.remitReceiptPrintCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: RemittanceReceiptPrintRequestDto): Promise<void> => {
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
          "RemitReceiptPrintReport",
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

  const onSubmit: SubmitHandler<RemitReceiptPrintFormValues> = useCallback(
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
    <RemitReceiptPrintForm
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

export default RemitReceiptPrintPage;
