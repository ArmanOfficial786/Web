// "use client";

// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import { useState, useCallback } from "react";
// import * as yup from "yup";
// import type { MemberDetailRequest, Pagination } from "types/api/api";
// import MemberRegistrationReport from "@/components/reports/memberReport/MemberDetailReport";
// import memberRegistrationService from "@/services/member/MemberDetailService";
// import {
//   DefaultPagination,
//   type ReportFormat,
// } from "@/utilis/Constants/reportConstants";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";

// // ── UI-only fields ────────────────────────────────────────────────────────
// export interface MemberRegistrationFormValues extends MemberDetailRequest {
//   memberName?: string;
// }

// // ── Client state ──────────────────────────────────────────────────────────
// export interface MemberRegistrationResponseExtended {
//   htmlContent?: string; // raw HTML from VIEW (on-screen)
//   isLoading: boolean;
// }

// // ── Validation ────────────────────────────────────────────────────────────
// const schema: yup.ObjectSchema<MemberRegistrationFormValues> = yup.object({
//   memberId: yup.string().nullable().optional().default(null),
//   memberName: yup.string().optional().default(""),
//   fromDate: yup.string().required("From Date is required").default(""),
//   toDate: yup
//     .string()
//     .required("To Date is required")
//     .default(null)
//     .test("bs-min", "Till Date cannot be before From Date", function (val) {
//       const { fromDate } = this.parent;
//       return !fromDate || !val || val >= fromDate;
//     }),
//   orderby: yup.string().nullable().optional().default("0"),
//   branchId: yup.number().required("Branch ID is required").default(2),
//   memberGroupId: yup.number().optional().default(0),
//   visualReport: yup.boolean().optional().default(false),
// });

// // ── Strip UI-only fields ─────────────────────────────────────────────────
// const toRequest = (v: MemberRegistrationFormValues): MemberDetailRequest => ({
//   memberId: v.memberId || null,
//   fromDate: v.fromDate || null,
//   toDate: v.toDate || null,
//   branchId: Number(v.branchId) || 0,
//   memberGroupId: Number(v.memberGroupId) || 0,
//   orderby: v.orderby,
//   visualReport: v.visualReport || false,
// });

// // ── Page ─────────────────────────────────────────────────────────────────
// function Page(): React.ReactElement {
//   const [reportState, setReportState] =
//     useState<MemberRegistrationResponseExtended>({ isLoading: false });

//   const [lastRequest, setLastRequest] = useState<MemberDetailRequest | null>(
//     null,
//   );

//   const { control, handleSubmit, setValue, reset } =
//     useForm<MemberRegistrationFormValues>({
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     });

//   // ── Raw API call ────────────────────────────────────────────────────────
//   const callApi = useCallback(
//     (request: MemberDetailRequest, format: string) =>
//       memberRegistrationService.api.memberRegistrationCreate(request, {
//         format,
//       }),
//     [],
//   );

//   // ── Helper: extract HTML string from response (handles Blob!) ──────────
//   const getHtmlString = async (response: any): Promise<string> => {
//     // If already a plain string, return it
//     // if (typeof response.data === "string") {
//     //   return response.data;
//     // }
//     // If it's a Blob (common when content-type mismatch), read as text
//     if (response.data instanceof Blob) {
//       return await (response.data as Blob).text();
//     }
//     // // If it's an ArrayBuffer (less common), decode
//     // if (response.data instanceof ArrayBuffer) {
//     //   const decoder = new TextDecoder("utf-8");
//     //   return decoder.decode(response.data);
//     // }
//     // // Fallback: if it's an object (e.g., unexpected JSON), stringify
//     return JSON.stringify(response.data);
//   };

//   // ── Fetch VIEW (HTML) for on-screen display ────────────────────────────
//   const fetchReport = useCallback(
//     async (request: MemberDetailRequest): Promise<void> => {
//       setReportState({ isLoading: true });

//       try {
//         const response = await callApi(request, "VIEW");
//         const htmlContent = await getHtmlString(response);

//         setLastRequest(request);
//         setReportState({ isLoading: false, htmlContent });

//         // Clear member lookup fields
//         reset({ memberId: "", memberName: "" });
//       } catch {
//         setReportState({ isLoading: false });
//         toast.error("Failed to load report.");
//       }
//     },
//     [callApi, reset],
//   );

//   // ── Download (PDF / Word / Excel / Image) ───────────────────────────────
//   const handleDownload = useCallback(
//     async (format: ReportFormat): Promise<void> => {
//       if (!lastRequest) {
//         toast.warning("Please view the report before exporting.");
//         return;
//       }
//       try {
//         const res = await callApi(lastRequest, format);
//         const blob = responseToBlob(res.data, format);
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = extractFilenameFromResponse(
//           res,
//           format,
//           "MemberRegistrationReport",
//         );
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//       } catch {
//         toast.error("Failed to download file.");
//       }
//     },
//     [callApi, lastRequest],
//   );

//   // ── Form submit ─────────────────────────────────────────────────────────
//   const onSubmit: SubmitHandler<MemberRegistrationFormValues> = useCallback(
//     (formData) => fetchReport(toRequest(formData)),
//     [fetchReport],
//   );

//   // ── Page navigation (not used for HTML, kept for interface) ────────────
//   const handlePageChange = useCallback((newPage: number) => {
//     // No-op for HTML view
//   }, []);

//   return (
//     <MemberRegistrationReport
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       setValue={setValue}
//       reportState={reportState}
//       onPageChange={handlePageChange}
//       onDownload={handleDownload}
//     />
//   );
// }

// export default Page;

"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect, useRef } from "react";
import * as yup from "yup";
import type { MemberDetailRequest } from "types/api/api";
import MemberRegistrationReport from "@/components/reports/memberReport/MemberRegistrationReport";
import memberRegistrationService from "@/services/member/MemberDetailService";
import { type ReportFormat } from "@/utilis/Constants/reportConstants";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";

// ── Types ─────────────────────────────────────────────────────────────────
export interface MemberRegistrationFormValues extends MemberDetailRequest {
  memberName?: string;
}

export interface MemberRegistrationResponseExtended {
  htmlContent?: string;
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
}

// ── Validation schema ─────────────────────────────────────────────────────
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

// ── Initial state ─────────────────────────────────────────────────────────
const INITIAL_STATE: MemberRegistrationResponseExtended = {
  isLoading: false,
  htmlContent: undefined,
  totalPages: 1,
  currentPage: 1,
};

// ── Page component ────────────────────────────────────────────────────────
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

  // ── postMessage listener ──────────────────────────────────────────────
  // Receives totalPages from the iframe's buildPages() after pagination
  // is complete. Fires once per report load.
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

  // ── API call ──────────────────────────────────────────────────────────
  const callApi = useCallback(
    (request: MemberDetailRequest, format: string) =>
      memberRegistrationService.api.memberRegistrationCreate(request, {
        format,
      }),
    [],
  );

  const getHtmlString = useCallback(async (response: any): Promise<string> => {
    if (response.data instanceof Blob) return (response.data as Blob).text();
    if (typeof response.data === "string") return response.data;
    return JSON.stringify(response.data);
  }, []);

  // ── Fetch VIEW report ─────────────────────────────────────────────────
  const fetchReport = useCallback(
    async (request: MemberDetailRequest): Promise<void> => {
      // Clear previous state and show loader
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

        // Set content first, then bump renderKey so the iframe mounts
        // with srcDoc already populated — avoids empty-then-updated flash.
        setReportState({
          isLoading: false,
          htmlContent,
          totalPages: 1, // will be updated by postMessage after buildPages()
          currentPage: 1,
        });
        setRenderKey((k) => k + 1);

        reset({ memberId: "", memberName: "" });
      } catch (err) {
        console.error("fetchReport error:", err);
        setReportState(INITIAL_STATE);
        toast.error("Failed to load report.");
      }
    },
    [callApi, getHtmlString, reset],
  );

  // ── Download ──────────────────────────────────────────────────────────
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

  // ── Page navigation ───────────────────────────────────────────────────
  // Calls scrollToPage() that buildPages() exposed on the iframe's window.
  // window.scrollTo() inside the iframe moves the iframe's own scroll
  // position, which is what the user sees through the fixed-height container.
  const handlePageChange = useCallback((newPage: number) => {
    setReportState((prev) => {
      const clamped = Math.max(1, Math.min(newPage, prev.totalPages));
      if (clamped === prev.currentPage) return prev; // no-op, skip re-render

      try {
        // contentWindow is accessible because sandbox has allow-same-origin
        const iframeWin = iframeRef.current?.contentWindow as
          | (Window & { scrollToPage?: (n: number) => void })
          | null;

        if (iframeWin?.scrollToPage) {
          iframeWin.scrollToPage(clamped);
        }
      } catch {
        // should never throw with allow-same-origin, but guard anyway
      }

      return { ...prev, currentPage: clamped };
    });
  }, []);

  // ── Form submit ────────────────────────────────────────────────────────
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
