"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanTypeWiseRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanTypeWiseForm from "@/components/reports/loanReport/LoanAnalysisReport/LoanTypeWiseForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

// ── Loan Guarantee options ────────────────────────────────────────────────────
const LOAN_GUARANTEE_ALL = "All";

// ── Share Type options (wire = number) ────────────────────────────────────────
const SHARE_TYPE_ALL = "All";
const SHARE_TYPE_PROMOTER = "Promoter";
const SHARE_TYPE_SHARE_HOLDER = "ShareHolder";

const shareTypeToNumber = (v: string | undefined): number | undefined => {
  if (!v || v === SHARE_TYPE_ALL) return undefined;
  if (v === SHARE_TYPE_PROMOTER) return 1;
  if (v === SHARE_TYPE_SHARE_HOLDER) return 2;
  return undefined;
};

// branchIds arrives as string[] from OfficeNameField
export interface LoanTypeWiseFormValues extends Omit<
  LoanTypeWiseRequestDto,
  | "branchIds"
  | "memberGroupId"
  | "collectionCenterId"
  | "collectorId"
  | "loanTypeId"
  | "shareType"
> {
  branchIds?: string[];
  memberGroupId?: string;
  collectionCenterId?: string;
  collectorId?: string;
  loanTypeId?: string;
  shareType?: string; // UI string → number in toRequest
}

export interface LoanTypeWiseResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanTypeWiseFormValues> = yup
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
    branchIds: yup
      .array()
      .of(yup.string().required())
      .optional()
      .default(["2"]),
    collectionCenterId: yup.string().optional().default("-1"),
    enableCollectionCenter: yup.boolean().optional().default(false),
    collectorId: yup.string().optional().default("-1"),
    memberGroupId: yup.string().optional().default("-1"),
    loanTypeId: yup.string().optional().default("-1"),
    loanGuarantee: yup.string().optional().default(LOAN_GUARANTEE_ALL),
    shareType: yup.string().optional().default(SHARE_TYPE_ALL),
    groupByBranch: yup.boolean().optional().default(false),
    groupByMemberGroup: yup.boolean().optional().default(false),
    sameCompanyName: yup.boolean().optional().default(false),
    showOpeningBalance: yup.boolean().optional().default(false),
    showDetail: yup.boolean().optional().default(false),
    viewCollector: yup.boolean().optional().default(false), // ✅ added — DTO field was missing from schema
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (v: LoanTypeWiseFormValues): LoanTypeWiseRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  const collectorNum = Number(v.collectorId);
  return {
    fromDateBs: v.fromDateBs || undefined,
    toDateBs: v.toDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    collectionCenterId: v.collectionCenterId || undefined,
    enableCollectionCenter: v.enableCollectionCenter ?? false,
    collectorId:
      Number.isFinite(collectorNum) && collectorNum > 0
        ? String(collectorNum)
        : undefined,
    memberGroupId: v.memberGroupId || "-1",
    loanTypeId: v.loanTypeId || undefined,
    loanGuarantee: v.loanGuarantee || LOAN_GUARANTEE_ALL,
    shareType: shareTypeToNumber(v.shareType),
    groupByBranch: v.groupByBranch ?? false,
    groupByMemberGroup: v.groupByMemberGroup ?? false,
    sameCompanyName: v.sameCompanyName ?? false,
    showOpeningBalance: v.showOpeningBalance ?? false,
    showDetail: v.showDetail ?? false,
    viewCollector: v.viewCollector ?? false, // ✅ added — pass through to the request DTO
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function LoanTypeWisePage(): React.ReactElement {
  const [reportState, setReportState] = useState<LoanTypeWiseResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<LoanTypeWiseRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue } = useForm<LoanTypeWiseFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const callApi = useCallback(
    (request: LoanTypeWiseRequestDto, format: string) =>
      loanService.api.loanTypeWiseCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanTypeWiseRequestDto): Promise<void> => {
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
          "LoanTypeWiseReport",
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

  const onSubmit: SubmitHandler<LoanTypeWiseFormValues> = useCallback(
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
    <LoanTypeWiseForm
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

export default LoanTypeWisePage;
