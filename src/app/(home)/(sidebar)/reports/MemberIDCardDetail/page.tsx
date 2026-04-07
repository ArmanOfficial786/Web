// "use client";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import { useEffect, useRef, useState } from "react";
// import * as yup from "yup";
// import { useLanguage } from "@/contexts/LanguageContext";
// import type { MemberIdCardRequest } from "../../../../../../types/api/api";
// import MemberIdCard, {
//   type FormInputs,
//   type ReportFormat,
//   type ReportState,
// } from "@/components/MemberIdCard";
// import { memberIdCardService } from "@/services/MemberIdCardService";
// import { branchService } from "@/services/BranchService";

// // ── Format map: UI label → API query param ────────────────────────────────────
// const FORMAT_MAP: Record<ReportFormat, string> = {
//   PDF: "PDF",
//   Word: "WORD",
//   Excel: "EXCEL",
//   Image: "PNG",
// };

// // ── Validation ────────────────────────────────────────────────────────────────
// const schema: yup.ObjectSchema<FormInputs> = yup.object({
//   memberId: yup.string().optional().default(""),
//   memberName: yup.string().optional().default(""),
//   fromDate: yup.string().required("From Date is required"),
//   tillDate: yup
//     .string()
//     .required("Till Date is required")
//     .test("bs-min", "Till Date cannot be before From Date", function (val) {
//       const { fromDate } = this.parent;
//       return !fromDate || !val || val >= fromDate;
//     }),
//   branchId: yup.mixed<number | string>().optional().default(0),
//   groupId: yup.mixed<number | string>().optional().default(0),
//   orderBy: yup.mixed<number | string>().optional().default(0),
// });

// const INITIAL_STATE: ReportState = {
//   currentPage: 1,
//   totalPages: 1,
//   totalRecord: 0,
//   pageSize: 15,
//   loading: false,
//   reportLoaded: false,
//   error: "",
//   pdfData: "",
// };

// // ── Page ──────────────────────────────────────────────────────────────────────
// function Page() {
//   const { t } = useLanguage();

//   const [reportState, setReportState] = useState<ReportState>(INITIAL_STATE);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [branchOptions, setBranchOptions] = useState<
//     { id: number; name: string }[]
//   >([{ id: 0, name: "-- Select --" }]);

//   // Exact payload from the last VIEW — export must send the same so backend cache key matches
//   const lastViewedPayload = useRef<MemberIdCardRequest | null>(null);

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

//   // ── Build base payload ────────────────────────────────────────────────────
//   const buildPayload = (): MemberIdCardRequest => {
//     const v = getValues();
//     return {
//       memberId: v.memberId || null,
//       fromDate: v.fromDate || null,
//       toDate: v.tillDate || null,
//       branchId: Number(v.branchId) || 0,
//       memberGroupId: Number(v.groupId) || 0,
//     };
//   };

//   // ── VIEW ──────────────────────────────────────────────────────────────────
//   const viewReport = async (
//     page = reportState.currentPage,
//     size = reportState.pageSize,
//   ) => {
//     setReportState((prev) => ({ ...prev, loading: true, error: "" }));
//     try {
//       const payload = buildPayload();
//       const result = await memberIdCardService.view(payload, page, size);

//       if (result.isView) {
//         lastViewedPayload.current = {
//           ...payload,
//           currentPage: page,
//           pageSize: size,
//         };

//         const p = result.report.pagination;
//         setReportState((prev) => ({
//           ...prev,
//           pdfData: result.report.pdfData ?? "",
//           reportLoaded: true,
//           currentPage: p?.currentPage ?? page,
//           totalPages: p?.totalPages ?? 1,
//           totalRecord: p?.totalRecord ?? 0,
//           pageSize: p?.pageSize ?? size,
//         }));
//         toast.success(`Page ${page} loaded successfully`);
//       }
//     } catch {
//       // Interceptor already toasted
//     } finally {
//       setReportState((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   // ── EXPORT ────────────────────────────────────────────────────────────────
//   const exportReport = async (format: string) => {
//     if (!lastViewedPayload.current) {
//       toast.warning("Please view the report before downloading.");
//       return;
//     }
//     setIsDownloading(true);
//     try {
//       await memberIdCardService.export(lastViewedPayload.current, format);
//       toast.success(`${format} downloaded successfully`);
//     } catch (err: unknown) {
//       toast.error(err instanceof Error ? err.message : "Download failed");
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   // ── Fetch branches on mount ───────────────────────────────────────────────
//   useEffect(() => {
//     branchService
//       .getAll()
//       .then((res) => {
//         const mapped = (res?.data ?? []).map((b) => ({
//           id: b.branchId ?? 0,
//           name: b.branchName ?? "",
//         }));
//         setBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//       })
//       .catch(() => {});
//   }, []);

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const onSubmit: SubmitHandler<FormInputs> = () => {
//     lastViewedPayload.current = null;
//     setReportState((prev) => ({
//       ...prev,
//       currentPage: 1,
//       reportLoaded: false,
//     }));
//     viewReport(1, reportState.pageSize);
//   };

//   const handlePageChange = (newPage: number) => {
//     const { currentPage, totalPages } = reportState;
//     if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage)
//       viewReport(newPage, reportState.pageSize);
//   };

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <MemberIdCard
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       branchOptions={branchOptions}
//       reportState={reportState}
//       onPageChange={handlePageChange}
//       onDownload={(format) => exportReport(FORMAT_MAP[format])}
//       isDownloading={isDownloading}
//       emptyText={t("clickGenerateReport")}
//     />
//   );
// }

// export default Page;

// "use client";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import { useEffect, useRef, useState } from "react";
// import * as yup from "yup";
// import { useLanguage } from "@/contexts/LanguageContext";
// import type { MemberIdCardRequest } from "../../../../../../types/api/api";
// import MemberIdCard, {
//   type FormInputs,
//   type ReportFormat,
//   type ReportState,
// } from "@/components/MemberIdCard";
// import { memberIdCardService } from "@/services/MemberIdCardService";
// import { branchService } from "@/services/BranchService";

// const FORMAT_MAP: Record<ReportFormat, string> = {
//   PDF: "PDF",
//   Word: "WORD",
//   Excel: "EXCEL",
//   Image: "PNG",
// };

// const schema: yup.ObjectSchema<FormInputs> = yup.object({
//   memberId: yup.string().optional().default(""),
//   memberName: yup.string().optional().default(""),
//   fromDate: yup.string().required("From Date is required"),
//   tillDate: yup
//     .string()
//     .required("Till Date is required")
//     .test("bs-min", "Till Date cannot be before From Date", function (val) {
//       const { fromDate } = this.parent;
//       return !fromDate || !val || val >= fromDate;
//     }),
//   branchId: yup.mixed<number | string>().optional().default(0),
//   groupId: yup.mixed<number | string>().optional().default(0),
//   orderBy: yup.mixed<number | string>().optional().default(0),
// });

// // ── ReportState no longer needs pdfData — PDF opens in new tab ───────────────
// const INITIAL_STATE: ReportState = {
//   currentPage: 1,
//   totalPages: 1,
//   totalRecord: 0,
//   pageSize: 15,
//   loading: false,
//   reportLoaded: false,
//   error: "",
//   pdfData: "", // unused — kept for type compatibility
// };

// function Page() {
//   const { t } = useLanguage();

//   const [reportState, setReportState] = useState<ReportState>(INITIAL_STATE);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [branchOptions, setBranchOptions] = useState<
//     { id: number; name: string }[]
//   >([{ id: 0, name: "-- Select --" }]);

//   // ✅ Exact payload from last VIEW — export MUST send same object
//   //    so backend cache key matches and DB is skipped
//   const lastViewedPayload = useRef<MemberIdCardRequest | null>(null);

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

//   const buildPayload = (): MemberIdCardRequest => {
//     const v = getValues();
//     return {
//       memberId: v.memberId || null,
//       fromDate: v.fromDate || null,
//       toDate: v.tillDate || null,
//       branchId: Number(v.branchId) || 0,
//       memberGroupId: Number(v.groupId) || 0,
//     };
//   };

//   // ── VIEW ──────────────────────────────────────────────────────────────────
//   // PDF opens in a new browser tab — same as old DevExpress ReportViewer
//   // User can print, zoom, or save as PDF from the native browser PDF viewer
//   const viewReport = async (
//     page = reportState.currentPage,
//     size = reportState.pageSize,
//   ) => {
//     setReportState((prev) => ({ ...prev, loading: true, error: "" }));
//     try {
//       const payload = buildPayload();
//       const result = await memberIdCardService.view(payload, page, size);

//       if (result.isView) {
//         // ✅ Cache exact payload — export MUST send this same object
//         lastViewedPayload.current = {
//           ...payload,
//           currentPage: page,
//           pageSize: size,
//         };

//         const p = result.pagination as any;
//         setReportState((prev) => ({
//           ...prev,
//           reportLoaded: true,
//           currentPage: p?.currentPage ?? page,
//           totalPages: p?.totalPages ?? 1,
//           totalRecord: p?.totalRecord ?? 0,
//           pageSize: p?.pageSize ?? size,
//         }));

//         // ✅ PDF is already open in new tab — toast confirms success
//         toast.success(`Report opened in new tab (page ${page})`);
//       }
//     } catch {
//       // Interceptor already toasted
//     } finally {
//       setReportState((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   // ── EXPORT ────────────────────────────────────────────────────────────────
//   const exportReport = async (format: string) => {
//     if (!lastViewedPayload.current) {
//       toast.warning("Please view the report before downloading.");
//       return;
//     }
//     setIsDownloading(true);
//     try {
//       const result = await memberIdCardService.export(
//         lastViewedPayload.current,
//         format,
//       );
//       if (!result.isView) {
//         toast.success(`${result.filename} downloaded successfully`);
//       }
//     } catch (err: unknown) {
//       toast.error(err instanceof Error ? err.message : "Download failed");
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   useEffect(() => {
//     branchService
//       .getAll()
//       .then((res) => {
//         const mapped = (res?.data ?? []).map((b) => ({
//           id: b.branchId ?? 0,
//           name: b.branchName ?? "",
//         }));
//         setBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//       })
//       .catch(() => {});
//   }, []);

//   const onSubmit: SubmitHandler<FormInputs> = () => {
//     lastViewedPayload.current = null;
//     setReportState((prev) => ({
//       ...prev,
//       currentPage: 1,
//       reportLoaded: false,
//     }));
//     viewReport(1, reportState.pageSize);
//   };

//   const handlePageChange = (newPage: number) => {
//     const { currentPage, totalPages } = reportState;
//     if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage)
//       viewReport(newPage, reportState.pageSize);
//   };

//   return (
//     <MemberIdCard
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       branchOptions={branchOptions}
//       reportState={reportState}
//       onPageChange={handlePageChange}
//       onDownload={(format) => exportReport(FORMAT_MAP[format])}
//       isDownloading={isDownloading}
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

const FORMAT_MAP: Record<ReportFormat, string> = {
  PDF: "PDF",
  Word: "WORD",
  Excel: "EXCEL",
  Image: "PNG",
};

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

function Page() {
  const { t } = useLanguage();

  const [reportState, setReportState] = useState<ReportState>(INITIAL_STATE);
  const [isDownloading, setIsDownloading] = useState(false);
  const [branchOptions, setBranchOptions] = useState<
    { id: number; name: string }[]
  >([{ id: 0, name: "-- Select --" }]);

  // Exact payload from last VIEW — export MUST send the same object
  // so the backend cache key matches and DB is skipped
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
  // PDF is decoded to base64 and rendered inline inside PdfSlideViewer
  const viewReport = async (
    page = reportState.currentPage,
    size = reportState.pageSize,
  ) => {
    setReportState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const payload = buildPayload();
      const result = await memberIdCardService.view(payload, page, size);

      if (result.isView) {
        // Cache exact payload — export MUST send this same object
        lastViewedPayload.current = {
          ...payload,
          currentPage: page,
          pageSize: size,
        };

        const p = result.pagination as any;
        setReportState((prev) => ({
          ...prev,
          reportLoaded: true,
          pdfData: result.pdfData, // ← base64 PDF for PdfSlideViewer
          currentPage: p?.currentPage ?? page,
          totalPages: p?.totalPages ?? 1,
          totalRecord: p?.totalRecord ?? 0,
          pageSize: p?.pageSize ?? size,
        }));

        toast.success(`Report loaded (page ${page})`);
      }
    } catch {
      // Interceptor already toasted
    } finally {
      setReportState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ── EXPORT ────────────────────────────────────────────────────────────────
  // Result opens in a new browser tab (PDF/Word/Excel/Image)
  const exportReport = async (format: string) => {
    if (!lastViewedPayload.current) {
      toast.warning("Please view the report before exporting.");
      return;
    }
    setIsDownloading(true);
    try {
      const result = await memberIdCardService.export(
        lastViewedPayload.current,
        format,
      );
      if (!result.isView) {
        toast.success(`${result.filename} opened in new tab`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsDownloading(false);
    }
  };

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

  const onSubmit: SubmitHandler<FormInputs> = () => {
    lastViewedPayload.current = null;
    setReportState((prev) => ({
      ...prev,
      currentPage: 1,
      reportLoaded: false,
      pdfData: "",
    }));
    viewReport(1, reportState.pageSize);
  };

  const handlePageChange = (newPage: number) => {
    const { currentPage, totalPages } = reportState;
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage)
      viewReport(newPage, reportState.pageSize);
  };

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
