"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import LoanAppraisalForm from "@/components/reports/loanReport/otherReports/LoanAppraisalForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { LoanAppraisalRequestDto } from "types/api/api";
import * as yup from "yup";

export type LoanAppraisalFormValues = LoanAppraisalRequestDto & {
  memberName?: string | null;
};

export interface LoanAppraisalResponseExtended {
  blobUrl: string;
  pdfData?: string;
  isLoading: boolean;
  pagination?: { currentPage?: number; totalPages?: number };
}

const schema: yup.ObjectSchema<LoanAppraisalFormValues> = yup
  .object({
    memberId: yup.string().nullable().optional(),
    memberName: yup.string().nullable().optional(),
    branchIds: yup.string().nullable().optional().default("2"),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function LoanAppraisalPage() {
  const [reportState, setReportState] = useState<LoanAppraisalResponseExtended>(
    {
      blobUrl: "",
      isLoading: false,
    },
  );
  const [lastRequest, setLastRequest] =
    useState<LoanAppraisalRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<LoanAppraisalFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: LoanAppraisalFormValues): LoanAppraisalRequestDto => ({
      memberId: form.memberId || undefined,
      branchIds: form.branchIds || "-1",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: LoanAppraisalRequestDto, format: string) =>
      loanService.api.loanAppraisalCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanAppraisalRequestDto) => {
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
          "LoanAppraisalReport",
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

  const onSubmit: SubmitHandler<LoanAppraisalFormValues> = useCallback(
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
    <LoanAppraisalForm
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
