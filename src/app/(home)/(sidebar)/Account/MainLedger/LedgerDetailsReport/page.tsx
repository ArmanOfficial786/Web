"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type { LedgerDetailsReqResponse, Pagination } from "types/api/api";
import LedgerDetailsForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/MainLedger/LedgerDetailsForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import accountService from "@/services/Account/AccountService";

export interface LedgerDetailsFormValues {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  ledgerHeadId?: string | null; // client-only filter, not sent to API
  ledgerName?: string | null; // wrapped into ledgerHead[] at request time
  voucherType?: string | null;
  reportType?: "0" | "1" | null;
  showOpeningBalance?: boolean;
}

export interface LedgerDetailsResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LedgerDetailsFormValues> = yup
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
    branchId: yup.string().nullable().optional().default(""),
    ledgerHeadId: yup.string().nullable().optional().default(""),
    ledgerName: yup.string().nullable().optional().default(""),
    voucherType: yup.string().nullable().optional().default("All"),
    reportType: yup
      .string()
      .oneOf(["0", "1"] as const)
      .optional()
      .default("0"), // ⚠️ codes assumed to match FirstLedgerDetails convention — confirm
    showOpeningBalance: yup.boolean().optional().default(false),
  })
  .required();

export default function LedgerDetailsPage() {
  const [reportState, setReportState] = useState<LedgerDetailsResponseExtended>(
    { isLoading: false },
  );
  const [lastRequest, setLastRequest] =
    useState<LedgerDetailsReqResponse | null>(null);

  const { control, handleSubmit, setValue } = useForm<LedgerDetailsFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
    mode: "onSubmit",
  });

  const toRequest = useCallback(
    (form: LedgerDetailsFormValues): LedgerDetailsReqResponse => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchId: form.branchId || "-1",
      voucherType: form.voucherType || "All",
      reportType: form.reportType ?? "0",
      // ledgerHeadId is a client-only filter — never sent; only the
      // resolved ledgerName goes to the API, wrapped in an array.
      ledgerHead: form.ledgerName ? [form.ledgerName] : undefined,
      showOpeningBalance: form.showOpeningBalance ?? false,
      isSummary: form.reportType === "1",
      orderBy: "",
    }),
    [],
  );

  const callApi = useCallback(
    (request: LedgerDetailsReqResponse, format: string) =>
      accountService.api.ledgerDetailsCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LedgerDetailsReqResponse) => {
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
          "LedgerDetails",
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

  const onSubmit: SubmitHandler<LedgerDetailsFormValues> = useCallback(
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
    <LedgerDetailsForm
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
