// app/(home)/(sidebar)/MemberAc/OtherReports/SavingIssueReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type { SavingIssueRequestDto, Pagination } from "types/api/api";
import SavingIssueForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/SavingIssueForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

export type SavingIssueFormValues = Omit<SavingIssueRequestDto, "branchIds"> & {
  branchIds?: string | number | Array<string | number> | null;
};

export interface SavingIssueResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<SavingIssueFormValues> = yup
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
    depositTypeId: yup.number().nullable().optional().default(null),
    collectorId: yup.number().nullable().optional().default(null),
    memberGroupId: yup.number().nullable().optional().default(null),
    reportMode: yup.string().nullable().optional().default(""), // ⚠️ not shown in UI — confirm if backend requires a value
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function SavingIssuePage() {
  const [reportState, setReportState] = useState<SavingIssueResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<SavingIssueRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset } =
    useForm<SavingIssueFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: SavingIssueFormValues): SavingIssueRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchIds: Array.isArray(form.branchIds)
        ? form.branchIds.join(",")
        : form.branchIds != null && form.branchIds !== ""
          ? String(form.branchIds)
          : undefined,
      branchName: form.branchName || undefined,
      orderBy: form.orderBy || "",
      depositTypeId: form.depositTypeId ?? undefined,
      collectorId: form.collectorId ?? undefined,
      memberGroupId: form.memberGroupId ?? undefined,
      reportMode: form.reportMode || undefined,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: SavingIssueRequestDto, format: string) =>
      memberAccountService.api.savingIssueCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SavingIssueRequestDto) => {
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
        "SavingIssueReport",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<SavingIssueFormValues> = useCallback(
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
    <SavingIssueForm
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
