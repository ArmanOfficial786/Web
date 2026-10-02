






















"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type {
  AccountStatementRequest,
  ReportResponseDtos,
} from "types/api/api";
import AccountStatement, {
  type ReportFormat,
} from "@/components/reports/accountReport/AccountingReports/AccountStatement";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import accountService from "@/services/Account/AccountService";

export interface AccountStatementRequestExtended extends AccountStatementRequest {
  branchId?: number[];
}

export interface AccountStatementResponseExtended extends ReportResponseDtos {
  blobUrl: string;
  isLoading: boolean;
}

const schema: yup.ObjectSchema<AccountStatementRequestExtended> = yup
  .object({
    fromDate: yup
      .string()
      .required("From Date is required")
      .nullable()
      .optional()
      .typeError("From Date must be a valid date"),
    toDate: yup
      .string()
      .required("To Date is required")
      .nullable()
      .optional()
      .typeError("To Date must be a valid date")
      .test(
        "date-order",
        "Till Date cannot be before From Date",
        function (val) {
          const { fromDate } = this.parent as { fromDate: string | null };
          if (!fromDate || !val) return true;
          return String(val) >= String(fromDate);
        },
      ),
    branchId: yup.array().of(yup.number().required()).optional().default([]),
    branchSelected: yup.string().nullable().optional(),
    branchName: yup.string().nullable().optional(),
    sameCompanyName: yup.boolean().optional().default(true),
    reportType: yup
      .string()
      .nullable()
      .optional()
      .typeError("Report Type must be a string")
      .default("Summary"),
    transactionType: yup
      .string()
      .nullable()
      .optional()
      .typeError("Transaction Type must be a string")
      .default("All"),
    orderBy: yup.string().nullable().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function AccountStatementPage() {
  const [reportState, setReportState] =
    useState<AccountStatementResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });

  const [lastRequest, setLastRequest] =
    useState<AccountStatementRequest | null>(null);
  const { branchOptions } = useReportFormContext();

  useEffect(() => {
    const raw = reportState.pdfData;

    if (!raw) {
      setReportState((prev) => {
        if (!prev.blobUrl) return prev;
        URL.revokeObjectURL(prev.blobUrl);
        return { ...prev, blobUrl: "" };
      });
      return;
    }

    let url = "";
    try {
      const binary = atob(raw);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    } catch {
      return;
    }

    setReportState((prev) => {
      if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
      return { ...prev, blobUrl: url };
    });

    return () => URL.revokeObjectURL(url);
  }, [reportState.pdfData]);

  const { control, handleSubmit, setValue, reset } =
    useForm<AccountStatementRequestExtended>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: AccountStatementRequestExtended): AccountStatementRequest => {
      const selectedIds = (form.branchId ?? [])
        .map(Number)
        .filter((id) => id > 0);
      const allIds = branchOptions
        .map((o) => Number(o.id))
        .filter((id) => id > 0);
      const isAll = selectedIds.length === 0;
      const resolvedIds = isAll ? allIds : selectedIds;

      return {
        fromDate: form.fromDate || undefined,
        toDate: form.toDate || undefined,
        branchSelected: isAll ? "-1" : selectedIds.join(","),
        branchName:
          branchOptions
            .filter((o) => resolvedIds.includes(Number(o.id)))
            .map((o) => o.name)
            .join(", ") || undefined,
        sameCompanyName: form.sameCompanyName,
        reportType: form.reportType || undefined,
        transactionType: form.transactionType || undefined,
        orderBy: form.orderBy || "",
        visualReport: form.visualReport || false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: AccountStatementRequest, format: string) =>
      accountService.api.accountStatementAccountStatementReportCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: AccountStatementRequest) => {
      setReportState((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await callApi(request, "VIEW");
        if (res.data?.isValid && res.data.data) {
          setLastRequest(request);
          setReportState((prev) => ({
            ...prev,
            ...res.data.data,
            isLoading: false,
          }));
        } else {
          toast.error(res.data?.message ?? "Failed to load report.");
          setReportState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        toast.error("An unexpected error occurred.");
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
          "AccountStatement",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {}
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<AccountStatementRequestExtended> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <AccountStatement
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

