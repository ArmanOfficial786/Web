"use client";

import LoanDetailPrincipalForm from "@/components/reports/loanReport/LoanAnalysisReport/LoanDetailPrincipalForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanDetailsRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

// ── Status options ────────────────────────────────────────────────────────────
const STATUS_OPEN = "Open";

// ⚠️ Guessed wire values — confirm against backend
const REPORT_TYPE_DETAIL = "Detail";

// branchIds arrives as string[] from OfficeNameField
export interface LoanDetailPrincipalFormValues extends Omit<
  LoanDetailsRequestDto,
  "branchIds"
> {
  branchIds?: string[];
}

export interface LoanDetailPrincipalResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanDetailPrincipalFormValues> = yup
  .object({
    loanTypeId: yup.string().optional().default(""),
    status: yup.string().optional().default(STATUS_OPEN),
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
    collectionCenterId: yup.string().optional().default("0"),
    enableCollectionCenter: yup.boolean().optional().default(false),
    collectorId: yup.string().optional().default("-1"),
    reportType: yup.string().optional().default(REPORT_TYPE_DETAIL),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (v: LoanDetailPrincipalFormValues): LoanDetailsRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  const collectorNum = Number(v.collectorId);
  return {
    loanTypeId: v.loanTypeId || undefined,
    status: v.status || STATUS_OPEN,
    fromDateBs: v.fromDateBs || undefined,
    toDateBs: v.toDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    collectionCenterId: v.collectionCenterId || "0",
    enableCollectionCenter: v.enableCollectionCenter ?? false,
    collectorId:
      Number.isFinite(collectorNum) && collectorNum > 0
        ? String(collectorNum)
        : undefined,
    reportType: v.reportType || REPORT_TYPE_DETAIL,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function LoanDetailPrincipalPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<LoanDetailPrincipalResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] = useState<LoanDetailsRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue } =
    useForm<LoanDetailPrincipalFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: LoanDetailsRequestDto, format: string) =>
      loanService.api.loanDetailsCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanDetailsRequestDto): Promise<void> => {
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

  const handleDownload = useCallback(
    async (format: ReportFormat): Promise<void> => {
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
          "LoanDetailPrincipalReport",
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

  const onSubmit: SubmitHandler<LoanDetailPrincipalFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
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
    <LoanDetailPrincipalForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
    />
  );
}

export default LoanDetailPrincipalPage;
