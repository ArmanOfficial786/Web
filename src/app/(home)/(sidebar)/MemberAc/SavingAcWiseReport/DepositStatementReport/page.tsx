





















"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  AccountLookUpDtos,
  DepositStatementRequestDto,
  Pagination,
  VerificationStatusDto,
} from "types/api/api";
import * as yup from "yup";

import DepositStatementForm, {
  DepositStatementFormValues,
} from "@/components/reports/memberAccount/SavingAccountWiseReports/DepositStatementForm";
import depositStatementVerifyService from "@/services/Common/DepositStatementVerificationService";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

export interface DepositStatementResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<DepositStatementFormValues> = yup
  .object({
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
    fromDateAd: yup.string().optional().default(""),
    toDateAd: yup.string().optional().default(""),
    statementVerifiedTill: yup.string().optional().default(""),
    passbookVerifiedTill: yup.string().optional().default(""),

    accountNo: yup.string().optional().default(""),
    fromDate: yup.string().optional().default(""),
    toDate: yup.string().optional().default(""),
    generateInterest: yup.boolean().optional().default(false),
    billNumber: yup.boolean().optional().default(false),
    language: yup.mixed<"English" | "Nepali">().optional().default("English"),

    entryBy: yup.boolean().optional().default(false),
    valueDate: yup.boolean().optional().default(false),
    sameCompanyName: yup.boolean().optional().default(false),
    customNarration: yup.boolean().optional().default(false),
    visualReport: yup.boolean().optional().default(false),
    viewInterest: yup.boolean().optional().default(false),
    nepaliDate: yup.boolean().optional().default(false),
    englishDate: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: DepositStatementFormValues,
): DepositStatementRequestDto => ({
  accountNo: v.accountNo || "",
  fromDateBs: v.fromDate || "",
  toDateBs: v.toDate || "",
  enableInterest: v.generateInterest ?? false,
  enableBillNumber: v.billNumber ?? false,
  entryBy: v.entryBy ?? false,
  valueDate: v.valueDate ?? false,
  sameCompanyName: v.sameCompanyName ?? false,
  language: v.language || "English",
  customNarration: v.customNarration ?? false,
  visualReport: v.visualReport ?? false,
  viewInterest: v.viewInterest ?? false,
  nepaliDate: v.nepaliDate ?? false,
  englishDate: v.englishDate ?? false,
});

function DepositStatementPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<DepositStatementResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<DepositStatementRequestDto | null>(null);

  const [mamAccountOpeningId, setMamAccountOpeningId] = useState<number>(0);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatusDto | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyErrorMessage, setVerifyErrorMessage] = useState<
    string | undefined
  >();

  const { control, handleSubmit, setValue } =
    useForm<DepositStatementFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const handleAccountSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");

      setVerificationStatus(null);
      setVerifyErrorMessage(undefined);
      setMamAccountOpeningId(record.mamAccountOpeningId ?? 0);
    },
    [setValue],
  );

  const callApi = useCallback(
    (request: DepositStatementRequestDto, format: string) =>
      memberAccountService.api.depositStatementCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: DepositStatementRequestDto): Promise<void> => {
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

        setVerifyErrorMessage(undefined);
        setVerificationStatus(null);
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
          "DepositStatement",
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

  const onSubmit: SubmitHandler<DepositStatementFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
  );

  const handleVerifyStatement: SubmitHandler<DepositStatementFormValues> =
    useCallback(
      async (formData) => {
        if (!formData.accountNo || !mamAccountOpeningId) {
          setVerifyErrorMessage("Please Enter Correct Account No");
          return;
        }
        if (!formData.statementVerifiedTill) {
          toast.warning("Please select the Statement Verified Till date.");
          return;
        }

        setVerifying(true);
        setVerifyErrorMessage(undefined);
        try {
          const status = await depositStatementVerifyService.verify({
            mamAccountOpeningId,
            accountNo: formData.accountNo,
            verifiedFromDateOnBs: formData.fromDate || "",
            verifiedToDateOnBs: formData.statementVerifiedTill,
          });
          setVerificationStatus(status);
        } catch (err) {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to update statement verification.";
          setVerifyErrorMessage(message);
        } finally {
          setVerifying(false);
        }
      },
      [mamAccountOpeningId],
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
    <DepositStatementForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onAccountSelect={handleAccountSelect}
      verificationStatus={verificationStatus}
      verifying={verifying}
      verifyErrorMessage={verifyErrorMessage}
      onVerifyStatement={handleVerifyStatement}
    />
  );
}

export default DepositStatementPage;
