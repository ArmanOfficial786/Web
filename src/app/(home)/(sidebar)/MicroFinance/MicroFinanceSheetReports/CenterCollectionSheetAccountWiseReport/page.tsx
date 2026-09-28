"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { getSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type {
  CenterCollectionSheetAccountWiseRequestDto,
  Pagination,
} from "types/api/api";
import * as yup from "yup";

import CenterCollectionSheetAccountWiseForm from "@/components/reports/microFinance/financeSheetReports/CenterCollectionSheetAccountWiseForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

// collectionCenterId (string) from CollectionCenterField; AD / address /
// meetingDateTimeBs / branchIds are UI-only bind fields, never sent.
export interface CenterCollectionSheetAccountWiseFormValues extends Omit<
  CenterCollectionSheetAccountWiseRequestDto,
  "collectionCenterId"
> {
  branchIds?: string[]; // UI-only office id from the authenticated session
  collectionCenterId?: string;
  tillDateAd?: string; // UI-only, derived from tillDateBs (BOTH_BS mode)
  address?: string; // UI-only, bound by CollectionCenterField
  meetingDateTimeBs?: string; // UI-only, bound by CollectionCenterField
}

export interface CenterCollectionSheetAccountWiseResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<CenterCollectionSheetAccountWiseFormValues> = yup
  .object({
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    tillDateAd: yup.string().optional().default(""),
    collectionCenterId: yup.string().optional().default("-1"),
    address: yup.string().optional().default(""),
    meetingDateTimeBs: yup.string().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: CenterCollectionSheetAccountWiseFormValues,
): CenterCollectionSheetAccountWiseRequestDto => ({
  tillDateBs: v.tillDateBs || undefined,
  collectionCenterId: v.collectionCenterId || "-1",
  visualReport: v.visualReport ?? false,
  // branchIds / tillDateAd / address / meetingDateTimeBs intentionally omitted — UI-only
});

function CenterCollectionSheetAccountWisePage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<CenterCollectionSheetAccountWiseResponseExtended>({
      isLoading: false,
    });
  const [lastRequest, setLastRequest] =
    useState<CenterCollectionSheetAccountWiseRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<CenterCollectionSheetAccountWiseFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  useEffect(() => {
    let active = true;

    void getSession().then((session) => {
      if (!active) return;

      const officeId = Number(session?.user?.officeId);
      if (officeId > 0) {
        setValue("branchIds", [String(officeId)]);
      }
    });

    return () => {
      active = false;
    };
  }, [setValue]);

  const callApi = useCallback(
    (request: CenterCollectionSheetAccountWiseRequestDto, format: string) =>
      loanService.api.centerCollectionSheetAccountWiseCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (
      request: CenterCollectionSheetAccountWiseRequestDto,
    ): Promise<void> => {
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
        toast.error("Failed to generate report.");
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
          "CenterCollectionSheetAccountWiseReport",
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

  const onSubmit: SubmitHandler<CenterCollectionSheetAccountWiseFormValues> =
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
    <CenterCollectionSheetAccountWiseForm
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

export default CenterCollectionSheetAccountWisePage;
