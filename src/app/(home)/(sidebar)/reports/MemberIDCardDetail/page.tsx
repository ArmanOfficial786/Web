// "use client";

// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import { useRef, useState } from "react";
// import * as yup from "yup";
// import { useLanguage } from "@/contexts/LanguageContext";
// import type { MemberIdCardRequest } from "../../../../../../types/api/api";
// import MemberIdCard, {
//   type FormInputs,
//   type ReportFormat,
//   type ReportState,
// } from "@/components/MemberIdCard";
// import { memberIdCardService } from "@/services/MemberIdCardService";

// // ── Format map ────────────────────────────────────────────────────────────────
// const FORMAT_MAP: Record<ReportFormat, string> = {
//   PDF: "PDF",
//   Word: "WORD",
//   Excel: "EXCEL",
//   Image: "PNG",
// };

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

//   // Cache exact payload so export always matches the last view request
//   const lastViewedPayload = useRef<MemberIdCardRequest | null>(null);

//   const { control, handleSubmit, getValues } = useForm<FormInputs>({
//     resolver: yupResolver(schema) as any,
//     defaultValues: {
//       memberId: "",
//       memberName: "",
//       fromDate: "",
//       tillDate: "",
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
//       orderBy: Number(v.orderBy) || 0,
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

//         const p = result.pagination as any;
//         setReportState((prev) => ({
//           ...prev,
//           reportLoaded: true,
//           pdfData: result.pdfData,
//           currentPage: p?.currentPage ?? page,
//           totalPages: p?.totalPages ?? 1,
//           totalRecord: p?.totalRecord ?? 0,
//           pageSize: p?.pageSize ?? size,
//         }));

//         toast.success(`Report loaded (page ${page})`);
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
//       toast.warning("Please view the report before exporting.");
//       return;
//     }
//     setIsDownloading(true);
//     try {
//       const result = await memberIdCardService.export(
//         lastViewedPayload.current,
//         format,
//       );
//       if (!result.isView) {
//         toast.success(`${result.filename} opened in new tab`);
//       }
//     } catch (err: unknown) {
//       toast.error(err instanceof Error ? err.message : "Export failed");
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const onSubmit: SubmitHandler<FormInputs> = () => {
//     lastViewedPayload.current = null;
//     setReportState((prev) => ({
//       ...prev,
//       currentPage: 1,
//       reportLoaded: false,
//       pdfData: "",
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
//       // branchOptions and orderByOptions are now read from context inside MemberIdCard
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
import { useRef, useState } from "react";
import * as yup from "yup";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MemberIdCardRequest } from "../../../../../../types/api/api";
import MemberIdCard, {
  type FormInputs,
  type ReportFormat,
  type ReportState,
} from "@/components/MemberIdCard";
import { memberIdCardService } from "@/services/MemberIdCardService";

// ── Format map ────────────────────────────────────────────────────────────────
const FORMAT_MAP: Record<ReportFormat, string> = {
  PDF: "PDF",
  Word: "WORD",
  Excel: "EXCEL",
  Image: "PNG",
};

// ── Validation schema ─────────────────────────────────────────────────────────
const schema: yup.ObjectSchema<FormInputs> = yup.object({
  memberId: yup.string().optional().default(""),
  memberName: yup.string().optional().default(""),
  fromDate: yup.string().optional().default(""),
  tillDate: yup
    .string()
    .optional()
    .default("")
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

  const lastViewedPayload = useRef<MemberIdCardRequest | null>(null);

  // ← destructure setValue so ViewReportButton can clear date fields
  const { control, handleSubmit, getValues, setValue } = useForm<FormInputs>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      memberId: "",
      memberName: "",
      fromDate: "",
      tillDate: "",
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
      orderBy: Number(v.orderBy) || 0,
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

        const p = result.pagination as any;
        setReportState((prev) => ({
          ...prev,
          reportLoaded: true,
          pdfData: result.pdfData,
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
      setValue={setValue} // ← passed through to ViewReportButton
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={(format) => exportReport(FORMAT_MAP[format])}
      isDownloading={isDownloading}
      emptyText={t("clickGenerateReport")}
    />
  );
}

export default Page;
