"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { AccountLookUpDtos, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanInstallmentDueACClosingForm from "@/components/reports/loanReport/loanAccountWiseReport/LoanInstallmentDueACClosingForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

// ⚠️ Guessed wire values — confirm against backend
const AS_ON_DATE_YES = "Yes";

const INTEREST_TYPE_PI = "PI";

// ⚠️ No matching DTO in api.ts — confirm exact endpoint + shape with backend
export interface LoanInstallmentDueACClosingRequestDto {
  accountNo?: string | null;
  fromDateBs?: string | null;
  tillDateBs?: string | null;
  asNoDate?: string | null;
  interestType?: string | null;
  branchIds?: string | null;
  visualReport?: boolean;
}

export interface LoanInstallmentDueACClosingFormValues extends LoanInstallmentDueACClosingRequestDto {
  memberId?: string;
  memberName?: string;
  branchName?: string;
}

export interface LoanInstallmentDueACClosingResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<LoanInstallmentDueACClosingFormValues> = yup
  .object({
    accountNo: yup.string().optional().default(""),
    fromDateBs: yup.string().optional().default(""),
    tillDateBs: yup.string().optional().default(""),
    asNoDate: yup.string().optional().default(AS_ON_DATE_YES),
    interestType: yup.string().optional().default(INTEREST_TYPE_PI),
    branchIds: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
    branchName: yup.string().optional().default(""),
  })
  .required();

const toRequest = (
  v: LoanInstallmentDueACClosingFormValues,
): LoanInstallmentDueACClosingRequestDto => ({
  accountNo: v.accountNo || "",
  fromDateBs: v.fromDateBs || "",
  tillDateBs: v.tillDateBs || "",
  asNoDate: v.asNoDate || AS_ON_DATE_YES,
  interestType: v.interestType || INTEREST_TYPE_PI,
  branchIds: v.branchIds || "",
  visualReport: v.visualReport ?? false,
});

function LoanInstallmentDueACClosingPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<LoanInstallmentDueACClosingResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<LoanInstallmentDueACClosingRequestDto | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<LoanInstallmentDueACClosingFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const handleAccountSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");
      setValue("branchIds", record.usmOfficeId?.toString() ?? "");
      setValue("branchName", record.officeName ?? "");
    },
    [setValue],
  );

  const callApi = useCallback(
    (request: LoanInstallmentDueACClosingRequestDto, format: string) =>
      // ⚠️ fake api is used
      loanService.api.accountAccountYearClosingCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanInstallmentDueACClosingRequestDto): Promise<void> => {
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
          "LoanInstallmentDueACClosingReport",
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

  const onSubmit: SubmitHandler<LoanInstallmentDueACClosingFormValues> =
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
    <LoanInstallmentDueACClosingForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onAccountSelect={handleAccountSelect}
    />
  );
}

export default LoanInstallmentDueACClosingPage;
