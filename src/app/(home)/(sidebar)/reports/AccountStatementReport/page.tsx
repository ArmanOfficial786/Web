// "use client";

// import React, { useCallback, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import accountStatementService from "@/services/AccountStatementService";
// import type { AccountStatementRequest } from "types/api/api";
// import AccountStatement, {
//   type ReportFormat,
// } from "@/components/reports/accountReport/AccountStatement";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { toast } from "react-toastify";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
// import {
//   InitialReportState,
//   ReportState,
// } from "@/utilis/Constants/reportConstants";

// // ── Schema typed to FormInputs (not AccountStatementRequest) ─────────────────
// const schema: yup.ObjectSchema<AccountStatementRequest> = yup.object({
//   fromDate: yup.string().default(""),
//   toDate: yup
//     .string()
//     .default("")
//     .test("date-order", "Till Date cannot be before From Date", function (val) {
//       const { fromDate } = this.parent;
//       return !fromDate || !val || val >= fromDate;
//     }),
//   branchId: yup.mixed<any>().default([]),
//   orderBy: yup.mixed<number | string>().default(0),
//   reportType: yup.string().default("Summary"),
//   transactionType: yup.string().default("All"),
//   branchSelected: yup.string().optional().default(undefined),
//   branchName: yup.string().optional().default(undefined),
// });

// // ── Mapper: FormInputs → AccountStatementRequest ──────────────────────────────

// // Converts form layer types to exact API contract types.
// // branchId etc. are string|number in form (MUI Select) → number in API.
// // const toRequest = (form: AccountStatementRequest): AccountStatementRequest => ({
// //   // branchId from multi-select comes as array e.g. [1, 2, 3]

// //   fromDate: form.fromDate || undefined,
// //   toDate: form.toDate || undefined, // API uses toDate
// //   branchId: branchIds[0] ?? undefined,
// //   branchSelected: branchIds.join(",") || undefined,
// //   branchName: undefined, // populated server-side
// //   reportType: String(form.reportType) || undefined,
// //   transactionType: String(form.transactionType) || undefined,
// //   orderBy: String(form.orderBy) || undefined,
// // });

// const toRequest = (form: AccountStatementRequest): AccountStatementRequest => {
//   // ✅ branchIds must be INSIDE toRequest — it depends on form parameter
//   const branchIds = Array.isArray(form.branchId)
//     ? (form.branchId as (number | string)[]).map(Number).filter(Boolean)
//     : form.branchId
//       ? [Number(form.branchId)]
//       : [];

//   return {
//     fromDate: form.fromDate || undefined,
//     toDate: form.toDate || undefined,
//     branchId: branchIds[0] ?? undefined, // ✅ first selected id
//     branchSelected: branchIds.join(",") || undefined, // ✅ "1,2,3" for API
//     branchName: undefined, // populated server-side
//     reportType: String(form.reportType) || undefined,
//     transactionType: String(form.transactionType) || undefined,
//     orderBy: String(form.orderBy) || undefined,
//   };
// };

// // ── Page ──────────────────────────────────────────────────────────────────────
// export default function AccountStatementPage() {
//   const [reportState, setReportState] =
//     useState<ReportState>(InitialReportState);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [lastRequest, setLastRequest] =
//     useState<AccountStatementRequest | null>(null);

//   const { control, handleSubmit, setValue, reset } =
//     useForm<AccountStatementRequest>({
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     });

//   // ── Single API call shared by VIEW + EXPORT ────────────────────────────────
//   const callApi = useCallback(
//     (request: AccountStatementRequest, format: string) =>
//       accountStatementService.api.accountStatementAccountStatementReportCreate(
//         request,
//         { format },
//       ),
//     [],
//   );

//   // ── VIEW ───────────────────────────────────────────────────────────────────
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

//   // ── EXPORT (server hits cache — no extra DB call) ──────────────────────────
//   const handleDownload = useCallback(
//     async (format: ReportFormat) => {
//       if (!lastRequest) return;

//       setIsDownloading(true);
//       try {
//         const res = await callApi(lastRequest, format);
//         const blob = responseToBlob(res.data, format);
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         let filename = extractFilenameFromResponse(
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
//           `Download failed: ${error instanceof Error ? error.message : "Failed to download report."}`,
//         );
//       } finally {
//         setIsDownloading(false);
//       }
//     },
//     [callApi, lastRequest],
//   );

//   // ── Handlers ───────────────────────────────────────────────────────────────
//   const onSubmit: SubmitHandler<AccountStatementRequest> = useCallback(
//     (formData) => fetchReport(toRequest(formData)), // ✅ mapped here
//     [fetchReport],
//   );

//   const handlePageChange = useCallback(
//     (newPage: number) => {
//       if (lastRequest) fetchReport({ ...lastRequest }); // page not in API type
//     },
//     [fetchReport, lastRequest],
//   );

//   // ── Render ─────────────────────────────────────────────────────────────────
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
//       isDownloading={isDownloading}
//     />
//   );
// }

"use client";

import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import accountStatementService from "@/services/AccountStatementService";
import type { AccountStatementRequest } from "types/api/api";
import AccountStatement, {
  type ReportFormat,
} from "@/components/reports/accountReport/AccountStatement";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { toast } from "react-toastify";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import {
  InitialReportState,
  type ReportState,
} from "@/utilis/Constants/reportConstants";
import { useReportForm } from "@/contexts/ReportFormContext";



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
      .required("Branch/Office is required")
      .min(1, "At least one branch/office is required")
      .typeError("Branch/Office must be an array")
      .default([]),
    branchSelected: yup.string().nullable().optional(),
    branchName: yup.string().nullable().optional(),
    sameCompanyName: yup.boolean().optional(),
    reportType: yup
      .string()
      .nullable()
      .optional()
      .typeError("Report Type must be a string"),
    transactionType: yup
      .string()
      .nullable()
      .optional()
      .typeError("Transaction Type must be a string"),
    orderBy: yup
      .string()
      .nullable()
      .optional()
      .typeError("Order By must be a string"),
  })
  .required();

export default function AccountStatementPage() {
  const [reportState, setReportState] =
    useState<ReportState>(InitialReportState);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastRequest, setLastRequest] =
    useState<AccountStatementRequest | null>(null);
  const { branchOptions } = useReportForm();

  const toRequest = useCallback(
    (form: AccountStatementRequest): AccountStatementRequest => {
      // Build numeric branch id array from form multi-select value
      const rawIds = Array.isArray(form.branchId)
        ? (form.branchId as (number | string)[]).map(Number)
        : form.branchId
          ? [Number(form.branchId)]
          : [];

      const specificIds = rawIds.filter((id) => id > 0);
      const isAll = specificIds.length === 0;

      const allBranchIds = branchOptions
        .map((o) => Number(o.id))
        .filter((id) => id > 0);

      return {
        fromDate: form.fromDate ? String(form.fromDate) : undefined,
        toDate: form.toDate ? String(form.toDate) : undefined,
        branchId: isAll ? allBranchIds : specificIds, // number[] matches API type
        //branchSelected: isAll ? "-1" : specificIds.join(","),
        branchName: undefined, // populated server-side
        reportType: form.reportType ? String(form.reportType) : undefined,
        transactionType: form.transactionType
          ? String(form.transactionType)
          : undefined,
        orderBy: form.orderBy ? String(form.orderBy) : undefined,
      };
    },
    [branchOptions],
  );

  const { control, handleSubmit, setValue, reset, formState } =
    useForm<AccountStatementRequest>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
      mode: "onBlur",
    });

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
      setReportState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const res = await callApi(request, "VIEW");
        if (res.data?.isValid) {
          setLastRequest(request);
          setReportState((prev) => ({
            ...prev,
            loading: false,
            reportLoaded: true,
            pdfData: res.data.data?.pdfData ?? "",
            totalPages: res.data.data?.pagination?.totalPages ?? 1,
            totalRecord: res.data.data?.pagination?.totalRecord ?? 0,
            currentPage: res.data.data?.pagination?.currentPage ?? 1,
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

  const handleDownload = useCallback(
    async (format: ReportFormat) => {
      if (!lastRequest) {
        toast.warning("Please view the report before exporting.");
        return;
      }
      setIsDownloading(true);
      try {
        const res = await callApi(lastRequest, format);
        const blob = responseToBlob(res.data, format);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const filename = extractFilenameFromResponse(
          res,
          format,
          "AccountStatement",
        );
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        toast.error(
          `Download failed: ${
            error instanceof Error
              ? error.message
              : "Failed to download report."
          }`,
        );
      } finally {
        setIsDownloading(false);
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<AccountStatementRequest> = useCallback(
    (formData) => {
      console.log("RAW formData:", JSON.stringify(formData, null, 2));
      fetchReport(toRequest(formData));
    },
    [fetchReport, toRequest],
  );

  const handlePageChange = useCallback(
    (_newPage: number) => {
      if (lastRequest) fetchReport({ ...lastRequest });
    },
    [fetchReport, lastRequest],
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
      isDownloading={isDownloading}
      formState={formState}
    />
  );
}
