// "use client";

// import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
// import CopomisForm from "@/components/reports/share/CopomisForm";
// import shareService from "@/services/Share/shareService";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
// import { DefaultPagination } from "@/utilis/Constants/reportConstants";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useCallback, useEffect, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { toast } from "react-toastify";
// import type { CopomisRequestDto, Pagination } from "types/api/api";
// import * as yup from "yup";

// export type CopomisFormValues = CopomisRequestDto;

// export interface CopomisResponseExtended {
//   pdfData?: string;
//   isLoading: boolean;
//   pagination?: Pagination;
// }

// const DATE_REQUIRED_MESSAGE = "Please select date";

// const schema: yup.ObjectSchema<CopomisFormValues> = yup
//   .object({
//     tillDateBs: yup
//       .string()
//       .nullable()
//       .optional()
//       .required(DATE_REQUIRED_MESSAGE),
//     officeIds: yup.string().nullable().optional().default("2"),
//     memberTypeId: yup.number().optional().default(0),
//     collectionCenterId: yup.number().optional().default(0),
//     memberGroupId: yup.number().optional().default(-1),
//     orderBy: yup.string().nullable().optional().default(""),
//     showMemberPhoto: yup.boolean().optional().default(true),
//     visualReport: yup.boolean().optional().default(false),
//   })
//   .required();

// export default function CopomisPage() {
//   const [reportState, setReportState] = useState<CopomisResponseExtended>({
//     isLoading: false,
//   });
//   const [lastRequest, setLastRequest] = useState<CopomisRequestDto | null>(
//     null,
//   );

//   const { control, handleSubmit, setValue, reset } = useForm<CopomisFormValues>(
//     {
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     },
//   );

//   const toRequest = useCallback(
//     (form: CopomisFormValues): CopomisRequestDto => ({
//       tillDateBs: form.tillDateBs || undefined,
//       officeIds: form.officeIds || "-1",
//       memberTypeId: form.memberTypeId ?? 0,
//       collectionCenterId: form.collectionCenterId ?? 0,
//       memberGroupId: form.memberGroupId ?? -1,
//       orderBy: form.orderBy || "",
//       showMemberPhoto: form.showMemberPhoto ?? true,
//       visualReport: form.visualReport ?? false,
//     }),
//     [],
//   );

//   const callApi = useCallback(
//     (request: CopomisRequestDto, format: string) =>
//       shareService.api.copomisCreate(request, { format }),
//     [],
//   );

//   const fetchReport = useCallback(
//     async (request: CopomisRequestDto) => {
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
//       if (!lastRequest) {
//         return;
//       }
//       try {
//         const res = await callApi(lastRequest, format);
//         const url = URL.createObjectURL(responseToBlob(res.data, format));
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = extractFilenameFromResponse(
//           res,
//           format,
//           "CopomisReport",
//         );
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         URL.revokeObjectURL(url);
//       } catch (error) {
//         console.error("Download error:", error);
//         toast.error("Failed to download file");
//       }
//     },
//     [callApi, lastRequest],
//   );

//   const onSubmit: SubmitHandler<CopomisFormValues> = useCallback(
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
//     <CopomisForm
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

import type { ReportFormat } from "@/components/reportForm/Common/ReportNavigation";
import CopomisForm from "@/components/reports/share/CopomisForm";
import shareService from "@/services/Share/shareService";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { CopomisRequestDto } from "types/api/api";
import * as yup from "yup";

export type CopomisFormValues = CopomisRequestDto;

export interface CopomisResponseExtended {
  htmlContent?: string;
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
}

const DATE_REQUIRED_MESSAGE = "Please select date";

const schema: yup.ObjectSchema<CopomisFormValues> = yup
  .object({
    tillDateBs: yup
      .string()
      .nullable()
      .optional()
      .required(DATE_REQUIRED_MESSAGE),
    officeIds: yup.string().nullable().optional().default("-1"),
    memberTypeId: yup.number().optional().default(0),
    collectionCenterId: yup.number().optional().default(0),
    memberGroupId: yup.number().optional().default(-1),
    orderBy: yup.string().nullable().optional().default(""),
    showMemberPhoto: yup.boolean().optional().default(true),
    visualReport: yup.boolean().optional().default(false),
  })
  .required();

const INITIAL_STATE: CopomisResponseExtended = {
  isLoading: false,
  htmlContent: undefined,
  totalPages: 1,
  currentPage: 1,
};

export default function CopomisPage() {
  const [reportState, setReportState] =
    useState<CopomisResponseExtended>(INITIAL_STATE);
  const [lastRequest, setLastRequest] = useState<CopomisRequestDto | null>(
    null,
  );
  const [renderKey, setRenderKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const { control, handleSubmit, setValue, reset } = useForm<CopomisFormValues>(
    {
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    },
  );

  // ── postMessage: receive totalPages from iframe after buildPages() ───────
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        event.data?.type === "REPORT_PAGES_READY" &&
        typeof event.data.totalPages === "number" &&
        event.data.totalPages > 0
      ) {
        setReportState((prev) => ({
          ...prev,
          totalPages: event.data.totalPages,
          currentPage: 1,
        }));
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const toRequest = useCallback(
    (form: CopomisFormValues): CopomisRequestDto => ({
      tillDateBs: form.tillDateBs || undefined,
      officeIds: form.officeIds || "-1",
      memberTypeId: form.memberTypeId ?? 0,
      collectionCenterId: form.collectionCenterId ?? 0,
      memberGroupId: form.memberGroupId ?? -1,
      orderBy: form.orderBy || "",
      showMemberPhoto: form.showMemberPhoto ?? true,
      visualReport: form.visualReport ?? false,
    }),
    [],
  );

  const callApi = useCallback(
    (request: CopomisRequestDto, format: string) =>
      shareService.api.copomisCreate(request, { format }),
    [],
  );

  const getHtmlString = useCallback(async (response: any): Promise<string> => {
    if (response.data instanceof Blob) return (response.data as Blob).text();
    if (typeof response.data === "string") return response.data;
    return JSON.stringify(response.data);
  }, []);

  const fetchReport = useCallback(
    async (request: CopomisRequestDto) => {
      setReportState({
        isLoading: true,
        htmlContent: undefined,
        totalPages: 1,
        currentPage: 1,
      });

      try {
        const response = await callApi(request, "VIEW");
        const htmlContent = await getHtmlString(response);

        setLastRequest(request);
        setReportState({
          isLoading: false,
          htmlContent,
          totalPages: 1,
          currentPage: 1,
        });
        setRenderKey((k) => k + 1);
      } catch (err) {
        console.error("fetchReport error:", err);
        setReportState(INITIAL_STATE);
        toast.error("Failed to load report.");
      }
    },
    [callApi, getHtmlString],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setReportState((prev) => {
      const clamped = Math.max(1, Math.min(newPage, prev.totalPages));
      if (clamped === prev.currentPage) return prev;
      try {
        const iframeWin = iframeRef.current?.contentWindow as
          | (Window & { scrollToPage?: (n: number) => void })
          | null;
        if (iframeWin?.scrollToPage) iframeWin.scrollToPage(clamped);
      } catch {
        // defensive catch
      }
      return { ...prev, currentPage: clamped };
    });
  }, []);

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
          "CopomisReport",
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
      }
    },
    [callApi, lastRequest],
  );

  const onSubmit: SubmitHandler<CopomisFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport, toRequest],
  );

  return (
    <CopomisForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reset={reset}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      iframeRef={iframeRef}
      renderKey={renderKey}
    />
  );
}
