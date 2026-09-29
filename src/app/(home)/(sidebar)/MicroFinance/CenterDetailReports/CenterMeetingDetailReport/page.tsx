"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { getSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { CenterMeetingDetailRequestDto, Pagination } from "types/api/api";
import * as yup from "yup";

import CenterMeetingDetailForm from "@/components/reports/microFinance/centerDetailReports/CenterMeetingDetailForm";
import loanService from "@/services/Loan/loanService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  ReportFormat,
} from "@/utilis/Constants/reportConstants";

// ── Report Type (wire = meetingType) ──────────────────────────────────────────
// ⚠️ Guessed wire values — confirm against backend
const MEETING_TYPE_NEXT_MEETING = "NextMeeting";

// branchIds arrives as string[] from OfficeNameField; collectionCenterId is string
// from CollectionCenterField. Both UI-facing field names differ slightly from DTO.
export interface CenterMeetingDetailFormValues extends Omit<
  CenterMeetingDetailRequestDto,
  "branchId" | "collectionCenterId"
> {
  branchIds?: string[];
  collectionCenterId?: string;
}

export interface CenterMeetingDetailResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<CenterMeetingDetailFormValues> = yup
  .object({
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
    branchIds: yup.array().of(yup.string().required()).optional().default([]),
    collectionCenterId: yup.string().optional().default("-1"),
    meetingType: yup.string().optional().default(MEETING_TYPE_NEXT_MEETING),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const toRequest = (
  v: CenterMeetingDetailFormValues,
): CenterMeetingDetailRequestDto => {
  const selectedIds = (v.branchIds ?? []).map(String).filter(Boolean);
  return {
    fromDateBs: v.fromDateBs || undefined,
    toDateBs: v.toDateBs || undefined,
    branchId: selectedIds.length === 0 ? "-1" : selectedIds.join(","),
    collectionCenterId: v.collectionCenterId || "-1",
    meetingType: v.meetingType || MEETING_TYPE_NEXT_MEETING,
    visualReport: v.visualReport ?? false,
  };
};

function CenterMeetingDetailPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<CenterMeetingDetailResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<CenterMeetingDetailRequestDto | null>(null);

  const { control, handleSubmit, setValue, reset } =
    useForm<CenterMeetingDetailFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // Seed branchIds from session so CollectionCenterField can fetch this branch's centers.
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
    (request: CenterMeetingDetailRequestDto, format: string) =>
      loanService.api.centerMeetingDetailCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: CenterMeetingDetailRequestDto): Promise<void> => {
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
          "CenterMeetingDetailReport",
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

  const onSubmit: SubmitHandler<CenterMeetingDetailFormValues> = useCallback(
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
    <CenterMeetingDetailForm
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

export default CenterMeetingDetailPage;
