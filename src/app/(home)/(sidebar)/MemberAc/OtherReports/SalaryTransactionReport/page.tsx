// app/(home)/(sidebar)/MemberAc/OtherReports/SalaryTransactionReport/page.tsx
"use client";

import SalaryTransactionForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/SalaryTransactionFrom";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { Pagination, SalaryTransactionRequestDto } from "types/api/api";
import * as yup from "yup";

// UI-only field — never sent to the API
export type SalaryTransactionFormValues = Omit<
  SalaryTransactionRequestDto,
  "branchIds"
> & {
  branchIds?: string | number | Array<string | number> | null;
  branchName?: string | null;
};

export interface SalaryTransactionResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<SalaryTransactionFormValues> = yup
  .object({
    fromDateBs: yup
      .string()
      .required("From Date is required")
      .nullable()
      .optional()
      .typeError("From Date must be a valid date"),
    toDateBs: yup
      .string()
      .required("To Date is required")
      .nullable()
      .optional()
      .typeError("To Date must be a valid date")
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDateBs } = this.parent as { fromDateBs: string | null };
        if (!fromDateBs || !val) return true;
        return String(val) >= String(fromDateBs);
      }),
    branchIds: yup
      .mixed<string | number | Array<string | number>>()
      .nullable()
      .optional()
      .default(""),
    branchName: yup.string().nullable().optional().default(""),
    orderBy: yup.string().nullable().optional().default(""),

    reportType: yup.number().optional().default(1),
    transferOn: yup
      .string()
      .oneOf(["all", "saving", "bank"])
      .nullable()
      .optional()
      .default("all"),
    staffSelection: yup
      .string()
      .oneOf(["officewise", "allstaff"])
      .nullable()
      .optional()
      .default("officewise"),
    staffId: yup.number().nullable().optional().default(-1),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function SalaryTransactionPage() {
  const [reportState, setReportState] =
    useState<SalaryTransactionResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<SalaryTransactionRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset, watch } =
    useForm<SalaryTransactionFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: SalaryTransactionFormValues): SalaryTransactionRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchIds: Array.isArray(form.branchIds)
        ? form.branchIds.join(",")
        : form.branchIds != null && form.branchIds !== ""
          ? String(form.branchIds)
          : undefined,
      branchName: form.branchName || undefined,
      orderBy: form.orderBy || "",
      reportType: form.reportType ?? undefined,
      transferOn: form.transferOn || "all",
      staffSelection: form.staffSelection || "officewise",
      staffId: form.staffId ?? undefined,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: SalaryTransactionRequestDto, format: string) =>
      memberAccountService.api.salaryTransactionCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SalaryTransactionRequestDto) => {
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
      } catch (error) {
        console.error("Report generation error:", error);
        toast.error("Failed to generate report");
        setReportState({ isLoading: false });
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
        "SalaryTransactionReport",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<SalaryTransactionFormValues> = useCallback(
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
    <SalaryTransactionForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      watch={watch}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
    />
  );
}
