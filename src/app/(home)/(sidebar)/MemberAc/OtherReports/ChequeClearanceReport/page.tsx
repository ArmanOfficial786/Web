// app/(home)/(sidebar)/MemberAc/OtherReports/ChequeClearanceReport/page.tsx
// ⚠️ Folder name and route are placeholders — rename to match your routing convention.
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type { Pagination } from "types/api/api";
import ChequeClearanceForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/ChequeClearanceForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ⚠️ Not sourced from types/api/api — no matching DTO exists in the swagger
// file (no "ChequeClearance" endpoint). Replace with the real generated
// request/response types once the backend endpoint exists.
export interface ChequeClearanceRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  chequeType?: string | null; // GetAll | ReceiveCheque | DeletedCheque | SendCheque | ClearanceCheque | RejectedCheque
  visualReport?: boolean;
}

export interface ReportResponseDtos {
  pdfData?: string;
  pagination?: { currentPage?: number; totalPages?: number };
}

export type ChequeClearanceFormValues = ChequeClearanceRequestDto;

export interface ChequeClearanceResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<ChequeClearanceFormValues> = yup
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
    chequeType: yup
      .string()
      .oneOf([
        "GetAll",
        "ReceiveCheque",
        "DeletedCheque",
        "SendCheque",
        "ClearanceCheque",
        "RejectedCheque",
      ]) // ⚠️ confirm exact backend codes
      .nullable()
      .optional()
      .default("GetAll"),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function ChequeClearancePage() {
  const [reportState, setReportState] =
    useState<ChequeClearanceResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<ChequeClearanceRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<ChequeClearanceFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: ChequeClearanceFormValues): ChequeClearanceRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      chequeType: form.chequeType || "GetAll",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  // ⚠️ Placeholder service call — replace `chequeClearanceCreate` with the
  // real generated method once the endpoint exists.
  const callApi = useCallback(
    (request: ChequeClearanceRequestDto, format: string) =>
      (memberAccountService.api as any).chequeClearanceCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: ChequeClearanceRequestDto) => {
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
      } catch (error) {
        console.error("Report generation error:", error);
        toast.error("Failed to generate report");
        setReportState({ isLoading: false });
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
      if (!lastRequest) return;

      const res = await callApi(lastRequest, format);
      const blob = responseToBlob(res.data, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = extractFilenameFromResponse(
        res,
        format,
        "ChequeClearanceReport",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<ChequeClearanceFormValues> = useCallback(
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
    <ChequeClearanceForm
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
