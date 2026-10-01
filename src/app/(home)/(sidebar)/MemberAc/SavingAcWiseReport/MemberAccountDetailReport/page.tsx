"use client";

import MemberAccountDetailForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/SavingAccountWiseReports/MemberAccountDetailForm";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { MemberAccountColumnOptions } from "@/utilis/Constants/MemberAccountColumnOptions";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { MemberAccountDetailRequest } from "types/api/api";
import * as yup from "yup";

// ── Helpers ───────────────────────────────────────────────────────────────────

const ALL_COLUMN_KEYS = MemberAccountColumnOptions.map((c) => c.key);

export interface MemberAccountDetailFormValues extends Omit<
  MemberAccountDetailRequest,
  "branchIds" | "status" | "memberRegistrationId"
> {
  branchId?: number[];
  status?: "-1" | "1" | "0";
}

export interface MemberAccountDetailResponseExtended {
  htmlContent?: string;
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
}

// ── Normalize BS date string to "yyyy/MM/dd" regardless of picker's separator ──

function normalizeBsDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value.replace(/-/g, "/");
}

// ── Validation schema ─────────────────────────────────────────────────────────

const schema: yup.ObjectSchema<MemberAccountDetailFormValues> = yup
  .object({
    tillDate: yup
      .string()
      .required("Till Date is required")
      .nullable()
      .optional()
      .typeError("Till Date must be a valid date")
      .default(""),
    branchId: yup.array().of(yup.number().required()).optional().default([2]),
    branchName: yup.string().nullable().optional().default("All"),
    depositTypeId: yup.string().nullable().optional().default("-1"),
    memberId: yup.string().nullable().optional().default(null),
    memberName: yup.string().nullable().optional().default(""),
    status: yup
      .mixed<"-1" | "1" | "0">()
      .oneOf(["-1", "1", "0"])
      .optional()
      .default("-1"),
    collectorId: yup.string().nullable().optional().default("-1"),
    collectionCenterId: yup.string().nullable().optional().default("-1"),
    memberGroupId: yup.string().nullable().optional().default("-1"),
    enableCollectionCenterGroup: yup.boolean().optional().default(false),
    enableMemberGroupGroup: yup.boolean().optional().default(false),
    sameCompanyName: yup.boolean().optional().default(true),
    orderBy: yup.string().nullable().optional().default(""),
    selectedColumns: yup
      .array()
      .of(yup.string().required())
      .optional()
      .default(() => [...ALL_COLUMN_KEYS]),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

// ── Initial report state ──────────────────────────────────────────────────────

const INITIAL_STATE: MemberAccountDetailResponseExtended = {
  isLoading: false,
  htmlContent: undefined,
  totalPages: 1,
  currentPage: 1,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MemberAccountDetailPage() {
  const [reportState, setReportState] =
    useState<MemberAccountDetailResponseExtended>(INITIAL_STATE);
  const [lastRequest, setLastRequest] =
    useState<MemberAccountDetailRequest | null>(null);
  const [renderKey, setRenderKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberAccountDetailFormValues>({
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

  // ── Map form values -> API request ────────────────────────────────────────────
  const toRequest = useCallback(
    (form: MemberAccountDetailFormValues): MemberAccountDetailRequest => {
      const selectedIds = (form.branchId ?? [])
        .map(Number)
        .filter((id) => id > 0);
      const allIds = branchOptions
        .map((o) => Number(o.id))
        .filter((id) => id > 0);
      const isAll =
        selectedIds.length === 0 || selectedIds.length === allIds.length;
      const resolvedIds = isAll ? allIds : selectedIds;

      const branchName =
        branchOptions
          .filter((o) => resolvedIds.includes(Number(o.id)))
          .map((o) => o.name)
          .join(", ") || "All";

      return {
        tillDate: normalizeBsDate(form.tillDate),
        branchIds: resolvedIds.join(","),
        branchName,
        depositTypeId: form.depositTypeId || undefined,
        memberId: form.memberId || undefined,
        memberName: form.memberName || undefined,
        status: Number(form.status ?? "-1"),
        collectorId: form.collectorId || undefined,
        collectionCenterId: form.collectionCenterId || undefined,
        memberGroupId: form.memberGroupId || undefined,
        enableCollectionCenterGroup: form.enableCollectionCenterGroup ?? false,
        enableMemberGroupGroup: form.enableMemberGroupGroup ?? false,
        sameCompanyName: form.sameCompanyName ?? true,
        orderBy: form.orderBy || "",
        selectedColumns: form.selectedColumns ?? [...ALL_COLUMN_KEYS],
        visualReport: form.visualReport ?? false,
      };
    },
    [branchOptions],
  );

  // ── API call ──────────────────────────────────────────────────────────────────
  const callApi = useCallback(
    (request: MemberAccountDetailRequest, format: string) =>
      memberAccountService.api.memberAccountDetailCreate(request, {
        format,
      }),
    [],
  );

  const getHtmlString = useCallback(async (response: any): Promise<string> => {
    if (response.data instanceof Blob) return (response.data as Blob).text();
    if (typeof response.data === "string") return response.data;
    return JSON.stringify(response.data);
  }, []);

  // ── Fetch VIEW report (raw HTML — same as MemberAllDetails) ───────────────────
  const fetchReport = useCallback(
    async (request: MemberAccountDetailRequest): Promise<void> => {
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

  // ── Download (PDF / EXCEL etc. still fetched as a blob) ────────────────────────
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
          "MemberAccountDetailReport",
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

  // ── Page navigation (delegates to the iframe's own scrollToPage()) ────────────
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
  const onSubmit: SubmitHandler<MemberAccountDetailFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <MemberAccountDetailForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      iframeRef={iframeRef}
      renderKey={renderKey}
    />
  );
}
