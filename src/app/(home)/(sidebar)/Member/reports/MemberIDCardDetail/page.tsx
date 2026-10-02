"use client";

import MemberIdCard from "@/components/reports/memberReport/MemberIdCard";
import memberService from "@/services/member/memberService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  DefaultPagination,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { MemberIdCardRequest, Pagination } from "types/api/api";
import * as yup from "yup";

export interface MemberIdCardFormValues extends MemberIdCardRequest {
  memberName?: string;
}

export interface MemberIdCardResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const schema: yup.ObjectSchema<MemberIdCardFormValues> = yup.object({
  memberId: yup.string().nullable().optional().default(null),
  memberName: yup.string().optional().default(""),
  fromDate: yup.string().required("From Date is required").default(""),
  toDate: yup
    .string()
    .required("To Date is required")
    .default(null)
    .test("bs-min", "Till Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    }),
  orderby: yup.string().nullable().optional().default(""),
  branchId: yup.number().required("Branch ID is required").default(2),
  memberGroupId: yup.number().optional().default(-1),
  currentPage: yup.number().optional().default(1),
  pageSize: yup.number().optional().default(10),
});

const toRequest = (v: MemberIdCardFormValues): MemberIdCardRequest => ({
  memberId: v.memberId || null,
  fromDate: v.fromDate || null,
  toDate: v.toDate || null,
  branchId: Number(v.branchId) || 0,
  memberGroupId: Number(v.memberGroupId) || -1,
  orderby: v.orderby || "",
  currentPage: 1,
  pageSize: v.pageSize ?? 10,
});

function Page(): React.ReactElement {
  const [reportState, setReportState] = useState<MemberIdCardResponseExtended>({
    isLoading: false,
  });
  const [lastRequest, setLastRequest] = useState<MemberIdCardRequest | null>(
    null,
  );

  const { control, handleSubmit, setValue, reset, getValues } =
    useForm<MemberIdCardFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const callApi = useCallback(
    (request: MemberIdCardRequest, format: string) =>
      memberService.api.memberIdCardMemberIdCardCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MemberIdCardRequest): Promise<void> => {
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
        reset({ ...getValues(), memberId: "", memberName: "" });
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [callApi, reset, getValues],
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
          "MemberIdCard",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<MemberIdCardFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
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

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <MemberIdCard
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

export default Page;
