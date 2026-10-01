"use client";

import SavingDepositDateWiseForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/SavingDepositAmountDateWiseFrom";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  Pagination,
  SavingDepositDateWiseRequestDto,
} from "types/api/api";
import * as yup from "yup";

export type SavingDepositDateWiseFormValues = Omit<
  SavingDepositDateWiseRequestDto,
  "branchIds"
> & {
  branchIds?: string | number | Array<string | number> | null;
  memberName?: string | null;
  typeCategory?: string | null;
  reportType?: "Deposit" | "Withdrawal" | null;
};

export interface SavingDepositDateWiseResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<SavingDepositDateWiseFormValues> = yup
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
    branchIds: yup
      .mixed<string | number | Array<string | number>>()
      .nullable()
      .optional()
      .default(""),
    orderBy: yup.string().nullable().optional().default(""),
    transactionType: yup
      .string()
      .oneOf(["All", "ChequeOnly", "CashOnly", "BankOnly"])
      .nullable()
      .optional()
      .default("All"),
    reportType: yup
      .string()
      .oneOf(["Deposit", "Withdrawal"])
      .nullable()
      .optional()
      .default("Deposit"),
    memberId: yup.number().nullable().optional().default(null),
    savingTypeId: yup.number().nullable().optional().default(-1),
    branchName: yup.string().nullable().optional().default(""),
    reportMode: yup.string().nullable().optional().default(""),
    chequeDetail: yup.number().optional(),
    memberName: yup.string().nullable().optional().default(""),
    typeCategory: yup.string().nullable().optional().default("Saving"),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function SavingDepositDateWisePage() {
  const [reportState, setReportState] =
    useState<SavingDepositDateWiseResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<SavingDepositDateWiseRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<SavingDepositDateWiseFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (
      form: SavingDepositDateWiseFormValues,
    ): SavingDepositDateWiseRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      branchIds: Array.isArray(form.branchIds)
        ? form.branchIds.join(",")
        : form.branchIds != null && form.branchIds !== ""
          ? String(form.branchIds)
          : undefined,
      branchName: form.branchName || undefined,
      orderBy: form.orderBy || "",
      transactionType: form.transactionType || "All",
      memberId: form.memberId || undefined,
      savingTypeId: form.savingTypeId || undefined,
      reportMode: form.reportMode || undefined,
      chequeDetail: form.chequeDetail || undefined,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: SavingDepositDateWiseRequestDto, format: string) =>
      memberAccountService.api.savingDepositAmountDateWiseCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: SavingDepositDateWiseRequestDto) => {
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
      } catch (error) {
        console.error("Report generation error:", error);
        toast.error("Failed to generate report");
        setReportState({ isLoading: false });
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
      if (!lastRequest) return;

      const res = await callApi(lastRequest, format);
      const blob = responseToBlob(res.data, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = extractFilenameFromResponse(
        res,
        format,
        "SavingDepositDateWiseReport",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<SavingDepositDateWiseFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
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
    <SavingDepositDateWiseForm
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
