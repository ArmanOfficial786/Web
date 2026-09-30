// "use client";

// import { yupResolver } from "@hookform/resolvers/yup";
// import React, { useCallback, useEffect, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { toast } from "react-toastify";
// import type { OfficeProgressRequest, Pagination } from "types/api/api";
// import * as yup from "yup";

// import OfficeProgressForm from "@/components/reports/microFinance/otherReports/OfficeProgressForm";
// import microFinanceService from "@/services/MicroFinance/microFinanceService";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
// import {
//   DefaultPagination,
//   ReportFormat,
// } from "@/utilis/Constants/reportConstants";

// // ⚠️ Guessed wire values — confirm against backend
// const REPORT_TYPE_OFFICE_PROGRESS = "OfficeProgress";

// // tillDateAd / branchName are UI-only (BOTH_BS derived + bound display)
// export interface OfficeProgressFormValues extends Omit<
//   OfficeProgressRequest,
//   "tillDate" | "branchId"
// > {
//   tillDateBs?: string; // BS primary → wire `tillDate`
//   tillDateAd?: string; // AD derived, UI-only
//   branchId?: string; // singular — matches BranchNameField
//   branchName?: string; // UI-only, bound by BranchNameField
// }

// export interface OfficeProgressResponseExtended {
//   pdfData?: string;
//   isLoading: boolean;
//   pagination?: Pagination;
// }

// const DATE_REQUIRED_MESSAGE = "Please select date";

// const schema: yup.ObjectSchema<OfficeProgressFormValues> = yup
//   .object({
//     tillDateBs: yup
//       .string()
//       .nullable()
//       .optional()
//       .required(DATE_REQUIRED_MESSAGE),
//     tillDateAd: yup.string().optional().default(""),
//     branchId: yup.string().optional().default("-1"),
//     branchName: yup.string().optional().default(""),
//     reportType: yup.string().optional().default(REPORT_TYPE_OFFICE_PROGRESS),
//     enable1to30Days: yup.boolean().optional().default(false),
//     provisionType: yup.string().optional().default(""),
//     groupByBranch: yup.boolean().optional().default(false),
//     groupByCollectionCenter: yup.boolean().optional().default(false),
//     viewDetail: yup.boolean().optional().default(false),
//     sameCompanyName: yup.boolean().optional().default(false),
//     visualReport: yup.boolean().optional().default(false),
//   })
//   .required();

// const toRequest = (v: OfficeProgressFormValues): OfficeProgressRequest => ({
//   tillDate: v.tillDateBs || undefined,
//   branchId: v.branchId || "-1",
//   branchName: v.branchName || undefined,
//   reportType: v.reportType || REPORT_TYPE_OFFICE_PROGRESS,
//   enable1to30Days: v.enable1to30Days ?? false,
//   provisionType: v.provisionType || undefined,
//   groupByBranch: v.groupByBranch ?? false,
//   groupByCollectionCenter: v.groupByCollectionCenter ?? false,
//   viewDetail: v.viewDetail ?? false,
//   sameCompanyName: v.sameCompanyName ?? false,
//   visualReport: v.visualReport ?? false,
//   // tillDateAd is UI-only — never sent
// });

// function OfficeProgressPage(): React.ReactElement {
//   const [reportState, setReportState] =
//     useState<OfficeProgressResponseExtended>({ isLoading: false });
//   const [lastRequest, setLastRequest] = useState<OfficeProgressRequest | null>(
//     null,
//   );

//   const { control, handleSubmit, setValue, reset } =
//     useForm<OfficeProgressFormValues>({
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     });

//   const callApi = useCallback(
//     (request: OfficeProgressRequest, format: string) =>
//       microFinanceService.api.officeProgressGenerateReportCreate(request, {
//         format,
//       }),
//     [],
//   );

//   const fetchReport = useCallback(
//     async (request: OfficeProgressRequest): Promise<void> => {
//       setReportState((prev) => {
//         if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
//         return { isLoading: true };
//       });
//       try {
//         const res = await callApi(request, "VIEW");

//         const raw =
//           (res.headers as Record<string, string>)["x-pagination"] ?? "";
//         const pagination: Pagination = (() => {
//           try {
//             return raw ? (JSON.parse(raw) as Pagination) : DefaultPagination;
//           } catch {
//             return DefaultPagination;
//           }
//         })();

//         const blob = responseToBlob(res.data, "PDF");
//         const pdfData = URL.createObjectURL(blob);

//         setLastRequest(request);
//         setReportState({ isLoading: false, pdfData, pagination });
//       } catch {
//         setReportState((prev) => ({ ...prev, isLoading: false }));
//         toast.error("Failed to generate report.");
//       }
//     },
//     [callApi],
//   );

//   const handleDownload = useCallback(
//     async (format: ReportFormat): Promise<void> => {
//       if (!lastRequest) {
//         toast.warning("Please view the report before exporting.");
//         return;
//       }
//       try {
//         const res = await callApi(lastRequest, format);
//         const blob = responseToBlob(res.data, format);
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = extractFilenameFromResponse(
//           res,
//           format,
//           "OfficeProgressReport",
//         );
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//       } catch {
//         toast.error("Failed to download file.");
//       }
//     },
//     [callApi, lastRequest],
//   );

//   const handlePageChange = useCallback((newPage: number) => {
//     setReportState((prev) => {
//       const total = prev.pagination?.totalPages ?? 1;
//       const clamped = Math.max(1, Math.min(newPage, total));
//       return {
//         ...prev,
//         pagination: { ...prev.pagination, currentPage: clamped },
//       };
//     });
//   }, []);

//   const onSubmit: SubmitHandler<OfficeProgressFormValues> = useCallback(
//     (formData) => fetchReport(toRequest(formData)),
//     [fetchReport],
//   );

//   useEffect(() => {
//     return () => {
//       setReportState((prev) => {
//         if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
//         return prev;
//       });
//     };
//   }, []);

//   return (
//     <OfficeProgressForm
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       setValue={setValue}
//       reset={reset}
//       reportState={reportState}
//       onPageChange={handlePageChange}
//       onDownload={handleDownload}
//     />
//   );
// }

// export default OfficeProgressPage;

function page() {
  return <div>present in account module</div>;
}

export default page;
