"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { AccountLookUpDtos, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanResolvingStatementForm, {
  LoanResolvingStatementFormValues,
} from "@/components/reports/loanReport/loanAccountWiseReport/LoanResolvingStatementForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export interface LoanResolvingStatementResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<LoanResolvingStatementFormValues> = yup
  .object({
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
    fromDateAd: yup.string().optional().default(""),
    toDateAd: yup.string().optional().default(""),
    accountNo: yup.string().optional().default(""),
    fromDateBs: yup.string().optional().default(""),
    toDateBs: yup.string().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(true),
  })
  .required();

const toRequest = (
  v: LoanResolvingStatementFormValues,
): LoanResolvingStatementFormValues => ({
  accountNo: v.accountNo || "",
  fromDateBs: v.fromDateBs || "",
  toDateBs: v.toDateBs || "",
  sameCompanyName: v.sameCompanyName ?? false,
});

function LoanResolvingStatementPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<LoanResolvingStatementResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<LoanResolvingStatementFormValues | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<LoanResolvingStatementFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const handleAccountSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");
    },
    [setValue],
  );

  const callApi = useCallback(
    (request: LoanResolvingStatementFormValues, format: string) =>
      loanService.api.loanRevolvingStatementCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanResolvingStatementFormValues): Promise<void> => {
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
          "LoanResolvingStatement",
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

  const onSubmit: SubmitHandler<LoanResolvingStatementFormValues> = useCallback(
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
    <LoanResolvingStatementForm
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

export default LoanResolvingStatementPage;
