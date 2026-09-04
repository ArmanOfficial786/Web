// app/(home)/(sidebar)/MemberAc/OtherReports/CollectorWiseCommissionSummaryReport/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  CollectorWiseCommissionSummaryRequestDto,
  ReportResponseDtos,
} from "types/api/api";
import CollectorWiseCommissionSummaryForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/CollectorWiseCommissionReport/CollectorWiseCommissionSummaryForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";

export type CollectorWiseCommissionSummaryFormValues =
  CollectorWiseCommissionSummaryRequestDto;

export interface CollectorWiseCommissionSummaryResponseExtended extends ReportResponseDtos {
  blobUrl: string;
  isLoading: boolean;
}

const schema: yup.ObjectSchema<CollectorWiseCommissionSummaryFormValues> = yup
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
    branchIds: yup.string().nullable().optional().default(""),
    branchName: yup.string().nullable().optional().default(""),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false), // ⚠️ on DTO, not in your field list — kept for schema completeness only, not rendered
  })
  .required();

export default function CollectorWiseCommissionSummaryPage() {
  const [reportState, setReportState] =
    useState<CollectorWiseCommissionSummaryResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<CollectorWiseCommissionSummaryRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<CollectorWiseCommissionSummaryFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: CollectorWiseCommissionSummaryFormValues,
    ): CollectorWiseCommissionSummaryRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchIds: form.branchIds || undefined,
      branchName: form.branchName || undefined,
      orderBy: form.orderBy || "",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: CollectorWiseCommissionSummaryRequestDto, format: string) =>
      memberAccountService.api.collectorWiseCommissionSummaryCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: CollectorWiseCommissionSummaryRequestDto) => {
      setReportState((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await callApi(request, "VIEW");
        const blobUrl = URL.createObjectURL(responseToBlob(res.data, "PDF"));
        setLastRequest(request);
        setReportState((prev) => ({
          ...prev,
          blobUrl,
          pdfData: blobUrl,
          isLoading: false,
        }));
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
          "CollectorWiseCommissionSummaryReport",
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

  const onSubmit: SubmitHandler<CollectorWiseCommissionSummaryFormValues> =
    useCallback(
      (formData) => fetchReport(toRequest(formData)),
      [fetchReport, toRequest],
    );

  return (
    <CollectorWiseCommissionSummaryForm
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
