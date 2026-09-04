// app/(home)/(sidebar)/MemberAc/OtherReports/InterestPayableReport/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  InterestPayableRequestDto,
  Pagination,
  ReportResponseDtos,
} from "types/api/api";
import InterestPayableForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/InterestPayableReport/InterestPayableForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

export type InterestPayableFormValues = InterestPayableRequestDto;

export interface InterestPayableResponseExtended extends ReportResponseDtos {
  blobUrl: string;
  isLoading: boolean;
}

const schema: yup.ObjectSchema<InterestPayableFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .required("Till Date is required")
      .nullable()
      .optional()
      .typeError("Till Date must be a valid date"),
    branchIds: yup.string().nullable().optional().default(""),
    branchName: yup.string().nullable().optional().default(""),
    orderBy: yup.string().nullable().optional().default(""),
    reportView: yup
      .string()
      .oneOf(["All", "OnlyTillDate"]) // ⚠️ confirm exact backend codes
      .nullable()
      .optional()
      .default("All"),
    visualReport: yup.boolean().optional().default(false), // ⚠️ on DTO, not requested for UI — kept for schema completeness only
  })
  .required();

export default function InterestPayablePage() {
  const [reportState, setReportState] =
    useState<InterestPayableResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<InterestPayableRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<InterestPayableFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: InterestPayableFormValues): InterestPayableRequestDto => ({
      tillDateBs: form.tillDateBs || undefined,
      branchIds: form.branchIds || undefined,
      branchName: form.branchName || undefined,
      orderBy: form.orderBy || "",
      reportView: form.reportView || "All",
    }),
    [],
  );

  const callApi = useCallback(
    (request: InterestPayableRequestDto, format: string) =>
      memberAccountService.api.interestPayableCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: InterestPayableRequestDto) => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return { isLoading: true, blobUrl: "" };
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
        const blobUrl = URL.createObjectURL(responseToBlob(res.data, "PDF"));
        setLastRequest(request);
        setReportState({ isLoading: false, blobUrl, pagination });
      } catch {
        toast.error("Failed to load report.");
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
        const blob = responseToBlob(res.data, format);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = extractFilenameFromResponse(
          res,
          format,
          "InterestPayableReport",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<InterestPayableFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <InterestPayableForm
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
