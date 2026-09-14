"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type { FirstLedgerDetailsRequestDto, Pagination } from "types/api/api";
import FirstLedgerDetailsForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/MainLedger/FirstLedgerDetailsForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import accountService from "@/services/Account/AccountService";

export type FirstLedgerDetailsFormValues = Omit<
  FirstLedgerDetailsRequestDto,
  "ledgerHeadId"
> & {
  ledgerHeadId?: string | null;
  reportType?: "0" | "1" | null;
  secondSubLedgerName?: string | null;
  thirdSubLedgerName?: string | null;
  fourthSubLedgerName?: string | null;
};

type FirstLedgerDetailsRequestWithLevels = FirstLedgerDetailsRequestDto & {
  secondSubLedgerName?: string;
  thirdSubLedgerName?: string;
  fourthSubLedgerName?: string;
};

export interface FirstLedgerDetailsResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<FirstLedgerDetailsFormValues> = yup
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
    thirdSubLedgerName: yup.string().nullable().optional().default(""),
    fourthSubLedgerName: yup.string().nullable().optional().default(""),
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

export default function FirstLedgerDetailsPage() {
  const [reportState, setReportState] =
    useState<FirstLedgerDetailsResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<FirstLedgerDetailsRequestWithLevels | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<FirstLedgerDetailsFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (
      form: FirstLedgerDetailsFormValues,
    ): FirstLedgerDetailsRequestWithLevels => ({
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
      thirdSubLedgerName: form.thirdSubLedgerName || "",
      fourthSubLedgerName: form.fourthSubLedgerName || "",
      voucherType: form.voucherType || "All",
      reportType: form.reportType ?? "0",
      showOpeningBalance: form.showOpeningBalance ?? false,
      orderBy: form.orderBy || "",
    }),
    [],
  );

  const callApi = useCallback(
    (request: FirstLedgerDetailsRequestWithLevels, format: string) =>
      accountService.api.firstLedgerDetailsCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: FirstLedgerDetailsRequestWithLevels) => {
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
          "FirstLedgerDetails",
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

  const onSubmit: SubmitHandler<FirstLedgerDetailsFormValues> = useCallback(
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
    <FirstLedgerDetailsForm
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
