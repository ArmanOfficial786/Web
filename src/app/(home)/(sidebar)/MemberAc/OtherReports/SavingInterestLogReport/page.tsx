// app/(home)/(sidebar)/MemberAc/OtherReports/SavingInterestChangeLogReport/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  SavingInterestChangeLogRequestDto,
  Pagination,
  AccountLookUpDtos,
} from "types/api/api";
import SavingInterestChangeLogForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/SavingInterestChangeLogForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

export type SavingInterestChangeLogFormValues =
  SavingInterestChangeLogRequestDto & {
    memberId?: string | null;
    memberName?: string | null;
  };

export interface SavingInterestChangeLogResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<SavingInterestChangeLogFormValues> = yup
  .object({
    fromDateBs: yup
      .string()
      .required("From Date is required")
      .nullable()
      .optional()
      .typeError("From Date must be a valid date"),
    toDateBs: yup
      .string()
      .required("To Date is required")
      .nullable()
      .optional()
      .typeError("To Date must be a valid date")
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDateBs } = this.parent as { fromDateBs: string | null };
        if (!fromDateBs || !val) return true;
        return String(val) >= String(fromDateBs);
      }),
    officeId: yup.number().nullable().optional().default(null),
    officeName: yup.string().nullable().optional().default(""),
    reportType: yup
      .string()
      .oneOf(["AccountNo", "DepositType"]) // ⚠️ confirm exact backend codes
      .nullable()
      .optional()
      .default("AccountNo"),
    accountNo: yup.string().nullable().optional().default(""),
    accountOpeningId: yup.number().nullable().optional().default(null), // not shown in UI — confirm if backend requires a value
    depositTypeId: yup.number().nullable().optional().default(null),
    visualReport: yup.boolean().optional().default(false), // ⚠️ not in your field list — declared for type-completeness only, not rendered
    memberId: yup.string().nullable().optional().default(""), // UI-only, not on DTO
    memberName: yup.string().nullable().optional().default(""), // UI-only, not on DTO
  })
  .required();

export default function SavingInterestChangeLogPage() {
  const [reportState, setReportState] =
    useState<SavingInterestChangeLogResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<SavingInterestChangeLogRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset, watch } =
    useForm<SavingInterestChangeLogFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const handleAccountSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");
      setValue("accountOpeningId", record.mamAccountOpeningId ?? null);
    },
    [setValue],
  );

  const toRequest = useCallback(
    (
      form: SavingInterestChangeLogFormValues,
    ): SavingInterestChangeLogRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      officeId: form.officeId ?? undefined,
      officeName: form.officeName || undefined,
      reportType: form.reportType || "AccountNo",
      accountNo:
        form.reportType === "AccountNo"
          ? form.accountNo || undefined
          : undefined,
      depositTypeId:
        form.reportType === "DepositType"
          ? (form.depositTypeId ?? undefined)
          : undefined,
      accountOpeningId: form.accountOpeningId ?? undefined,
      visualReport: form.visualReport ?? false,
      // memberId / memberName intentionally omitted — not part of this DTO
    }),
    [],
  );

  const callApi = useCallback(
    (request: SavingInterestChangeLogRequestDto, format: string) =>
      memberAccountService.api.savingInterestChangeLogCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SavingInterestChangeLogRequestDto) => {
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
      } catch (error) {
        console.error("Report generation error:", error);
        toast.error("Failed to generate report");
        setReportState({ isLoading: false });
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
        "SavingInterestChangeLogReport",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<SavingInterestChangeLogFormValues> =
    useCallback(
      (formData) => fetchReport(toRequest(formData)),
      [fetchReport, toRequest],
    );

  return (
    <SavingInterestChangeLogForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      watch={watch}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onAccountSelect={handleAccountSelect}
    />
  );
}
