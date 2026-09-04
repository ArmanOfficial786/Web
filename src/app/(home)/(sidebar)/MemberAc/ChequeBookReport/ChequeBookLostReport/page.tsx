// app/(home)/(sidebar)/MemberAc/OtherReports/ChequeBookLostReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type { ChequeBookLostRequestDto, Pagination } from "types/api/api";
import ChequeBookLostForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/ChequeBookReport/ChequeBookLostForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";


export type ChequeBookLostFormValues = Omit<
  ChequeBookLostRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
};

export interface ChequeBookLostResponseExtended {
  blobUrl?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<ChequeBookLostFormValues> = yup
  .object({
    memberId: yup.number().optional(),
    memberIdText: yup.string().nullable().optional().default(""),
    memberName: yup.string().nullable().optional().default(""),
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
    branchName: yup.string().nullable().optional().default(""),
    orderBy: yup.string().nullable().optional().default(""),
    reportView: yup.string().nullable().optional().default(""), // ⚠️ on DTO, not requested for UI — kept for schema completeness only
    visualReport: yup.boolean().optional().default(false), // ⚠️ on DTO, not requested for UI — kept for schema completeness only
  })
  .required();

export default function ChequeBookLostPage() {
  const [reportState, setReportState] =
    useState<ChequeBookLostResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<ChequeBookLostRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<ChequeBookLostFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (form: ChequeBookLostFormValues): ChequeBookLostRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const isAll = selectedIds.length === 0;

      return {
        memberId: form.memberId || undefined,
        memberIdText: form.memberIdText || undefined,
        memberName: form.memberName || undefined,
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        branchName: form.branchName || undefined,
        orderBy: form.orderBy || "",
      };
    },
    [],
  );

  const callApi = useCallback(
    (request: ChequeBookLostRequestDto, format: string) =>
      memberAccountService.api.chequeBookLostCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: ChequeBookLostRequestDto) => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
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
          "ChequeBookLostReport",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Download failed.");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<ChequeBookLostFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
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
    <ChequeBookLostForm
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