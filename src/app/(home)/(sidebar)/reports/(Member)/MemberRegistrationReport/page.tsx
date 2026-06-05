"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect } from "react";
import * as yup from "yup";
import type { MemberDetailRequest, Pagination } from "types/api/api";
import MemberRegistrationReport from "@/components/reports/memberReport/MemberDetailReport";
import memberRegistrationService from "@/services/member/MemberDetailService";
import {
  DefaultPagination,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";

// ── UI-only fields — stripped before sending to API ────────────────────────
export interface MemberRegistrationFormValues extends MemberDetailRequest {
  memberName?: string;
}

// ── Client-only state ──────────────────────────────────────────────────────
// MemberRegistration endpoint returns ReportResponseDtosGeneralResponse (JSON
// with base64 pdfData + pagination object), NOT a raw binary blob.
export interface MemberRegistrationResponseExtended {
  pdfData?: string; // base64 string from data.pdfData
  isLoading: boolean;
  pagination?: Pagination;
}

// ── Validation schema ──────────────────────────────────────────────────────
const schema: yup.ObjectSchema<MemberRegistrationFormValues> = yup.object({
  memberId: yup.string().nullable().optional().default(null),
  memberName: yup.string().optional().default(""),
  fromDate: yup.string().required("From Date is required").default(""),
  toDate: yup
    .string()
    .required("To Date is required")
    .default(null)
    .test("bs-min", "Till Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    }),
  orderby: yup.string().nullable().optional().default("0"),
  branchId: yup.number().required("Branch ID is required").default(2),
  memberGroupId: yup.number().optional().default(0),
  visualReport: yup.boolean().optional().default(false),
});

// ── Strip UI-only fields before API call ───────────────────────────────────
const toRequest = (v: MemberRegistrationFormValues): MemberDetailRequest => ({
  memberId: v.memberId || null,
  fromDate: v.fromDate || null,
  toDate: v.toDate || null,
  branchId: Number(v.branchId) || 0,
  memberGroupId: Number(v.memberGroupId) || 0,
  orderby: v.orderby,
});

// ── Default pagination fallback ────────────────────────────────────────────
const DEFAULT_PAGINATION: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 10,
  hasNextPage: false,
  hasPreviousPage: false,
};

// ── Page ───────────────────────────────────────────────────────────────────
function Page(): React.ReactElement {
  const [reportState, setReportState] =
    useState<MemberRegistrationResponseExtended>({ isLoading: false });

  const [lastRequest, setLastRequest] = useState<MemberDetailRequest | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberRegistrationFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── Raw API call ─────────────────────────────────────────────────────────
  const callApi = useCallback(
    (request: MemberDetailRequest, format: string) =>
      memberRegistrationService.api.memberRegistrationCreate(request, {
        format,
      }),
    [],
  );

  // ── View report (VIEW format → base64 JSON) ───────────────────────────────
  const fetchReport = useCallback(
    async (request: MemberDetailRequest): Promise<void> => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return { isLoading: true };
      });

      try {
        const res = await callApi(request, "VIEW");
        //         // ── Parse X-Pagination JSON header ─────────────────────────────────
        // Backend serializes anonymous object → keys are already camelCase
        const raw =
          (res.headers as Record<string, string>)["x-pagination"] ?? "";
        const pagination: Pagination = (() => {
          try {
            return raw ? (JSON.parse(raw) as Pagination) : DefaultPagination;
          } catch {
            return DefaultPagination;
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
      }
    },
    [callApi, reset],
  );

  // ── Download (PDF / Word / Excel / Image) ─────────────────────────────────
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
          "MemberRegistrationReport",
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

  // ── Form submit ───────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<MemberRegistrationFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
  );

  // ── Page navigation — updates local state; iframe navigates via #page=N ──
  const handlePageChange = useCallback((newPage: number) => {
    setReportState((prev) => {
      const total = prev.pagination?.totalPages ?? 1;
      const clamped = Math.max(1, Math.min(newPage, total));
      return {
        ...prev,
        pagination: {
          ...(prev.pagination ?? DEFAULT_PAGINATION),
          currentPage: clamped,
        },
      };
    });
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  // Nothing to revoke here (base64, not blob URL), but kept for symmetry and
  // future-proofing in case pdfData becomes a blob URL.
  useEffect(() => {
    return () => {
      setReportState((prev) => prev);
    };
  }, []);

  return (
    <MemberRegistrationReport
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
