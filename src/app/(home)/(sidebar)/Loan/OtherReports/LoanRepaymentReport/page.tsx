// app/(home)/(sidebar)/Loan/OtherReports/LoanRepaymentReport/page.tsx
"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import LoanRepaymentForm from "@/components/reports/loanReport/otherReports/LoanRepaymentForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanRepaymentRequestDto } from "types/api/api";
import * as yup from "yup";

export type LoanRepaymentFormValues = LoanRepaymentRequestDto & {
  memberName?: string | null;
};

export interface LoanRepaymentResponseExtended {
  blobUrl: string;
  pdfData?: string;
  isLoading: boolean;
  pagination?: { currentPage?: number; totalPages?: number };
}

const schema: yup.ObjectSchema<LoanRepaymentFormValues> = yup
  .object({
    memberId: yup.string().nullable().optional(),
    memberName: yup.string().nullable().optional(),
    branchIds: yup.string().nullable().optional().default("2"),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function LoanRepaymentPage() {
  const [reportState, setReportState] = useState<LoanRepaymentResponseExtended>(
    {
      blobUrl: "",
      isLoading: false,
    },
  );
  const [lastRequest, setLastRequest] =
    useState<LoanRepaymentRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanRepaymentFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: LoanRepaymentFormValues): LoanRepaymentRequestDto => ({
      memberId: form.memberId || undefined,
      branchIds: form.branchIds || "-1",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: LoanRepaymentRequestDto, format: string) =>
      loanService.api.loanRepaymentCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanRepaymentRequestDto) => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return { blobUrl: "", isLoading: true };
      });

      try {
        const res = await callApi(request, "VIEW");
        const blobUrl = URL.createObjectURL(responseToBlob(res.data, "PDF"));
        setLastRequest(request);
        setReportState({ blobUrl, pdfData: blobUrl, isLoading: false });
      } catch {
        toast.error("Failed to generate report.");
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
          "LoanRepaymentReport",
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

  const onSubmit: SubmitHandler<LoanRepaymentFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return prev;
      });
    };
  }, []);

  return (
    <LoanRepaymentForm
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
