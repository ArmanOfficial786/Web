// app/(home)/(sidebar)/MemberAc/OtherReports/CollectorWiseVisitReport/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  CollectorWiseVisitRequestDto,
  Pagination,
  ReportResponseDtos,
} from "types/api/api";
import CollectorWiseVisitForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/CollectorWiseCommissionReport/CollectorWiseVisitForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

export type CollectorWiseVisitFormValues = CollectorWiseVisitRequestDto;

export interface CollectorWiseVisitResponseExtended extends ReportResponseDtos {
  blobUrl: string;
  isLoading: boolean;
}

const schema: yup.ObjectSchema<CollectorWiseVisitFormValues> = yup
  .object({
    year: yup.string().nullable().optional().default(""),
    month: yup.string().nullable().optional().default(""),
    collectorId: yup
      .number()
      .required("Collector is required")
      .moreThan(0, "Collector is required")
      .default(0),
    collectorName: yup.string().nullable().optional().default(""),
    reportType: yup
      .string()
      .oneOf(["All", "Deposit", "Loan"]) // ⚠️ confirm exact backend codes
      .nullable()
      .optional()
      .default("All"),
    // ⚠️ Landscape/Portrait mapped to `visitType` — low confidence, see chat note
    visitType: yup
      .string()
      .oneOf(["Landscape", "Portrait"]) // ⚠️ confirm exact backend codes / correct field
      .nullable()
      .optional()
      .default("Portrait"),
    amountType: yup
      .string()
      .oneOf(["Count", "Amount"]) // ⚠️ confirm exact backend codes
      .nullable()
      .optional()
      .default("Count"),
    generateBy: yup
      .string()
      .oneOf(["AllAccount", "OnlyVisit"]) // ⚠️ confirm exact backend codes
      .nullable()
      .optional()
      .default("AllAccount"),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false), // ⚠️ on DTO, not in your field list — kept for schema completeness only
  })
  .required();

export default function CollectorWiseVisitPage() {
  const [reportState, setReportState] =
    useState<CollectorWiseVisitResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<CollectorWiseVisitRequestDto | null>(null);
  const { collectorOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<CollectorWiseVisitFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: CollectorWiseVisitFormValues): CollectorWiseVisitRequestDto => {
      const collectorName =
        collectorOptions.find((o) => String(o.id) === String(form.collectorId))
          ?.name ?? "";

      return {
        year: form.year != null ? String(form.year) : undefined,
        month: form.month != null ? String(form.month) : undefined,
        collectorId: form.collectorId,
        collectorName: collectorName || undefined,
        reportType: form.reportType || "All",
        visitType: form.visitType || "Portrait",
        amountType: form.amountType || "Count",
        generateBy: form.generateBy || "AllAccount",
        orderBy: form.orderBy || "",
        visualReport: form.visualReport ?? false,
      };
    },
    [collectorOptions],
  );

  const callApi = useCallback(
    (request: CollectorWiseVisitRequestDto, format: string) =>
      memberAccountService.api.collectorWiseVisitCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: CollectorWiseVisitRequestDto) => {
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
          "CollectorWiseVisitReport",
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

  const onSubmit: SubmitHandler<CollectorWiseVisitFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <CollectorWiseVisitForm
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
