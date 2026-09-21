"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import CopomisForm from "@/components/reports/share/CopomisForm";
import shareService from "@/services/Share/shareService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { CopomisRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

export type CopomisFormValues = CopomisRequestDto;

export interface CopomisResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<CopomisFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    officeIds: yup.string().nullable().optional().default("2"),
    memberTypeId: yup.number().optional().default(0),
    collectionCenterId: yup.number().optional().default(0),
    memberGroupId: yup.number().optional().default(-1),
    orderBy: yup.string().nullable().optional().default(""),
    showMemberPhoto: yup.boolean().optional().default(false),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function CopomisPage() {
  const [reportState, setReportState] = useState<CopomisResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<CopomisRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset } = useForm<CopomisFormValues>(
    {
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    },
  );

  const toRequest = useCallback(
    (form: CopomisFormValues): CopomisRequestDto => ({
      tillDateBs: form.tillDateBs || undefined,
      officeIds: form.officeIds || "-1",
      memberTypeId: form.memberTypeId ?? 0,
      collectionCenterId: form.collectionCenterId ?? 0,
      memberGroupId: form.memberGroupId ?? -1,
      orderBy: form.orderBy || "",
      showMemberPhoto: form.showMemberPhoto ?? false,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: CopomisRequestDto, format: string) =>
      shareService.api.copomisCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: CopomisRequestDto) => {
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
          "CopomisReport",
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

  const onSubmit: SubmitHandler<CopomisFormValues> = useCallback(
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
    <CopomisForm
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
