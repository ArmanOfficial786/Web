"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  LoanAgingArrealCalculationRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import LoanAgeingArrearCalculationForm from "@/components/reports/loanReport/LoanAnalysisReport/LoanAgeingArrearCalculationForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

// branchIds arrives as string[] from OfficeNameField
// collectorId, collectionCenterId, memberGroupId are strings from DropDowns
export interface LoanAgeingArrearCalculationFormValues extends Omit<
  LoanAgingArrealCalculationRequestDto,
  "branchIds" | "collectorId" | "collectionCenterId" | "memberGroupId"
> {
  branchIds?: string[];
  collectorId?: string;
  collectionCenterId?: string;
  memberGroupId?: string;
}

export interface LoanAgeingArrearCalculationResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<LoanAgeingArrearCalculationFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    branchIds: yup
      .array()
      .of(yup.string().required())
      .optional()
      .default(["2"]),
    collectorId: yup.string().optional().default("-1"),
    collectionCenterId: yup.string().optional().default("-1"),
    enableCollectionCenter: yup.boolean().optional().default(false),
    enable1To30Days: yup.boolean().optional().default(false),
    memberGroupId: yup.string().optional().default("-1"),
    penaltyType: yup.string().optional().default(""),
    orderBy: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: LoanAgeingArrearCalculationFormValues,
): LoanAgingArrealCalculationRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);

  return {
    tillDateBs: v.tillDateBs || undefined,
    branchIds: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    collectorId: v.collectorId || "-1",
    collectionCenterId: v.collectionCenterId || "-1",
    enableCollectionCenter: v.enableCollectionCenter ?? false,
    enable1To30Days: v.enable1To30Days ?? false,
    memberGroupId: v.memberGroupId || "-1",
    penaltyType: v.penaltyType || undefined,
    orderBy: v.orderBy || "",
    visualReport: v.visualReport ?? false,
  };
};

function LoanAgeingArrearCalculationPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<LoanAgeingArrearCalculationResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<LoanAgingArrealCalculationRequestDto | null>(null);

  const { control, handleSubmit, setValue } =
    useForm<LoanAgeingArrearCalculationFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: LoanAgingArrealCalculationRequestDto, format: string) =>
      loanService.api.loanAgingArrealCalculationCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: LoanAgingArrealCalculationRequestDto): Promise<void> => {
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
          "LoanAgeingArrearCalculationReport",
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

  const onSubmit: SubmitHandler<LoanAgeingArrearCalculationFormValues> =
    useCallback((formData) => fetchReport(toRequest(formData)), [fetchReport]);

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <LoanAgeingArrearCalculationForm
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

export default LoanAgeingArrearCalculationPage;
