"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanRegisterRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanRegisterForm from "@/components/reports/loanReport/LoanAnalysisReport/LoanRegisterForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

// ── Select Loan options ───────────────────────────────────────────────────────
const SELECT_LOAN_ALL = "All";

// branchIds arrives as string[] from OfficeNameField
export interface LoanRegisterFormValues extends Omit<
  LoanRegisterRequestDto,
  "branchIds" | "loanTypeMasterId" | "collectorId" | "collectionCenterIds"
> {
  branchIds?: string[];
  loanTypeMasterId?: string;
  collectorId?: string;
  collectionCenterIds?: string;
}

export interface LoanRegisterResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanRegisterFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    branchIds: yup
      .array()
      .of(yup.string().required())
      .optional()
      .default(["2"]),
    loanTypeMasterId: yup.string().optional().default("-1"),
    collectorId: yup.string().optional().default("-1"),
    collectionCenterIds: yup.string().optional().default("-1"),
    enableCollectionCenter: yup.boolean().optional().default(false),
    selectLoan: yup.string().optional().default(SELECT_LOAN_ALL),
    nepaliReport: yup.boolean().optional().default(false),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (v: LoanRegisterFormValues): LoanRegisterRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  const collectorNum = Number(v.collectorId);
  return {
    tillDateBs: v.tillDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    loanTypeMasterId: v.loanTypeMasterId || undefined,
    collectorId:
      Number.isFinite(collectorNum) && collectorNum > 0
        ? String(collectorNum)
        : undefined,
    collectionCenterIds: v.collectionCenterIds || "-1",
    enableCollectionCenter: v.enableCollectionCenter ?? false,
    selectLoan: v.selectLoan || SELECT_LOAN_ALL,
    nepaliReport: v.nepaliReport ?? false,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function LoanRegisterPage(): React.ReactElement {
  const [reportState, setReportState] = useState<LoanRegisterResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<LoanRegisterRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue } = useForm<LoanRegisterFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const callApi = useCallback(
    (request: LoanRegisterRequestDto, format: string) =>
      loanService.api.loanRegisterCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanRegisterRequestDto): Promise<void> => {
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
          "LoanRegisterReport",
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

  const onSubmit: SubmitHandler<LoanRegisterFormValues> = useCallback(
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
    <LoanRegisterForm
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

export default LoanRegisterPage;
