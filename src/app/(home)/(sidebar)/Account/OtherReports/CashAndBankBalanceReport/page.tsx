"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

import CashAndBankBalanceForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/OtherReports/CashAndBankBalanceForm";
import accountService from "@/services/Account/AccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import type { CashAndBankBalanceRequestDto, Pagination } from "types/api/api";

export type CashAndBankBalanceFormValues = Omit<
  CashAndBankBalanceRequestDto,
  "visualReport"
> & {
  visualReport?: boolean;
};

export interface CashAndBankBalanceResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select till date";

const schema: yup.ObjectSchema<CashAndBankBalanceFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    branchId: yup.string().nullable().optional().default("-1"),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
    nepaliReport: yup.boolean().optional().default(false),
  })
  .required();

export default function CashAndBankBalancePage() {
  const [reportState, setReportState] =
    useState<CashAndBankBalanceResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<CashAndBankBalanceRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<CashAndBankBalanceFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (form: CashAndBankBalanceFormValues): CashAndBankBalanceRequestDto => ({
      tillDateBs: form.tillDateBs || undefined,
      branchId: form.branchId || "-1",
      orderBy: form.orderBy || "",
      nepaliReport: form.nepaliReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: CashAndBankBalanceRequestDto, format: string) =>
      accountService.api.cashAndBankBalanceCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: CashAndBankBalanceRequestDto) => {
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

        const pdfData = URL.createObjectURL(responseToBlob(res.data, "PDF"));
        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });
      } catch {
        toast.error("Failed to load report.");
        setReportState((prev) => ({ ...prev, isLoading: false }));
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
          "CashAndBankBalance",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Download failed.",
        );
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<CashAndBankBalanceFormValues> = useCallback(
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
    <CashAndBankBalanceForm
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
