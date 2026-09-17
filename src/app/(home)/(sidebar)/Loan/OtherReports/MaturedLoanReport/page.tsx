"use client";

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import MaturedLoanForm from "@/components/reports/loanReport/otherReports/MaturedLoanForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { MaturedLoanRequestDto } from "types/api/api";
import * as yup from "yup";

export type MaturedLoanFormValues = MaturedLoanRequestDto & {
  memberName?: string | null;
};

export interface MaturedLoanResponseExtended {
  blobUrl: string;
  pdfData?: string;
  isLoading: boolean;
  pagination?: { currentPage?: number; totalPages?: number };
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<MaturedLoanFormValues> = yup
  .object({
    memberId: yup.string().nullable().optional(),
    memberName: yup.string().nullable().optional(),
    fromDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    toDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE)
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDateBs } = this.parent as { fromDateBs: string | null };
        if (!fromDateBs || !val) return true;
        return String(val) >= String(fromDateBs);
      }),
    branchIds: yup.string().nullable().optional().default("2"),
    memberGroupId: yup.string().nullable().optional().default("0"),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function MaturedLoanPage() {
  const [reportState, setReportState] = useState<MaturedLoanResponseExtended>({
    blobUrl: "",
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<MaturedLoanRequestDto | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset } =
    useForm<MaturedLoanFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: MaturedLoanFormValues): MaturedLoanRequestDto => ({
      memberId: form.memberId || undefined,
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchIds: form.branchIds || "-1",
      memberGroupId: form.memberGroupId || "0",
      orderBy: form.orderBy || "",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: MaturedLoanRequestDto, format: string) =>
      loanService.api.maturedLoanCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MaturedLoanRequestDto) => {
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
          "MaturedLoanReport",
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

  const onSubmit: SubmitHandler<MaturedLoanFormValues> = useCallback(
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
    <MaturedLoanForm
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
