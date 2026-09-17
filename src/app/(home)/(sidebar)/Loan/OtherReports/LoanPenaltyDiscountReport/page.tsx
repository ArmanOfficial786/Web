// app/(home)/(sidebar)/Loan/OtherReports/LoanPenaltyDiscountReport/page.tsx
"use client";

import LoanPenaltyDiscountForm, {
  type ReportFormat,
} from "@/components/reports/loanReport/otherReports/LoanPenaltyDiscountForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanPenaltyDiscountRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

export type LoanPenaltyDiscountFormValues = Omit<
  LoanPenaltyDiscountRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
  memberName?: string | null;
};

export interface LoanPenaltyDiscountResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanPenaltyDiscountFormValues> = yup
  .object({
    memberId: yup.string().nullable().optional().default(""),
    memberName: yup.string().nullable().optional().default(""),
    loanTypeId: yup.number().optional().default(0),
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
    branchIds: yup
      .array()
      .of(yup.string().required())
      .transform((_value, originalValue) => {
        if (Array.isArray(originalValue)) return originalValue;
        if (
          originalValue === null ||
          originalValue === undefined ||
          originalValue === ""
        ) {
          return [];
        }
        return [String(originalValue)];
      })
      .optional()
      .default([]),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false), // ⚠️ on DTO, not requested for UI — kept for schema completeness only
  })
  .required();

export default function LoanPenaltyDiscountPage() {
  const [reportState, setReportState] =
    useState<LoanPenaltyDiscountResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<LoanPenaltyDiscountRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanPenaltyDiscountFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const toRequest = useCallback(
    (form: LoanPenaltyDiscountFormValues): LoanPenaltyDiscountRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const isAll = selectedIds.length === 0;

      return {
        memberId: form.memberId || undefined,
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        orderBy: form.orderBy || "",
      };
    },
    [],
  );

  const callApi = useCallback(
    (request: LoanPenaltyDiscountRequestDto, format: string) =>
      loanService.api.loanPenaltyDiscountCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanPenaltyDiscountRequestDto) => {
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
          "LoanPenaltyDiscountReport",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        toast.error("Failed to download file.");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<LoanPenaltyDiscountFormValues> = useCallback(
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
    <LoanPenaltyDiscountForm
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
