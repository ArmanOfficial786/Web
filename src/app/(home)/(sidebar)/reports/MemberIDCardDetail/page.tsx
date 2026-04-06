// // import React from "react";
// // import MemberIdCard from "@/components/MemberIdCard";

// // function page() {
// //   return <MemberIdCard />;
// // }

// // export default page;

// "use client";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import { useEffect, useState } from "react";
// import * as yup from "yup";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { Api, ReportResponseDtosGeneralResponse, type MemberIdCardRequest } from "../../../../../../types/api/api";
// import MemberIdCard, {
//   type FormInputs,
//   type ReportFormat,
//   type ReportState,
// } from "@/components/MemberIdCard";
// import { branchService } from "@/services/BranchService";

// // ── API client ────────────────────────────────────────────────────────────────
// const apiClient = new Api({
//   baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
// });

// // ── Validation schema ─────────────────────────────────────────────────────────
// const schema: yup.ObjectSchema<FormInputs> = yup.object({
//   memberId: yup.string().optional().default(""),
//   memberName: yup.string().optional().default(""),
//   fromDate: yup.string().required("From Date is required"),
//   tillDate: yup
//     .string()
//     .required("Till Date is required")
//     .test("bs-min", "Till Date cannot be before From Date", function (val) {
//       const { fromDate } = this.parent;
//       if (!fromDate || !val) return true;
//       return val >= fromDate;
//     }),
//   branchId: yup.mixed<number | string>().optional().default(0),
//   groupId: yup.mixed<number | string>().optional().default(0),
//   orderBy: yup.mixed<number | string>().optional().default(0),
// });

// // ── Page ──────────────────────────────────────────────────────────────────────
// function Page() {
//   const { t } = useLanguage();

//   // ── Report state ────────────────────────────────────────────────────────
//   const [reportState, setReportState] = useState<ReportState>({
//     currentPage: 1,
//     totalPages: 1,
//     totalRecord: 0,
//     pageSize: 15,
//     loading: false,
//     reportLoaded: false,
//     error: "",
//     searchText: "",
//     showDownloadMenu: false,
//     pdfData: "",
//     hasNextPage: false,
//     hasPreviousPage: false,
//   });
//   const [branchOptions, setBranchOptions] = useState<
//     { id: number; name: string }[]
//   >([]);

//   // ── Form ────────────────────────────────────────────────────────────────
//   const { control, handleSubmit, getValues } = useForm<FormInputs>({
//     resolver: yupResolver(schema) as any,
//     defaultValues: {
//       memberId: "",
//       memberName: "",
//       fromDate: "2082-12-19",
//       tillDate: "2082-12-22",
//       branchId: 0,
//       groupId: 0,
//       orderBy: 0,
//     },
//   });

//   // ── Generate / download ─────────────────────────────────────────────────
//   const generateReport = async (
//     format?: string,
//     page: number = reportState.currentPage,
//     size: number = reportState.pageSize,
//   ) => {
//     setReportState((prev) => ({ ...prev, loading: true, error: "" }));

//     try {
//       const values = getValues();

//       const requestBody: MemberIdCardRequest = {
//         memberId: values.memberId || null,
//         fromDate: values.fromDate || null,
//         toDate: values.tillDate || null,
//         branchId: Number(values.branchId) || 0,
//         memberGroupId: Number(values.groupId) || 0,
//         currentPage: page,
//         pageSize: size,
//       };

//       const isView = !format || format.toUpperCase() === "VIEW";
//       const apiFormat = isView ? "VIEW" : format!.toUpperCase();

//       const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//         requestBody,
//         { format: apiFormat },
//       );

//       // ── VIEW ────────────────────────────────────────────────────────
//       // if (isView) {
//       //   const res = response.data as unknown as {
//       //     isValid: boolean;
//       //     success: boolean;
//       //     pdfData: string;
//       //     pagination: {
//       //       currentPage: number;
//       //       totalPages: number;
//       //       totalRecord: number;
//       //       pageSize: number;
//       //       hasNextPage: boolean;
//       //       hasPreviousPage: boolean;
//       //     };
//       //   };

//       const res = response.data as ReportResponseDtosGeneralResponse;

//       if(res.isValid === false || res.statusCode !== 200)
//         {
//           setReportState((prev) => ({
//             ...prev,
//             error: res.message || "Report generation failed",
//           }));
//           return;
//         }

//         const p = res.data?.pagination;
//         setReportState((prev) => ({
//           ...prev,
//           pdfData: res.data?.pdfData || "",
//           reportLoaded: true,
//           currentPage: p?.currentPage || page,
//           totalPages: p?.totalPages || 1,
//           totalRecord: p?.totalRecord ?? 0,
//           pageSize: p?.pageSize || size,
//           hasNextPage: p?.hasNextPage ?? false,
//           hasPreviousPage: p?.hasPreviousPage ?? false,
//         }));

//         toast.success(`Page ${page} loaded successfully`);
//         return;
//       }

//       // ── DOWNLOAD ────────────────────────────────────────────────────
//       const raw = response.data as unknown;
//       const blob =
//         raw instanceof Blob
//           ? raw
//           : new Blob([raw as any], { type: "application/octet-stream" });

//       const extMap: Record<string, string> = {
//         PDF: "pdf",
//         WORD: "docx",
//         DOCX: "docx",
//         XLSX: "xlsx",
//         EXCEL: "xlsx",
//         PNG: "png",
//         IMAGE: "png",
//       };

//       const ext = extMap[apiFormat] ?? apiFormat.toLowerCase();
//       const filename = `MemberIdCard_${values.fromDate}_to_${values.tillDate}.${ext}`;
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       toast.success(`${apiFormat} downloaded successfully`);
//     } catch (err: any) {
//       console.error("Generate report error:", err);
//       setReportState((prev) => ({
//         ...prev,
//         error: err.message || "Failed to generate report",
//       }));
//     } finally {
//       setReportState((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await branchService.getAll();
//         const branches = response?.data ?? [];

//         const mapped = branches.map((b) => ({
//           id: b.branchId ?? 0,
//           name: b.branchName ?? "",
//         }));

//         setBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//       } catch (err) {
//         console.error("Branch fetch error", err);
//         toast.error("Failed to load branches");
//       }
//     };

//     fetchBranches();
//   }, []);

//   // ── Handlers ────────────────────────────────────────────────────────────
//   const onSubmit: SubmitHandler<FormInputs> = () => {
//     setReportState((prev) => ({ ...prev, currentPage: 1 }));
//     generateReport(undefined, 1, reportState.pageSize);
//   };

//   const handleDownload = async (format: ReportFormat) => {
//     setReportState((prev) => ({ ...prev, showDownloadMenu: false }));
//     const formatMap: Record<ReportFormat, string> = {
//       PDF: "PDF",
//       Word: "WORD",
//       Excel: "XLSX",
//       Image: "PNG",
//     };
//     await generateReport(formatMap[format]);
//   };

//   const handlePageChange = (newPage: number) => {
//     const { currentPage, totalPages } = reportState;
//     if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage)
//       generateReport(undefined, newPage, reportState.pageSize);
//   };

//   const handlePageSizeChange = (newSize: number) => {
//     setReportState((prev) => ({ ...prev, pageSize: newSize, currentPage: 1 }));
//     generateReport(undefined, 1, newSize);
//   };

//   return (
//     <MemberIdCard
//       // form
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       // report state
//       reportState={reportState}
//       // navigation handlers
//       onPageChange={handlePageChange}
//       onPageSizeChange={handlePageSizeChange}
//       onSearchTextChange={(text) =>
//         setReportState((prev) => ({ ...prev, searchText: text }))
//       }
//       onToggleDownloadMenu={() =>
//         setReportState((prev) => ({
//           ...prev,
//           showDownloadMenu: !prev.showDownloadMenu,
//         }))
//       }
//       onDownload={handleDownload}
//       onPrint={() => window.print()}
//       // i18n
//       emptyText={t("clickGenerateReport")}
//     />
//   );
// }

// export default Page;

// "use client";

// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import { useEffect, useState } from "react";
// import * as yup from "yup";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { type MemberIdCardRequest } from "../../../../../../types/api/api";
// import MemberIdCard, {
//   type FormInputs,
//   type ReportFormat,
//   type ReportState,
// } from "@/components/MemberIdCard";
// import { memberIdCardService } from "@/services/MemberIdCardService";
// import { triggerFileDownload } from "@/utilis/reportUtils";

// // ── Validation schema ─────────────────────────────────────────────────────────
// const schema: yup.ObjectSchema<FormInputs> = yup.object({
//   memberId: yup.string().optional().default(""),
//   memberName: yup.string().optional().default(""),
//   fromDate: yup.string().required("From Date is required"),
//   tillDate: yup
//     .string()
//     .required("Till Date is required")
//     .test("bs-min", "Till Date cannot be before From Date", function (val) {
//       const { fromDate } = this.parent;
//       if (!fromDate || !val) return true;
//       return val >= fromDate;
//     }),
//   branchId: yup.mixed<number | string>().optional().default(0),
//   groupId: yup.mixed<number | string>().optional().default(0),
//   orderBy: yup.mixed<number | string>().optional().default(0),
// });

// // ── Format map (UI label → API format string) ─────────────────────────────────
// const FORMAT_MAP: Record<ReportFormat, string> = {
//   PDF: "PDF",
//   Word: "WORD",
//   Excel: "XLSX",
//   Image: "PNG",
// };

// // ── Page ──────────────────────────────────────────────────────────────────────
// function Page() {
//   const { t } = useLanguage();

//   const [reportState, setReportState] = useState<ReportState>({
//     currentPage: 1,
//     totalPages: 1,
//     totalRecord: 0,
//     pageSize: 15,
//     loading: false,
//     reportLoaded: false,
//     error: "",
//     searchText: "",
//     showDownloadMenu: false,
//     pdfData: "",
//     hasNextPage: false,
//     hasPreviousPage: false,
//   });

//   const { control, handleSubmit, getValues } = useForm<FormInputs>({
//     resolver: yupResolver(schema) as any,
//     defaultValues: {
//       memberId: "",
//       memberName: "",
//       fromDate: "2082-12-19",
//       tillDate: "2082-12-22",
//       branchId: 0,
//       groupId: 0,
//       orderBy: 0,
//     },
//   });

//   const generateReport = async (
//     format = "VIEW",
//     page = reportState.currentPage,
//     size = reportState.pageSize,
//   ) => {
//     setReportState((prev) => ({ ...prev, loading: true }));

//     try {
//       const values = getValues();

//       const payload: MemberIdCardRequest = {
//         memberId: values.memberId || null,
//         fromDate: values.fromDate || null,
//         toDate: values.tillDate || null,
//         branchId: Number(values.branchId) || 0,
//         memberGroupId: Number(values.groupId) || 0,
//         currentPage: page,
//         pageSize: size,
//       };

//       const result = await memberIdCardService.getReport(payload, format);

//       if (result.isView) {
//         const p = result.report.pagination;
//         setReportState((prev) => ({
//           ...prev,
//           pdfData: result.report.pdfData ?? "",
//           reportLoaded: true,
//           currentPage: p?.currentPage ?? page,
//           totalPages: p?.totalPages ?? 1,
//           totalRecord: p?.totalRecord ?? 0,
//           pageSize: p?.pageSize ?? size,
//           hasNextPage: p?.hasNextPage ?? false,
//           hasPreviousPage: p?.hasPreviousPage ?? false,
//         }));
//         toast.success(`Page ${page} loaded successfully`);
//         return;
//       }

//       // ✅ interceptor already toasted any error — just trigger download
//       triggerFileDownload(result.blob, result.filename);
//       toast.success(`${format} downloaded successfully`);
//     } catch {
//       // ✅ interceptor already showed the toast — nothing to do here
//     } finally {
//       setReportState((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   const onSubmit: SubmitHandler<FormInputs> = () => {
//     setReportState((prev) => ({ ...prev, currentPage: 1 }));
//     generateReport("VIEW", 1, reportState.pageSize);
//   };

//   const handleDownload = async (format: ReportFormat) => {
//     setReportState((prev) => ({ ...prev, showDownloadMenu: false }));
//     await generateReport(FORMAT_MAP[format]);
//   };

//   const handlePageChange = (newPage: number) => {
//     const { currentPage, totalPages } = reportState;
//     if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage)
//       generateReport("VIEW", newPage, reportState.pageSize);
//   };

//   const handlePageSizeChange = (newSize: number) => {
//     setReportState((prev) => ({ ...prev, pageSize: newSize, currentPage: 1 }));
//     generateReport("VIEW", 1, newSize);
//   };

//   return (
//     <MemberIdCard
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       reportState={reportState}
//       onPageChange={handlePageChange}
//       onPageSizeChange={handlePageSizeChange}
//       onSearchTextChange={(text) =>
//         setReportState((prev) => ({ ...prev, searchText: text }))
//       }
//       onToggleDownloadMenu={() =>
//         setReportState((prev) => ({
//           ...prev,
//           showDownloadMenu: !prev.showDownloadMenu,
//         }))
//       }
//       onDownload={handleDownload}
//       onPrint={() => window.print()}
//       emptyText={t("clickGenerateReport")}
//     />
//   );
// }

// export default Page;
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MemberIdCardRequest } from "../../../../../../types/api/api";
import MemberIdCard, {
  type FormInputs,
  type ReportFormat,
  type ReportState,
} from "@/components/MemberIdCard";
import { memberIdCardService } from "@/services/MemberIdCardService";
import { branchService } from "@/services/BranchService";

// ── Format map: UI label → API query param ────────────────────────────────────
const FORMAT_MAP: Record<ReportFormat, string> = {
  PDF: "PDF",
  Word: "WORD",
  Excel: "XLSX",
  Image: "PNG",
};

// ── Validation ────────────────────────────────────────────────────────────────
const schema: yup.ObjectSchema<FormInputs> = yup.object({
  memberId: yup.string().optional().default(""),
  memberName: yup.string().optional().default(""),
  fromDate: yup.string().required("From Date is required"),
  tillDate: yup
    .string()
    .required("Till Date is required")
    .test("bs-min", "Till Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    }),
  branchId: yup.mixed<number | string>().optional().default(0),
  groupId: yup.mixed<number | string>().optional().default(0),
  orderBy: yup.mixed<number | string>().optional().default(0),
});

const INITIAL_STATE: ReportState = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 15,
  loading: false,
  reportLoaded: false,
  error: "",
  pdfData: "",
};

// ── Page ──────────────────────────────────────────────────────────────────────
function Page() {
  const { t } = useLanguage();

  const [reportState, setReportState] = useState<ReportState>(INITIAL_STATE);
  const [isDownloading, setIsDownloading] = useState(false);
  const [branchOptions, setBranchOptions] = useState<
    { id: number; name: string }[]
  >([{ id: 0, name: "-- Select --" }]);

  // Exact payload from the last VIEW — export must send the same so backend cache key matches
  const lastViewedPayload = useRef<MemberIdCardRequest | null>(null);

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

  // ── Build base payload ────────────────────────────────────────────────────
  const buildPayload = (): MemberIdCardRequest => {
    const v = getValues();
    return {
      memberId: v.memberId || null,
      fromDate: v.fromDate || null,
      toDate: v.tillDate || null,
      branchId: Number(v.branchId) || 0,
      memberGroupId: Number(v.groupId) || 0,
    };
  };

  // ── VIEW ──────────────────────────────────────────────────────────────────
  const viewReport = async (
    page = reportState.currentPage,
    size = reportState.pageSize,
  ) => {
    setReportState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const payload = buildPayload();
      const result = await memberIdCardService.view(payload, page, size);

      if (result.isView) {
        lastViewedPayload.current = {
          ...payload,
          currentPage: page,
          pageSize: size,
        };

        const p = result.report.pagination;
        setReportState((prev) => ({
          ...prev,
          pdfData: result.report.pdfData ?? "",
          reportLoaded: true,
          currentPage: p?.currentPage ?? page,
          totalPages: p?.totalPages ?? 1,
          totalRecord: p?.totalRecord ?? 0,
          pageSize: p?.pageSize ?? size,
        }));
        toast.success(`Page ${page} loaded successfully`);
      }
    } catch {
      // Interceptor already toasted
    } finally {
      setReportState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ── EXPORT ────────────────────────────────────────────────────────────────
  const exportReport = async (format: string) => {
    if (!lastViewedPayload.current) {
      toast.warning("Please view the report before downloading.");
      return;
    }
    setIsDownloading(true);
    try {
      await memberIdCardService.export(lastViewedPayload.current, format);
      toast.success(`${format} downloaded successfully`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Fetch branches on mount ───────────────────────────────────────────────
  useEffect(() => {
    branchService
      .getAll()
      .then((res) => {
        const mapped = (res?.data ?? []).map((b) => ({
          id: b.branchId ?? 0,
          name: b.branchName ?? "",
        }));
        setBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
      })
      .catch(() => {});
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<FormInputs> = () => {
    lastViewedPayload.current = null;
    setReportState((prev) => ({
      ...prev,
      currentPage: 1,
      reportLoaded: false,
    }));
    viewReport(1, reportState.pageSize);
  };

  const handlePageChange = (newPage: number) => {
    const { currentPage, totalPages } = reportState;
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage)
      viewReport(newPage, reportState.pageSize);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <MemberIdCard
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      branchOptions={branchOptions}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={(format) => exportReport(FORMAT_MAP[format])}
      isDownloading={isDownloading}
      emptyText={t("clickGenerateReport")}
    />
  );
}

export default Page;
