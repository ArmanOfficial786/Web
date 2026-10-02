"use client";

import DepositUnverifiedForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/SavingAccountWiseReports/DepositeUnverifiedForm";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { DepositUnverifiedRequest, Pagination } from "types/api/api";
import * as yup from "yup";

export interface DepositUnverifiedFormValues extends Omit<
  DepositUnverifiedRequest,
  "branchIds"
> {
  branchId?: number;
}

export interface DepositUnverifiedResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

function normalizeBsDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value.replace(/-/g, "/");
}

const schema: yup.ObjectSchema<DepositUnverifiedFormValues> = yup
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
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDate } = this.parent as { fromDate: string | null };
        if (!fromDate || !val) return true;
        return String(val) >= String(fromDate);
      }),
    memberId: yup.string().nullable().optional().default(null),
    memberName: yup.string().nullable().optional().default(""),
    branchId: yup.number().optional().default(2),
    branchName: yup.string().nullable().optional().default(""),
    depositTypeId: yup.string().nullable().optional().default("-1"),
    collectorId: yup.string().nullable().optional().default("-1"),
    orderBy: yup.string().nullable().optional().default(""),
    reportType: yup.string().nullable().optional().default("All"),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function DepositUnverifiedPage() {
  const [reportState, setReportState] =
    useState<DepositUnverifiedResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<DepositUnverifiedRequest | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<DepositUnverifiedFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: DepositUnverifiedFormValues): DepositUnverifiedRequest => ({
      fromDate: normalizeBsDate(form.fromDate),
      toDate: normalizeBsDate(form.toDate),
      memberId: form.memberId || null,
      memberName: form.memberName || undefined,
      branchIds: form.branchId != null ? String(form.branchId) : undefined,
      branchName: form.branchName || undefined,
      depositTypeId: form.depositTypeId || undefined,
      collectorId: form.collectorId || undefined,
      orderBy: form.orderBy || "",
      reportType: form.reportType || "All",
      sameCompanyName: form.sameCompanyName ?? true,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: DepositUnverifiedRequest, format: string) =>
      memberAccountService.api.depositUnverifiedGenerateReportCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: DepositUnverifiedRequest) => {
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
        "DepositUnverified",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<DepositUnverifiedFormValues> = useCallback(
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
    <DepositUnverifiedForm
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
