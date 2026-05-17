"use client";

import SavingAcWiseBalance from "@/components/reports/memberAccount/SavingAcWiseBalance";
import savingAcWiseBalanceService from "@/services/memberAccount/SavingAcWiseBalanceService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { type ReportFormat } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  ReportResponseDtos,
  type Pagination,
  type SavingAcWiseBalanceRequest,
} from "types/api/api";
import * as yup from "yup";

// ── Client-only state ──────────────────────────────────────────────────────
// Does NOT extend ReportResponseDtos — backend returns binary PDF, not base64 JSON
export interface SavingAcWiseBalanceResponseExtended extends ReportResponseDtos {
  isLoading: boolean;
}

// ── Validation schema ──────────────────────────────────────────────────────
const schema: yup.ObjectSchema<SavingAcWiseBalanceRequest> = yup.object({
  // string | null  → .nullable().optional() ✅
  tillDate: yup
    .string()
    .nullable()
    .optional()
    .required("Till Date is required"),
  depositId: yup.number().required("Deposit Type is required"),
  branchSelected: yup.string().nullable().optional(),
  branchName: yup.string().nullable().optional().required("Branch is required"),
  status: yup.string().nullable().optional().required("Status is required"),
  collectorId: yup.number().optional(),
  memberGroupId: yup.number().optional(),
  collectionCenterId: yup.number().optional(),
  sameCompanyName: yup.boolean().optional().default(true),
  enableCollectionCenter: yup.boolean().optional().default(true),
  enableGroup: yup.boolean().optional().default(true),
  orderBy: yup.string().nullable().optional(),
});

// ── Strip / normalise before API call ─────────────────────────────────────
const toRequest = (
  v: SavingAcWiseBalanceRequest,
): SavingAcWiseBalanceRequest => ({
  tillDate: v.tillDate || null,
  depositId: v.depositId,
  branchSelected: v.branchSelected,
  branchName: v.branchName,
  status: v.status || null,
  collectorId: v.collectorId,
  memberGroupId: v.memberGroupId,
  collectionCenterId: v.collectionCenterId,
  sameCompanyName: v.sameCompanyName,
  enableCollectionCenter: v.enableCollectionCenter,
  // intentional: mirrors the original mapping
  enableGroup: v.enableCollectionCenter,
  orderBy: v.orderBy,
});

// ── Default pagination fallback ────────────────────────────────────────────
const DEFAULT_PAGINATION: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

// ── Page ───────────────────────────────────────────────────────────────────
function Page(): React.ReactElement {
  const [reportState, setReportState] =
    useState<SavingAcWiseBalanceResponseExtended>({ isLoading: false });

  const [lastRequest, setLastRequest] =
    useState<SavingAcWiseBalanceRequest | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<SavingAcWiseBalanceRequest>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: SavingAcWiseBalanceRequest, format: string) =>
      savingAcWiseBalanceService.api.savingAcWiseBalanceReportCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SavingAcWiseBalanceRequest): Promise<void> => {
      // Revoke previous blob URL before creating a new one
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return { isLoading: true };
      });
      try {
        const res = await callApi(request, "VIEW");

        // ── Parse X-Pagination JSON header ─────────────────────────────────
        // Backend serializes anonymous object → keys are already camelCase
        const raw =
          (res.headers as Record<string, string>)["x-pagination"] ?? "";
        const pagination: Pagination = (() => {
          try {
            return raw ? (JSON.parse(raw) as Pagination) : DEFAULT_PAGINATION;
          } catch {
            return DEFAULT_PAGINATION;
          }
        })();

        // ── Binary PDF response → blob URL ─────────────────────────────────
        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
        // Error toast handled by Axios interceptor
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
          "SavingAcWiseBalance", // fixed: was "MemberIdCard"
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

  const onSubmit: SubmitHandler<SavingAcWiseBalanceRequest> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
  );

  // ── Page navigation — NO API call — iframe navigates via #page=N ──────
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

  // ── Revoke blob URL on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <SavingAcWiseBalance
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

export default Page;
