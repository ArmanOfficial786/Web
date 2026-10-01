"use client";

import TellerWiseCollectionForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/TellerWiseCollectionForm";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Pagination, TellerWiseCollectionRequestDto } from "types/api/api";
import * as yup from "yup";

export interface TellerWiseCollectionFormValues extends Omit<
  TellerWiseCollectionRequestDto,
  "tellerId"
> {
  tellerId?: number;
}

export interface TellerWiseCollectionResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DATE_REQUIRED_MESSAGE = "Please select date to get Teller Name";
const TELLER_REQUIRED_MESSAGE = "Select Date for TellerName";

const schema: yup.ObjectSchema<TellerWiseCollectionFormValues> = yup
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
    tellerId: yup
      .number()
      .optional()
      .required(TELLER_REQUIRED_MESSAGE)
      .test(
        "teller-selected",
        TELLER_REQUIRED_MESSAGE,
        (val) => typeof val === "number" && val >= 0,
      )
      .default(-1),
    orderBy: yup.string().nullable().optional().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function TellerWiseCollectionPage() {
  const [reportState, setReportState] =
    useState<TellerWiseCollectionResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<TellerWiseCollectionRequestDto | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TellerWiseCollectionFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
    mode: "onSubmit",
  });

  const toRequest = useCallback(
    (form: TellerWiseCollectionFormValues): TellerWiseCollectionRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      tellerId: form.tellerId || undefined,
      orderBy: form.orderBy || "",
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: TellerWiseCollectionRequestDto, format: string) =>
      memberAccountService.api.tellerWiseCollectionCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: TellerWiseCollectionRequestDto) => {
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
      } catch (err) {
        setReportState({ isLoading: false });
        throw err;
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
        "TellerWiseCollection",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<TellerWiseCollectionFormValues> = useCallback(
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
    <TellerWiseCollectionForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      errors={errors}
    />
  );
}
