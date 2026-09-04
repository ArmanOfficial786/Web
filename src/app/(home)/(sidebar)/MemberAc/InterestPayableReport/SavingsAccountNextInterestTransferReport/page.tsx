// app/(home)/(sidebar)/MemberAc/OtherReports/SavingAccountNextInterestTransferReport/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  Pagination,
  ReportResponseDtos,
  SavingsAccountInterestTransferRequestDto,
} from "types/api/api";
import SavingAccountNextInterestTransferForm from "@/components/reports/memberAccount/InterestPayableReport/SavingAccountNextInterestTransferForm";
import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── branchId is a string on the DTO ("-1" = all, else comma-separated ids),
// but OfficeNameField binds/writes a string[]. Same collapse pattern as
// SavingsAccountInterestTransferReport / SavingsAccountMaturityReport.
export type SavingAccountNextInterestTransferFormValues = Omit<
  SavingsAccountInterestTransferRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
};

export interface SavingAccountNextInterestTransferResponseExtended extends ReportResponseDtos {
  blobUrl: string;
  isLoading: boolean;
}

const schema: yup.ObjectSchema<SavingAccountNextInterestTransferFormValues> =
  yup
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
        .test(
          "date-order",
          "To Date cannot be before From Date",
          function (val) {
            const { fromDateBs } = this.parent as {
              fromDateBs: string | null;
            };
            if (!fromDateBs || !val) return true;
            return String(val) >= String(fromDateBs);
          },
        ),
      branchIds: yup.array().of(yup.string().required()).optional().default([]),
      branchName: yup.string().nullable().optional().default(""),
      depositTypeId: yup.number().optional(),
      orderBy: yup.string().nullable().optional().default(""),
      visualReport: yup.boolean().optional().default(false), // ⚠️ same as above
    })
    .required();

export default function SavingAccountNextInterestTransferPage() {
  const [reportState, setReportState] =
    useState<SavingAccountNextInterestTransferResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<SavingsAccountInterestTransferRequestDto | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<SavingAccountNextInterestTransferFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: SavingAccountNextInterestTransferFormValues,
    ): SavingsAccountInterestTransferRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const allIds = branchOptions
        .map((o) => String(o.id))
        .filter((id) => Number(id) > 0);
      const isAll =
        selectedIds.length === 0 || selectedIds.length === allIds.length;
      const resolvedIds = isAll ? allIds : selectedIds;

      const branchName = branchOptions
        .filter((o) => resolvedIds.includes(String(o.id)))
        .map((o) => o.name)
        .join(", ");

      return {
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        branchName: branchName || undefined,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: SavingsAccountInterestTransferRequestDto, format: string) =>
      memberAccountService.api.savingsAccountNextInterestTransferCreate(
        request,
        { format },
      ),
    [],
  );

  const fetchReport = useCallback(
    async (request: SavingsAccountInterestTransferRequestDto) => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return { isLoading: true, blobUrl: "" };
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
    async (format: ReportFormat) => {
      if (!lastRequest) {
        toast.warning("Please generate the report first");
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
          "SavingAccountNextInterestTransferReport",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<SavingAccountNextInterestTransferFormValues> =
    useCallback(
      (formData) => fetchReport(toRequest(formData)),
      [fetchReport, toRequest],
    );

  return (
    <SavingAccountNextInterestTransferForm
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
