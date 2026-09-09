// app/(home)/(sidebar)/Account/OtherReports/PaymentThroughSavingReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type { PaymentThroughSavingRequestDto, Pagination } from "types/api/api";

import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";
import accountService from "@/services/Account/AccountService";
import PaymentThroughSavingForm from "@/components/reportForm/Account/PaymentThroughSavingForm";

export type PaymentThroughSavingFormValues = Omit<
  PaymentThroughSavingRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
};

export interface PaymentThroughSavingResponseExtended {
  blobUrl?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<PaymentThroughSavingFormValues> = yup
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
    sameCompanyName: yup.boolean().optional().default(false),
    transactionType: yup.string().nullable().optional().default(""),
    orderBy: yup.string().nullable().optional().default(""),
  })
  .required();

export default function PaymentThroughSavingPage() {
  const [reportState, setReportState] =
    useState<PaymentThroughSavingResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<PaymentThroughSavingRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<PaymentThroughSavingFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (form: PaymentThroughSavingFormValues): PaymentThroughSavingRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);

      return {
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: selectedIds.length ? selectedIds.join(",") : "-1",
        sameCompanyName: form.sameCompanyName ?? false,
        transactionType: form.transactionType || undefined,
        orderBy: form.orderBy || "",
      };
    },
    [],
  );

  const callApi = useCallback(
    (request: PaymentThroughSavingRequestDto, format: string) =>
      // ⚠️ confirm real generated method name — following BankReceivedPayment's
      // naming convention (accountService.api.<name>Create)
      accountService.api.paymentThroughSavingCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: PaymentThroughSavingRequestDto) => {
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
          "PaymentThroughSaving",
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

  const onSubmit: SubmitHandler<PaymentThroughSavingFormValues> = useCallback(
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
    <PaymentThroughSavingForm
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
