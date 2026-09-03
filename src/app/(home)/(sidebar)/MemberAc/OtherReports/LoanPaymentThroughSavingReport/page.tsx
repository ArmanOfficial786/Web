// app/(home)/(sidebar)/MemberAc/OtherReports/LoanPaymentThroughSavingReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type {
  LoanPaymentThroughSavingRequestDto,
  Pagination,
} from "types/api/api";
import LoanPaymentThroughSavingForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/LoanPaymentForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

export type LoanPaymentThroughSavingFormValues = Omit<
  LoanPaymentThroughSavingRequestDto,
  "branchIds"
> & {
  branchIds?: string | Array<string | number> | null;
};

export interface LoanPaymentThroughSavingResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<LoanPaymentThroughSavingFormValues> = yup
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
    orderBy: yup.string().nullable().optional().default(""),
    reportView: yup
      .string()
      .oneOf(["Vertical", "Horizontal"])
      .nullable()
      .optional()
      .default("Vertical"),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function LoanPaymentThroughSavingPage() {
  const [reportState, setReportState] =
    useState<LoanPaymentThroughSavingResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<LoanPaymentThroughSavingRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanPaymentThroughSavingFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (
      form: LoanPaymentThroughSavingFormValues,
    ): LoanPaymentThroughSavingRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchIds: Array.isArray(form.branchIds)
        ? form.branchIds.join(",")
        : form.branchIds || undefined,
      orderBy: form.orderBy || "",
      reportView: form.reportView || "Vertical",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: LoanPaymentThroughSavingRequestDto, format: string) =>
      memberAccountService.api.loanPaymentThroughSavingCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanPaymentThroughSavingRequestDto) => {
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
        "LoanPaymentThroughSavingReport",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<LoanPaymentThroughSavingFormValues> =
    useCallback(
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
    <LoanPaymentThroughSavingForm
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
