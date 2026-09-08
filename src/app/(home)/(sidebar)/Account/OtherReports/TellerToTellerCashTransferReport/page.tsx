// app/(home)/(sidebar)/MemberAc/OtherReports/TellerToTellerCashTransferReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  TellerToTellerCashTransferRequestDto,
  Pagination,
} from "types/api/api";
import TellerToTellerCashTransferForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/OtherReports/TellerToTellerCashTransferForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── sameCompanyName is UI-only — the real DTO has no such field.
export type TellerToTellerCashTransferFormValues =
  TellerToTellerCashTransferRequestDto & {
    sameCompanyName?: boolean;
  };

export interface TellerToTellerCashTransferResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<TellerToTellerCashTransferFormValues> = yup
  .object({
    fromDate: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    toDate: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE)
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDate } = this.parent as { fromDate: string | null };
        if (!fromDate || !val) return true;
        return String(val) >= String(fromDate);
      }),
    branchId: yup.string().nullable().optional().default(""),
    orderBy: yup.string().nullable().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(false), // ⚠️ UI-only — not on the real DTO, never sent to the API
    visualReport: yup.boolean().optional().default(false), // ⚠️ on DTO, not requested for UI — kept for schema completeness only
  })
  .required();

export default function TellerToTellerCashTransferPage() {
  const [reportState, setReportState] =
    useState<TellerToTellerCashTransferResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<TellerToTellerCashTransferRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<TellerToTellerCashTransferFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (
      form: TellerToTellerCashTransferFormValues,
    ): TellerToTellerCashTransferRequestDto => ({
      fromDate: form.fromDate || undefined,
      toDate: form.toDate || undefined,
      branchId: form.branchId || undefined,
      orderBy: form.orderBy || "",
      // sameCompanyName intentionally omitted — not part of this DTO
    }),
    [],
  );

  const callApi = useCallback(
    (request: TellerToTellerCashTransferRequestDto, format: string) =>
      memberAccountService.api.tellerToTellerCashTransferCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: TellerToTellerCashTransferRequestDto) => {
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
        toast.error("Failed to generate report.");
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
          "TellerToTellerCashTransferReport",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        toast.error("Failed to download file.");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<TellerToTellerCashTransferFormValues> =
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
    <TellerToTellerCashTransferForm
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
