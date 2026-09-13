// app/(home)/(sidebar)/Account/MainLedger/4thLedgerDetailsReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type { LedgerDetailsReqResponse, Pagination } from "types/api/api";
import FourthLedgerDetailsForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/MainLedger/FourthLedgerDetailsForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import accountService from "@/services/Account/AccountService";

export type FourthLedgerDetailsFormValues = Omit<
  LedgerDetailsReqResponse,
  "ledgerHeadId" | "ledgerHead" | "selectedAccountType" | "isSummary"
> & {
  ledgerHeadId?: string | null;
  ledgerName?: string | null;
  subLedgerName?: string | null;
  secondSubLedgerName?: string | null;
  thirdSubLedgerName?: string | null;
  fourthSubLedgerName?: string | null;
  reportType?: "0" | "1" | null;
};

export interface FourthLedgerDetailsResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<FourthLedgerDetailsFormValues> = yup
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
    subLedgerName: yup.string().nullable().optional().default(""),
    secondSubLedgerName: yup.string().nullable().optional().default(""),
    thirdSubLedgerName: yup.string().nullable().optional().default(""),
    fourthSubLedgerName: yup.string().nullable().optional().default(""),
    voucherType: yup.string().nullable().optional().default("All"),
    reportType: yup
      .string()
      .oneOf(["0", "1"] as const)
      .optional()
      .default("0"), // ⚠️ codes assumed to match First/Second/Third convention — confirm
    showOpeningBalance: yup.boolean().optional().default(false),
    orderBy: yup.string().nullable().optional().default(""),
  })
  .required();

export default function FourthLedgerDetailsPage() {
  const [reportState, setReportState] =
    useState<FourthLedgerDetailsResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<LedgerDetailsReqResponse | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<FourthLedgerDetailsFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (form: FourthLedgerDetailsFormValues): LedgerDetailsReqResponse => {
      const ledgerHead = [
        form.ledgerName,
        form.subLedgerName,
        form.secondSubLedgerName,
        form.thirdSubLedgerName,
        form.fourthSubLedgerName,
      ].filter((v): v is string => Boolean(v));

      return {
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchId: form.branchId || "-1",
        voucherType: form.voucherType || "All",
        reportType: form.reportType ?? "0",
        selectedAccountType:
          form.ledgerHeadId === undefined ||
          form.ledgerHeadId === null ||
          form.ledgerHeadId === ""
            ? -1
            : Number(form.ledgerHeadId),
        ledgerHead: ledgerHead.length ? ledgerHead : undefined,
        showOpeningBalance: form.showOpeningBalance ?? false,
        isSummary: form.reportType === "1",
        orderBy: form.orderBy || "",
      };
    },
    [],
  );

  const callApi = useCallback(
    (request: LedgerDetailsReqResponse, format: string) =>
      accountService.api.fourthLedgerDetailsCreate(request, { format }),
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
          "FourthLedgerDetails",
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

  const onSubmit: SubmitHandler<FourthLedgerDetailsFormValues> = useCallback(
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
    <FourthLedgerDetailsForm
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
