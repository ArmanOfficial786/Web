// // app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/MemberAccountDetailNoReport/page.tsx
// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import memberAccountDetailNoService from "@/services/memberAccount/MemberAccountDetailNoService";
// import type { MemberAccountDetailNoRequest, Pagination } from "types/api/api";
// import MemberAccountDetailNoForm, {
//   type ReportFormat,
// } from "@/components/reports/memberAccount/MemberAccountDetailNoForm";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
// import { useReportFormContext } from "@/contexts/ReportFormContext";

// // ── branchId (multi-select array) is form-only — resolved into branchIds
// // (comma string) on submit. savingTypeId/shareTypeId/loanTypeId are numbers
// // here (match DropDown option ids), converted to strings in toRequest(). ────
// export interface MemberAccountDetailNoFormValues extends Omit<
//   MemberAccountDetailNoRequest,
//   "branchIds" | "savingTypeId" | "shareTypeId" | "loanTypeId"
// > {
//   branchId?: number[];
//   savingTypeId?: number;
//   shareTypeId?: number;
//   loanTypeId?: number;
// }

// // ── Client-only response state (raw PDF blob + header pagination) ───────────
// export interface MemberAccountDetailNoResponseExtended {
//   pdfData?: string;
//   isLoading: boolean;
//   pagination?: Pagination;
// }

// const DEFAULT_PAGINATION: Pagination = {
//   currentPage: 1,
//   totalPages: 1,
//   totalRecord: 0,
//   pageSize: 1,
//   hasNextPage: false,
//   hasPreviousPage: false,
// };

// // ── Normalize BS date string to "yyyy/MM/dd" regardless of picker's separator ──
// function normalizeBsDate(value?: string | null): string | undefined {
//   if (!value) return undefined;
//   return value.replace(/-/g, "/");
// }

// const schema: yup.ObjectSchema<MemberAccountDetailNoFormValues> = yup
//   .object({
//     tillDate: yup
//       .string()
//       .required("Till Date is required")
//       .nullable()
//       .optional()
//       .typeError("Till Date must be a valid date")
//       .default(""),
//     branchId: yup.array().of(yup.number().required()).optional().default([]),
//     branchName: yup.string().nullable().optional().default("All"),
//     memberType: yup.string().optional().default("Active"), // ⚠️ placeholder — confirm real meaning/options
//     includeSaving: yup.boolean().optional().default(true),
//     includeShare: yup.boolean().optional().default(true),
//     includeLoan: yup.boolean().optional().default(true),
//     savingTypeId: yup.number().optional().default(0),
//     shareTypeId: yup.number().optional().default(0),
//     loanTypeId: yup.number().optional().default(0),
//     orderBy: yup.string().nullable().optional().default(""),
//     sameCompanyName: yup.boolean().optional().default(true),
//     visualReport: yup.boolean().optional().default(false),
//   })
//   .required();

// export default function MemberAccountDetailNoPage() {
//   const [reportState, setReportState] =
//     useState<MemberAccountDetailNoResponseExtended>({ isLoading: false });
//   const [lastRequest, setLastRequest] =
//     useState<MemberAccountDetailNoRequest | null>(null);
//   const { branchOptions } = useReportFormContext();

//   const { control, handleSubmit, setValue, reset } =
//     useForm<MemberAccountDetailNoFormValues>({
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     });

//   const toRequest = useCallback(
//     (form: MemberAccountDetailNoFormValues): MemberAccountDetailNoRequest => {
//       const selectedIds = (form.branchId ?? [])
//         .map(Number)
//         .filter((id) => id > 0);
//       const allIds = branchOptions
//         .map((o) => Number(o.id))
//         .filter((id) => id > 0);
//       const isAll = selectedIds.length === 0;
//       const resolvedIds = isAll ? allIds : selectedIds;

//       const branchName =
//         branchOptions
//           .filter((o) => resolvedIds.includes(Number(o.id)))
//           .map((o) => o.name)
//           .join(", ") || "All";

//       return {
//         tillDate: normalizeBsDate(form.tillDate),
//         branchIds: resolvedIds.join(","),
//         branchName,
//         memberType: form.memberType,
//         includeSaving: form.includeSaving ?? true,
//         includeShare: form.includeShare ?? true,
//         includeLoan: form.includeLoan ?? true,
//         savingTypeId:
//           form.includeSaving && form.savingTypeId
//             ? String(form.savingTypeId)
//             : undefined,
//         shareTypeId:
//           form.includeShare && form.shareTypeId
//             ? String(form.shareTypeId)
//             : undefined,
//         loanTypeId:
//           form.includeLoan && form.loanTypeId
//             ? String(form.loanTypeId)
//             : undefined,
//         orderBy: form.orderBy || "",
//         sameCompanyName: form.sameCompanyName ?? true,
//         visualReport: form.visualReport ?? false,
//       };
//     },
//     [branchOptions],
//   );

//   const callApi = useCallback(
//     (request: MemberAccountDetailNoRequest, format: string) =>
//       memberAccountDetailNoService.api.memberAccountDetailNoCreate(request, {
//         format,
//       }),
//     [],
//   );

//   const fetchReport = useCallback(
//     async (request: MemberAccountDetailNoRequest) => {
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
//             return raw ? (JSON.parse(raw) as Pagination) : DEFAULT_PAGINATION;
//           } catch {
//             return DEFAULT_PAGINATION;
//           }
//         })();

//         const blob = responseToBlob(res.data, "PDF");
//         const pdfData = URL.createObjectURL(blob);

//         setLastRequest(request);
//         setReportState({ isLoading: false, pdfData, pagination });
//       } catch (err) {
//         setReportState({ isLoading: false });
//         throw err;
//       }
//     },
//     [callApi],
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

//   const handleDownload = useCallback(
//     async (format: ReportFormat) => {
//       if (!lastRequest) return;

//       const res = await callApi(lastRequest, format);
//       const blob = responseToBlob(res.data, format);
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = extractFilenameFromResponse(
//         res,
//         format,
//         "MemberAccountDetailNo",
//       );
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     },
//     [callApi, lastRequest],
//   );

//   const onSubmit: SubmitHandler<MemberAccountDetailNoFormValues> = useCallback(
//     (formData) => fetchReport(toRequest(formData)),
//     [fetchReport, toRequest],
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
//     <MemberAccountDetailNoForm
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

// app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/MemberAccountDetailNoReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { MemberAccountDetailNoRequest, Pagination } from "types/api/api";
import MemberAccountDetailNoForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/SavingAccountWiseReports/MemberAccountDetailNoForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── branchId (multi-select array) is form-only. memberType is a form-only
// "Active"|"Inactive" radio (NOT the DTO's number) — converted to 1/0 in
// toRequest(). savingTypeId/shareTypeId/loanTypeId are numbers here (match
// DropDown option ids), converted to strings in toRequest(). ───────────────
export interface MemberAccountDetailNoFormValues extends Omit<
  MemberAccountDetailNoRequest,
  "branchIds" | "memberType" | "savingTypeId" | "shareTypeId" | "loanTypeId"
> {
  branchId?: number[];
  memberType?: "Active" | "Inactive";
  savingTypeId?: number;
  shareTypeId?: number;
  loanTypeId?: number;
}

// ── Client-only response state (raw PDF blob + header pagination) ───────────
export interface MemberAccountDetailNoResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

// ── Normalize BS date string to "yyyy/MM/dd" regardless of picker's separator ──
function normalizeBsDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value.replace(/-/g, "/");
}

const schema: yup.ObjectSchema<MemberAccountDetailNoFormValues> = yup
  .object({
    tillDate: yup
      .string()
      .required("Till Date is required")
      .nullable()
      .optional()
      .typeError("Till Date must be a valid date")
      .default(""),
    branchId: yup.array().of(yup.number().required()).optional().default([]),
    branchName: yup.string().nullable().optional().default("All"),
    memberType: yup
      .mixed<"Active" | "Inactive">()
      .oneOf(["Active", "Inactive"])
      .optional()
      .default("Active"),
    includeSaving: yup.boolean().optional().default(true),
    includeShare: yup.boolean().optional().default(true),
    includeLoan: yup.boolean().optional().default(true),
    savingTypeId: yup.number().optional().default(0),
    shareTypeId: yup.number().optional().default(0),
    loanTypeId: yup.number().optional().default(0),
    orderBy: yup.string().nullable().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function MemberAccountDetailNoPage() {
  const [reportState, setReportState] =
    useState<MemberAccountDetailNoResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<MemberAccountDetailNoRequest | null>(null);
  const { branchOptions } = useReportFormContext();

  const { control, handleSubmit, setValue, reset } =
    useForm<MemberAccountDetailNoFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const toRequest = useCallback(
    (form: MemberAccountDetailNoFormValues): MemberAccountDetailNoRequest => {
      const selectedIds = (form.branchId ?? [])
        .map(Number)
        .filter((id) => id > 0);
      const allIds = branchOptions
        .map((o) => Number(o.id))
        .filter((id) => id > 0);
      const isAll = selectedIds.length === 0;
      const resolvedIds = isAll ? allIds : selectedIds;

      const branchName =
        branchOptions
          .filter((o) => resolvedIds.includes(Number(o.id)))
          .map((o) => o.name)
          .join(", ") || "All";

      return {
        tillDate: normalizeBsDate(form.tillDate),
        branchIds: resolvedIds.join(","),
        branchName,
        memberType: form.memberType === "Active" ? 1 : 0,
        includeSaving: form.includeSaving ?? true,
        includeShare: form.includeShare ?? true,
        includeLoan: form.includeLoan ?? true,
        savingTypeId:
          form.includeSaving && form.savingTypeId
            ? String(form.savingTypeId)
            : undefined,
        shareTypeId:
          form.includeShare && form.shareTypeId
            ? String(form.shareTypeId)
            : undefined,
        loanTypeId:
          form.includeLoan && form.loanTypeId
            ? String(form.loanTypeId)
            : undefined,
        orderBy: form.orderBy || "",
        sameCompanyName: form.sameCompanyName ?? true,
        visualReport: form.visualReport ?? false,
      };
    },
    [branchOptions],
  );

  const callApi = useCallback(
    (request: MemberAccountDetailNoRequest, format: string) =>
      memberAccountService.api.memberAccountDetailNoCreate(request, {
        format,
      }),
    [],
  );

  const fetchReport = useCallback(
    async (request: MemberAccountDetailNoRequest) => {
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
      } catch (err) {
        setReportState({ isLoading: false });
        throw err;
      }
    },
    [callApi],
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

  const handleDownload = useCallback(
    async (format: ReportFormat) => {
      if (!lastRequest) return;

      const res = await callApi(lastRequest, format);
      const blob = responseToBlob(res.data, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = extractFilenameFromResponse(
        res,
        format,
        "MemberAccountDetailNo",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<MemberAccountDetailNoFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <MemberAccountDetailNoForm
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
