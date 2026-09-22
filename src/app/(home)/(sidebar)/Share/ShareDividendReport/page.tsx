"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import ShareDividendForm from "@/components/reports/share/ShareDividendForm";
import shareService from "@/services/Share/shareService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { Pagination, ShareDividendRequestDto } from "types/api/api";
import * as yup from "yup";

export type ShareDividendFormValues = ShareDividendRequestDto;

export interface ShareDividendResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<ShareDividendFormValues> = yup
  .object({
    fiscalYearId: yup
      .number()
      .default(-1)
      .moreThan(0, "Fiscal Year is Required"),
    officeId: yup.number().optional().default(-1),
    shareTypeId: yup.number().optional().default(-1),
    memberGroupId: yup.number().optional().default(-1),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function ShareDividendPage() {
  const [reportState, setReportState] = useState<ShareDividendResponseExtended>(
    { isLoading: false },
  );
  const [lastRequest, setLastRequest] =
    useState<ShareDividendRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<ShareDividendFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: ShareDividendFormValues): ShareDividendRequestDto => ({
      fiscalYearId: form.fiscalYearId ?? -1,
      officeId: form.officeId ?? -1,
      shareTypeId: form.shareTypeId ?? -1,
      memberGroupId: form.memberGroupId ?? -1,
      orderBy: form.orderBy || "",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: ShareDividendRequestDto, format: string) =>
      shareService.api.shareDividendCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: ShareDividendRequestDto) => {
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
          "ShareDividendReport",
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

  const onSubmit: SubmitHandler<ShareDividendFormValues> = useCallback(
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
    <ShareDividendForm
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
