// app/(home)/(sidebar)/Account/MainLedger/2ndLedgerDetailsReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type { SecondLedgerDetailsRequestDto, Pagination } from "types/api/api";
import SecondLedgerDetailsForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/MainLedger/SecondLedgerDetailsForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import accountService from "@/services/Account/AccountService";

// ledgerHeadId is client-side a string (dropdown value) — DTO wants a number,
// same convention as FirstLedgerDetailsFormValues.
export type SecondLedgerDetailsFormValues = Omit<
  SecondLedgerDetailsRequestDto,
  "ledgerHeadId"
> & {
  ledgerHeadId?: string | null;
  reportType?: "0" | "1" | null;
};

export interface SecondLedgerDetailsResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<SecondLedgerDetailsFormValues> = yup
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
    branchIds: yup.string().nullable().optional().default(""),
    ledgerHeadId: yup.string().nullable().optional().default(""),
    ledgerName: yup.string().nullable().optional().default(""),
    subLedgerName: yup.string().nullable().optional().default(""),
    secondSubLedgerName: yup.string().nullable().optional().default(""),
    voucherType: yup.string().nullable().optional().default("All"),
    reportType: yup
      .string()
      .oneOf(["0", "1"] as const)
      .optional()
      .default("0"),
    showOpeningBalance: yup.boolean().optional().default(false),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function SecondLedgerDetailsPage() {
  const [reportState, setReportState] =
    useState<SecondLedgerDetailsResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<SecondLedgerDetailsRequestDto | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<SecondLedgerDetailsFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (form: SecondLedgerDetailsFormValues): SecondLedgerDetailsRequestDto => ({
      fromDate: form.fromDate || undefined,
      toDate: form.toDate || undefined,
      branchIds: form.branchIds || undefined,
      ledgerHeadId:
        form.ledgerHeadId === undefined ||
        form.ledgerHeadId === null ||
        form.ledgerHeadId === ""
          ? -1
          : Number(form.ledgerHeadId),
      ledgerName: form.ledgerName || "",
      subLedgerName: form.subLedgerName || "",
      secondSubLedgerName: form.secondSubLedgerName || "",
      voucherType: form.voucherType || "All",
      reportType: form.reportType ?? "0",
      showOpeningBalance: form.showOpeningBalance ?? false,
      orderBy: form.orderBy || "",
    }),
    [],
  );

  const callApi = useCallback(
    (request: SecondLedgerDetailsRequestDto, format: string) =>
      accountService.api.accountSecondLedgerDetailsCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SecondLedgerDetailsRequestDto) => {
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
          "SecondLedgerDetails",
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

  const onSubmit: SubmitHandler<SecondLedgerDetailsFormValues> = useCallback(
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
    <SecondLedgerDetailsForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
    />
  );
}