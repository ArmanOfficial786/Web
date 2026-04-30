// "use client";

// import { useReportForm } from "@/contexts/ReportFormContext";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import { useRef, useState, useCallback } from "react";
// import * as yup from "yup";
// import { useLanguage } from "@/contexts/LanguageContext";
// import type { MemberIdCardRequest } from "../../../../../../types/api/api";
// import MemberIdCard, {
//   type FormInputs,
//   //type ReportState,
// } from "@/components/reports/memberReport/MemberIdCard";
// import {
//   memberIdCardService,
//   triggerDownload,
// } from "@/services/MemberIdCardService";
// import {
//   ExportFormat,
//   InitialReportState,
//   ReportState,
// } from "@/utilis/Constants/reportConstants";

// // ── Validation schema ─────────────────────────────────────────────────────────

// const schema: yup.ObjectSchema<FormInputs> = yup.object({
//   memberId: yup.string().optional().default(""),
//   memberName: yup.string().optional().default(""),
//   fromDate: yup.string().optional().default(""),
//   tillDate: yup
//     .string()
//     .optional()
//     .default("")
//     .test("bs-min", "Till Date cannot be before From Date", function (val) {
//       const { fromDate } = this.parent;
//       return !fromDate || !val || val >= fromDate;
//     }),
//   branchId: yup.mixed<number | string>().optional().default(0),
//   collectionCenterId: yup.mixed<number | string>().optional().default(0),
//   groupId: yup.mixed<number | string>().optional().default(0),
//   orderBy: yup.mixed<number | string>().optional().default(0),
// });

// // ── Page ──────────────────────────────────────────────────────────────────────

// function Page(): React.ReactElement {
//   const { t } = useLanguage();
//   const { resetFormFields, setSelectedMember } = useReportForm();

//   const [reportState, setReportState] =
//     useState<ReportState>(InitialReportState);
//   const [isDownloading, setIsDownloading] = useState<boolean>(false);

//   // Mirrors reportState into a ref — keeps useCallback deps stable
//   const reportStateRef = useRef<ReportState>(InitialReportState);
//   reportStateRef.current = reportState;

//   // Caches the last viewed payload so export always matches viewed report
//   const lastViewedPayload = useRef<MemberIdCardRequest | null>(null);

//   const { control, handleSubmit, getValues, setValue, reset } =
//     useForm<FormInputs>({
//       resolver: yupResolver(schema) as any,
//       defaultValues: {
//         memberId: "",
//         memberName: "",
//         fromDate: "",
//         tillDate: "",
//         branchId: 0,
//         collectionCenterId: 0,
//         groupId: 0,
//         orderBy: 0,
//       },
//     });

//   // ── Build payload from form values ────────────────────────────────────────

//   const buildPayload = useCallback((): MemberIdCardRequest => {
//     const v = getValues();
//     return {
//       memberId: v.memberId || null,
//       fromDate: v.fromDate || null,
//       toDate: v.tillDate || null,
//       branchId: Number(v.branchId) || 0,
//       memberGroupId: Number(v.groupId) || 0,
//       orderby: v.orderBy && v.orderBy !== 0 ? String(v.orderBy) : null,
//     };
//   }, [getValues]);

//   // ── Clear form ────────────────────────────────────────────────────────────

//   const clearForm = useCallback((): void => {
//     reset({
//       memberId: "",
//       memberName: "",
//       fromDate: "",
//       tillDate: "",
//       branchId: 0,
//       collectionCenterId: 0,
//       groupId: 0,
//       orderBy: 0,
//     });
//     resetFormFields();
//     setSelectedMember(null);
//   }, [reset, resetFormFields, setSelectedMember]);

//   // ── VIEW ──────────────────────────────────────────────────────────────────

//   const viewReport = useCallback(
//     async (
//       page: number = reportStateRef.current.currentPage,
//       size: number = reportStateRef.current.pageSize,
//     ): Promise<void> => {
//       setReportState((prev: any) => ({ ...prev, loading: true, error: "" }));
//       try {
//         const payload = buildPayload();
//         const result = await memberIdCardService.view(payload, page, size);

//         if (result.isView) {
//           lastViewedPayload.current = {
//             ...payload,
//             currentPage: page,
//             pageSize: size,
//           };

//           const p = result.pagination;
//           setReportState((prev: any) => ({
//             ...prev,
//             reportLoaded: true,
//             pdfData: result.pdfData ?? "",
//             currentPage: p?.currentPage ?? page,
//             totalPages: p?.totalPages ?? 1,
//             totalRecord: p?.totalRecord ?? 0,
//             pageSize: p?.pageSize ?? size,
//           }));

//           toast.success("Report generated successfully");
//           clearForm();
//         }
//       } catch {
//         // Interceptor already toasted the error
//       } finally {
//         setReportState((prev: any) => ({ ...prev, loading: false }));
//       }
//     },
//     [buildPayload, clearForm],
//   );

//   // ── EXPORT ────────────────────────────────────────────────────────────────

//   const exportReport = useCallback(async (format: string): Promise<void> => {
//     if (!lastViewedPayload.current) {
//       toast.warning("Please view the report before exporting.");
//       return;
//     }

//     // ── PDF: reuse cached base64 — zero extra API call ────────────────
//     if (format.toUpperCase() === "PDF") {
//       const base64 = reportStateRef.current.pdfData;
//       if (!base64) {
//         toast.warning("No report data available.");
//         return;
//       }
//       setIsDownloading(true);
//       try {
//         const binary = atob(base64);
//         const buffer = new ArrayBuffer(binary.length);
//         const bytes = new Uint8Array(buffer);
//         for (let i = 0; i < binary.length; i++) {
//           bytes[i] = binary.charCodeAt(i);
//         }
//         triggerDownload(buffer, "MemberIdCardReport.pdf");
//         toast.success("MemberIdCardReport.pdf downloaded");
//       } catch {
//         toast.error("Failed to download PDF.");
//       } finally {
//         setIsDownloading(false);
//       }
//       return;
//     }

//     // ── Word / Excel / Image: hit the server ──────────────────────────
//     setIsDownloading(true);
//     try {
//       const result = await memberIdCardService.export(
//         lastViewedPayload.current,
//         format,
//       );
//       if (!result.isView) {
//         toast.success(`${result.filename} downloaded`);
//       }
//     } catch {
//       // Interceptor already toasted the error
//     } finally {
//       setIsDownloading(false);
//     }
//   }, []);

//   // ── Form submit — resets to page 1 ────────────────────────────────────────

//   const onSubmit: SubmitHandler<FormInputs> = useCallback((): void => {
//     lastViewedPayload.current = null;
//     setReportState((prev: any) => ({
//       ...prev,
//       currentPage: 1,
//       reportLoaded: false,
//       pdfData: "",
//     }));
//     viewReport(1, reportStateRef.current.pageSize);
//   }, [viewReport]);

//   // ── Pagination ────────────────────────────────────────────────────────────

//   const handlePageChange = useCallback(
//     (newPage: number): void => {
//       const { currentPage, totalPages } = reportStateRef.current;
//       if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
//         viewReport(newPage, reportStateRef.current.pageSize);
//       }
//     },
//     [viewReport],
//   );

//   // ── Download (called from ReportNavigation) ───────────────────────────────

//   const handleDownload = useCallback(
//     (format: keyof typeof ExportFormat): void => {
//       exportReport(ExportFormat[format]);
//     },
//     [exportReport],
//   );

//   // ── Render ────────────────────────────────────────────────────────────────

//   return (
//     <MemberIdCard
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       setValue={setValue}
//       reset={reset}
//       reportState={reportState}
//       onPageChange={handlePageChange}
//       onDownload={handleDownload}
//       isDownloading={isDownloading}
//       emptyText={t("clickGenerateReport")}
//     />
//   );
// }

// export default Page;

"use client";

import { useReportForm } from "@/contexts/ReportFormContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useCallback } from "react";
import * as yup from "yup";
import type { MemberIdCardRequest } from "../../../../../../types/api/api";
import MemberIdCard from "@/components/reports/memberReport/MemberIdCard";
import memberIdCardService from "@/services/MemberIdCardService";
import {
  InitialReportState,
  PaginationHeader,
  DefaultPagination,
  type ReportState,
  type ReportFormat, // ← import ReportFormat
} from "@/utilis/Constants/reportConstants";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";

// ── Extended form type — collectionCenterId is UI-only, not in API request ────
export interface MemberIdCardFormValues extends MemberIdCardRequest {
  collectionCenterId?: number;
  memberName?: string;
}

// ── Validation schema ─────────────────────────────────────────────────────────

const schema: yup.ObjectSchema<MemberIdCardFormValues> = yup.object({
  memberId: yup.string().nullable().optional().default(null),
  memberName: yup.string().optional().default(""), // ✅ UI-only
  fromDate: yup.string().nullable().optional().default(null),
  toDate: yup
    .string()
    .nullable()
    .optional()
    .default(null)
    .test("bs-min", "Till Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent;
      return !fromDate || !val || val >= fromDate;
    }),
  orderby: yup.string().nullable().optional().default(null),
  branchId: yup.number().optional().default(2),
  collectionCenterId: yup.number().optional().default(0),
  memberGroupId: yup.number().optional().default(0),
  currentPage: yup.number().optional().default(1),
  pageSize: yup.number().optional().default(10),
});
// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert FormInputs → API request shape */
const toRequest = (
  // ← return type narrowed
  v: MemberIdCardFormValues,
  page = 1,
  size = 10,
): MemberIdCardFormValues => ({
  memberId: v.memberId || null,
  fromDate: v.fromDate || null,
  toDate: v.toDate || null,
  branchId: Number(v.branchId) || 0,
  //collectionCenterId: Number(v.collectionCenterId) || 0,
  memberGroupId: Number(v.memberGroupId) || 0,
  orderby: v.orderby,
  currentPage: page,
  pageSize: size,
});

// ── Page ──────────────────────────────────────────────────────────────────────

function Page(): React.ReactElement {
  const { resetFormFields, setSelectedMember } = useReportForm();

  const [reportState, setReportState] =
    useState<ReportState>(InitialReportState);
  const [lastRequest, setLastRequest] = useState<MemberIdCardRequest | null>(
    null,
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberIdCardFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── Clear form ────────────────────────────────────────────────────────────

  const clearForm = useCallback((): void => {
    reset({
      memberId: "",
      memberName: "",
      fromDate: "",
      toDate: "",
      branchId: 0,
      collectionCenterId: 0,
      memberGroupId: 0,
      orderby: "",
    });
    resetFormFields();
    setSelectedMember(null);
  }, [reset, resetFormFields, setSelectedMember]);

  // ── Single API call shared by VIEW + EXPORT ───────────────────────────────

  const callApi = useCallback(
    (request: MemberIdCardRequest, format: string) =>
      memberIdCardService.api.memberIdCardMemberIdCardCreate(request, {
        format,
      }),
    [],
  );

  // ── VIEW (also used for page-change) ─────────────────────────────────────

  const fetchReport = useCallback(
    async (request: MemberIdCardRequest): Promise<void> => {
      setReportState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const res = await callApi(request, "VIEW");

        const rawHeader =
          (res.headers as Record<string, string>)?.[PaginationHeader] ?? "";
        const pagination = (() => {
          try {
            return rawHeader ? JSON.parse(rawHeader) : DefaultPagination;
          } catch {
            return DefaultPagination;
          }
        })();

        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);

        setReportState((prev) => ({
          ...prev,
          reportLoaded: true,
          pdfData,
          currentPage: pagination?.currentPage ?? request.currentPage ?? 1,
          totalPages: pagination?.totalPages ?? 1,
          totalRecord: pagination?.totalRecord ?? 0,
          pageSize: pagination?.pageSize ?? request.pageSize ?? 10,
        }));
        toast.success("Report generated successfully");
        clearForm();
      } catch {
        // Error toast handled by the interceptor
      } finally {
        setReportState((prev) => ({ ...prev, loading: false }));
      }
    },
    [callApi, clearForm],
  );

  // ── EXPORT ────────────────────────────────────────────────────────────────

  const handleDownload = useCallback(
    async (format: string): Promise<void> => {
      if (!lastRequest) {
        toast.warning("Please view the report before exporting.");
        return;
      }
      setIsDownloading(true);
      try {
        const upperFormat = format.toUpperCase() as ReportFormat; // ← cast once
        const res = await callApi(lastRequest, upperFormat);
        const blob = responseToBlob(res.data, upperFormat); // ← typed
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        // ↓ all 3 required args: response, format, fallbackName
        link.download = extractFilenameFromResponse(
          res,
          upperFormat,
          "MemberIdCard",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`${link.download} downloaded`);
      } catch {
        toast.error("Failed to download file.");
      } finally {
        setIsDownloading(false);
      }
    },
    [callApi, lastRequest],
  );

  // ── Form submit — resets to page 1 ───────────────────────────────────────

  const onSubmit: SubmitHandler<MemberIdCardRequest> = useCallback(
    (formData) => {
      const request = toRequest(formData, 1, reportState.pageSize ?? 10);
      fetchReport(request); // ← now MemberIdCardRequest, not unknown
    },
    [fetchReport, reportState.pageSize],
  );

  // ── Pagination ────────────────────────────────────────────────────────────

  const handlePageChange = useCallback(
    (newPage: number): void => {
      if (!lastRequest) return;
      const { currentPage, totalPages } = reportState;
      if (newPage < 1 || newPage > totalPages || newPage === currentPage)
        return;

      fetchReport({
        ...lastRequest,
        currentPage: newPage,
      });
    },
    [fetchReport, lastRequest, reportState],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <MemberIdCard
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      isDownloading={isDownloading}
    />
  );
}

export default Page;
