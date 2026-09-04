// app/(home)/(sidebar)/MemberAc/OtherReports/SavingsAccountMaturityReport/page.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  SavingsAccountMaturityRequestDto,
  Pagination,
  ReportResponseDtos,
} from "types/api/api";
import SavingsAccountMaturityForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/InterestPayableReport/SavingsAccountMaturityForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── branchIds is a string on the DTO ("-1" = all, else comma-separated ids),
// but OfficeNameField binds/writes a string[]. Same collapse pattern as
// InterestAndTaxDetail / InterestAndTaxPosted.
export type SavingsAccountMaturityFormValues = Omit<
  SavingsAccountMaturityRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
};

export interface SavingsAccountMaturityResponseExtended extends ReportResponseDtos {
  blobUrl: string;
  isLoading: boolean;
}

const schema: yup.ObjectSchema<SavingsAccountMaturityFormValues> = yup
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
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    branchName: yup.string().nullable().optional().default(""),
    depositTypeId: yup.number().optional(),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false), // ⚠️ on DTO, not requested for UI — kept for schema completeness only
    format: yup.string().nullable().optional(),
  })
  .required();

export default function SavingsAccountMaturityPage() {
  const [reportState, setReportState] =
    useState<SavingsAccountMaturityResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<SavingsAccountMaturityRequestDto | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<SavingsAccountMaturityFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: SavingsAccountMaturityFormValues,
    ): SavingsAccountMaturityRequestDto => {
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
        depositTypeId: form.depositTypeId || undefined,
        orderBy: form.orderBy || "",
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: SavingsAccountMaturityRequestDto, format: string) =>
      memberAccountService.api.savingsAccountMaturityCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SavingsAccountMaturityRequestDto) => {
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
      console.log("handlePageChange: newPage", newPage, "totalPages", total);
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
          "SavingsAccountMaturityReport",
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

  const onSubmit: SubmitHandler<SavingsAccountMaturityFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <SavingsAccountMaturityForm
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
