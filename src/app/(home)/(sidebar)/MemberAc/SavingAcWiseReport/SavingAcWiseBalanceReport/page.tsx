




















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

export interface ProgressivePagination extends Pagination {
  progressive?: boolean;
  jobId?: string;
  pagesReady?: number;
  estimatedPages?: number;
  isComplete?: boolean;
}

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

  const [reportKey, setReportKey] = useState(0);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const currentBlobUrlRef = useRef<string | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<SavingAcWiseBalanceRequest>({
      resolver: yupResolver(schema),
      defaultValues: useMemo(() => schema.getDefault(), []),
    });

  const revokeCurrentBlob = useCallback(() => {
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const callApi = useCallback(
    (request: SavingAcWiseBalanceRequest, format: string) =>
      memberAccountService.api.savingAcWiseBalanceReportCreate(request, {
        format,
      }),
    [],
  );

  const swapBlobUrl = useCallback((newBlob: Blob): string => {
    const newUrl = URL.createObjectURL(newBlob);
    const oldUrl = currentBlobUrlRef.current;
    currentBlobUrlRef.current = newUrl;
    if (oldUrl) URL.revokeObjectURL(oldUrl);
    return newUrl;
  }, []);

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

        if (pagesReady > lastPagesReady || isComplete) {
          const newUrl = swapBlobUrl(blob);

          setReportState((prev) => ({
            ...prev,
            pdfData: newUrl,
            pagination: {
              ...(prev.pagination ?? DefaultPagination),
              totalPages: Math.max(
                pagesReady,
                prev.pagination?.totalPages ?? 0,
              ),
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

  const fetchReport = useCallback(
    async (request: SavingAcWiseBalanceRequest): Promise<void> => {
      stopPolling();
      revokeCurrentBlob();
      abortRef.current = new AbortController();

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

        if (pagination.progressive && pagination.jobId) {
          const initialPages = pagination.pagesReady ?? 0;

          setReportState({
            isLoading: false,
            pdfData,
            pagination: {
              ...pagination,
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
            pollTimerRef.current = setTimeout(
              () => pollProgressive(pagination.jobId!, initialPages),
              POLL_INTERVAL_MS,
            );
          }
          return;
        }

        setReportState({ isLoading: false, pdfData, pagination });
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [callApi, pollProgressive, revokeCurrentBlob, stopPolling, swapBlobUrl],
  );

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
