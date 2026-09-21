"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import ShareStatementForm from "@/components/reports/share/ShareStatementForm";
import shareService from "@/services/Share/shareService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { Pagination, ShareStatementRequestDto } from "types/api/api";
import * as yup from "yup";

export type ShareStatementFormValues = ShareStatementRequestDto & {
  memberName?: string | null;
};

export interface ShareStatementResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<ShareStatementFormValues> = yup
  .object({
    memberId: yup.number().optional(),
    memberName: yup.string().nullable().optional(),
    shareTypeId: yup.number().optional().default(0),
    enableHeader: yup.boolean().optional().default(false),
    enableBillNo: yup.boolean().optional().default(false),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function ShareStatementPage() {
  const [reportState, setReportState] =
    useState<ShareStatementResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<ShareStatementRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<ShareStatementFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: ShareStatementFormValues): ShareStatementRequestDto => ({
      memberId: form.memberId,
      shareTypeId: form.shareTypeId ?? 0,
      enableHeader: form.enableHeader ?? false,
      enableBillNo: form.enableBillNo ?? false,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: ShareStatementRequestDto, format: string) =>
      shareService.api.shareStatementCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: ShareStatementRequestDto) => {
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
          "ShareStatementReport",
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

  const onSubmit: SubmitHandler<ShareStatementFormValues> = useCallback(
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
    <ShareStatementForm
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
