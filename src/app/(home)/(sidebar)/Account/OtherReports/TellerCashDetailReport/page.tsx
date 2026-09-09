"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { TellerCashDetailRequestDto, Pagination } from "types/api/api";
import TellerCashDetailForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/OtherReports/TellerCashDetailForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import accountService from "@/services/Account/AccountService";

export interface TellerCashDetailFormValues extends Omit<
  TellerCashDetailRequestDto,
  "transactionDateBs" | "tellerId" | "branchId"
> {
  tillDateBs?: string | null;
  tellerId?: number;
  branchId?: number;
  reportType: "Detail" | "Summary";
}

export interface TellerCashDetailResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DEFAULT_PAGINATION: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const DATE_REQUIRED_MESSAGE = "Please select the transaction date";
const TELLER_REQUIRED_MESSAGE = "Select Date for TellerName";

const schema: yup.ObjectSchema<TellerCashDetailFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    branchId: yup.number().optional().default(-1),
    tellerId: yup
      .number()
      .optional()
      .required(TELLER_REQUIRED_MESSAGE)
      .test(
        "teller-selected",
        TELLER_REQUIRED_MESSAGE,
        (val) => typeof val === "number" && val >= 0,
      )
      .default(-1),
    reportType: yup
      .string()
      .oneOf(["Detail", "Summary"])
      .required()
      .default("Detail"),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function TellerCashDetailReportPage() {
  const [reportState, setReportState] =
    useState<TellerCashDetailResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<TellerCashDetailRequestDto | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TellerCashDetailFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
    mode: "onSubmit",
  });

  const toRequest = useCallback(
    (form: TellerCashDetailFormValues): TellerCashDetailRequestDto => ({
      transactionDateBs: form.tillDateBs || undefined,
      branchId: form.branchId === undefined ? undefined : String(form.branchId),
      tellerId: form.tellerId === undefined ? undefined : String(form.tellerId),
      orderBy: form.orderBy || "",
    }),
    [],
  );

  const callApi = useCallback(
    (request: TellerCashDetailRequestDto, format: string) =>
      accountService.api.tellerCashDetailCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: TellerCashDetailRequestDto) => {
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
            return raw ? (JSON.parse(raw) as Pagination) : DEFAULT_PAGINATION;
          } catch {
            return DEFAULT_PAGINATION;
          }
        })();

        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });
      } catch (err) {
        setReportState({ isLoading: false });
        throw err;
      }
    },
    [callApi],
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

  const handleDownload = useCallback(
    async (format: ReportFormat) => {
      if (!lastRequest) return;

      const res = await callApi(lastRequest, format);
      const blob = responseToBlob(res.data, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = extractFilenameFromResponse(
        res,
        format,
        "TellerCashDetail",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<TellerCashDetailFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
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
    <TellerCashDetailForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      errors={errors}
    />
  );
}
