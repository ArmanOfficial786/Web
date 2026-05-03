"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useCallback } from "react";
import * as yup from "yup";
import type { MemberIdCardRequest } from "../../../../../../types/api/api";
import MemberIdCard from "@/components/reports/memberReport/MemberIdCard";
import memberIdCardService from "@/services/MemberIdCardService";
import {
  InitialReportState,
  PaginationHeader,
  DefaultPagination,
  type ReportState,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";

// ── Extended form type — collectionCenterId is UI-only, not in API request ────
export interface MemberIdCardFormValues extends MemberIdCardRequest {
  collectionCenterId?: number;
  memberName?: string;
}

// ── Validation schema ─────────────────────────────────────────────────────────

const schema: yup.ObjectSchema<MemberIdCardFormValues> = yup.object({
  memberId: yup.string().nullable().optional().default(null),
  memberName: yup.string().optional().default(""), // ✅ UI-only
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
// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert FormInputs → API request shape */
const toRequest = (
  // ← return type narrowed
  v: MemberIdCardFormValues,
  page = 1,
  size = 10,
): MemberIdCardFormValues => ({
  memberId: v.memberId || null,
  fromDate: v.fromDate || null,
  toDate: v.toDate || null,
  branchId: Number(v.branchId) || 0,
  collectionCenterId: Number(v.collectionCenterId) || 0,
  memberGroupId: Number(v.memberGroupId) || 0,
  orderby: v.orderby,
  currentPage: page,
  pageSize: size,
});

// ── Page ──────────────────────────────────────────────────────────────────────

function Page(): React.ReactElement {
  const [reportState, setReportState] =
    useState<ReportState>(InitialReportState);
  const [lastRequest, setLastRequest] = useState<MemberIdCardRequest | null>(
    null,
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberIdCardFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── Single API call shared by VIEW + EXPORT ───────────────────────────────

  const callApi = useCallback(
    (request: MemberIdCardRequest, format: string) =>
      memberIdCardService.api.memberIdCardMemberIdCardCreate(request, {
        format,
      }),
    [],
  );

  // ── VIEW (also used for page-change) ─────────────────────────────────────

  const fetchReport = useCallback(
    async (request: MemberIdCardRequest): Promise<void> => {
      setReportState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const res = await callApi(request, "VIEW");

        const rawHeader =
          (res.headers as Record<string, string>)?.[PaginationHeader] ?? "";
        const pagination = (() => {
          try {
            return rawHeader ? JSON.parse(rawHeader) : DefaultPagination;
          } catch {
            return DefaultPagination;
          }
        })();

        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);

        setReportState((prev) => ({
          ...prev,
          reportLoaded: true,
          pdfData,
          currentPage: pagination?.currentPage ?? request.currentPage ?? 1,
          totalPages: pagination?.totalPages ?? 1,
          totalRecord: pagination?.totalRecord ?? 0,
          pageSize: pagination?.pageSize ?? request.pageSize ?? 10,
        }));
        toast.success("Report generated successfully");
        reset({
          memberId: "",
          memberName: "",
        });
      } catch {
        // Error toast handled by the interceptor
      } finally {
        setReportState((prev) => ({ ...prev, loading: false }));
      }
    },
    [callApi, reset],
  );

  // ── EXPORT ────────────────────────────────────────────────────────────────

  const handleDownload = useCallback(
    async (format: string): Promise<void> => {
      if (!lastRequest) {
        toast.warning("Please view the report before exporting.");
        return;
      }
      setIsDownloading(true);
      try {
        const upperFormat = format.toUpperCase() as ReportFormat; // ← cast once
        const res = await callApi(lastRequest, upperFormat);
        const blob = responseToBlob(res.data, upperFormat); // ← typed
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        // ↓ all 3 required args: response, format, fallbackName
        link.download = extractFilenameFromResponse(
          res,
          upperFormat,
          "MemberIdCard",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`${link.download} downloaded`);
      } catch {
        toast.error("Failed to download file.");
      } finally {
        setIsDownloading(false);
      }
    },
    [callApi, lastRequest],
  );

  // ── Form submit — resets to page 1 ───────────────────────────────────────

  const onSubmit: SubmitHandler<MemberIdCardRequest> = useCallback(
    (formData) => {
      const request = toRequest(formData, 1, reportState.pageSize ?? 10);
      fetchReport(request); // ← now MemberIdCardRequest, not unknown
    },
    [fetchReport, reportState.pageSize],
  );

  // ── Pagination ────────────────────────────────────────────────────────────

  const handlePageChange = useCallback(
    (newPage: number): void => {
      if (!lastRequest) return;
      const { currentPage, totalPages } = reportState;
      if (newPage < 1 || newPage > totalPages || newPage === currentPage)
        return;

      fetchReport({
        ...lastRequest,
        currentPage: newPage,
      });
    },
    [fetchReport, lastRequest, reportState],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <MemberIdCard
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      isDownloading={isDownloading}
    />
  );
}

export default Page;
