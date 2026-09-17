"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import LoanDefaulterDueSummaryForm from "@/components/reports/loanReport/otherReports/LoanDefaulterDueSummaryForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  LoanDefaulterDueSummaryRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

export type LoanDefaulterDueSummaryFormValues =
  LoanDefaulterDueSummaryRequestDto;

export interface LoanDefaulterDueSummaryResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const REPORT_TYPE_SCHEDULE_WISE = "ScheduleWiseInterestReport";

const schema: yup.ObjectSchema<LoanDefaulterDueSummaryFormValues> = yup
  .object({
    tillDate: yup
      .string()
      .required("Till Date is required")
      .nullable()
      .optional()
      .typeError("Till Date must be a valid date"),
    branchIds: yup.string().nullable().optional().default("2"),
    collectionCenterId: yup.string().nullable().optional().default("0"),
    enableCollectionCenter: yup.boolean().optional().default(false),
    collectorId: yup.string().nullable().optional().default("0"),
    reportType: yup
      .string()
      .nullable()
      .optional()
      .default(REPORT_TYPE_SCHEDULE_WISE),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function LoanDefaulterDueSummaryPage() {
  const [reportState, setReportState] =
    useState<LoanDefaulterDueSummaryResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<LoanDefaulterDueSummaryRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanDefaulterDueSummaryFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: LoanDefaulterDueSummaryFormValues,
    ): LoanDefaulterDueSummaryRequestDto => ({
      tillDate: form.tillDate || undefined,
      branchIds: form.branchIds || "2",
      collectionCenterId: String(form.collectionCenterId || "0"),
      enableCollectionCenter: form.enableCollectionCenter ?? false,
      collectorId: form.collectorId || undefined,
      reportType: form.reportType || REPORT_TYPE_SCHEDULE_WISE,
      orderBy: form.orderBy || "",
    }),
    [],
  );

  const callApi = useCallback(
    (request: LoanDefaulterDueSummaryRequestDto, format: string) =>
      loanService.api.loanDefaulterDueSummaryCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanDefaulterDueSummaryRequestDto) => {
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
          "LoanDefaulterDueSummaryReport",
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

  const onSubmit: SubmitHandler<LoanDefaulterDueSummaryFormValues> =
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
    <LoanDefaulterDueSummaryForm
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
