// app/(home)/(sidebar)/MemberAc/OtherReports/SavingDepositAmountMemberReport/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  SavingDepositMemberWiseRequestDto,
  Pagination,
} from "types/api/api";
import SavingDepositMemberWiseForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/SavingDepositMemberWiseForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// UI-only fields — never sent to the API:
// - memberName: EntityLookupField display
// - typeCategory: fixed "Saving" fed to TypeField's transactionTypeName
//   dependency so it filters savingTypeId options correctly
export type SavingDepositMemberWiseFormValues = Omit<
  SavingDepositMemberWiseRequestDto,
  "branchIds"
> & {
  branchIds?: string | number | Array<string | number> | null;
  memberName?: string | null;
  typeCategory?: string | null;
};

export interface SavingDepositMemberWiseResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<SavingDepositMemberWiseFormValues> = yup
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
    branchIds: yup
      .mixed<string | number | Array<string | number>>()
      .nullable()
      .optional()
      .default(""),
    orderBy: yup.string().nullable().optional().default(""),
    transactionType: yup
      .string()
      .oneOf(["Deposit", "Withdrawl"])
      .nullable()
      .optional()
      .default("Deposit"),
    memberId: yup.number().nullable().optional().default(null),
    savingTypeId: yup.number().nullable().optional().default(null),
    branchName: yup.string().nullable().optional().default(""),
    reportMode: yup.string().nullable().optional().default(""), // ⚠️ confirm accepted backend values
    memberName: yup.string().nullable().optional().default(""),
    typeCategory: yup.string().nullable().optional().default("Saving"), // UI-only, not sent to API
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function SavingDepositMemberWisePage() {
  const [reportState, setReportState] =
    useState<SavingDepositMemberWiseResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<SavingDepositMemberWiseRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<SavingDepositMemberWiseFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: SavingDepositMemberWiseFormValues,
    ): SavingDepositMemberWiseRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchIds: Array.isArray(form.branchIds)
        ? form.branchIds.join(",")
        : form.branchIds != null && form.branchIds !== ""
          ? String(form.branchIds)
          : undefined,
      branchName: form.branchName || undefined,
      orderBy: form.orderBy || "",
      transactionType: form.transactionType || "Deposit",
      memberId: form.memberId || undefined,
      savingTypeId: form.savingTypeId || undefined,
      reportMode: form.reportMode || undefined,
      visualReport: form.visualReport ?? false,
      // typeCategory intentionally omitted — UI-only field, not part of the DTO
    }),
    [],
  );

  const callApi = useCallback(
    (request: SavingDepositMemberWiseRequestDto, format: string) =>
      memberAccountService.api.savingDepositAmountMemberWiseCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SavingDepositMemberWiseRequestDto) => {
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
        "SavingDepositMemberWiseReport",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<SavingDepositMemberWiseFormValues> =
    useCallback(
      (formData) => fetchReport(toRequest(formData)),
      [fetchReport, toRequest],
    );

  return (
    <SavingDepositMemberWiseForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
    />
  );
}
