// app/(home)/(sidebar)/MemberAc/OtherReports/ChequeBookWithdrawalReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  AccountLookUpDtos,
  ChequeBookWithdrawalRequestDto,
  Pagination,
} from "types/api/api";
import ChequeBookWithdrawalForm, {
  type ChequeBookWithdrawalFormValues,
  type ReportFormat,
} from "@/components/reports/memberAccount/ChequeBookReport/ChequeBookWithdrawalForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

export interface ChequeBookWithdrawalResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

// ── UI-only fields (accountId) merged onto the real DTO shape ───────────────
const schema: yup.ObjectSchema<ChequeBookWithdrawalFormValues> = yup
  .object({
    accountId: yup.number().optional(),
    accountNo: yup.string().nullable().optional().default(""),
    memberId: yup.string().nullable().optional().default(""),
    memberName: yup.string().nullable().optional().default(""),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false), // ⚠️ on DTO, not requested for UI — kept for schema completeness only
  })
  .required();

const toRequest = (
  form: ChequeBookWithdrawalFormValues,
): ChequeBookWithdrawalRequestDto => ({
  accountId: form.accountId || undefined,
  accountNo: form.accountNo || undefined,
  memberId: form.memberId || undefined,
  memberName: form.memberName || undefined,
  orderBy: form.orderBy || "",
});

export default function ChequeBookWithdrawalPage() {
  const [reportState, setReportState] =
    useState<ChequeBookWithdrawalResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<ChequeBookWithdrawalRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<ChequeBookWithdrawalFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── Account selection from the lookup modal ──────────────────────────────
  const handleAccountSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");
      setValue("accountId", record.mamAccountOpeningId ?? undefined);
    },
    [setValue],
  );

  const callApi = useCallback(
    (request: ChequeBookWithdrawalRequestDto, format: string) =>
      memberAccountService.api.chequeBookWithdrawalCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: ChequeBookWithdrawalRequestDto): Promise<void> => {
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
          "ChequeBookWithdrawalReport",
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

  const onSubmit: SubmitHandler<ChequeBookWithdrawalFormValues> = useCallback(
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
    <ChequeBookWithdrawalForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onAccountSelect={handleAccountSelect}
    />
  );
}
