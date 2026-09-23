"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  AccountLookUpDtos,
  LoanFineInterestPrinciplePaymentSummaryRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import LoanPrincipalInterestFinePaymentForm from "@/components/reports/loanReport/loanAccountWiseReport/LoanPrincipalInterestFinePaymentForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

// ⚠️ Guessed wire values — confirm against backend
const REPORT_TYPE_PAYMENT = "Payment";

const CASH_TYPE_ALL = "All";

// branchIds arrives as string[] from OfficeNameField; memberId / memberName / reportType are UI-facing
export interface LoanPrincipalInterestFinePaymentFormValues extends Omit<
  LoanFineInterestPrinciplePaymentSummaryRequestDto,
  "branchIds"
> {
  branchIds?: string[];
  memberId?: string;
  memberName?: string;
  reportType?: string; // ⚠️ UI-only — DTO has no such field, never sent
}

export interface LoanPrincipalInterestFinePaymentResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanPrincipalInterestFinePaymentFormValues> = yup
  .object({
    memberRegistrationId: yup.number().optional().default(0),
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
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
    collectorId: yup.string().optional().default(""),
    collectionCenterId: yup.string().optional().default("0"),
    enableCollectionCenter: yup.boolean().optional().default(false),
    reportType: yup.string().optional().default(REPORT_TYPE_PAYMENT),
    selectAllOrOnlyCash: yup.string().optional().default(CASH_TYPE_ALL),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: LoanPrincipalInterestFinePaymentFormValues,
): LoanFineInterestPrinciplePaymentSummaryRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  return {
    memberRegistrationId: v.memberRegistrationId || 0,
    fromDateBs: v.fromDateBs || undefined,
    toDateBs: v.toDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    collectorId: v.collectorId || undefined,
    collectionCenterId: v.collectionCenterId || "0",
    enableCollectionCenter: v.enableCollectionCenter ?? false,
    selectAllOrOnlyCash: v.selectAllOrOnlyCash || CASH_TYPE_ALL,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
    // reportType intentionally omitted — ⚠️ UI-only, not on this DTO
  };
};

function LoanPrincipalInterestFinePaymentPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<LoanPrincipalInterestFinePaymentResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<LoanFineInterestPrinciplePaymentSummaryRequestDto | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<LoanPrincipalInterestFinePaymentFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const handleMemberSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("memberRegistrationId", record.mamAccountOpeningId ?? 0);
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");
    },
    [setValue],
  );

  const callApi = useCallback(
    (
      request: LoanFineInterestPrinciplePaymentSummaryRequestDto,
      format: string,
    ) =>
      loanService.api.loanFineInterestPrinciplePaymentSummaryCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (
      request: LoanFineInterestPrinciplePaymentSummaryRequestDto,
    ): Promise<void> => {
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
        setReportState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [callApi],
  );

  const handleDownload = useCallback(
    async (format: ReportFormat): Promise<void> => {
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
          "LoanPrincipalInterestFinePaymentReport",
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

  const onSubmit: SubmitHandler<LoanPrincipalInterestFinePaymentFormValues> =
    useCallback((formData) => fetchReport(toRequest(formData)), [fetchReport]);

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <LoanPrincipalInterestFinePaymentForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onMemberSelect={handleMemberSelect}
    />
  );
}

export default LoanPrincipalInterestFinePaymentPage;
