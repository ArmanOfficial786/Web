// app/(home)/(sidebar)/Account/AccountReports/IbtTransactionReport/page.tsx
"use client";

import IbtTransactionForm, {
  type ReportFormat,
} from "@/components/reports/accountReport/IBTReport/IbtTransactionForm";
import accountService from "@/services/Account/AccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { IBTTransactionRequestDto } from "types/api/api";
import * as yup from "yup";

export type IbtTransactionFormValues = IBTTransactionRequestDto & {
  branchName?: string | null; // UI-only, not on the DTO — never sent to the API
};

export interface IbtTransactionResponseExtended {
  blobUrl: string;
  pdfData?: string;
  isLoading: boolean;
  pagination?: { currentPage?: number; totalPages?: number };
}

const schema: yup.ObjectSchema<IbtTransactionFormValues> = yup
  .object({
    fromDateBs: yup
      .string()
      .required("From Date is required")
      .nullable()
      .optional()
      .typeError("From Date must be a valid date"),
    toDateBs: yup
      .string()
      .required("To Date is required")
      .nullable()
      .optional()
      .typeError("To Date must be a valid date")
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDateBs } = this.parent as { fromDateBs: string | null };
        if (!fromDateBs || !val) return true;
        return String(val) >= String(fromDateBs);
      }),
    // ⚠️ Real DTO field is `branchId` (singular string), not `branchIds` like
    // most other reports — confirm whether OfficeNameField's output (often a
    // comma-joined multi-select) is compatible with a single-branch field.
    branchId: yup.string().nullable().optional().default("2"),
    branchName: yup.string().nullable().optional().default(""),
    orderBy: yup.string().nullable().optional().default(""),
  })
  .required();

export default function IbtTransactionPage() {
  const [reportState, setReportState] =
    useState<IbtTransactionResponseExtended>({
      blobUrl: "",
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<IBTTransactionRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<IbtTransactionFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: IbtTransactionFormValues): IBTTransactionRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchId: form.branchId || undefined,
      orderBy: form.orderBy || "",
      // branchName intentionally omitted — UI-only, not part of the DTO
    }),
    [],
  );

  const callApi = useCallback(
    (request: IBTTransactionRequestDto, format: string) =>
      accountService.api.ibtTransactionCreate(request, { format }),
    [],
  );

  // Endpoint is void-typed with no `format: "json"` in its request config —
  // it returns raw PDF bytes, not a JSON isValid/data envelope. Uses the
  // raw-binary pattern (matches BalanceSheetReportPage /
  // CollectorWiseWithdrawalPage), not the isValid/base64 pattern.
  const fetchReport = useCallback(
    async (request: IBTTransactionRequestDto) => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return { blobUrl: "", isLoading: true };
      });
      try {
        const res = await callApi(request, "VIEW");
        const blob = responseToBlob(res.data, "PDF");
        const blobUrl = URL.createObjectURL(blob);
        setLastRequest(request);
        setReportState({ blobUrl, pdfData: blobUrl, isLoading: false });
      } catch (error) {
        console.error("Report generation error:", error);
        toast.error("Failed to generate report");
        setReportState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [callApi],
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

  const handleDownload = useCallback(
    async (format: ReportFormat) => {
      if (!lastRequest) {
        toast.warning("Please generate the report first");
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
          "IbtTransactionReport",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<IbtTransactionFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  // ── Revoke blob URL on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return prev;
      });
    };
  }, []);

  return (
    <IbtTransactionForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
    />
  );
}
