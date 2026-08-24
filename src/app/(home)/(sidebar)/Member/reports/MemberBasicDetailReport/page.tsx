"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect } from "react";
import * as yup from "yup";
import type { MemberBasicDetailsRequest, Pagination } from "types/api/api";
import MemberBasicDetailsForm from "@/components/reports/memberReport/MemberBasicDetailsForm";
import {
  DefaultPagination,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import type { MemberRecord } from "@/contexts/ReportFormContext";
import memberService from "@/services/member/memberService";

// ── UI-only fields – stripped before sending to API ────────────────────────
// branchId (number) is the UI selection; branchIds (string) is what the API
// expects — joined from branchId in toRequest.
export interface MemberBasicDetailsFormValues extends MemberBasicDetailsRequest {
  branchId?: number;
  memberName?: string;
}

// ── Client-only state ──────────────────────────────────────────────────────
export interface MemberBasicDetailsResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

// ── Validation schema ──────────────────────────────────────────────────────
const schema: yup.ObjectSchema<MemberBasicDetailsFormValues> = yup.object({
  fromDate: yup.string().required("From Date is required").default(""),
  toDate: yup
    .string()
    .required("To Date is required")
    .test("bs-min", "To Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    })
    .default(""),
  memberRegistrationId: yup
    .number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .optional()
    .default(0),
  memberName: yup.string().optional().default(""),
  branchId: yup
    .number()
    .required("Branch is required")
    .min(1, "Branch is required")
    .default(0),
  branchIds: yup.string().nullable().optional().default(""),
  orderBy: yup.string().nullable().optional().default(""),
  visualReport: yup.boolean().optional().default(false),
  sameCompanyName: yup.boolean().optional().default(false),
  branchSelected: yup.string().nullable().optional().default(""),
  branchName: yup.string().nullable().optional().default(""),
});

// ── Strip UI-only fields before API call ──────────────────────────────────
const toRequest = (
  v: MemberBasicDetailsFormValues,
): MemberBasicDetailsRequest => ({
  memberRegistrationId: Number(v.memberRegistrationId) || 0,
  fromDate: v.fromDate || "",
  toDate: v.toDate || "",
  // ✅ single branchId joined into the comma-separated branchIds string
  branchIds: v.branchId ? String(v.branchId) : "",
  orderBy: v.orderBy || "",
  visualReport: v.visualReport || false,
  sameCompanyName: v.sameCompanyName || false,
  branchSelected: v.branchSelected || "",
  branchName: v.branchName || "",
});

// ── Page ──────────────────────────────────────────────────────────────────
function Page(): React.ReactElement {
  const [reportState, setReportState] =
    useState<MemberBasicDetailsResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<MemberBasicDetailsRequest | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberBasicDetailsFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── Wire MemberLookupButton selection → correct form fields ────────────
  const handleMemberSelect = useCallback(
    (member: MemberRecord) => {
      setValue("memberRegistrationId", member.memMemberRegistrationId, {
        shouldValidate: true,
      });
      setValue("memberName", member.memberName || "");
    },
    [setValue],
  );

  const callApi = useCallback(
    (request: MemberBasicDetailsRequest, format: string) =>
      memberService.api.memberBasicDetailsCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MemberBasicDetailsRequest): Promise<void> => {
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
          "MemberBasicDetails",
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

  const onSubmit: SubmitHandler<MemberBasicDetailsFormValues> = useCallback(
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
    <MemberBasicDetailsForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onMemberSelect={handleMemberSelect}
    />
  );
}

export default Page;
