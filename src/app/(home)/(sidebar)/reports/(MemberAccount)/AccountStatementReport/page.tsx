// "use client";

// import React, { useCallback, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import accountStatementService from "@/services/AccountStatementService";
// import type { AccountStatementRequest } from "types/api/api";
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

// const schema: yup.ObjectSchema<AccountStatementRequest> = yup
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
//     useState<AccountStatementRequest | null>(null);
//   const { branchOptions } = useReportFormContext();

//   // const toRequest = useCallback(
//   //   (form: AccountStatementRequest): AccountStatementRequest => {
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
//     (form: AccountStatementRequest): AccountStatementRequest => {
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
//     useForm<AccountStatementRequest>({
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     });

//   const callApi = useCallback(
//     (request: AccountStatementRequest, format: string) =>
//       accountStatementService.api.accountStatementAccountStatementReportCreate(
//         request,
//         { format },
//       ),
//     [],
//   );

//   const fetchReport = useCallback(
//     async (request: AccountStatementRequest) => {
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

//   const onSubmit: SubmitHandler<AccountStatementRequest> = useCallback(
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

import accountStatementService from "@/services/AccountStatementService";
import type { AccountStatementRequest } from "types/api/api";
import AccountStatement, {
  type ReportFormat,
} from "@/components/reports/memberAccount/AccountStatement";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { toast } from "react-toastify";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  InitialReportState,
  type ReportState,
} from "@/utilis/Constants/reportConstants";
import { useReportFormContext } from "@/contexts/ReportFormContext";

const schema: yup.ObjectSchema<AccountStatementRequest> = yup
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
    branchId: yup
      .array()
      .of(yup.number().required())
      .nullable()
      .optional()
      .default([]),
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
    orderBy: yup.string().nullable().default("0"),
  })
  .required();

export default function AccountStatementPage() {
  const [reportState, setReportState] =
    useState<ReportState>(InitialReportState);
  const [lastRequest, setLastRequest] =
    useState<AccountStatementRequest | null>(null);
  const { branchOptions } = useReportFormContext();

  // ── Convert pdfData → blob URL once when pdfData changes ─────────────────
  // blob URL supports #page=N — base64 data URLs do NOT
  useEffect(() => {
    const raw = reportState.pdfData;

    if (!raw) {
      setReportState((prev) => {
        if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
        return { ...prev, blobUrl: "" };
      });
      return;
    }

    let newBlobUrl = "";
    try {
      const binary = atob(raw);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      newBlobUrl = URL.createObjectURL(blob);
    } catch {
      toast.error("Failed to render PDF.");
      return;
    }

    setReportState((prev) => {
      // Revoke old blob URL to free memory
      if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
      return { ...prev, blobUrl: newBlobUrl };
    });

    // Cleanup on unmount
    return () => URL.revokeObjectURL(newBlobUrl);
  }, [reportState.pdfData]);

  const { control, handleSubmit, setValue, reset } =
    useForm<AccountStatementRequest>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: AccountStatementRequest): AccountStatementRequest => {
      const selectedIds = (form.branchId ?? [])
        .map(Number)
        .filter((id) => id > 0);
      const allIds = branchOptions
        .map((o) => Number(o.id))
        .filter((id) => id > 0);
      const isAll = selectedIds.length === 0;
      const resolvedIds = isAll ? allIds : selectedIds;
      const branchSelected = isAll ? "-1" : selectedIds.join(",");
      const branchName = branchOptions
        .filter((o) => resolvedIds.includes(Number(o.id)))
        .map((o) => o.name)
        .join(", ");

      return {
        fromDate: form.fromDate || undefined,
        toDate: form.toDate || undefined,
        branchSelected,
        branchName: branchName || undefined,
        sameCompanyName: form.sameCompanyName,
        reportType: form.reportType || undefined,
        transactionType: form.transactionType || undefined,
        orderBy: form.orderBy || "-1",
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

  // ── Fetch — only called on form submit ───────────────────────────────────
  const fetchReport = useCallback(
    async (request: AccountStatementRequest) => {
      setReportState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const res = await callApi(request, "VIEW");
        if (res.data?.isValid) {
          setLastRequest(request);
          setReportState((prev) => ({
            ...prev,
            loading: false,
            reportLoaded: true,
            pdfData: res.data.data?.pdfData ?? "", // triggers blobUrl useEffect
            totalPages: res.data.data?.pagination?.totalPages ?? 1,
            totalRecord: res.data.data?.pagination?.totalRecord ?? 0,
            currentPage: 1, // always reset to page 1
          }));
        } else {
          setReportState((prev) => ({
            ...prev,
            loading: false,
            error: res.data?.message ?? "Failed to load report.",
          }));
        }
      } catch {
        setReportState((prev) => ({
          ...prev,
          loading: false,
          error: "An unexpected error occurred.",
        }));
      }
    },
    [callApi],
  );

  // ── Page change — NO API CALL — just update currentPage in state ─────────
  // The iframe src uses blobUrl#page=N so it navigates instantly in the browser
  const handlePageChange = useCallback((newPage: number) => {
    setReportState((prev) => {
      const clamped = Math.max(1, Math.min(newPage, prev.totalPages));
      if (clamped === prev.currentPage) return prev; // nothing changed
      return { ...prev, currentPage: clamped };
    });
  }, []);

  // ── Download — uses cached response from backend, no re-render ───────────
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
          "AccountStatement",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error(
          `Download failed: ${error instanceof Error ? error.message : "Failed to download report."}`,
        );
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<AccountStatementRequest> = useCallback(
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
