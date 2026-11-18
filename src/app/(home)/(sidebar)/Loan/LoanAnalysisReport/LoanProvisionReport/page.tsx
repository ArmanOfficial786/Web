"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanProvisionRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

import LoanProvisionForm from "@/components/reports/loanReport/LoanAnalysisReport/LoanProvisionForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { ReportFormat } from "@/utilis/Constants/reportConstants";
import {
  parseViewResponse,
  useReportPages,
} from "@/utilis/Constants/reportView";
import { REPORT_TYPE_SCHEDULE_WISE } from "@/config/LoanReportOptions";

export interface LoanProvisionFormValues extends Omit<
  LoanProvisionRequestDto,
  "branchIds"
> {
  branchIds?: string;
}

export interface LoanProvisionResponseExtended {
  pdfData?: string;
  isHtml?: boolean;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanProvisionFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    branchIds: yup.string().optional().default("2"),
    memberGroupId: yup.string().optional().default("-1"),
    penaltyType: yup.string().optional().default(REPORT_TYPE_SCHEDULE_WISE),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (v: LoanProvisionFormValues): LoanProvisionRequestDto => {
  return {
    tillDateBs: v.tillDateBs || undefined,
    branchIds: String(v.branchIds || "2"),
    memberGroupId: v.memberGroupId || "-1",
    penaltyType: v.penaltyType || undefined,
    visualReport: v.visualReport ?? false,
  };
};

function LoanProvisionPage(): React.ReactElement {
  const [reportState, setReportState] = useState<LoanProvisionResponseExtended>(
    { isLoading: false },
  );
  const [lastRequest, setLastRequest] =
    useState<LoanProvisionRequestDto | null>(null);

  // inside the component, after useState:
  useReportPages(setReportState);

  const { control, handleSubmit, setValue } = useForm<LoanProvisionFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const callApi = useCallback(
    (request: LoanProvisionRequestDto, format: string) =>
      loanService.api.loanProvisionCreate(request, { format }),
    [],
  );

  // const fetchReport = useCallback(
  //   async (request: LoanProvisionRequestDto): Promise<void> => {
  //     setReportState((prev) => {
  //       if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
  //       return { isLoading: true };
  //     });
  //     try {
  //       const res = await callApi(request, "VIEW");

  //       const raw =
  //         (res.headers as Record<string, string>)["x-pagination"] ?? "";
  //       const pagination: Pagination = (() => {
  //         try {
  //           return raw ? (JSON.parse(raw) as Pagination) : DefaultPagination;
  //         } catch {
  //           return DefaultPagination;
  //         }
  //       })();

  //       const blob = responseToBlob(res.data, "PDF");
  //       const pdfData = URL.createObjectURL(blob);

  //       setLastRequest(request);
  //       setReportState({ isLoading: false, pdfData, pagination });
  //     } catch {
  //       setReportState((prev) => ({ ...prev, isLoading: false }));
  //     }
  //   },
  //   [callApi],
  // );

  const fetchReport = useCallback(
    async (request: LoanProvisionRequestDto): Promise<void> => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return { isLoading: true };
      });
      try {
        const res = await callApi(request, "VIEW");
        setLastRequest(request);
        setReportState({
          isLoading: false,
          ...parseViewResponse(res as never),
        });
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
          "LoanProvisionReport",
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

  const onSubmit: SubmitHandler<LoanProvisionFormValues> = useCallback(
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
    <LoanProvisionForm
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

export default LoanProvisionPage;
