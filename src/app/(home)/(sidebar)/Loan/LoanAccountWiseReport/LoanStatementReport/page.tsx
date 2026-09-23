"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  AccountLookUpDtos,
  LoanStatementRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import LoanStatementForm from "@/components/reports/loanReport/loanAccountWiseReport/LoanStatementForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export interface LoanStatementFormValues extends LoanStatementRequestDto {
  memberId?: string;
  memberName?: string;
  fromDateAd?: string;
  toDateAd?: string;
  branchName?: string;
}

export interface LoanStatementResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<LoanStatementFormValues> = yup
  .object({
    accountNo: yup.string().optional().default(""),
    branchIds: yup.string().optional().default(""),
    fromDateBs: yup.string().optional().default(""),
    toDateBs: yup.string().optional().default(""),
    reportType: yup.string().optional().default(""),
    showEntryBy: yup.boolean().optional().default(false),
    showDetailNarration: yup.boolean().optional().default(false),
    showAccountCloseDetails: yup.boolean().optional().default(false),
    enableBillNumber: yup.boolean().optional().default(false),
    narrationType: yup.string().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
    fromDateAd: yup.string().optional().default(""),
    toDateAd: yup.string().optional().default(""),
    branchName: yup.string().optional().default(""),
  })
  .required();

const toRequest = (v: LoanStatementFormValues): LoanStatementRequestDto => ({
  accountNo: v.accountNo || "",
  branchIds: v.branchIds || "",
  fromDateBs: v.fromDateBs || "",
  toDateBs: v.toDateBs || "",
  reportType: v.reportType || "",
  showEntryBy: v.showEntryBy ?? false,
  showDetailNarration: v.showDetailNarration ?? false,
  showAccountCloseDetails: v.showAccountCloseDetails ?? false,
  enableBillNumber: v.enableBillNumber ?? false,
  narrationType: v.narrationType || "",
  sameCompanyName: v.sameCompanyName ?? true,
  visualReport: v.visualReport ?? false,
});

function LoanStatementPage(): React.ReactElement {
  const [reportState, setReportState] = useState<LoanStatementResponseExtended>(
    { isLoading: false },
  );
  const [lastRequest, setLastRequest] =
    useState<LoanStatementRequestDto | null>(null);

  const { control, handleSubmit, setValue } = useForm<LoanStatementFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleAccountSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");
      setValue("branchIds", record.usmOfficeId?.toString() ?? "");
      setValue("branchName", record.officeName ?? "");
    },
    [setValue],
  );

  const callApi = useCallback(
    (request: LoanStatementRequestDto, format: string) =>
      loanService.api.loanStatementCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanStatementRequestDto): Promise<void> => {
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
          "LoanStatement",
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

  const onSubmit: SubmitHandler<LoanStatementFormValues> = useCallback(
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
    <LoanStatementForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onAccountSelect={handleAccountSelect}
    />
  );
}

export default LoanStatementPage;
