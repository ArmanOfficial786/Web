"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type {
  InterestAndTaxTypeWiseRequestDto,
  Pagination,
} from "types/api/api";
import InterestAndTaxTypeWiseForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/InterestExpenseReport/InterestAndTaxTypeWiseForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { useReportFormContext } from "@/contexts/ReportFormContext";

export type InterestAndTaxTypeWiseFormValues = Omit<
  InterestAndTaxTypeWiseRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
};

export interface InterestAndTaxTypeWiseResponseExtended {
  blobUrl?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const REPORT_VIEW_NORMAL = "1";

const schema: yup.ObjectSchema<InterestAndTaxTypeWiseFormValues> = yup
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
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDateBs } = this.parent as { fromDateBs: string | null };
        if (!fromDateBs || !val) return true;
        return String(val) >= String(fromDateBs);
      }),
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    branchName: yup.string().nullable().optional(),
    reportView: yup.string().nullable().optional().default(REPORT_VIEW_NORMAL),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function InterestAndTaxTypeWisePage() {
  const [reportState, setReportState] =
    useState<InterestAndTaxTypeWiseResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<InterestAndTaxTypeWiseRequestDto | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<InterestAndTaxTypeWiseFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (
      form: InterestAndTaxTypeWiseFormValues,
    ): InterestAndTaxTypeWiseRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const allIds = branchOptions
        .map((o) => String(o.id))
        .filter((id) => Number(id) > 0);
      const isAll =
        selectedIds.length === 0 || selectedIds.length === allIds.length;
      const resolvedIds = isAll ? allIds : selectedIds;

      const branchName = branchOptions
        .filter((o) => resolvedIds.includes(String(o.id)))
        .map((o) => o.name)
        .join(", ");

      return {
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        branchName: branchName || undefined,
        reportView: form.reportView || REPORT_VIEW_NORMAL,
        orderBy: form.orderBy || "",
        visualReport: form.visualReport ?? false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: InterestAndTaxTypeWiseRequestDto, format: string) =>
      memberAccountService.api.interestAndTaxTypeWiseCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: InterestAndTaxTypeWiseRequestDto) => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
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
        toast.warning("Please view the report before exporting.");
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
          "InterestAndTaxTypeWise",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Download failed.",
        );
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<InterestAndTaxTypeWiseFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return prev;
      });
    };
  }, []);

  return (
    <InterestAndTaxTypeWiseForm
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
