"use client";

import IbtStatementBranchwiseForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/IBTReport/IbtStatementBranchwiseForm";
import accountService from "@/services/Account/AccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  IBTStatementBranchwiseRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

export type IbtStatementBranchwiseFormValues =
  IBTStatementBranchwiseRequestDto & {
    branchName?: string | null;
  };

export interface IbtStatementBranchwiseResponseExtended {
  blobUrl: string;
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DEFAULT_PAYABLE_BRANCH_ID = "2";

const schema: yup.ObjectSchema<IbtStatementBranchwiseFormValues> = yup
  .object({
    fromDateBs: yup.string().required("From Date is required").nullable(),
    toDateBs: yup
      .string()
      .required("To Date is required")
      .nullable()
      .test(
        "date-order",
        "To Date cannot be before From Date",
        function (value) {
          const { fromDateBs } = this.parent as { fromDateBs: string | null };
          if (!fromDateBs || !value) return true;
          return String(value) >= String(fromDateBs);
        },
      ),
    officeId: yup.string().required("Login branch is required").nullable(),
    payableBranchId: yup
      .string()
      .required("Payable branch is required")
      .nullable()
      .default(DEFAULT_PAYABLE_BRANCH_ID),
    branchName: yup.string().nullable().optional().default(""),
    reportType: yup.string().required().nullable().default("Detail"),
    interestRate: yup.number().optional(),
    minimumClosingBalance: yup.number().optional(),
  })
  .required();

export default function IbtStatementBranchwisePage() {
  const [reportState, setReportState] =
    useState<IbtStatementBranchwiseResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<IBTStatementBranchwiseRequestDto | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<IbtStatementBranchwiseFormValues>({
      resolver: yupResolver(schema),
      // ── schema.getDefault() so payableBranchId actually resolves to "2" —
      // a hand-written defaultValues object here previously silently
      // overrode the yup default with "".
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: IbtStatementBranchwiseFormValues,
    ): IBTStatementBranchwiseRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      officeId: form.officeId || undefined,
      payableBranchId: form.payableBranchId || DEFAULT_PAYABLE_BRANCH_ID,
      reportType: form.reportType || "Detail",
      interestRate: form.interestRate,
      minimumClosingBalance: form.minimumClosingBalance,
    }),
    [],
  );

  const callApi = useCallback(
    (request: IBTStatementBranchwiseRequestDto, format: string) =>
      accountService.api.ibtStatementBranchwiseCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: IBTStatementBranchwiseRequestDto) => {
      setReportState((previous) => {
        if (previous.blobUrl) URL.revokeObjectURL(previous.blobUrl);
        return { blobUrl: "", isLoading: true };
      });

      try {
        const response = await callApi(request, "VIEW");

        const raw =
          (response.headers as Record<string, string>)["x-pagination"] ?? "";
        const pagination: Pagination = (() => {
          try {
            return raw ? (JSON.parse(raw) as Pagination) : DefaultPagination;
          } catch {
            return DefaultPagination;
          }
        })();

        const blobUrl = URL.createObjectURL(
          responseToBlob(response.data, "PDF"),
        );
        setLastRequest(request);
        setReportState({
          blobUrl,
          pdfData: blobUrl,
          isLoading: false,
          pagination,
        });
      } catch (error) {
        console.error("Report generation error:", error);
        toast.error("Failed to generate report");
        setReportState((previous) => ({ ...previous, isLoading: false }));
      }
    },
    [callApi],
  );

  const handlePageChange = useCallback((page: number) => {
    setReportState((previous) => {
      const totalPages = previous.pagination?.totalPages ?? 1;
      const clamped = Math.max(1, Math.min(page, totalPages));
      return {
        ...previous,
        pagination: { ...previous.pagination, currentPage: clamped },
      };
    });
  }, []);

  const handleDownload = useCallback(
    async (format: ReportFormat) => {
      if (!lastRequest) {
        toast.warning("Please generate the report first");
        return;
      }

      try {
        const response = await callApi(lastRequest, format);
        const url = URL.createObjectURL(responseToBlob(response.data, format));
        const link = document.createElement("a");
        link.href = url;
        link.download = extractFilenameFromResponse(
          response,
          format,
          "IbtStatementBranchwiseReport",
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<IbtStatementBranchwiseFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  useEffect(() => {
    return () => {
      setReportState((previous) => {
        if (previous.blobUrl) URL.revokeObjectURL(previous.blobUrl);
        return previous;
      });
    };
  }, []);

  return (
    <IbtStatementBranchwiseForm
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
