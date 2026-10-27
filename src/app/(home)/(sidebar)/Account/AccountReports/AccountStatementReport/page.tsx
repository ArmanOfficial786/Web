"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

import AccountStatement, {
  type ReportFormat,
} from "@/components/reports/accountReport/AccountingReports/AccountStatement";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import accountService from "@/services/Account/AccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import type { AccountStatementRequest, Pagination } from "types/api/api";

export interface AccountStatementRequestExtended extends AccountStatementRequest {
  branchId?: number[];
}

export interface AccountStatementResponseExtended {
  isLoading: boolean;
  pdfData?: string;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<AccountStatementRequestExtended> = yup
  .object({
    fromDate: yup
      .string()
      .required("From Date is required")
      .nullable()
      .optional()
      .typeError("From Date must be a valid date"),
    toDate: yup
      .string()
      .required("To Date is required")
      .nullable()
      .optional()
      .typeError("To Date must be a valid date")
      .test(
        "date-order",
        "Till Date cannot be before From Date",
        function (val) {
          const { fromDate } = this.parent as { fromDate: string | null };
          if (!fromDate || !val) return true;
          return String(val) >= String(fromDate);
        },
      ),
    branchId: yup.array().of(yup.number().required()).optional().default([]),
    branchSelected: yup.string().nullable().optional(),
    branchName: yup.string().nullable().optional(),
    sameCompanyName: yup.boolean().optional().default(true),
    reportType: yup
      .string()
      .nullable()
      .optional()
      .typeError("Report Type must be a string")
      .default("Summary"),
    transactionType: yup
      .string()
      .nullable()
      .optional()
      .typeError("Transaction Type must be a string")
      .default("All"),
    orderBy: yup.string().nullable().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function AccountStatementPage() {
  const [reportState, setReportState] =
    useState<AccountStatementResponseExtended>({
      isLoading: false,
    });

  const [lastRequest, setLastRequest] =
    useState<AccountStatementRequest | null>(null);
  const { branchOptions } = useReportFormContext();

  useEffect(() => {
    const pdfData = reportState.pdfData;
    return () => {
      if (pdfData) URL.revokeObjectURL(pdfData);
    };
  }, [reportState.pdfData]);

  const { control, handleSubmit, setValue, reset } =
    useForm<AccountStatementRequestExtended>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: AccountStatementRequestExtended): AccountStatementRequest => {
      const selectedIds = (form.branchId ?? [])
        .map(Number)
        .filter((id) => id > 0);
      const allIds = branchOptions
        .map((o) => Number(o.id))
        .filter((id) => id > 0);
      const isAll = selectedIds.length === 0;
      const resolvedIds = isAll ? allIds : selectedIds;

      return {
        fromDate: form.fromDate || undefined,
        toDate: form.toDate || undefined,
        branchSelected: isAll ? "-1" : selectedIds.join(","),
        branchName:
          branchOptions
            .filter((o) => resolvedIds.includes(Number(o.id)))
            .map((o) => o.name)
            .join(", ") || undefined,
        sameCompanyName: form.sameCompanyName,
        reportType: form.reportType || undefined,
        transactionType: form.transactionType || undefined,
        orderBy: form.orderBy || "",
        visualReport: form.visualReport || false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: AccountStatementRequest, format: string) =>
      accountService.api.accountStatementAccountStatementReportCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: AccountStatementRequest) => {
      setLastRequest(null);
      setReportState({ isLoading: true });

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
        console.log("PDF Data URL:", pdfData); // Log the PDF data URL for debugging

        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });
      } catch (err) {
        setReportState({ isLoading: false });
        toast.error(
          `Failed to load report: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
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
          "AccountStatement",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error(
          `Download failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<AccountStatementRequestExtended> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <AccountStatement
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
