"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  AccountLookUpDtos,
  LoanPrinciplePaymentRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import LoanPrincipalPaymentForm from "@/components/reports/loanReport/loanAccountWiseReport/LoanPrincipalPaymentForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export interface LoanPrincipalPaymentFormValues extends LoanPrinciplePaymentRequestDto {
  memberId?: string;
  memberName?: string;
  branchName?: string;
  memberGroupName?: string;
}

export interface LoanPrincipalPaymentResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<LoanPrincipalPaymentFormValues> = yup
  .object({
    paymentType: yup.string().optional().default("Principal Payment"),
    memberRegistrationId: yup.number().optional().default(0),
    fromDateBs: yup.string().optional().default(""),
    toDateBs: yup.string().optional().default(""),
    branchIds: yup.string().optional().default(""),
    memberGroupId: yup.string().optional().default(""),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
    branchName: yup.string().optional().default(""),
    memberGroupName: yup.string().optional().default(""),
  })
  .required();

const toRequest = (
  v: LoanPrincipalPaymentFormValues,
): LoanPrinciplePaymentRequestDto => ({
  paymentType: v.paymentType || "Principal Payment",
  memberRegistrationId: v.memberRegistrationId ?? 0,
  fromDateBs: v.fromDateBs || "",
  toDateBs: v.toDateBs || "",
  branchIds: v.branchIds || "",
  memberGroupId: v.memberGroupId || "",
  orderBy: v.orderBy || "",
  visualReport: v.visualReport ?? false,
});

function LoanPrincipalPaymentPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<LoanPrincipalPaymentResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<LoanPrinciplePaymentRequestDto | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<LoanPrincipalPaymentFormValues>({
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
    (request: LoanPrinciplePaymentRequestDto, format: string) =>
      loanService.api.loanPrinciplePaymentCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanPrinciplePaymentRequestDto): Promise<void> => {
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
          "LoanPrincipalPayment",
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

  const onSubmit: SubmitHandler<LoanPrincipalPaymentFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
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
    <LoanPrincipalPaymentForm
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

export default LoanPrincipalPaymentPage;
