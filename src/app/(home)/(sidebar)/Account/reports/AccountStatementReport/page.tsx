// "use client";

// import React, { useCallback, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import accountStatementService from "@/services/AccountStatementService";
// import type { AccountStatementRequestExtended } from "types/api/api";
// import AccountStatement, {
//   type ReportFormat,
// } from "@/components/reports/memberAccount/AccountStatement";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { toast } from "react-toastify";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
// import {
//   InitialReportState,
//   type ReportState,
// } from "@/utilis/Constants/reportConstants";
// import { useReportFormContext } from "@/contexts/ReportFormContext";

// const schema: yup.ObjectSchema<AccountStatementRequestExtended> = yup
//   .object({
//     fromDate: yup
//       .string()
//       .required("From Date is required")
//       .nullable()
//       .optional()
//       .typeError("From Date must be a valid date"),
//     toDate: yup
//       .string()
//       .required("To Date is required")
//       .nullable()
//       .optional()
//       .typeError("To Date must be a valid date")
//       .test(
//         "date-order",
//         "Till Date cannot be before From Date",
//         function (val) {
//           const { fromDate } = this.parent as { fromDate: string | null };
//           if (!fromDate || !val) return true;
//           return String(val) >= String(fromDate);
//         },
//       ),
//     branchId: yup
//       .array()
//       .of(yup.number().required())
//       .nullable()
//       .optional()
//       .default([]),
//     branchSelected: yup.string().nullable().optional(),
//     branchName: yup.string().nullable().optional(),
//     sameCompanyName: yup.boolean().optional().default(true),
//     reportType: yup
//       .string()
//       .nullable()
//       .optional()
//       .typeError("Report Type must be a string")
//       .default("Summary"),
//     transactionType: yup
//       .string()
//       .nullable()
//       .optional()
//       .typeError("Transaction Type must be a string")
//       .default("All"),
//     orderBy: yup.string().nullable().default("0"),
//   })
//   .required();

// export default function AccountStatementPage() {
//   const [reportState, setReportState] =
//     useState<ReportState>(InitialReportState);
//   const [lastRequest, setLastRequest] =
//     useState<AccountStatementRequestExtended | null>(null);
//   const { branchOptions } = useReportFormContext();

//   // const toRequest = useCallback(
//   //   (form: AccountStatementRequestExtended): AccountStatementRequestExtended => {
//   //     // Build numeric branch id array from form multi-select value
//   //     const rawIds = Array.isArray(form.branchId)
//   //       ? (form.branchId as (number | string)[]).map(Number)
//   //       : form.branchId
//   //         ? [Number(form.branchId)]
//   //         : [];

//   //     const specificIds = rawIds.filter((id) => id > 0);
//   //     const isAll = specificIds.length === 0;

//   //     const allBranchIds = branchOptions
//   //       .map((o) => Number(o.id))
//   //       .filter((id) => id > 0);

//   //     // ── Derive branchName from selected IDs ───────────────────────────────
//   //     const resolvedIds = isAll ? allBranchIds : specificIds;
//   //     // ✅ branchName: individual names always sent for report subtitle row
//   //     const branchName = branchOptions
//   //       .filter((o) => resolvedIds.includes(Number(o.id)))
//   //       .map((o) => o.name)
//   //       .join(",");

//   //     const sameCompanyName = form.sameCompanyName ?? true;

//   //     return {
//   //       fromDate: form.fromDate ? String(form.fromDate) : undefined,
//   //       toDate: form.toDate ? String(form.toDate) : undefined,
//   //       branchId: isAll ? allBranchIds : specificIds, // number[] matches API type
//   //       branchSelected: isAll ? "-1" : specificIds.join(","), // ✅ always actual names — Razor decides display
//   //       branchName: branchName || undefined, // populated server-side
//   //       sameCompanyName: sameCompanyName, // ✅ Razor uses this to switch header
//   //       reportType: form.reportType ? String(form.reportType) : undefined,
//   //       transactionType: form.transactionType
//   //         ? String(form.transactionType)
//   //         : undefined,
//   //       orderBy: form.orderBy ? String(form.orderBy) : undefined,
//   //     };
//   //   },
//   //   [branchOptions],
//   // );

//   // Transform form data for API consumption (handles "all branches" logic)
//   const toRequest = useCallback(
//     (form: AccountStatementRequestExtended): AccountStatementRequestExtended => {
//       const selectedIds = (form.branchId ?? [])
//         .map(Number)
//         .filter((id) => id > 0);
//       const allIds = branchOptions
//         .map((o) => Number(o.id))
//         .filter((id) => id > 0);

//       const isAll = selectedIds.length === 0;
//       const resolvedIds = isAll ? allIds : selectedIds;

//       const branchSelected = isAll ? "-1" : selectedIds.join(",");
//       const branchName = branchOptions
//         .filter((o) => resolvedIds.includes(Number(o.id)))
//         .map((o) => o.name)
//         .join(", ");

//       return {
//         fromDate: form.fromDate || undefined,
//         toDate: form.toDate || undefined,
//         branchSelected,
//         branchName: branchName || undefined,
//         sameCompanyName: form.sameCompanyName,
//         reportType: form.reportType || undefined,
//         transactionType: form.transactionType || undefined,
//         orderBy: form.orderBy || "-1",
//         // branchId is not sent to the API; it's only used in the form
//       };
//     },
//     [branchOptions],
//   );

//   const { control, handleSubmit, setValue, reset } =
//     useForm<AccountStatementRequestExtended>({
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     });

//   const callApi = useCallback(
//     (request: AccountStatementRequestExtended, format: string) =>
//       accountStatementService.api.accountStatementAccountStatementReportCreate(
//         request,
//         { format },
//       ),
//     [],
//   );

//   const fetchReport = useCallback(
//     async (request: AccountStatementRequestExtended) => {
//       setReportState((prev) => ({ ...prev, loading: true, error: "" }));
//       try {
//         const res = await callApi(request, "VIEW");
//         if (res.data?.isValid) {
//           setLastRequest(request);
//           setReportState((prev) => ({
//             ...prev,
//             loading: false,
//             reportLoaded: true,
//             pdfData: res.data.data?.pdfData ?? "",
//             totalPages: res.data.data?.pagination?.totalPages ?? 1,
//             totalRecord: res.data.data?.pagination?.totalRecord ?? 0,
//             currentPage: res.data.data?.pagination?.currentPage ?? 1,
//           }));
//         } else {
//           setReportState((prev) => ({
//             ...prev,
//             loading: false,
//             error: res.data?.message ?? "Failed to load report.",
//           }));
//         }
//       } catch {
//         setReportState((prev) => ({
//           ...prev,
//           loading: false,
//           error: "An unexpected error occurred.",
//         }));
//       }
//     },
//     [callApi],
//   );

//   const handleDownload = useCallback(
//     async (format: ReportFormat) => {
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
//         const filename = extractFilenameFromResponse(
//           res,
//           format,
//           "AccountStatement",
//         );
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//       } catch (error) {
//         console.error("Download failed:", error);
//         toast.error(
//           `Download failed: ${
//             error instanceof Error
//               ? error.message
//               : "Failed to download report."
//           }`,
//         );
//       }
//     },
//     [callApi, lastRequest],
//   );

//   const onSubmit: SubmitHandler<AccountStatementRequestExtended> = useCallback(
//     (formData) => {
//       fetchReport(toRequest(formData));
//     },
//     [fetchReport, toRequest],
//   );

//   const handlePageChange = useCallback(
//     (_newPage: number) => {
//       if (lastRequest) fetchReport({ ...lastRequest });
//     },
//     [fetchReport, lastRequest],
//   );

//   return (
//     <AccountStatement
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

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import accountStatementService from "@/services/Account/AccountStatementService";
import type {
  AccountStatementRequest,
  ReportResponseDtos,
} from "types/api/api";
import AccountStatement, {
  type ReportFormat,
} from "@/components/reports/accountReport/AccountStatement";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { useReportFormContext } from "@/contexts/ReportFormContext";

// ── branchId is form-only — stripped before sending to API ──────────────────
export interface AccountStatementRequestExtended extends AccountStatementRequest {
  branchId?: number[];
}

// ── Extends generated ReportResponseDtos with 2 client-only fields ──────────
export interface AccountStatementResponseExtended extends ReportResponseDtos {
  blobUrl: string; // derived from pdfData — blob URL supports #page=N
  isLoading: boolean; // in-flight state — backend cannot provide this
}

const schema: yup.ObjectSchema<AccountStatementRequestExtended> = yup
  .object({
    fromDate: yup
      .string()
      .required("From Date is required")
      .nullable()
      .optional()
      .typeError("From Date must be a valid date"),
    toDate: yup
      .string()
      .required("To Date is required")
      .nullable()
      .optional()
      .typeError("To Date must be a valid date")
      .test(
        "date-order",
        "Till Date cannot be before From Date",
        function (val) {
          const { fromDate } = this.parent as { fromDate: string | null };
          if (!fromDate || !val) return true;
          return String(val) >= String(fromDate);
        },
      ),
    branchId: yup.array().of(yup.number().required()).optional().default([]),
    branchSelected: yup.string().nullable().optional(),
    branchName: yup.string().nullable().optional(),
    sameCompanyName: yup.boolean().optional().default(true),
    reportType: yup
      .string()
      .nullable()
      .optional()
      .typeError("Report Type must be a string")
      .default("Summary"),
    transactionType: yup
      .string()
      .nullable()
      .optional()
      .typeError("Transaction Type must be a string")
      .default("All"),
    orderBy: yup.string().nullable().default(""),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function AccountStatementPage() {
  const [reportState, setReportState] =
    useState<AccountStatementResponseExtended>({
      blobUrl: "",
      isLoading: false,
      // ReportResponseDtos fields (pdfData, reportName, pagination) start undefined
    });

  const [lastRequest, setLastRequest] =
    useState<AccountStatementRequest | null>(null);
  const { branchOptions } = useReportFormContext();

  // ── Derive blobUrl from pdfData ──────────────────────────────────────────
  useEffect(() => {
    const raw = reportState.pdfData;

    if (!raw) {
      setReportState((prev) => {
        if (!prev.blobUrl) return prev; // ✅ same reference = no re-render
        URL.revokeObjectURL(prev.blobUrl);
        return { ...prev, blobUrl: "" };
      });
      return;
    }

    let url = "";
    try {
      const binary = atob(raw);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    } catch {
      return;
    }

    setReportState((prev) => {
      if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
      return { ...prev, blobUrl: url };
    });

    return () => URL.revokeObjectURL(url);
  }, [reportState.pdfData]);

  const { control, handleSubmit, setValue, reset } =
    useForm<AccountStatementRequestExtended>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: AccountStatementRequestExtended): AccountStatementRequest => {
      const selectedIds = (form.branchId ?? [])
        .map(Number)
        .filter((id) => id > 0);
      const allIds = branchOptions
        .map((o) => Number(o.id))
        .filter((id) => id > 0);
      const isAll = selectedIds.length === 0;
      const resolvedIds = isAll ? allIds : selectedIds;

      return {
        fromDate: form.fromDate || undefined,
        toDate: form.toDate || undefined,
        branchSelected: isAll ? "-1" : selectedIds.join(","),
        branchName:
          branchOptions
            .filter((o) => resolvedIds.includes(Number(o.id)))
            .map((o) => o.name)
            .join(", ") || undefined,
        sameCompanyName: form.sameCompanyName,
        reportType: form.reportType || undefined,
        transactionType: form.transactionType || undefined,
        orderBy: form.orderBy || "",
        visualReport: form.visualReport || false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: AccountStatementRequest, format: string) =>
      accountStatementService.api.accountStatementAccountStatementReportCreate(
        request,
        { format },
      ),
    [],
  );

  const fetchReport = useCallback(
    async (request: AccountStatementRequest) => {
      setReportState((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await callApi(request, "VIEW");
        if (res.data?.isValid && res.data.data) {
          setLastRequest(request);
          setReportState((prev) => ({
            ...prev,
            ...res.data.data, // pdfData + reportName + pagination from backend
            isLoading: false,
          }));
        } else {
          toast.error(res.data?.message ?? "Failed to load report.");
          setReportState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        toast.error("An unexpected error occurred.");
        setReportState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [callApi],
  );

  // ── No API call — iframe navigates via blobUrl#page=N ───────────────────
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
          "AccountStatement",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
       
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<AccountStatementRequestExtended> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <AccountStatement
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

// AccountStatementPage.displayName = "AccountStatementPage";
// AccountStatementPage.whyDidYouRender = true;
