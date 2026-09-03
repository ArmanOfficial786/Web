"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  PayableInterestTransferredRequestDto,
  ReportResponseDtos,
} from "types/api/api";
import PayableInterestTransferredForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/InterestExpenseReport/PayableInterestTransferredForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { useReportFormContext } from "@/contexts/ReportFormContext";

export type PayableInterestTransferredFormValues = Omit<
  PayableInterestTransferredRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
};

export interface PayableInterestTransferredResponseExtended extends ReportResponseDtos {
  blobUrl: string;
  isLoading: boolean;
}

const schema: yup.ObjectSchema<PayableInterestTransferredFormValues> = yup
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
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    orderBy: yup.string().nullable().optional().default(""),
    branchName: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false), // ⚠️ on DTO, not requested for UI — kept for schema completeness only
  })
  .required();

export default function PayableInterestTransferredPage() {
  const [reportState, setReportState] =
    useState<PayableInterestTransferredResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<PayableInterestTransferredRequestDto | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<PayableInterestTransferredFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: PayableInterestTransferredFormValues,
    ): PayableInterestTransferredRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const allIds = branchOptions
        .map((option) => String(option.id))
        .filter((id) => Number(id) > 0);
      const isAll =
        selectedIds.length === 0 || selectedIds.length === allIds.length;
      const resolvedIds = isAll ? allIds : selectedIds;
      const branchName = branchOptions
        .filter((option) => resolvedIds.includes(String(option.id)))
        .map((option) => option.name)
        .join(", ");

      return {
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        branchName: branchName || undefined,
        orderBy: form.orderBy || "",
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: PayableInterestTransferredRequestDto, format: string) =>
      memberAccountService.api.payableInterestTransferredCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: PayableInterestTransferredRequestDto) => {
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
          "PayableInterestTransferredReport",
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

  const onSubmit: SubmitHandler<PayableInterestTransferredFormValues> =
    useCallback(
      (formData) => fetchReport(toRequest(formData)),
      [fetchReport, toRequest],
    );

  return (
    <PayableInterestTransferredForm
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
