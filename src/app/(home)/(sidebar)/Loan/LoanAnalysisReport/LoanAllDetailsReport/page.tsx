"use client";
import LoanDetailReport from "@/components/reports/loanReport/LoanAnalysisReport/LoanDetailReport";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { LOAN_COLUMN_OPTIONS } from "@/utilis/Constants/LoanColumnOptions";
import {
  DefaultPagination,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanAllDetailsRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

export interface LoanDetailFormValues extends Omit<
  LoanAllDetailsRequestDto,
  "branchIds"
> {
  branchIds: string[];
  memberId?: string | null;
  memberName?: string;
  groupByMemberGroup?: boolean;
}

export interface LoanDetailResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const ALL_COLUMN_KEYS = LOAN_COLUMN_OPTIONS.map((c) => c.key);

const schema: yup.ObjectSchema<LoanDetailFormValues> = yup
  .object({
    memberRegistrationId: yup.number().optional().default(-1),
    loanTypeId: yup.string().nullable().optional().default("-1"),
    orderBy: yup.string().nullable().optional().default(""),
    collectorId: yup.string().nullable().optional().default("-1"),
    tillDateBs: yup.string().nullable().optional().default(""),
    status: yup.string().nullable().optional().default("All"),
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    collectionCenterId: yup.string().nullable().optional().default("-1"),
    enableCollectionCenter: yup.boolean().optional().default(false),
    memberGroupId: yup.string().nullable().optional().default("-1"),
    groupByMemberGroup: yup.boolean().optional().default(false),
    memberId: yup.string().nullable().optional().default(null),
    memberName: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
    selectedColumns: yup
      .array()
      .of(yup.string().required())
      .required()
      .min(1, "Please select at least one column")
      .default(() => ALL_COLUMN_KEYS),
  })
  .required();

const toRequest = (v: LoanDetailFormValues): LoanAllDetailsRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  return {
    memberRegistrationId: v.memberRegistrationId ?? -1,
    tillDateBs: v.tillDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    loanTypeId: v.loanTypeId || "-1",
    status: v.status || "All",
    collectionCenterId: v.collectionCenterId || "-1",
    enableCollectionCenter: v.enableCollectionCenter ?? false,
    collectorId: v.collectorId || "-1",
    memberGroupId: v.groupByMemberGroup ? v.memberGroupId || "-1" : "-1",
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
    selectedColumns: v.selectedColumns,
  };
};

function Page(): React.ReactElement {
  const [reportState, setReportState] = useState<LoanDetailResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] =
    useState<LoanAllDetailsRequestDto | null>(null);
  //const [renderKey, setRenderKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const { control, handleSubmit, setValue } = useForm<LoanDetailFormValues>({
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
    (request: LoanAllDetailsRequestDto, format: string) =>
      loanService.api.loanAllDetailsCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanAllDetailsRequestDto): Promise<void> => {
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
          "LoanDetailReport",
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
      const total = prev.pagination?.totalPages ?? 1;
      const clamped = Math.max(1, Math.min(newPage, total));
      return {
        ...prev,
        pagination: { ...prev.pagination, currentPage: clamped },
      };
    });
  }, []);
  const onSubmit: SubmitHandler<LoanDetailFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
  );

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <LoanDetailReport
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      iframeRef={iframeRef}
      //renderKey={renderKey}
    />
  );
}

export default Page;
