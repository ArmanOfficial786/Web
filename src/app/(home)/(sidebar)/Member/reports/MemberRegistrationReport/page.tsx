"use client";

import MemberRegistrationReport from "@/components/reports/memberReport/MemberRegistrationReport";
import memberService from "@/services/member/memberService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { type ReportFormat } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { MemberDetailRequest } from "types/api/api";
import * as yup from "yup";

export interface MemberRegistrationFormValues extends MemberDetailRequest {
  memberName?: string;
}

export interface MemberRegistrationResponseExtended {
  htmlContent?: string;
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
}

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
  orderby: yup.string().nullable().optional().default(""),
  branchId: yup.number().required("Branch ID is required").default(2),
  memberGroupId: yup.number().optional().default(0),
  visualReport: yup.boolean().optional().default(false),
});

const toRequest = (v: MemberRegistrationFormValues): MemberDetailRequest => ({
  memberId: v.memberId || null,
  fromDate: v.fromDate || null,
  toDate: v.toDate || null,
  branchId: Number(v.branchId) || 0,
  memberGroupId: Number(v.memberGroupId) || 0,
  orderby: v.orderby || "",
  visualReport: v.visualReport || false,
});

const INITIAL_STATE: MemberRegistrationResponseExtended = {
  isLoading: false,
  htmlContent: undefined,
  totalPages: 1,
  currentPage: 1,
};

function Page(): React.ReactElement {
  const [reportState, setReportState] =
    useState<MemberRegistrationResponseExtended>(INITIAL_STATE);

  const [lastRequest, setLastRequest] = useState<MemberDetailRequest | null>(
    null,
  );
  const [renderKey, setRenderKey] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberRegistrationFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

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

  const callApi = useCallback(
    (request: MemberDetailRequest, format: string) =>
      memberService.api.memberRegistrationCreate(request, {
        format,
      }),
    [],
  );

  const getHtmlString = useCallback(async (response: any): Promise<string> => {
    if (response.data instanceof Blob) return (response.data as Blob).text();
    if (typeof response.data === "string") return response.data;
    return JSON.stringify(response.data);
  }, []);

  const fetchReport = useCallback(
    async (request: MemberDetailRequest): Promise<void> => {
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

        reset({ memberId: "", memberName: "" });
      } catch (err) {
        setReportState(INITIAL_STATE);
      }
    },
    [callApi, getHtmlString, reset],
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
          "MemberRegistrationReport",
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

  const handlePageChange = useCallback((newPage: number) => {
    setReportState((prev) => {
      const clamped = Math.max(1, Math.min(newPage, prev.totalPages));
      if (clamped === prev.currentPage) return prev;

      try {
        const iframeWin = iframeRef.current?.contentWindow as
          | (Window & { scrollToPage?: (n: number) => void })
          | null;

        if (iframeWin?.scrollToPage) {
          iframeWin.scrollToPage(clamped);
        }
      } catch {}

      return { ...prev, currentPage: clamped };
    });
  }, []);

  const onSubmit: SubmitHandler<MemberRegistrationFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
  );

  return (
    <MemberRegistrationReport
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
