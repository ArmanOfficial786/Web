// src/app/(home)/(sidebar)/MemberAc/OtherReports/DataEditedReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { DataEditedReportRequestDto, Pagination } from "types/api/api";
import DataEditedReportForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/DataEditedReportForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";

// ── Form-only shape ──────────────────────────────────────────────────────────
// branchId: array of selected office ids from the checkbox list (joined into
//           the DTO's comma-separated branchIds string in toRequest()).
// memberId / memberName / memberRegistrationId: populated by the Member
//           Directory lookup (EntityLookupField + MemberLookupConfig), same
//           pattern used on the MemberIdCard page.
// NOTE: memberId/memberName are typed `string | null` (not `| undefined`) to
// match the `.nullable()` yup fields below — yup's inferred output type for
// `.nullable()` is `T | null`, so the interface must agree or ObjectSchema<T>
// fails to type-check.
export interface DataEditedReportFormValues extends Omit<
  DataEditedReportRequestDto,
  "branchIds" | "entryBy" | "editedBy" | "memberRegistrationId"
> {
  branchId?: number[];
  entryBy?: number;
  editedBy?: number;
  memberRegistrationId?: number;
  memberId?: string | null;
  memberName?: string | null;
}

// ── Client-only response state (raw PDF blob URL + header pagination) ──────
export interface DataEditedReportResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DEFAULT_PAGINATION: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const BRANCH_REQUIRED_MESSAGE = "Please select Office Name";
const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<DataEditedReportFormValues> = yup
  .object({
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
    branchId: yup
      .array()
      .of(yup.number().required())
      .optional()
      .default([])
      .test(
        "branch-required",
        BRANCH_REQUIRED_MESSAGE,
        (val) => !!val && val.length > 0,
      ),
    entryBy: yup.number().optional().default(-1),
    editedBy: yup.number().optional().default(-1),
    memberRegistrationId: yup.number().optional().default(-1),
    memberId: yup.string().nullable().optional().default(""),
    memberName: yup.string().nullable().optional().default(""),
    orderBy: yup.string().nullable().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function DataEditedReportPage() {
  const [reportState, setReportState] =
    useState<DataEditedReportResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<DataEditedReportRequestDto | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DataEditedReportFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
    mode: "onSubmit",
  });

  const toRequest = useCallback(
    (form: DataEditedReportFormValues): DataEditedReportRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchIds:
        form.branchId && form.branchId.length > 0
          ? form.branchId.join(",")
          : undefined,
      entryBy: form.entryBy && form.entryBy !== -1 ? form.entryBy : undefined,
      editedBy:
        form.editedBy && form.editedBy !== -1 ? form.editedBy : undefined,
      memberRegistrationId:
        form.memberRegistrationId && form.memberRegistrationId !== -1
          ? form.memberRegistrationId
          : undefined,
      orderBy: form.orderBy || "",
      sameCompanyName: form.sameCompanyName ?? true,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: DataEditedReportRequestDto, format: string) =>
      memberAccountService.api.dataEditedReportCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: DataEditedReportRequestDto) => {
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
            return raw ? (JSON.parse(raw) as Pagination) : DEFAULT_PAGINATION;
          } catch {
            return DEFAULT_PAGINATION;
          }
        })();

        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });
      } catch (err) {
        setReportState({ isLoading: false });
        throw err;
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
        "DataEditedReport",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<DataEditedReportFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
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
    <DataEditedReportForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      errors={errors}
    />
  );
}
