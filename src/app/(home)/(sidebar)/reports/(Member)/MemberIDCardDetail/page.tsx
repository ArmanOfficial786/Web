"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect } from "react";
import * as yup from "yup";
import type { MemberIdCardRequest, Pagination } from "types/api/api";
import MemberIdCard from "@/components/reports/memberReport/MemberIdCard";
import memberIdCardService from "@/services/member/MemberIdCardService";
import { type ReportFormat } from "@/utilis/Constants/reportConstants";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";

// ── UI-only fields — stripped before sending to API ────────────────────────
export interface MemberIdCardFormValues extends MemberIdCardRequest {
  collectionCenterId?: number;
  memberName?: string;
}

// ── Client-only state ──────────────────────────────────────────────────────
// Does NOT extend ReportResponseDtos — backend returns binary PDF, not base64 JSON
export interface MemberIdCardResponseExtended {
  pdfData?: string; // blob URL created from binary PDF
  isLoading: boolean;
  pagination?: Pagination; // parsed from X-Pagination header (camelCase JSON)
}

// ── Validation schema ──────────────────────────────────────────────────────
const schema: yup.ObjectSchema<MemberIdCardFormValues> = yup.object({
  memberId: yup.string().nullable().optional().default(null),
  memberName: yup.string().optional().default(""),
  fromDate: yup.string().nullable().optional().default(null),
  toDate: yup
    .string()
    .nullable()
    .optional()
    .default(null)
    .test("bs-min", "Till Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    }),
  orderby: yup.string().nullable().optional().default("0"),
  branchId: yup.number().optional().default(2),
  collectionCenterId: yup.number().optional().default(0),
  memberGroupId: yup.number().optional().default(0),
  currentPage: yup.number().optional().default(1),
  pageSize: yup.number().optional().default(10),
});

// ── Strip UI-only fields before API call ───────────────────────────────────
const toRequest = (v: MemberIdCardFormValues): MemberIdCardRequest => ({
  memberId: v.memberId || null,
  fromDate: v.fromDate || null,
  toDate: v.toDate || null,
  branchId: Number(v.branchId) || 0,
  memberGroupId: Number(v.memberGroupId) || 0,
  orderby: v.orderby,
  currentPage: 1,
  pageSize: v.pageSize ?? 10,
  // collectionCenterId & memberName are UI-only — intentionally omitted
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
  const [reportState, setReportState] = useState<MemberIdCardResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<MemberIdCardRequest | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberIdCardFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: MemberIdCardRequest, format: string) =>
      memberIdCardService.api.memberIdCardMemberIdCardCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MemberIdCardRequest): Promise<void> => {
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
        reset({ memberId: "", memberName: "" });
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
        // Error toast handled by Axios interceptor
      }
    },
    [callApi, reset],
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
          "MemberIdCard",
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

  const onSubmit: SubmitHandler<MemberIdCardFormValues> = useCallback(
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

  // ── Revoke(cancel,terminate) blob URL on unmount(delete) ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <MemberIdCard
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
