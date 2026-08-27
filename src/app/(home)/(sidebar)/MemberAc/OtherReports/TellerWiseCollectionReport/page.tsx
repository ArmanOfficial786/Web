// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import type { TellerWiseCollectionRequestDto, Pagination } from "types/api/api";
// import TellerWiseCollectionForm, {
//   type ReportFormat,
// } from "@/components/reports/memberAccount/OthersReport/TellerWiseCollectionForm";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
// import memberAccountService from "@/services/memberAccount/memberAccountService";

// // ── tellerId is a number here (matches TellerField's DropDown option ids),
// // converted to the DTO's int64|null in toRequest(). ──────────────────────────
// export interface TellerWiseCollectionFormValues extends Omit<
//   TellerWiseCollectionRequestDto,
//   "tellerId"
// > {
//   tellerId?: number;
// }

// // ── Client-only response state (raw PDF blob URL + header pagination) ──────
// // Same shape as DepositUnverifiedResponseExtended — pdfData is ALWAYS a blob
// // URL created via URL.createObjectURL, never a raw base64 string.
// export interface TellerWiseCollectionResponseExtended {
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

// const schema: yup.ObjectSchema<TellerWiseCollectionFormValues> = yup
//   .object({
//     fromDateBs: yup.string().nullable().optional().required(),
//     toDateBs: yup
//       .string()
//       .nullable()
//       .optional()
//       .required()
//       .test("date-order", "To Date cannot be before From Date", function (val) {
//         const { fromDateBs } = this.parent as { fromDateBs: string | null };
//         if (!fromDateBs || !val) return true;
//         return String(val) >= String(fromDateBs);
//       }),
//     tellerId: yup.number().optional().required().default(-1),
//     orderBy: yup.string().nullable().optional().default(""),
//     sameCompanyName: yup.boolean().optional().default(true),
//     visualReport: yup.boolean().optional().default(false),
//   })
//   .required();

// export default function TellerWiseCollectionPage() {
//   const [reportState, setReportState] =
//     useState<TellerWiseCollectionResponseExtended>({ isLoading: false });
//   const [lastRequest, setLastRequest] =
//     useState<TellerWiseCollectionRequestDto | null>(null);

//   const { control, handleSubmit, setValue, reset } =
//     useForm<TellerWiseCollectionFormValues>({
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     });

//   const toRequest = useCallback(
//     (form: TellerWiseCollectionFormValues): TellerWiseCollectionRequestDto => ({
//       fromDateBs: form.fromDateBs || undefined,
//       toDateBs: form.toDateBs || undefined,
//       tellerId: form.tellerId || undefined,
//       orderBy: form.orderBy || "",
//       sameCompanyName: form.sameCompanyName ?? true,
//       visualReport: form.visualReport ?? false,
//     }),
//     [],
//   );

//   const callApi = useCallback(
//     (request: TellerWiseCollectionRequestDto, format: string) =>
//       memberAccountService.api.tellerWiseCollectionGenerateReportCreate(
//         request,
//         { format },
//       ),
//     [],
//   );

//   const fetchReport = useCallback(
//     async (request: TellerWiseCollectionRequestDto) => {
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
//         "TellerWiseCollection",
//       );
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     },
//     [callApi, lastRequest],
//   );

//   const onSubmit: SubmitHandler<TellerWiseCollectionFormValues> = useCallback(
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
//     <TellerWiseCollectionForm
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
import type { TellerWiseCollectionRequestDto, Pagination } from "types/api/api";
import TellerWiseCollectionForm, {
  type ReportFormat,
} from "@/components/reports/memberAccount/OthersReport/TellerWiseCollectionForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import memberAccountService from "@/services/memberAccount/memberAccountService";

// ── tellerId is a number here (matches TellerField's DropDown option ids),
// converted to the DTO's int64|null in toRequest(). ──────────────────────────
export interface TellerWiseCollectionFormValues extends Omit<
  TellerWiseCollectionRequestDto,
  "tellerId"
> {
  tellerId?: number;
}

// ── Client-only response state (raw PDF blob URL + header pagination) ──────
// Same shape as DepositUnverifiedResponseExtended — pdfData is ALWAYS a blob
// URL created via URL.createObjectURL, never a raw base64 string.
export interface TellerWiseCollectionResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

const DEFAULT_PAGINATION: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const DATE_REQUIRED_MESSAGE = "Please select date to get Teller Name";
const TELLER_REQUIRED_MESSAGE = "Select Date for TellerName";

const schema: yup.ObjectSchema<TellerWiseCollectionFormValues> = yup
  .object({
    fromDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    toDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE)
      .test("date-order", "To Date cannot be before From Date", function (val) {
        const { fromDateBs } = this.parent as { fromDateBs: string | null };
        if (!fromDateBs || !val) return true;
        return String(val) >= String(fromDateBs);
      }),
    tellerId: yup
      .number()
      .optional()
      .required(TELLER_REQUIRED_MESSAGE)
      .test(
        "teller-selected",
        TELLER_REQUIRED_MESSAGE,
        (val) => typeof val === "number" && val >= 0,
      )
      .default(-1),
    orderBy: yup.string().nullable().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

export default function TellerWiseCollectionPage() {
  const [reportState, setReportState] =
    useState<TellerWiseCollectionResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<TellerWiseCollectionRequestDto | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TellerWiseCollectionFormValues>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
    mode: "onSubmit",
  });

  const toRequest = useCallback(
    (form: TellerWiseCollectionFormValues): TellerWiseCollectionRequestDto => ({
      fromDateBs: form.fromDateBs || undefined,
      toDateBs: form.toDateBs || undefined,
      tellerId: form.tellerId || undefined,
      orderBy: form.orderBy || "",
      sameCompanyName: form.sameCompanyName ?? true,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: TellerWiseCollectionRequestDto, format: string) =>
      memberAccountService.api.tellerWiseCollectionGenerateReportCreate(
        request,
        { format },
      ),
    [],
  );

  const fetchReport = useCallback(
    async (request: TellerWiseCollectionRequestDto) => {
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
            return raw ? (JSON.parse(raw) as Pagination) : DEFAULT_PAGINATION;
          } catch {
            return DEFAULT_PAGINATION;
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
        "TellerWiseCollection",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<TellerWiseCollectionFormValues> = useCallback(
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
    <TellerWiseCollectionForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      errors={errors}
    />
  );
}
