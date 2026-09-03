// app/(home)/(sidebar)/MemberAc/OtherReports/MiscellaneousIncomeReport/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type { MiscellaneousIncomeRequestDto, Pagination } from "types/api/api";
import MiscellaneousIncomeForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/MiscellaneousIncomeForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
export type MiscellaneousIncomeFormValues = Omit<
  MiscellaneousIncomeRequestDto,
  "branchIds"
> & {
  memberName?: string | null;
  branchIds?: string | Array<string | number> | null;
};

export interface MiscellaneousIncomeResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<MiscellaneousIncomeFormValues> = yup
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
      .mixed<string | Array<string | number>>()
      .nullable()
      .optional()
      .default([]),
    reportType: yup
      .string()
      .oneOf(["Miscellaneous", "Fund"]) // ⚠️ confirm exact backend codes
      .nullable()
      .optional()
      .default("Miscellaneous"),
    orderBy: yup.string().nullable().optional().default(""),
    branchName: yup.string().nullable().optional().default(""),
    memberId: yup.number().nullable().optional().default(null),
    memberName: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function MiscellaneousIncomePage() {
  const [reportState, setReportState] =
    useState<MiscellaneousIncomeResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<MiscellaneousIncomeRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<MiscellaneousIncomeFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: MiscellaneousIncomeFormValues): MiscellaneousIncomeRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchIds: Array.isArray(form.branchIds)
        ? form.branchIds.join(",")
        : form.branchIds || undefined,
      branchName: form.branchName || undefined,
      reportType: form.reportType || "Miscellaneous",
      orderBy: form.orderBy || "",
      memberId: form.memberId || undefined,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: MiscellaneousIncomeRequestDto, format: string) =>
      memberAccountService.api.miscellaneousIncomeCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MiscellaneousIncomeRequestDto) => {
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
        "MiscellaneousIncomeReport",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<MiscellaneousIncomeFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <MiscellaneousIncomeForm
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
