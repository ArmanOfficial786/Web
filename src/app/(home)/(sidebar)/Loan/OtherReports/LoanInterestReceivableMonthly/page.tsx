"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import LoanInterestReceivableMonthlyForm from "@/components/reports/loanReport/otherReports/LoanInterestReceivableMonthlyForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  LoanInterestReceivableMonthlyRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

export type LoanInterestReceivableMonthlyFormValues =
  LoanInterestReceivableMonthlyRequestDto;

export interface LoanInterestReceivableMonthlyResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<LoanInterestReceivableMonthlyFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required("Till Date is required")
      .typeError("Till Date must be a valid date"),
    branchIds: yup.string().nullable().optional().default("2"),
    memberGroupId: yup.number().optional().default(-1),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function LoanInterestReceivableMonthlyPage() {
  const [reportState, setReportState] =
    useState<LoanInterestReceivableMonthlyResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<LoanInterestReceivableMonthlyRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanInterestReceivableMonthlyFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: LoanInterestReceivableMonthlyFormValues,
    ): LoanInterestReceivableMonthlyRequestDto => ({
      tillDateBs: form.tillDateBs || undefined,
      branchIds: form.branchIds || "-1",
      memberGroupId: form.memberGroupId,
      orderBy: form.orderBy || "",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: LoanInterestReceivableMonthlyRequestDto, format: string) =>
      loanService.api.loanInterestReceivableMonthlyCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanInterestReceivableMonthlyRequestDto) => {
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
        toast.error("Failed to generate report.");
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
        toast.warning("Please generate the report first");
        return;
      }
      try {
        const res = await callApi(lastRequest, format);
        const url = URL.createObjectURL(responseToBlob(res.data, format));
        const link = document.createElement("a");
        link.href = url;
        link.download = extractFilenameFromResponse(
          res,
          format,
          "LoanInterestReceivableMonthlyReport",
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<LoanInterestReceivableMonthlyFormValues> =
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
    <LoanInterestReceivableMonthlyForm
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
