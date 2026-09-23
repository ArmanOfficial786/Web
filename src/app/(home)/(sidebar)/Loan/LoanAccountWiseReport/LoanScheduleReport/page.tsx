"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  AccountLookUpDtos,
  LoanScheduleRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import LoanScheduleForm from "@/components/reports/loanReport/loanAccountWiseReport/LoanScheduleForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export interface LoanScheduleFormValues extends LoanScheduleRequestDto {
  memberId?: string;
  memberName?: string;
}

export interface LoanScheduleResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<LoanScheduleFormValues> = yup
  .object({
    accountNo: yup.string().optional().default(""),
    loanIssueId: yup.number().optional().default(0),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
  })
  .required();

const toRequest = (v: LoanScheduleFormValues): LoanScheduleRequestDto => ({
  accountNo: v.accountNo || "",
  loanIssueId: v.loanIssueId ?? 0,
  sameCompanyName: v.sameCompanyName ?? true,
  visualReport: v.visualReport ?? false,
});

function LoanSchedulePage(): React.ReactElement {
  const [reportState, setReportState] = useState<LoanScheduleResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<LoanScheduleRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue } = useForm<LoanScheduleFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleAccountSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");
      setValue("loanIssueId", record.mamAccountOpeningId ?? 0);
    },
    [setValue],
  );

  const callApi = useCallback(
    (request: LoanScheduleRequestDto, format: string) =>
      loanService.api.loanScheduleCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanScheduleRequestDto): Promise<void> => {
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
          "LoanSchedule",
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

  const onSubmit: SubmitHandler<LoanScheduleFormValues> = useCallback(
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
    <LoanScheduleForm
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

export default LoanSchedulePage;
