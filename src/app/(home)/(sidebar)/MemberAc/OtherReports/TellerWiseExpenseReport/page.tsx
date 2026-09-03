// src/app/(home)/(sidebar)/MemberAc/OtherReports/TellerWiseExpenseReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { TellerWiseExpenseRequestDto, Pagination } from "types/api/api";
import TellerWiseExpenseForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/TellerWiseExpenseFrom";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";

// ── tellerId is a number here (matches TellerExpenseField's DropDown option
// ids), converted to the DTO's int64|null in toRequest(). ────────────────────
export interface TellerWiseExpenseFormValues extends Omit<
  TellerWiseExpenseRequestDto,
  "tellerId"
> {
  tellerId?: number;
}

// ── Client-only response state (raw PDF blob URL + header pagination) ──────
export interface TellerWiseExpenseResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DEFAULT_PAGINATION: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const DATE_REQUIRED_MESSAGE = "Please select date to get Teller Name";
const TELLER_REQUIRED_MESSAGE = "Select Date for TellerName";

const schema: yup.ObjectSchema<TellerWiseExpenseFormValues> = yup
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
    tellerId: yup
      .number()
      .optional()
      .required(TELLER_REQUIRED_MESSAGE)
      .test(
        "teller-selected",
        TELLER_REQUIRED_MESSAGE,
        (val) => typeof val === "number" && val >= 0,
      )
      .default(-1),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function TellerWiseExpensePage() {
  const [reportState, setReportState] =
    useState<TellerWiseExpenseResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<TellerWiseExpenseRequestDto | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TellerWiseExpenseFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
    mode: "onSubmit",
  });

  const toRequest = useCallback(
    (form: TellerWiseExpenseFormValues): TellerWiseExpenseRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      tellerId: form.tellerId || undefined,
      orderBy: form.orderBy || "",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: TellerWiseExpenseRequestDto, format: string) =>
      memberAccountService.api.tellerWiseExpenseCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: TellerWiseExpenseRequestDto) => {
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
            return raw ? (JSON.parse(raw) as Pagination) : DEFAULT_PAGINATION;
          } catch {
            return DEFAULT_PAGINATION;
          }
        })();

        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });
      } catch (err) {
        setReportState({ isLoading: false });
        throw err;
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
        "TellerWiseExpense",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<TellerWiseExpenseFormValues> = useCallback(
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
    <TellerWiseExpenseForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      errors={errors}
    />
  );
}
