// import React from "react";
// import MemberIdCard from "@/components/MemberIdCard";

// function page() {
//   return <MemberIdCard />;
// }

// export default page;

"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState } from "react";
import * as yup from "yup";
import { useLanguage } from "@/contexts/LanguageContext";
import { Api, type MemberIdCardRequest } from "../../../../../../types/api/api";
import MemberIdCard, {
  type FormInputs,
  type ReportFormat,
  type ReportState,
} from "@/components/MemberIdCard";

// ── API client ────────────────────────────────────────────────────────────────
const apiClient = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
});

// ── Validation schema ─────────────────────────────────────────────────────────
const schema: yup.ObjectSchema<FormInputs> = yup.object({
  memberId: yup.string().optional().default(""),
  memberName: yup.string().optional().default(""),
  fromDate: yup.string().required("From Date is required"),
  tillDate: yup
    .string()
    .required("Till Date is required")
    .test("bs-min", "Till Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      if (!fromDate || !val) return true;
      return val >= fromDate;
    }),
  branchId: yup.mixed<number | string>().optional().default(0),
  groupId: yup.mixed<number | string>().optional().default(0),
  orderBy: yup.mixed<number | string>().optional().default(0),
});

// ── Page ──────────────────────────────────────────────────────────────────────
function Page() {
  const { t } = useLanguage();

  // ── Report state ────────────────────────────────────────────────────────
  const [reportState, setReportState] = useState<ReportState>({
    currentPage: 1,
    totalPages: 1,
    totalRecord: 0,
    pageSize: 15,
    loading: false,
    reportLoaded: false,
    error: "",
    searchText: "",
    showDownloadMenu: false,
    pdfData: "",
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ── Form ────────────────────────────────────────────────────────────────
  const { control, handleSubmit, getValues } = useForm<FormInputs>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      memberId: "",
      memberName: "",
      fromDate: "2082-12-19",
      tillDate: "2082-12-22",
      branchId: 0,
      groupId: 0,
      orderBy: 0,
    },
  });

  // ── Generate / download ─────────────────────────────────────────────────
  const generateReport = async (
    format?: string,
    page: number = reportState.currentPage,
    size: number = reportState.pageSize,
  ) => {
    setReportState((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const values = getValues();

      const requestBody: MemberIdCardRequest = {
        memberId: values.memberId || null,
        fromDate: values.fromDate || null,
        toDate: values.tillDate || null,
        branchId: Number(values.branchId) || 0,
        memberGroupId: Number(values.groupId) || 0,
        currentPage: page,
        pageSize: size,
      };

      const isView = !format || format.toUpperCase() === "VIEW";
      const apiFormat = isView ? "VIEW" : format!.toUpperCase();

      const response = await apiClient.api.memberIdCardMemberIdCardCreate(
        requestBody,
        { format: apiFormat },
      );

      // ── VIEW ────────────────────────────────────────────────────────
      if (isView) {
        const data = response.data as unknown as {
          success: boolean;
          pdfData: string;
          pagination: {
            currentPage: number;
            totalPages: number;
            totalRecord: number;
            pageSize: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
          };
        };

        if (!data?.success) {
          setReportState((prev) => ({
            ...prev,
            error: "Report generation failed on server",
          }));
          return;
        }
        if (!data?.pdfData) {
          setReportState((prev) => ({
            ...prev,
            error: "No content in response",
          }));
          return;
        }

        const p = data.pagination;
        setReportState((prev) => ({
          ...prev,
          pdfData: data.pdfData,
          reportLoaded: true,
          currentPage: p?.currentPage || page,
          totalPages: p?.totalPages || 1,
          totalRecord: p?.totalRecord ?? 0,
          pageSize: p?.pageSize || size,
          hasNextPage: p?.hasNextPage ?? false,
          hasPreviousPage: p?.hasPreviousPage ?? false,
        }));

        toast.success(`Page ${page} loaded successfully`);
        return;
      }

      // ── DOWNLOAD ────────────────────────────────────────────────────
      const raw = response.data as unknown;
      const blob =
        raw instanceof Blob
          ? raw
          : new Blob([raw as any], { type: "application/octet-stream" });

      const extMap: Record<string, string> = {
        PDF: "pdf",
        WORD: "docx",
        DOCX: "docx",
        XLSX: "xlsx",
        EXCEL: "xlsx",
        PNG: "png",
        IMAGE: "png",
      };

      const ext = extMap[apiFormat] ?? apiFormat.toLowerCase();
      const filename = `MemberIdCard_${values.fromDate}_to_${values.tillDate}.${ext}`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${apiFormat} downloaded successfully`);
    } catch (err: any) {
      console.error("Generate report error:", err);
      setReportState((prev) => ({
        ...prev,
        error: err.message || "Failed to generate report",
      }));
    } finally {
      setReportState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<FormInputs> = () => {
    setReportState((prev) => ({ ...prev, currentPage: 1 }));
    generateReport(undefined, 1, reportState.pageSize);
  };

  const handleDownload = async (format: ReportFormat) => {
    setReportState((prev) => ({ ...prev, showDownloadMenu: false }));
    const formatMap: Record<ReportFormat, string> = {
      PDF: "PDF",
      Word: "WORD",
      Excel: "XLSX",
      Image: "PNG",
    };
    await generateReport(formatMap[format]);
  };

  const handlePageChange = (newPage: number) => {
    const { currentPage, totalPages } = reportState;
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage)
      generateReport(undefined, newPage, reportState.pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setReportState((prev) => ({ ...prev, pageSize: newSize, currentPage: 1 }));
    generateReport(undefined, 1, newSize);
  };

  return (
    <MemberIdCard
      // form
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      // report state
      reportState={reportState}
      // navigation handlers
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onSearchTextChange={(text) =>
        setReportState((prev) => ({ ...prev, searchText: text }))
      }
      onToggleDownloadMenu={() =>
        setReportState((prev) => ({
          ...prev,
          showDownloadMenu: !prev.showDownloadMenu,
        }))
      }
      onDownload={handleDownload}
      onPrint={() => window.print()}
      // i18n
      emptyText={t("clickGenerateReport")}
    />
  );
}

export default Page;
