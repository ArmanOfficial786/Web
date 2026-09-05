// app/(home)/(sidebar)/MemberAc/CollectorDetailReport/CollectorWiseCommissionReport/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  CollectorWiseCommissionRequestDto,
  Pagination,
  ReportResponseDtos,
} from "types/api/api";
import CollectorWiseCommissionForm from "@/components/reports/memberAccount/CollectorWiseCommissionReport/CollectorWiseCommissionForm";
import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

export type CollectorWiseCommissionFormValues =
  CollectorWiseCommissionRequestDto;

export interface CollectorWiseCommissionResponseExtended extends ReportResponseDtos {
  blobUrl: string;
  isLoading: boolean;
}

const schema: yup.ObjectSchema<CollectorWiseCommissionFormValues> = yup
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
    orderBy: yup.string().nullable().optional().default(""),
    collectorId: yup
      .number()
      .required("Collector is required")
      .moreThan(0, "Collector is required")
      .default(0),
    collectorName: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function CollectorWiseCommissionPage() {
  const [reportState, setReportState] =
    useState<CollectorWiseCommissionResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<CollectorWiseCommissionRequestDto | null>(null);
  const { collectorOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<CollectorWiseCommissionFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: CollectorWiseCommissionFormValues,
    ): CollectorWiseCommissionRequestDto => {
      const collectorName =
        collectorOptions.find((o) => String(o.id) === String(form.collectorId))
          ?.name ?? "";

      return {
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        orderBy: form.orderBy || "",
        collectorId: form.collectorId,
        collectorName: collectorName || undefined,
      };
    },
    [collectorOptions],
  );

  const callApi = useCallback(
    (request: CollectorWiseCommissionRequestDto, format: string) =>
      memberAccountService.api.collectorWiseCommissionCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: CollectorWiseCommissionRequestDto) => {
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
        setReportState({
          isLoading: false,
          blobUrl,
          pdfData: blobUrl,
          pagination,
        });
      } catch (error) {
        console.error("Report generation error:", error);
        toast.error("Failed to generate report");
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
          "CollectorWiseCommissionReport",
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

  const onSubmit: SubmitHandler<CollectorWiseCommissionFormValues> =
    useCallback(
      (formData) => fetchReport(toRequest(formData)),
      [fetchReport, toRequest],
    );

  return (
    <CollectorWiseCommissionForm
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
