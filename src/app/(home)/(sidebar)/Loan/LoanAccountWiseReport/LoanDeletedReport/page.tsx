"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanDeletedRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanDeletedForm, {
  type ReportFormat,
} from "@/components/reports/loanReport/loanAccountWiseReport/LoanDeletedForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ⚠️ Guessed wire values — confirm against backend
const REPORT_TYPE_ALL_DELETED = "ViewAllDeleted";
const REPORT_TYPE_BETWEEN_DATE = "ViewDeletedBetweenDate";

// branchIds arrives as string[] from OfficeNameField, memberGroupId is UI "Select Group"
export type LoanDeletedFormValues = Omit<
  LoanDeletedRequestDto,
  "branchIds" | "memberGroupId"
> & {
  branchIds?: string[];
  memberGroupId?: string | null;
};

export interface LoanDeletedResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanDeletedFormValues> = yup
  .object({
    reportType: yup
      .string()
      .nullable()
      .optional()
      .default(REPORT_TYPE_ALL_DELETED),
    fromDateBs: yup
      .string()
      .nullable()
      .optional()
      .when("reportType", {
        is: REPORT_TYPE_BETWEEN_DATE,
        then: (s) => s.required(DATE_REQUIRED_MESSAGE),
        otherwise: (s) => s.nullable().optional(),
      }),
    toDateBs: yup
      .string()
      .nullable()
      .optional()
      .when("reportType", {
        is: REPORT_TYPE_BETWEEN_DATE,
        then: (s) =>
          s
            .required(DATE_REQUIRED_MESSAGE)
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
        otherwise: (s) => s.nullable().optional(),
      }),
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    memberGroupId: yup.string().nullable().optional().default("-1"),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function LoanDeletedPage() {
  const [reportState, setReportState] = useState<LoanDeletedResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<LoanDeletedRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanDeletedFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: LoanDeletedFormValues): LoanDeletedRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const isAll = selectedIds.length === 0;

      return {
        reportType: form.reportType || REPORT_TYPE_ALL_DELETED,
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        memberGroupId: form.memberGroupId || "-1",
        orderBy: form.orderBy || "",
        visualReport: form.visualReport ?? false,
      };
    },
    [],
  );

  const callApi = useCallback(
    (request: LoanDeletedRequestDto, format: string) =>
      loanService.api.loanDeletedCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanDeletedRequestDto) => {
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
          "LoanDeletedReport",
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

  const onSubmit: SubmitHandler<LoanDeletedFormValues> = useCallback(
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
    <LoanDeletedForm
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
