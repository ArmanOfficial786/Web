"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import LoanIssueDetailsForm from "@/components/reports/loanReport/loanAccountWiseReport/LoanIssueDetailsForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanIssueDetailsRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

// ⚠️ Guessed wire values — confirm against backend
const REPORT_TYPE_LOAN_ISSUE = "LoanIssueReport";
// export type LoanIssueDetailsFormValues = LoanIssueDetailsRequestDto & {
//   memberName?: string | null;
// };

export type LoanIssueDetailsFormValues = Omit<
  LoanIssueDetailsRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
  memberName?: string | null;
};

export interface LoanIssueDetailsResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanIssueDetailsFormValues> = yup
  .object({
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
    collectionCenterIds: yup.string().nullable().optional().default("0"),
    enableCollectionCenter: yup.boolean().optional().default(false),
    reportType: yup
      .string()
      .nullable()
      .optional()
      .default(REPORT_TYPE_LOAN_ISSUE),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function LoanIssueDetailsPage() {
  const [reportState, setReportState] =
    useState<LoanIssueDetailsResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<LoanIssueDetailsRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanIssueDetailsFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: LoanIssueDetailsFormValues): LoanIssueDetailsRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const isAll = selectedIds.length === 0;

      return {
        memberId: form.memberId || undefined,
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        collectionCenterIds: form.collectionCenterIds || "0",
        enableCollectionCenter: form.enableCollectionCenter ?? false,
        reportType: form.reportType || REPORT_TYPE_LOAN_ISSUE,
        orderBy: form.orderBy || "",
        visualReport: form.visualReport ?? false,
      };
    },
    [],
  );

  const callApi = useCallback(
    (request: LoanIssueDetailsRequestDto, format: string) =>
      loanService.api.loanIssueDetailsCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanIssueDetailsRequestDto) => {
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
        const url = URL.createObjectURL(responseToBlob(res.data, format));
        const link = document.createElement("a");
        link.href = url;
        link.download = extractFilenameFromResponse(
          res,
          format,
          "LoanIssueDetailsReport",
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<LoanIssueDetailsFormValues> = useCallback(
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
    <LoanIssueDetailsForm
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
