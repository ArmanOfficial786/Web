"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type {
  AccountLookUpDtos,
  FixedDepositCertificateScheduleRequestDto,
  Pagination,
} from "types/api/api";
import FixedDepositCertificateScheduleForm from "@/components/reports/memberAccount/InterestPayableReport/FixedDepositCertificateScheduleForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";
import memberAccountService from "@/services/memberAccount/memberAccountService"; // ⚠️ confirm this exposes fixedDepositCertificateScheduleCreate

// ⚠️ Guessed wire values — confirm against backend
export const REPORT_TYPE_SCHEDULE = "Schedule";
export const REPORT_TYPE_CERTIFICATE = "Certificate";
type ViewKind = "schedule" | "certificate";

export interface FixedDepositCertificateScheduleFormValues {
  accountNo?: string;
  memberId?: string;
  memberName?: string;
  accountId?: number;
  showHeader?: boolean;
}

export interface FixedDepositCertificateScheduleResponseExtended {
  blobUrl?: string;
  isLoading: boolean;
  loadingKind?: ViewKind; // which button triggered the in-flight request
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<FixedDepositCertificateScheduleFormValues> = yup
  .object({
    accountNo: yup.string().optional().default(""),
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
    accountId: yup.number().optional(),
    showHeader: yup.boolean().optional().default(true),
  })
  .required();

export default function FixedDepositCertificateSchedulePage() {
  const [reportState, setReportState] =
    useState<FixedDepositCertificateScheduleResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<FixedDepositCertificateScheduleRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<FixedDepositCertificateScheduleFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── Account Directory selection ──────────────────────────────────────────
  const handleAccountSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");
      setValue("accountId", record.mamAccountOpeningId ?? undefined);
    },
    [setValue],
  );

  const toRequest = useCallback(
    (
      form: FixedDepositCertificateScheduleFormValues,
      reportType: string,
    ): FixedDepositCertificateScheduleRequestDto => ({
      accountId: form.accountId || undefined,
      accountNo: form.accountNo || undefined,
      memberId: form.memberId || undefined,
      memberName: form.memberName || undefined,
      showHeader: form.showHeader ?? true,
      reportType,
    }),
    [],
  );

  const callApi = useCallback(
    (request: FixedDepositCertificateScheduleRequestDto, format: string) =>
      memberAccountService.api.fixedDepositCertificateScheduleCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (
      request: FixedDepositCertificateScheduleRequestDto,
      kind: ViewKind,
    ) => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return { isLoading: true, loadingKind: kind };
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

        const blobUrl = URL.createObjectURL(responseToBlob(res.data, "PDF"));
        setLastRequest(request);
        setReportState({ isLoading: false, blobUrl, pagination });
      } catch {
        toast.error("Failed to load report.");
        setReportState((prev) => ({
          ...prev,
          isLoading: false,
          loadingKind: undefined,
        }));
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
          "FixedDepositCertificateSchedule",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Download failed.",
        );
      }
    },
    [callApi, lastRequest],
  );

  // ── Two distinct submit actions sharing one form ────────────────────────
  const onViewSchedule: SubmitHandler<FixedDepositCertificateScheduleFormValues> =
    useCallback(
      (formData) =>
        fetchReport(toRequest(formData, REPORT_TYPE_SCHEDULE), "schedule"),
      [fetchReport, toRequest],
    );

  const onViewCertificate: SubmitHandler<FixedDepositCertificateScheduleFormValues> =
    useCallback(
      (formData) =>
        fetchReport(
          toRequest(formData, REPORT_TYPE_CERTIFICATE),
          "certificate",
        ),
      [fetchReport, toRequest],
    );

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return prev;
      });
    };
  }, []);

  return (
    <FixedDepositCertificateScheduleForm
      control={control}
      handleSubmit={handleSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onAccountSelect={handleAccountSelect}
      onViewSchedule={onViewSchedule}
      onViewCertificate={onViewCertificate}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
    />
  );
}
