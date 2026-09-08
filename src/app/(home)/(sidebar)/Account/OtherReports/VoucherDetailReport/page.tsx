// app/(home)/(sidebar)/Account/OtherReports/VoucherDetailReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type { VoucherDetailsRequestDto, Pagination } from "types/api/api";
import VoucherDetailsForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/OtherReports/VoucherDetailsForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── branchIds is a string on the DTO ("-1" = all, else comma-separated ids),
// but OfficeNameField binds/writes a string[]. Same collapse pattern as
// InterestAndTaxDetail / SavingsAccountMaturity.
export type VoucherDetailsFormValues = Omit<
  VoucherDetailsRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
};

export interface VoucherDetailsResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<VoucherDetailsFormValues> = yup
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
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    voucherId: yup.number().nullable().optional().default(0),
    orderBy: yup.string().nullable().optional().default(""),
    viewType: yup
      .string()
      .oneOf(["None", "Grouping"]) // ⚠️ confirm exact backend codes
      .nullable()
      .optional()
      .default("None"),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function VoucherDetailsPage() {
  const [reportState, setReportState] =
    useState<VoucherDetailsResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<VoucherDetailsRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<VoucherDetailsFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (form: VoucherDetailsFormValues): VoucherDetailsRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const isAll = selectedIds.length === 0;

      return {
        fromDate: form.fromDate || undefined,
        toDate: form.toDate || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        voucherId: form.voucherId ?? undefined,
        orderBy: form.orderBy || "",
        viewType: form.viewType || "None",
      };
    },
    [],
  );

  const callApi = useCallback(
    (request: VoucherDetailsRequestDto, format: string) =>
      memberAccountService.api.accountVoucherDetailsCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: VoucherDetailsRequestDto) => {
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
          "VoucherDetailsReport",
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

  const onSubmit: SubmitHandler<VoucherDetailsFormValues> = useCallback(
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
    <VoucherDetailsForm
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
