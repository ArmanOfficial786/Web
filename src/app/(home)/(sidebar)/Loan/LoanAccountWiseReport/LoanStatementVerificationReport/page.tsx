"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  AccountLookUpDtos,
  LoanStatementVerificationRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import LoanStatementVerificationForm from "@/components/reports/loanReport/loanAccountWiseReport/LoanStatementVerificationForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export interface LoanStatementVerificationFormValues extends Omit<
  LoanStatementVerificationRequestDto,
  "branchIds" | "collectorId"
> {
  branchIds?: string[];
  collectorId?: string;
  memberId?: string;
  memberName?: string;
}

export interface LoanStatementVerificationResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanStatementVerificationFormValues> = yup
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
    collectorId: yup.string().optional().default("-1"),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: LoanStatementVerificationFormValues,
): LoanStatementVerificationRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  const collectorNum = Number(v.collectorId);
  return {
    memberRegistrationId: v.memberRegistrationId || 0,
    fromDateBs: v.fromDateBs || undefined,
    toDateBs: v.toDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    collectorId:
      Number.isFinite(collectorNum) && collectorNum > 0 ? collectorNum : 0,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function LoanStatementVerificationPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<LoanStatementVerificationResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<LoanStatementVerificationRequestDto | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<LoanStatementVerificationFormValues>({
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
    (request: LoanStatementVerificationRequestDto, format: string) =>
      loanService.api.loanStatementVerificationCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanStatementVerificationRequestDto): Promise<void> => {
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
          "LoanStatementVerificationReport",
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

  const onSubmit: SubmitHandler<LoanStatementVerificationFormValues> =
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
    <LoanStatementVerificationForm
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

export default LoanStatementVerificationPage;
