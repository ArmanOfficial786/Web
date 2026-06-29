"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect, useRef } from "react";
import * as yup from "yup";
import MemberAllDetailsReport from "@/components/reports/memberReport/MemberAllDetails";
import type { MemberAllDetailRequst } from "types/api/api";
import { type ReportFormat } from "@/utilis/Constants/reportConstants";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { COLUMN_OPTIONS } from "@/utilis/Constants/MemberColumnOptions";
import memberAllDetailsService from "@/services/member/MemberAllDetailsService";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MemberAllDetailsFormValues extends MemberAllDetailRequst {
  memberId?: string | null;
  memberName?: string;
}

export interface MemberRegistrationResponseExtended {
  htmlContent?: string;
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ALL_COLUMN_KEYS = COLUMN_OPTIONS.map((c) => c.key);

// ── Validation schema ─────────────────────────────────────────────────────────

const schema: yup.ObjectSchema<MemberAllDetailsFormValues> = yup.object({
  memberId: yup.string().nullable().optional().default(null),
  memberName: yup.string().optional().default(""),
  fromDate: yup.string().required("From Date is required").default(""),
  toDate: yup
    .string()
    .required("To Date is required")
    .default("")
    .test("bs-min", "Till Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    }),
  orderby: yup.string().nullable().optional().default(""), // ← lowercase b
  branchId: yup.number().required("Branch ID is required").default(2),
  memberGroupId: yup.number().optional().default(0),
  visualReport: yup.boolean().optional().default(false),
  selectedColumns: yup
    .array()
    .of(yup.string().required())
    .required()
    .min(1, "Please select at least one column")
    .default(() => ALL_COLUMN_KEYS),
});

// ── Request mapper ────────────────────────────────────────────────────────────

const toRequest = (v: MemberAllDetailsFormValues): MemberAllDetailRequst => ({
  memberId: v.memberId || null,
  fromDate: v.fromDate || null,
  toDate: v.toDate || null,
  branchId: Number(v.branchId) || 0,
  memberGroupId: Number(v.memberGroupId) || 0,
  orderby: v.orderby || "",
  visualReport: v.visualReport ?? false,
  selectedColumns: v.selectedColumns,
});

// ── Initial report state ──────────────────────────────────────────────────────

const INITIAL_STATE: MemberRegistrationResponseExtended = {
  isLoading: false,
  htmlContent: undefined,
  totalPages: 1,
  currentPage: 1,
};

// ── Page ──────────────────────────────────────────────────────────────────────

function Page(): React.ReactElement {
  const [reportState, setReportState] =
    useState<MemberRegistrationResponseExtended>(INITIAL_STATE);
  const [lastRequest, setLastRequest] = useState<MemberAllDetailRequst | null>(
    null,
  );
  const [renderKey, setRenderKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberAllDetailsFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── postMessage: receive totalPages from iframe after buildPages() ───────────
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        event.data?.type === "REPORT_PAGES_READY" &&
        typeof event.data.totalPages === "number" &&
        event.data.totalPages > 0
      ) {
        setReportState((prev) => ({
          ...prev,
          totalPages: event.data.totalPages,
          currentPage: 1,
        }));
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // ── API call ──────────────────────────────────────────────────────────────────
  const callApi = useCallback(
    (request: MemberAllDetailRequst, format: string) =>
      memberAllDetailsService.api.memberAllDetailsCreate(request, { format }),
    [],
  );

  const getHtmlString = useCallback(async (response: any): Promise<string> => {
    if (response.data instanceof Blob) return (response.data as Blob).text();
    if (typeof response.data === "string") return response.data;
    return JSON.stringify(response.data);
  }, []);

  // ── Fetch VIEW report ─────────────────────────────────────────────────────────
  const fetchReport = useCallback(
    async (request: MemberAllDetailRequst): Promise<void> => {
      setReportState({
        isLoading: true,
        htmlContent: undefined,
        totalPages: 1,
        currentPage: 1,
      });
      try {
        const response = await callApi(request, "VIEW");
        const htmlContent = await getHtmlString(response);
        setLastRequest(request);
        setReportState({
          isLoading: false,
          htmlContent,
          totalPages: 1,
          currentPage: 1,
        });
        setRenderKey((k) => k + 1);
        reset((prev) => ({ ...prev, memberId: null, memberName: "" }), {
          keepValues: true,
        });
      } catch (err) {
        console.error("fetchReport error:", err);
        setReportState(INITIAL_STATE);
        toast.error("Failed to load report.");
      }
    },
    [callApi, getHtmlString, reset],
  );

  // ── Download ──────────────────────────────────────────────────────────────────
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
          "MemberAllDetailsReport",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("handleDownload error:", err);
        toast.error("Failed to download file.");
      }
    },
    [callApi, lastRequest],
  );

  // ── Page navigation ───────────────────────────────────────────────────────────
  const handlePageChange = useCallback((newPage: number) => {
    setReportState((prev) => {
      const clamped = Math.max(1, Math.min(newPage, prev.totalPages));
      if (clamped === prev.currentPage) return prev;
      try {
        const iframeWin = iframeRef.current?.contentWindow as
          | (Window & { scrollToPage?: (n: number) => void })
          | null;
        if (iframeWin?.scrollToPage) iframeWin.scrollToPage(clamped);
      } catch {
        // defensive catch
      }
      return { ...prev, currentPage: clamped };
    });
  }, []);

  // ── Form submit ───────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<MemberAllDetailsFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
  );

  return (
    <MemberAllDetailsReport
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      iframeRef={iframeRef}
      renderKey={renderKey}
    />
  );
}

export default Page;
