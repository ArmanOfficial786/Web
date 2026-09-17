"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import LoanFollowUpForm from "@/components/reports/loanReport/otherReports/LoanFollowUpForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanFollowUpRequestDto } from "types/api/api";
import * as yup from "yup";

export type LoanFollowUpFormValues = LoanFollowUpRequestDto & {
  memberName?: string | null; // display-only companion to memberId; stripped in toRequest
};

export interface LoanFollowUpResponseExtended {
  blobUrl: string;
  pdfData?: string;
  isLoading: boolean;
  pagination?: { currentPage?: number; totalPages?: number };
}

const schema: yup.ObjectSchema<LoanFollowUpFormValues> = yup
  .object({
    memberId: yup.string().nullable().optional().default(""),
    memberName: yup.string().nullable().optional().default(""),
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
    branchId: yup.string().nullable().optional().default("2"),
    visualReport: yup.boolean().optional().default(false),
    orderBy: yup.string().nullable().optional().default(""),
  })
  .required();

export default function LoanFollowUpPage() {
  const [reportState, setReportState] = useState<LoanFollowUpResponseExtended>({
    blobUrl: "",
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<LoanFollowUpRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanFollowUpFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: LoanFollowUpFormValues): LoanFollowUpRequestDto => ({
      memberId: form.memberId || undefined,
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchId: form.branchId || undefined,
      orderBy: form.orderBy || "",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: LoanFollowUpRequestDto, format: string) =>
      loanService.api.loanFollowUpCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanFollowUpRequestDto) => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return { blobUrl: "", isLoading: true };
      });

      try {
        const res = await callApi(request, "VIEW");
        const blobUrl = URL.createObjectURL(responseToBlob(res.data, "PDF"));
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
        const url = URL.createObjectURL(responseToBlob(res.data, format));
        const link = document.createElement("a");
        link.href = url;
        link.download = extractFilenameFromResponse(
          res,
          format,
          "LoanFollowUpReport",
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

  const onSubmit: SubmitHandler<LoanFollowUpFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <LoanFollowUpForm
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
