"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect } from "react";
import * as yup from "yup";
import type { MemberDetailsSummaryRequest, Pagination } from "types/api/api";
import MemberDetailsSummaryForm from "@/components/reports/memberReport/MemberDetailsSummaryForm";
import memberDetailsSummaryService from "@/services/member/MemberDetailsSummaryService";
import { type ReportFormat } from "@/utilis/Constants/reportConstants";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import type { MemberRecord } from "@/contexts/ReportFormContext";

// ── UI-only fields – stripped before sending to API ────────────────────────
export interface MemberDetailsSummaryFormValues extends MemberDetailsSummaryRequest {
  memberName?: string;
}

// ── Client-only state ──────────────────────────────────────────────────────
export interface MemberDetailsSummaryResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

// ── Validation schema ──────────────────────────────────────────────────────
const schema: yup.ObjectSchema<MemberDetailsSummaryFormValues> = yup.object({
  memberRegistrationId: yup
    .number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required("Member is required")
    .min(1, "Member is required")
    .default(0),
  fromDate: yup.string().required("From Date is required").default(""),
  toDate: yup
    .string()
    .required("To Date is required")
    .test("bs-min", "To Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    })
    .default(""),
  orderBy: yup.string().nullable().optional().default(""),
  visualReport: yup.boolean().optional().default(false),
  memberName: yup.string().optional().default(""),
});

// ── Strip UI-only fields before API call ──────────────────────────────────
const toRequest = (
  v: MemberDetailsSummaryFormValues,
): MemberDetailsSummaryRequest => ({
  memberRegistrationId: Number(v.memberRegistrationId) || 0,
  fromDate: v.fromDate || "",
  toDate: v.toDate || "",
  orderBy: v.orderBy || "",
  visualReport: v.visualReport || false,
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

// ── Page ──────────────────────────────────────────────────────────────────
function Page(): React.ReactElement {
  const [reportState, setReportState] =
    useState<MemberDetailsSummaryResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<MemberDetailsSummaryRequest | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberDetailsSummaryFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── Wire modal selection → correct form fields ─────────────────────────
  // MemberLookupButton calls onMemberSelect with the full MemberRecord.
  // We pull memMemberRegistrationId (number) → memberRegistrationId
  // and memberName (string) → memberName (display only)
  const handleMemberSelect = useCallback(
    (member: MemberRecord) => {
      setValue(
        "memberRegistrationId",
        member.memMemberRegistrationId, // ✅ 202, not "MR-01-202"
        { shouldValidate: true },
      );
      setValue("memberName", member.memberName);
    },
    [setValue],
  );

  const callApi = useCallback(
    (request: MemberDetailsSummaryRequest, format: string) =>
      memberDetailsSummaryService.api.memberDetailsSummaryCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MemberDetailsSummaryRequest): Promise<void> => {
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
            return raw ? (JSON.parse(raw) as Pagination) : DEFAULT_PAGINATION;
          } catch {
            return DEFAULT_PAGINATION;
          }
        })();

        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });
        reset({ memberName: "" });
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
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
          "MemberDetailsSummary",
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

  const onSubmit: SubmitHandler<MemberDetailsSummaryFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
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

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <MemberDetailsSummaryForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onMemberSelect={handleMemberSelect} // ✅ pass down to form
    />
  );
}

export default Page;
