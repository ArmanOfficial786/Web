// "use client";

export default function LoanAllDetailsReportPage() {
  return null;
}

// import LoanDetailReport from "@/components/reports/loanReport/LoanAnalysisReport/LoanDetailReport";
// import loanService from "@/services/Loan/loanService";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
// import { LOAN_COLUMN_OPTIONS } from "@/utilis/Constants/LoanColumnOptions";
// import { type ReportFormat } from "@/utilis/Constants/reportConstants";
// import { yupResolver } from "@hookform/resolvers/yup";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { toast } from "react-toastify";
// import type { LoanDetailsRequestDto } from "types/api/api";
// import * as yup from "yup";

// // ── Types ─────────────────────────────────────────────────────────────────────

// // LoanDetailsRequestDto has no memberId / memberGroupId / selectedColumns / status —
// // extended here as UI-only so the request still compiles against the DTO.
// export interface LoanDetailFormValues extends LoanDetailsRequestDto {
//   memberId?: string | null;
//   memberName?: string;
//   memberGroupId?: string;
//   selectedColumns?: string[];
// }

// export interface LoanDetailResponseExtended {
//   htmlContent?: string;
//   isLoading: boolean;
//   totalPages: number;
//   currentPage: number;
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────

// const ALL_COLUMN_KEYS = LOAN_COLUMN_OPTIONS.map((c) => c.key);

// export const STATUS_OPTIONS = [
//   { value: "All", label: "-- All --" },
//   { value: "Active", label: "Active" },
//   { value: "Closed", label: "Closed" },
//   { value: "Overdue", label: "Overdue" },
// ];

// // ── Schema ────────────────────────────────────────────────────────────────────

// const schema: yup.ObjectSchema<LoanDetailFormValues> = yup
//   .object({
//     loanTypeId: yup.string().optional().default(""),
//     orderBy: yup.string().optional().default(""),
//     collectorId: yup.string().optional().default(""),
//     tillDateBs: yup.string().optional().default(""),
//     fromDateBs: yup.string().optional().default(""),
//     toDateBs: yup.string().optional().default(""),
//     status: yup.string().optional().default("All"),
//     branchIds: yup.array().of(yup.string().required()).optional().default([]),
//     collectionCenterId: yup.string().optional().default("0"),
//     enableCollectionCenter: yup.boolean().optional().default(false),
//     memberGroupId: yup.string().optional().default("-1"),
//     groupByMemberGroup: yup.boolean().optional().default(false),
//     memberId: yup.string().nullable().optional().default(null),
//     memberName: yup.string().optional().default(""),
//     visualReport: yup.boolean().optional().default(false),
//     selectedColumns: yup
//       .array()
//       .of(yup.string().required())
//       .required()
//       .min(1, "Please select at least one column")
//       .default(() => ALL_COLUMN_KEYS),
//   })
//   .required();

// // ── Request mapper ────────────────────────────────────────────────────────────

// const toRequest = (v: LoanDetailFormValues): LoanDetailsRequestDto => {
//   const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
//   return {
//     toDateBs: v.toDateBs || undefined,
//     branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
//     loanTypeId: v.loanTypeId || undefined,
//     status: v.status || "All",
//     collectionCenterId: v.collectionCenterId || "0",
//     enableCollectionCenter: v.enableCollectionCenter ?? false,
//     collectorId: v.collectorId || undefined,
//     orderBy: v.orderBy || "",
//     visualReport: v.visualReport ?? false,
//     // memberId / memberGroupId / groupByMemberGroup / selectedColumns
//     // are UI-only here — add them to the DTO if backend needs them.
//   };
// };

// // ── Initial state ─────────────────────────────────────────────────────────────

// const INITIAL_STATE: LoanDetailResponseExtended = {
//   isLoading: false,
//   htmlContent: undefined,
//   totalPages: 1,
//   currentPage: 1,
// };

// // ── Page ──────────────────────────────────────────────────────────────────────

// function Page(): React.ReactElement {
//   const [reportState, setReportState] =
//     useState<LoanDetailResponseExtended>(INITIAL_STATE);
//   const [lastRequest, setLastRequest] = useState<LoanDetailsRequestDto | null>(
//     null,
//   );
//   const [renderKey, setRenderKey] = useState(0);
//   const iframeRef = useRef<HTMLIFrameElement | null>(null);

//   const { control, handleSubmit, setValue, reset } =
//     useForm<LoanDetailFormValues>({
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     });

//   // ── postMessage: receive totalPages from iframe after buildPages() ─────────
//   useEffect(() => {
//     const handler = (event: MessageEvent) => {
//       if (
//         event.data?.type === "REPORT_PAGES_READY" &&
//         typeof event.data.totalPages === "number" &&
//         event.data.totalPages > 0
//       ) {
//         setReportState((prev) => ({
//           ...prev,
//           totalPages: event.data.totalPages,
//           currentPage: 1,
//         }));
//       }
//     };
//     window.addEventListener("message", handler);
//     return () => window.removeEventListener("message", handler);
//   }, []);

//   // ── API call ──────────────────────────────────────────────────────────────
//   const callApi = useCallback(
//     (request: LoanDetailsRequestDto, format: string) =>
//       loanService.api.loanDetailsCreate(request, { format }),
//     [],
//   );

//   const getHtmlString = useCallback(async (response: any): Promise<string> => {
//     if (response.data instanceof Blob) return (response.data as Blob).text();
//     if (typeof response.data === "string") return response.data;
//     return JSON.stringify(response.data);
//   }, []);

//   // ── Fetch VIEW report ─────────────────────────────────────────────────────
//   const fetchReport = useCallback(
//     async (request: LoanDetailsRequestDto): Promise<void> => {
//       setReportState({
//         isLoading: true,
//         htmlContent: undefined,
//         totalPages: 1,
//         currentPage: 1,
//       });
//       try {
//         const response = await callApi(request, "VIEW");
//         const htmlContent = await getHtmlString(response);
//         setLastRequest(request);
//         setReportState({
//           isLoading: false,
//           htmlContent,
//           totalPages: 1,
//           currentPage: 1,
//         });
//         setRenderKey((k) => k + 1);
//         reset((prev) => ({ ...prev, memberId: null, memberName: "" }), {
//           keepValues: true,
//         });
//       } catch (err) {
//         console.error("fetchReport error:", err);
//         setReportState(INITIAL_STATE);
//         toast.error("Failed to load report.");
//       }
//     },
//     [callApi, getHtmlString, reset],
//   );

//   // ── Download ──────────────────────────────────────────────────────────────
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
//           "LoanDetailReport",
//         );
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//       } catch (err) {
//         console.error("handleDownload error:", err);
//         toast.error("Failed to download file.");
//       }
//     },
//     [callApi, lastRequest],
//   );

//   // ── Page navigation ───────────────────────────────────────────────────────
//   const handlePageChange = useCallback((newPage: number) => {
//     setReportState((prev) => {
//       const clamped = Math.max(1, Math.min(newPage, prev.totalPages));
//       if (clamped === prev.currentPage) return prev;
//       try {
//         const iframeWin = iframeRef.current?.contentWindow as
//           | (Window & { scrollToPage?: (n: number) => void })
//           | null;
//         if (iframeWin?.scrollToPage) iframeWin.scrollToPage(clamped);
//       } catch {
//         // defensive catch
//       }
//       return { ...prev, currentPage: clamped };
//     });
//   }, []);

//   // ── Form submit ───────────────────────────────────────────────────────────
//   const onSubmit: SubmitHandler<LoanDetailFormValues> = useCallback(
//     (formData) => fetchReport(toRequest(formData)),
//     [fetchReport],
//   );

//   return (
//     <LoanDetailReport
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       setValue={setValue}
//       reportState={reportState}
//       onPageChange={handlePageChange}
//       onDownload={handleDownload}
//       iframeRef={iframeRef}
//       renderKey={renderKey}
//     />
//   );
// }

// export default Page;
