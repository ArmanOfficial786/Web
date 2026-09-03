// "use client";

// import SavingAcWiseBalance from "@/components/reports/memberAccount/SavingAcWiseBalance";
// import savingAcWiseBalanceService from "@/services/memberAccount/SavingAcWiseBalanceService";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
// import {
//   DefaultPagination,
//   type ReportFormat,
// } from "@/utilis/Constants/reportConstants";
// import { yupResolver } from "@hookform/resolvers/yup";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { type SubmitHandler, useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import {
//   ReportResponseDtos,
//   type Pagination,
//   type SavingAcWiseBalanceRequest,
// } from "types/api/api";
// import * as yup from "yup";

// // ── Client-only state ──────────────────────────────────────────────────────
// // Does NOT extend ReportResponseDtos — backend returns binary PDF, not base64 JSON
// export interface SavingAcWiseBalanceResponseExtended extends ReportResponseDtos {
//   isLoading: boolean;
// }

// // ── Validation schema ──────────────────────────────────────────────────────
// const schema: yup.ObjectSchema<SavingAcWiseBalanceRequest> = yup.object({
//   // ✅ Fix 2: required fields — no .optional() mixed in
//   tillDate: yup.string().nullable(),

//   // ✅ Fix 2: branchName was .optional().required() — contradictory, blocked submit
//   branchName: yup.string().nullable().optional(), // not required — BranchNameField sets it internally

//   // purely optional fields
//   depositId: yup.number().optional().default(0),
//   branchSelected: yup.string().nullable().optional().default(""),
//   status: yup.string().nullable().optional().default("0"),
//   collectorId: yup.number().optional().default(0),
//   memberGroupId: yup.number().optional().default(0),
//   collectionCenterId: yup.number().optional().default(0),
//   sameCompanyName: yup.boolean().optional().default(true),
//   enableCollectionCenter: yup.boolean().optional().default(true),
//   enableGroup: yup.boolean().optional().default(true),
//   orderBy: yup.string().nullable().optional().default("0"),
// });

// // ── Strip / normalise before API call ─────────────────────────────────────
// const toRequest = (
//   v: SavingAcWiseBalanceRequest,
// ): SavingAcWiseBalanceRequest => ({
//   tillDate: v.tillDate || null,
//   depositId: v.depositId,
//   branchSelected: v.branchSelected,
//   branchName: v.branchName,
//   status: v.status || null,
//   collectorId: v.collectorId,
//   memberGroupId: v.memberGroupId,
//   collectionCenterId: v.collectionCenterId,
//   sameCompanyName: v.sameCompanyName,
//   enableCollectionCenter: v.enableCollectionCenter,
//   // intentional: mirrors the original mapping
//   enableGroup: v.enableCollectionCenter,
//   orderBy: v.orderBy,
// });

// // ── Default pagination fallback ────────────────────────────────────────────
// // const DEFAULT_PAGINATION: Pagination = {
// //   currentPage: 1,
// //   totalPages: 1,
// //   totalRecord: 0,
// //   pageSize: 1,
// //   hasNextPage: false,
// //   hasPreviousPage: false,
// // };

// // ── Page ───────────────────────────────────────────────────────────────────
// function Page(): React.ReactElement {
//   const [reportState, setReportState] =
//     useState<SavingAcWiseBalanceResponseExtended>({ isLoading: false });

//   const [lastRequest, setLastRequest] =
//     useState<SavingAcWiseBalanceRequest | null>(null);

//   const { control, handleSubmit, setValue } =
//     useForm<SavingAcWiseBalanceRequest>({
//       resolver: yupResolver(schema),
//       defaultValues: useMemo(() => schema.getDefault(), []),
//     });

//   const callApi = useCallback(
//     (request: SavingAcWiseBalanceRequest, format: string) =>
//       savingAcWiseBalanceService.api.savingAcWiseBalanceReportCreate(request, {
//         format,
//       }),
//     [],
//   );

//   const fetchReport = useCallback(
//     async (request: SavingAcWiseBalanceRequest): Promise<void> => {
//       // Revoke previous blob URL before creating a new one
//       setReportState((prev) => {
//         if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
//         return { isLoading: true };
//       });
//       try {
//         const res = await callApi(request, "VIEW");

//         // ── Parse X-Pagination JSON header ─────────────────────────────────
//         // Backend serializes anonymous object → keys are already camelCase
//         const raw =
//           (res.headers as Record<string, string>)["x-pagination"] ?? "";
//         const pagination: Pagination = (() => {
//           try {
//             return raw ? (JSON.parse(raw) as Pagination) : DefaultPagination;
//           } catch {
//             return DefaultPagination;
//           }
//         })();

//         // ── Binary PDF response → blob URL ─────────────────────────────────
//         const blob = responseToBlob(res.data, "PDF");
//         const pdfData = URL.createObjectURL(blob);

//         setLastRequest(request);
//         setReportState({ isLoading: false, pdfData, pagination });
//       } catch {
//         setReportState((prev) => ({ ...prev, isLoading: false }));
//         // Error toast handled by Axios interceptor
//       }
//     },
//     [callApi],
//   );

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
//           "SavingAcWiseBalance", // fixed: was "MemberIdCard"
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

//   const onSubmit: SubmitHandler<SavingAcWiseBalanceRequest> = useCallback(
//     (formData) => {
//       fetchReport(toRequest(formData));
//     },
//     [fetchReport],
//   );

//   // ── Page navigation — NO API call — iframe navigates via #page=N ──────
//   const handlePageChange = useCallback((newPage: number) => {
//     setReportState((prev) => {
//       const total = prev.pagination?.totalPages ?? 1;
//       const clamped = Math.max(1, Math.min(newPage, total));
//       return {
//         ...prev,
//         pagination: { ...prev.pagination, currentPage: clamped },
//       };
//     });
//   }, []);

//   // ── Revoke blob URL on unmount ─────────────────────────────────────────
//   useEffect(() => {
//     return () => {
//       setReportState((prev) => {
//         if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
//         return prev;
//       });
//     };
//   }, []);

//   return (
//     <SavingAcWiseBalance
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
// Page.whyDidYouRender = true;
// export default Page;

"use client";

import SavingAcWiseBalance from "@/components/reports/memberAccount/SavingAccountWiseReports/SavingAcWiseBalance";
import savingAcWiseBalanceProgressiveService from "@/services/Common/Progressivepolling";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  ReportResponseDtos,
  type Pagination,
  type SavingAcWiseBalanceRequest,
} from "types/api/api";
import * as yup from "yup";
import memberAccountService from "@/services/memberAccount/memberAccountService";

// ── Extended pagination ──────────────────────────────────────────────────────
export interface ProgressivePagination extends Pagination {
  progressive?: boolean;
  jobId?: string;
  pagesReady?: number;
  estimatedPages?: number;
  isComplete?: boolean;
}

// ── Client-only state ────────────────────────────────────────────────────────
export interface SavingAcWiseBalanceResponseExtended extends ReportResponseDtos {
  isLoading: boolean;
  pagination?: ProgressivePagination;
  progressiveInfo?: {
    isStreaming: boolean;
    pagesReady: number;
    estimatedPages: number;
    progressPercent: number;
    sizeMb: number;
  };
}

const POLL_INTERVAL_MS = 1_500;

const schema: yup.ObjectSchema<SavingAcWiseBalanceRequest> = yup.object({
  tillDate: yup.string().nullable(),
  branchName: yup.string().nullable().optional(),
  depositId: yup.number().optional().default(0),
  branchSelected: yup.string().nullable().optional().default(""),
  status: yup.string().nullable().optional().default("0"),
  collectorId: yup.number().optional().default(0),
  memberGroupId: yup.number().optional().default(0),
  collectionCenterId: yup.number().optional().default(0),
  sameCompanyName: yup.boolean().optional().default(true),
  enableCollectionCenter: yup.boolean().optional().default(true),
  enableGroup: yup.boolean().optional().default(true),
  orderBy: yup.string().nullable().optional().default(""),
});

const toRequest = (
  v: SavingAcWiseBalanceRequest,
): SavingAcWiseBalanceRequest => ({
  tillDate: v.tillDate || null,
  depositId: v.depositId,
  branchSelected: v.branchSelected,
  branchName: v.branchName,
  status: v.status || null,
  collectorId: v.collectorId,
  memberGroupId: v.memberGroupId,
  collectionCenterId: v.collectionCenterId,
  sameCompanyName: v.sameCompanyName,
  enableCollectionCenter: v.enableCollectionCenter,
  enableGroup: v.enableCollectionCenter,
  orderBy: v.orderBy || "",
});

const parsePaginationHeader = (raw: string): ProgressivePagination => {
  try {
    return raw ? (JSON.parse(raw) as ProgressivePagination) : DefaultPagination;
  } catch {
    return DefaultPagination;
  }
};

function Page(): React.ReactElement {
  const [reportState, setReportState] =
    useState<SavingAcWiseBalanceResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<SavingAcWiseBalanceRequest | null>(null);

  // reportKey increments only on new form submissions, NOT during polling.
  // LazyReportViewer uses it to reset its intersection-observer gate.
  const [reportKey, setReportKey] = useState(0);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const currentBlobUrlRef = useRef<string | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<SavingAcWiseBalanceRequest>({
      resolver: yupResolver(schema),
      defaultValues: useMemo(() => schema.getDefault(), []),
    });

  // ── Blob URL lifecycle ────────────────────────────────────────────────────
  const revokeCurrentBlob = useCallback(() => {
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }
  }, []);

  // ── Stop background polling ───────────────────────────────────────────────
  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  // ── API helper ────────────────────────────────────────────────────────────
  const callApi = useCallback(
    (request: SavingAcWiseBalanceRequest, format: string) =>
      memberAccountService.api.savingAcWiseBalanceReportCreate(request, {
        format,
      }),
    [],
  );

  // ── Swap blob URL (revoke old after creating new to prevent blank flash) ──
  const swapBlobUrl = useCallback((newBlob: Blob): string => {
    const newUrl = URL.createObjectURL(newBlob);
    const oldUrl = currentBlobUrlRef.current;
    currentBlobUrlRef.current = newUrl;
    if (oldUrl) URL.revokeObjectURL(oldUrl);
    return newUrl;
  }, []);

  // ── Progressive poll ─────────────────────────────────────────────────────
  const pollProgressive = useCallback(
    async (jobId: string, lastPagesReady: number): Promise<void> => {
      try {
        const result =
          await savingAcWiseBalanceProgressiveService.getProgressivePdf(
            jobId,
            abortRef.current?.signal ?? undefined,
          );

        const {
          blob,
          pagesReady,
          isComplete,
          totalChunks,
          completedChunks,
          sizeBytes,
          estimatedPages,
        } = result;

        const progressPercent =
          totalChunks > 0
            ? Math.round((completedChunks / totalChunks) * 100)
            : 0;

        // ── Always refresh the displayed PDF with the latest merged blob.
        //    Primary guard is pagesReady > lastPagesReady (works once CORS
        //    exposes the headers). Belt-and-suspenders: also refresh when
        //    isComplete fires, so the final page is never missed.
        if (pagesReady > lastPagesReady || isComplete) {
          const newUrl = swapBlobUrl(blob);

          setReportState((prev) => ({
            ...prev,
            pdfData: newUrl,
            pagination: {
              ...(prev.pagination ?? DefaultPagination),
              // totalPages grows as chunks merge in; never shrink it
              totalPages: Math.max(
                pagesReady,
                prev.pagination?.totalPages ?? 0,
              ),
              // preserve the page the user is currently viewing
              currentPage: prev.pagination?.currentPage ?? 1,
              hasNextPage: !isComplete,
              isComplete,
              pagesReady,
              estimatedPages:
                estimatedPages > 0
                  ? estimatedPages
                  : prev.progressiveInfo?.estimatedPages,
            },
            progressiveInfo: {
              isStreaming: !isComplete,
              pagesReady,
              estimatedPages:
                (estimatedPages > 0
                  ? estimatedPages
                  : prev.progressiveInfo?.estimatedPages) ?? 0,
              progressPercent,
              sizeMb: sizeBytes / 1024 / 1024,
            },
          }));
        } else {
          // Headers not yet readable (CORS not fixed yet) or no new pages —
          // still update progress indicators without swapping the blob.
          if (completedChunks > 0 || progressPercent > 0) {
            setReportState((prev) => ({
              ...prev,
              progressiveInfo: prev.progressiveInfo
                ? {
                    ...prev.progressiveInfo,
                    progressPercent,
                    sizeMb: sizeBytes / 1024 / 1024,
                  }
                : prev.progressiveInfo,
            }));
          }
        }

        if (isComplete) {
          toast.success(`Report complete — ${pagesReady} pages ready`);
          stopPolling();
          return;
        }

        // Schedule next poll
        pollTimerRef.current = setTimeout(
          () =>
            pollProgressive(
              jobId,
              pagesReady > lastPagesReady ? pagesReady : lastPagesReady,
            ),
          POLL_INTERVAL_MS,
        );
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.warn("Polling error — will retry:", err);
        pollTimerRef.current = setTimeout(
          () => pollProgressive(jobId, lastPagesReady),
          POLL_INTERVAL_MS * 2,
        );
      }
    },
    [stopPolling, swapBlobUrl],
  );

  // ── Main fetch (triggered by form submit) ────────────────────────────────
  const fetchReport = useCallback(
    async (request: SavingAcWiseBalanceRequest): Promise<void> => {
      stopPolling();
      revokeCurrentBlob();
      abortRef.current = new AbortController();

      // Bump reportKey so LazyReportViewer resets its intersection-observer
      setReportKey((k) => k + 1);
      setReportState({ isLoading: true });

      try {
        const res = await callApi(request, "VIEW");

        const raw =
          (res.headers as Record<string, string>)["x-pagination"] ?? "";
        const pagination = parsePaginationHeader(raw);
        const blob = responseToBlob(res.data, "PDF");
        const pdfData = swapBlobUrl(blob);
        setLastRequest(request);

        // ── Progressive: backend returned a partial PDF + jobId ───────────
        if (pagination.progressive && pagination.jobId) {
          const initialPages = pagination.pagesReady ?? 0;

          setReportState({
            isLoading: false,
            pdfData,
            pagination: {
              ...pagination,
              // Set totalPages so navigation shows a real number immediately
              totalPages: Math.max(
                initialPages,
                pagination.estimatedPages ?? 0,
              ),
              currentPage: 1,
            },
            progressiveInfo: {
              isStreaming: !(pagination.isComplete ?? false),
              pagesReady: initialPages,
              estimatedPages: pagination.estimatedPages ?? 0,
              progressPercent: 0,
              sizeMb: 0,
            },
          });

          if (!pagination.isComplete) {
            toast.info(`Showing first ${initialPages} pages — loading more…`);
            // Start polling after one interval so the initial render settles
            pollTimerRef.current = setTimeout(
              () => pollProgressive(pagination.jobId!, initialPages),
              POLL_INTERVAL_MS,
            );
          }
          return;
        }

        // ── Standard (small dataset) ──────────────────────────────────────
        setReportState({ isLoading: false, pdfData, pagination });
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [callApi, pollProgressive, revokeCurrentBlob, stopPolling, swapBlobUrl],
  );

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = useCallback(
    async (format: ReportFormat): Promise<void> => {
      if (!lastRequest) {
        toast.warning("Please view the report before exporting.");
        return;
      }
      if (reportState.progressiveInfo?.isStreaming) {
        toast.info("Preparing full export — this may take a moment.");
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
          "SavingAcWiseBalance",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        toast.error("Failed to download file.");
      }
    },
    [callApi, lastRequest, reportState.progressiveInfo?.isStreaming],
  );

  const onSubmit: SubmitHandler<SavingAcWiseBalanceRequest> = useCallback(
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

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopPolling();
      revokeCurrentBlob();
    };
  }, [stopPolling, revokeCurrentBlob]);

  return (
    <SavingAcWiseBalance
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      reportKey={reportKey}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
    />
  );
}

export default Page;
