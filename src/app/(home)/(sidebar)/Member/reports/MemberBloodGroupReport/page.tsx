"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect } from "react";
import * as yup from "yup";
import type { MemberBloodGroupReportRequest, Pagination } from "types/api/api";
import MemberBloodGroupReportForm from "@/components/reports/memberReport/MemberBloodGroupReportForm";
import {
  DefaultPagination,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberService from "@/services/member/memberService";

// ── UI-only fields – stripped before sending to API ────────────────────────
export interface MemberBloodGroupReportFormValues extends MemberBloodGroupReportRequest {}

// ── Client-only state ──────────────────────────────────────────────────────
export interface MemberBloodGroupReportResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

// ── Validation schema ──────────────────────────────────────────────────────
const schema: yup.ObjectSchema<MemberBloodGroupReportFormValues> = yup.object({
  fromDate: yup.string().required("From Date is required").default(""),
  toDate: yup
    .string()
    .required("To Date is required")
    .test("bs-min", "To Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    })
    .default(""),
  branchId: yup
    .number()
    .required("Branch is required")
    .min(1, "Branch is required")
    .default(0),
  memberGroupId: yup.number().optional().default(0),
  bloodGroupOption: yup.number().optional().default(0), // 0 = All
  orderBy: yup.string().nullable().optional().default(""),
  visualReport: yup.boolean().optional().default(false),
  sameCompanyName: yup.boolean().optional().default(false),
  branchSelected: yup.string().nullable().optional().default(""),
  branchName: yup.string().nullable().optional().default(""),
});

// ── Strip UI-only fields before API call ──────────────────────────────────
const toRequest = (
  v: MemberBloodGroupReportFormValues,
): MemberBloodGroupReportRequest => ({
  fromDate: v.fromDate || "",
  toDate: v.toDate || "",
  branchId: Number(v.branchId) || 0,
  memberGroupId: Number(v.memberGroupId) || 0,
  bloodGroupOption: Number(v.bloodGroupOption) || 0,
  orderBy: v.orderBy || "",
  visualReport: v.visualReport || false,
  sameCompanyName: v.sameCompanyName || false,
  branchSelected: v.branchSelected || "",
  branchName: v.branchName || "",
});

// ── Page ──────────────────────────────────────────────────────────────────
function Page(): React.ReactElement {
  const [reportState, setReportState] =
    useState<MemberBloodGroupReportResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<MemberBloodGroupReportRequest | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<MemberBloodGroupReportFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: MemberBloodGroupReportRequest, format: string) =>
      memberService.api.memberBloodGroupReportCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MemberBloodGroupReportRequest): Promise<void> => {
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
          "MemberBloodGroupReport",
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

  const onSubmit: SubmitHandler<MemberBloodGroupReportFormValues> = useCallback(
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
    <MemberBloodGroupReportForm
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
