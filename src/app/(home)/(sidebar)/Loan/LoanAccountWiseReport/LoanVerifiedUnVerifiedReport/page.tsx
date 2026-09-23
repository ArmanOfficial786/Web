"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  LoanVerifiedUnverifiedRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import LoanVerifiedUnverifiedForm, {
  type ReportFormat,
} from "@/components/reports/loanReport/loanAccountWiseReport/LoanVerifiedUnverifiedForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ⚠️ Guessed wire values — confirm against backend
const REPORT_TYPE_LOAN_VERIFIED = "LoanVerified";

// branchIds arrives as string[] from OfficeNameField
// memberId / memberName are UI-only (from EntityLookupField)
export type LoanVerifiedUnverifiedFormValues = Omit<
  LoanVerifiedUnverifiedRequestDto,
  "branchIds" | "memberRegistrationId"
> & {
  branchIds?: string[];
  memberId?: string | null;
  memberName?: string | null;
};

export interface LoanVerifiedUnverifiedResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanVerifiedUnverifiedFormValues> = yup
  .object({
    reportType: yup
      .string()
      .nullable()
      .optional()
      .default(REPORT_TYPE_LOAN_VERIFIED),
    memberId: yup.string().nullable().optional(),
    memberName: yup.string().nullable().optional(),
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
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function LoanVerifiedUnverifiedPage() {
  const [reportState, setReportState] =
    useState<LoanVerifiedUnverifiedResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<LoanVerifiedUnverifiedRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanVerifiedUnverifiedFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: LoanVerifiedUnverifiedFormValues,
    ): LoanVerifiedUnverifiedRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const isAll = selectedIds.length === 0;

      return {
        reportType: form.reportType || REPORT_TYPE_LOAN_VERIFIED,
        memberRegistrationId: form.memberId || undefined,
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        orderBy: form.orderBy || "",
        visualReport: form.visualReport ?? false,
      };
    },
    [],
  );

  const callApi = useCallback(
    (request: LoanVerifiedUnverifiedRequestDto, format: string) =>
      loanService.api.loanVerifiedUnverifiedCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanVerifiedUnverifiedRequestDto) => {
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
    async (format: ReportFormat) => {
      if (!lastRequest) {
        toast.warning("Please view the report before exporting.");
        return;
      }
      try {
        const res = await callApi(lastRequest, format);
        const url = URL.createObjectURL(responseToBlob(res.data, format));
        const link = document.createElement("a");
        link.href = url;
        link.download = extractFilenameFromResponse(
          res,
          format,
          "LoanVerifiedUnverifiedReport",
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch {
        toast.error("Failed to download file.");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<LoanVerifiedUnverifiedFormValues> = useCallback(
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
    <LoanVerifiedUnverifiedForm
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
