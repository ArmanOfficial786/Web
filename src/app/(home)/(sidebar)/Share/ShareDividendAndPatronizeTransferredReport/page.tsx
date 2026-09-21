"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import ShareDividendPatronizeTransferredForm from "@/components/reports/share/ShareDividendPatronizeTransferredForm";
import shareService from "@/services/Share/shareService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  Pagination,
  ShareDividendPatronizeTransferredRequestDto,
} from "types/api/api";
import * as yup from "yup";

export type ShareDividendPatronizeTransferredFormValues =
  ShareDividendPatronizeTransferredRequestDto;

export interface ShareDividendPatronizeTransferredResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";
const REPORT_TYPE_DEFAULT = "Share Dividend";

const schema: yup.ObjectSchema<ShareDividendPatronizeTransferredFormValues> =
  yup
    .object({
      fromDateBs: yup
        .string()
        .nullable()
        .optional()
        .required(DATE_REQUIRED_MESSAGE),
      toDateBs: yup
        .string()
        .nullable()
        .optional()
        .required(DATE_REQUIRED_MESSAGE)
        .test(
          "date-order",
          "To Date cannot be before From Date",
          function (val) {
            const { fromDateBs } = this.parent as { fromDateBs: string | null };
            if (!fromDateBs || !val) return true;
            return String(val) >= String(fromDateBs);
          },
        ),
      reportType: yup
        .string()
        .nullable()
        .optional()
        .default(REPORT_TYPE_DEFAULT),
      visualReport: yup.boolean().optional().default(false),
    })
    .required();

export default function ShareDividendPatronizeTransferredPage() {
  const [reportState, setReportState] =
    useState<ShareDividendPatronizeTransferredResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<ShareDividendPatronizeTransferredRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<ShareDividendPatronizeTransferredFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: ShareDividendPatronizeTransferredFormValues,
    ): ShareDividendPatronizeTransferredRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      reportType: form.reportType || REPORT_TYPE_DEFAULT,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: ShareDividendPatronizeTransferredRequestDto, format: string) =>
      shareService.api.shareDividendPatronizeTransferredCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: ShareDividendPatronizeTransferredRequestDto) => {
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
          "ShareDividendPatronizeTransferredReport",
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

  const onSubmit: SubmitHandler<ShareDividendPatronizeTransferredFormValues> =
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
    <ShareDividendPatronizeTransferredForm
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
