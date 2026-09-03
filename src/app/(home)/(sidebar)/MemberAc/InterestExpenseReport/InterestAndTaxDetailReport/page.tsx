"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import type {
  InterestAndTaxDetailRequestDto,
  MemberLookUpDtos,
  Pagination,
} from "types/api/api";
import InterestAndTaxDetailForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/InterestExpenseReport/InterestAndTaxDetailForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { useReportFormContext } from "@/contexts/ReportFormContext";

export type InterestAndTaxDetailFormValues = Omit<
  InterestAndTaxDetailRequestDto,
  "branchIds"
> & {
  branchIds?: string[];
};

export interface InterestAndTaxDetailResponseExtended {
  blobUrl?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<InterestAndTaxDetailFormValues> = yup
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
    branchName: yup.string().nullable().optional(),
    memberRegistrationId: yup.number().optional(),
    memberId: yup.string().nullable().optional(),
    memberName: yup.string().nullable().optional(),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function InterestAndTaxDetailPage() {
  const [reportState, setReportState] =
    useState<InterestAndTaxDetailResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<InterestAndTaxDetailRequestDto | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<InterestAndTaxDetailFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onSubmit",
    });

  const handleMemberSelect = useCallback(
    (member: MemberLookUpDtos) => {
      setValue("memberRegistrationId", member.memMemberRegistrationId, {
        shouldValidate: true,
      });
      setValue("memberId", member.memberId ?? "");
      setValue("memberName", member.memberName ?? "");
    },
    [setValue],
  );

  const toRequest = useCallback(
    (form: InterestAndTaxDetailFormValues): InterestAndTaxDetailRequestDto => {
      const selectedIds = (form.branchIds ?? []).map(String).filter(Boolean);
      const allIds = branchOptions
        .map((o) => String(o.id))
        .filter((id) => Number(id) > 0);
      const isAll =
        selectedIds.length === 0 || selectedIds.length === allIds.length;
      const resolvedIds = isAll ? allIds : selectedIds;

      const branchName = branchOptions
        .filter((o) => resolvedIds.includes(String(o.id)))
        .map((o) => o.name)
        .join(", ");

      return {
        fromDateBs: form.fromDateBs || undefined,
        toDateBs: form.toDateBs || undefined,
        branchIds: isAll ? "-1" : selectedIds.join(","),
        branchName: branchName || undefined,
        memberRegistrationId: form.memberRegistrationId || undefined,
        memberId: form.memberId || undefined,
        memberName: form.memberName || undefined,
        orderBy: form.orderBy || "",
        visualReport: form.visualReport ?? false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: InterestAndTaxDetailRequestDto, format: string) =>
      memberAccountService.api.interestAndTaxDetailCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: InterestAndTaxDetailRequestDto) => {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
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

        const blobUrl = URL.createObjectURL(responseToBlob(res.data, "PDF"));
        setLastRequest(request);
        setReportState({ isLoading: false, blobUrl, pagination });
      } catch {
        toast.error("Failed to load report.");
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
          "InterestAndTaxDetail",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Download failed.",
        );
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<InterestAndTaxDetailFormValues> = useCallback(
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
    <InterestAndTaxDetailForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onMemberSelect={handleMemberSelect}
    />
  );
}
